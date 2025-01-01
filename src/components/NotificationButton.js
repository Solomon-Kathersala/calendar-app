import React, { useState } from "react";
import { notification, Badge, Button, Dropdown, Menu, Table, Modal, Select } from "antd";
import { BellOutlined } from "@ant-design/icons";
import "./NotificationButton.css"
const { Option } = Select;

const Notification = ({ companies, setCompanies }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [temporaryChanges, setTemporaryChanges] = useState([]); // Track changes locally

  // Filter overdue and today's communications
  const overdueCommunications = companies.flatMap((company) =>
    company.communications.filter((comm) => comm.status === "overdue")
  );

  const todaysCommunications = companies.flatMap((company) =>
    company.communications.filter((comm) => comm.status === "dueToday")
  );

  // Counts for overdue and today's communications
  const overdueCount = overdueCommunications.length;
  const todayCount = todaysCommunications.length;

  // Open modal and set selected type
  const openModal = (type) => {
    setSelectedType(type);
    setTemporaryChanges([]); // Clear temporary changes when modal opens
    setIsModalVisible(true);
  };

  // Close modal
  const closeModal = () => {
    setSelectedType(null);
    setTemporaryChanges([]); // Clear temporary changes when modal closes
    setIsModalVisible(false);
  };

  // Track changes temporarily
  const handleStatusChange = (record, newStatus) => {
    setTemporaryChanges((prevChanges) => {
      return [...prevChanges, { ...record, status: newStatus }];
    });
  };

  // Save changes to main companies state
  const saveChanges = () => {
    setCompanies((prevCompanies) =>
      prevCompanies.map((company) => {
        const updateCommunications = (comms) =>
          comms.map((comm) => {
            const tempChange = temporaryChanges.find(
              (change) => change.key === comm.key
            );
            return tempChange ? { ...comm, status: tempChange.status } : comm;
          });

          return {
            ...company,
            communications: updateCommunications(company.communications)
        };
      })
    );

    // Clear temporary changes and close modal
    setTemporaryChanges([]);
    setIsModalVisible(false);

    // Show success notification
    notification.success({
      message: "Changes Saved",
      description: "All changes have been successfully saved.",
    });
  };

  // Columns for the table
  const columns = [
    {
      title: "Company Name",
      dataIndex: "companyName",
      key: "companyName",
      render: (_, record) => record.companyName,
    },
    {
      title: "Communication Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Communication Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Notes",
      dataIndex: "notes",
      key: "notes",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Select
          defaultValue={record.status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record, value)}
        >
          <Option value="dueToday">Due Today</Option>
          <Option value="finished">Finished</Option>
          <Option value="override">Override</Option>
        </Select>
      ),
    },
  ];

  // Add company name to the data source for table
  const tableDataSource = companies.flatMap((company) =>
    company.communications
    .filter((comm) => comm.status === selectedType)
    .map((comm) => ({
      key: comm.key,
      companyName: company.name,
      type: comm.type,
      date: comm.date,
      notes: comm.notes,
      status: comm.status,
    }))
  );

  // Menu for dropdown
  const menu = (
    <Menu>
      <Menu.Item key="overdue" onClick={() => openModal("overdue")}>
        Overdue Communications ({overdueCount})
      </Menu.Item>
      <Menu.Item key="dueToday" onClick={() => openModal("dueToday")}>
        Today's Communications ({todayCount})
      </Menu.Item>
    </Menu>
  );

  return (
    <div>
      {/* Notification Button */}
      <Dropdown overlay={menu} trigger={["hover"]}>
        <Badge count={overdueCount + todayCount} offset={[-10, 5]}>
          <Button
            type="text"
            shape="circle"
            size="large"
            icon={<BellOutlined />}
            aria-label="Notifications"
            style={{ backgroundColor: "yellow", padding: "1.5rem", boxShadow: "0 4px 20px rgba(94, 92, 8, 0.3)", }}
          />
        </Badge>
      </Dropdown>

      {/* Modal with Table */}
      <Modal
        title={`${selectedType === "overdue" ? "Overdue" : "Today's"} Communications`}
        visible={isModalVisible}
        onCancel={closeModal}
        width="60vw"
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button
            key="save"
            type="primary"
            style={{backgroundColor: "green", borderColor: "green"}}
            onClick={saveChanges}
          >
            Save Changes
          </Button>,
        ]}
      >
        <Table
          dataSource={tableDataSource}
          columns={columns}
          rowKey="key"
          pagination={{ pageSize: 5 }}
        />
      </Modal>
    </div>
  );
};

export default Notification;
