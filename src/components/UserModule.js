import React, { useState, useEffect, useRef } from "react";
import { Table, Tooltip, Button, Modal, Form, Input, Select, DatePicker, notification} from "antd";
import moment from 'moment';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import "./UserModule.css";
import NotificationButton from "./NotificationButton";

const { Option } = Select;
const sampleCompanies = [
  {
    name: "Company A",
    communications: [
      { key: "Company A1", type: "LinkedIn Post", date: "2024-12-26", notes: "Scheduled for next campaign", status: "overdue"},
      { key: "Company A2", type: "Email", date: "2024-12-25", notes: "Customer engagement email", status: "finished"},
      { key: "Company A3", type: "Team Meeting", date: "2024-12-28", notes: "Monthly team sync", status: "finished"},
      { key: "Company A4", type: "Webinar", date: "2024-12-24", notes: "Product training webinar", status: "finished"},
      { key: "Company A5", type: "Phone Call", date: "2024-12-30", notes: "Follow up with client", status: "scheduled"},
    ],
  },
  {
    name: "Company B",
    communications: [
      { key: "Company B1", type: "Email", date: "2024-12-22", notes: "Monthly updates to users", status: "finished"},
      { key: "Company B2", type: "LinkedIn Post", date: "2024-12-18", notes: "Post about new feature", status: "finished"},
      { key: "Company B3", type: "Phone Call", date: "2024-12-21", notes: "Discuss progress on project", status: "finished"},
      { key: "Company B4", type: "Marketing Campaign", date: "2024-12-23", notes: "Launch new marketing ads", status: "overdue"},
      { key: "Company B5", type: "Project Update", date: "2024-12-29", notes: "Finalizing project deliverables", status: "scheduled"},
    ]
  },
];
const today = moment().startOf('day');

const UserModule = ({ compNames }) => {
  // State
  const [companies, setCompanies] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [form] = Form.useForm();

  const updateStatus = () => {
    setCompanies(prevCompanies =>
      prevCompanies.map(company => ({
        ...company,
        communications: company.communications.map(comm => ({
          ...comm,
          status:
            comm.status !== "finished" &&
            comm.status !== "overdue" &&
            comm.status !== "override"
              ? calculateCommunicationStatus(comm.date)
              : comm.status,
        })),
      }))
    );
  };

  // Sample Data
  useEffect(() => {
    const newCompanies = compNames
    .filter(name => !sampleCompanies.some(company => company.name === name))
    .map(name => ({
      name, communications: []
    }));

    const filterComp = sampleCompanies.filter(com => compNames.includes(com.name));
    setCompanies([...filterComp, ...newCompanies]);
    updateStatus();
  }, []);

  //updates every day
  (() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0); // Set the time to midnight (start of the next day)

    setTimeout(() => {
      updateStatus();
      
      setInterval(() => {
        updateStatus();
      }, 86400000);
    }, midnight-now);
  })();

  // Helper function to calculate communication status
  const calculateCommunicationStatus = (date) => {
    if (moment(date).isBefore(today)) return "overdue";
    if (moment(date).isSame(today)) return "dueToday";
    if (moment(date).isAfter(today)) return "scheduled";
    return "No"; // Default status if none match
  };

  // Columns for Dashboard Table
  const columns = [
    { title: "Company Name", dataIndex: "name", key: "name",},
    { title: "Last Five Communications",
      dataIndex: "communications",
      key: "communications",
      render: (communications) => (
        <div>
          {communications
          .filter((comm) => comm.status === "finished")
          .slice(-5)
          .map((comm, index) => (
            <Tooltip key={`${comm.date}-${index}`} title={comm.notes}>
              <p className={comm.status}>{`${comm.type} - ${comm.date}`}</p>
            </Tooltip>
          ))}
        </div>
      ),
    },
    {
      title: "Next Scheduled Communication",
      dataIndex: "communications",
      key: "communications",
      render: (communications) => (
        <div>
          {communications
          .filter((comm) => comm.status !== "finished")
          .map((comm, index) => (
            <p className={comm.status}>{`${comm.type} - ${comm.date}`}</p>
          ))}
        </div>
      ),
    },
    { title: "Action", key: "action",
      render: (_, record) => (
        <Button type="primary" onClick={() => openModal(record)}>
          Log Communication
        </Button>
      ),
    },
  ];

  // Modal Handlers
  const openModal = (company) => {
    setSelectedCompany(company);
    setModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        const newCommunication = {
          key : selectedCompany.name + (selectedCompany.communications.length + 1),
          type: values.type,
          date: values.date.format("YYYY-MM-DD"),
          notes: values.notes,
          status: calculateCommunicationStatus(values.date.format("YYYY-MM-DD")),
        };
        // Update data logic
        const updatedCompanies = companies.map((company) => {
          if (company.name === selectedCompany.name) {
            return {
              ...company,
              communications: [
                ...company.communications, newCommunication,
              ],
            };
          }
          return company;
        });
        setCompanies(updatedCompanies);
        setModalVisible(false);
        form.resetFields();
        notification.success({
          message: "Success",
          description: "Communication logged successfully!",
        });
      })
      .catch((info) => {
        console.log("Validation Failed: ", info);
      });
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const tday = new Date();
  const currentYear = tday.getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const calendarRef = useRef(null);

  const handleYearChange = (event) => {
    const newYear = parseInt(event.target.value, 10);
    setSelectedYear(newYear);

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const currentDate = calendarApi.getDate();
      const newDate = new Date(currentDate);
      newDate.setFullYear(newYear);

      calendarApi.gotoDate(newDate.toISOString().split("T")[0]);
    }
  };

  const handleDatesSet = (arg) => {
    // Calculate the middle of the visible range to determine the year
    const start = new Date(arg.start);
    const end = new Date(arg.end);
    const middleDate = new Date((start.getTime() + end.getTime()) / 2);
    const middleYear = middleDate.getFullYear();

    // Synchronize the dropdown year with the middle year of the current visible range
    setSelectedYear(middleYear);
  };

  return (
    <div className="user-wrapper">
      {/* Notification Button */}
      <h1 className="user-head">User Module</h1>

      <div className="notification">
        <NotificationButton
          companies={companies} setCompanies={setCompanies} // Pass companies data to NotificationButton
        />
      </div>

      <div className="user">
        <div>
          <div className="dashboard">
            <h2>Dashboard</h2>
            <Table
              dataSource={companies}
              columns={columns}
              rowKey="name"
              scroll={{ y: 250 }}
            />

            <Modal
              title={`Log Communication for ${selectedCompany?.name}`}
              visible={modalVisible}
              onOk={handleOk}
              onCancel={handleCancel}
              >
              <Form form={form} layout="vertical">
                <Form.Item name="type" label="Type of Communication" rules={[{ required: true }]}>
                  <Select placeholder="Select type">
                    <Option value="LinkedIn Post">LinkedIn Post</Option>
                    <Option value="Email">Email</Option>
                    <Option value="Phone Call">Phone Call</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="date" label="Date of Communication" rules={[{ required: true }]}>
                  <DatePicker />
                </Form.Item>
                <Form.Item name="notes" label="Notes">
                  <Input.TextArea rows={4} placeholder="Enter any notes..." />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        </div>
        <div>
          <div className="calendar">
            <div className="calHead">
              <p>Calendar</p>
              <div className="dropdown">
                <select
                  id="year-dropdown"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  {Array.from({ length: 21 }, (_, index) => currentYear - 10 + index).map(
                    (year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>

            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              initialDate={tday.toISOString().split("T")[0]}
              events={companies.flatMap((company) =>
                company.communications.map((com) => ({
                  title: com.type,
                  start: com.date,
                }))
              )}
              datesSet={handleDatesSet} // Trigger when navigation occurs
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserModule;