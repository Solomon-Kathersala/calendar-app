import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Form, Input, Select, Space } from "antd";
import { PlusOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import "./AdminModule.css";

const { Option } = Select;

const Admin = ({ setCompNames }) => {
  const [companies, setCompanies] = useState([]);
  const [methods, setMethods] = useState([]);
  const [isCompanyModalVisible, setIsCompanyModalVisible] = useState(false);
  const [isMethodModalVisible, setIsMethodModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [editingMethod, setEditingMethod] = useState(null);
  const [form] = Form.useForm();

  const mockCompanies = [
    {
      id: 1,
      name: "Company A",
      location: "New York",
      linkedIn: "https://linkedin.com/companyA",
      email: "contact@companyA.com",
      phoneNumber: "1234567890",
      comment: "Important client",
      periodicity: "2 weeks",
    },
    {
      id: 2,
      name: "Company B",
      location: "Australia",
      linkedIn: "https://linkedin.com/companyB",
      email: "contact@companyB.com",
      phoneNumber: "0123456789",
      comment: "Important client",
      periodicity: "2 weeks",
    },
  ];
  const mockMethods = [
    { id: 1, name: "LinkedIn Post", description: "Post on LinkedIn", sequence: 1, mandatory: true },
  ];

  // Fetch initial data (mock for now)
  useEffect(() => {
    setCompanies(mockCompanies);
    setMethods(mockMethods);
    setCompNames(mockCompanies.map(company => company.name));
  }, []);
  
  

  // Add or Edit Company
  const handleCompanySubmit = (values) => {
    if (editingCompany) {
      const isDuplicate = companies.some(
        (company) =>
          (company.email === values.email && company.id !== editingCompany.id) ||
          (company.name === values.name && company.id !== editingCompany.id) ||
          (company.phoneNumber === values.phoneNumber && company.id !== editingCompany.id)
      );
    
      if (isDuplicate) {
        alert("Entered details already exist.");
        return; // Exit early to avoid further execution
      }
      
      setCompanies((prev) =>
        prev.map((company) =>
          company.id === editingCompany.id ? { ...editingCompany, ...values } : company
        )
      );
    
      // Close the modal
      setIsCompanyModalVisible(false);
    } else {
        const isDuplicate = companies.some((company) =>
          (company.email === values.email) ||
          (company.name === values.name) ||
          (company.phoneNumber === values.phoneNumber)
        );
        if(isDuplicate){
          alert("Entered details already exists.");
          return;
        }
        setIsCompanyModalVisible(false);
        const newCompany = { id: Date.now(), ...values };
        const updatedCom = [...companies, newCompany];
        setCompNames(updatedCom.map(company => company.name));
        setCompanies(updatedCom);
    }
    setEditingCompany(null);
    form.resetFields();
  };

  // Delete Company
  const handleDeleteCompany = (id) => {
    const updatedCom = companies.filter((company) => company.id !== id);
    setCompanies(updatedCom);
    setCompNames(updatedCom.map(comp => comp.name));
  };

  // Add or Edit Method
  const handleMethodSubmit = (values) => {
    if (editingMethod) {
      setMethods((prev) =>
        prev.map((method) =>
          method.id === editingMethod.id ? { ...editingMethod, ...values } : method
        )
      );
    } else {
      setMethods((prev) => [...prev, { id: Date.now(), ...values }]);
    }
    setIsMethodModalVisible(false);
    setEditingMethod(null);
    form.resetFields();
  };

  // Delete Method
  const handleDeleteMethod = (id) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  };

  return (
    <div className="admin-wrapper">
      <h1>Admin Module</h1>      
      <div className="admin">
        {/* Company Management */}
        <div>
          <div className="cmp-mgmt">
            <h2>Company Management</h2>
            <Space direction="vertical">

              <div className="btn-mgmt">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsCompanyModalVisible(true)}
                >
                  Add Company
                </Button>
              </div>
              <div className="cmp-table">
              <Table
                dataSource={companies}
                columns={[
                  { title: "Name", dataIndex: "name", key: "name" },
                  { title: "Location", dataIndex: "location", key: "location" },
                  { title: "LinkedIn", dataIndex: "linkedIn", key: "linkedIn" },
                  { title: "Email", dataIndex: "email", key: "email"},
                  { title: "Phone Number", dataIndex: "phoneNumber", key: "phoneNumber"},
                  { title: "Comment", dataIndex: "comment", key: "comment"},
                  { title: "Periodicity", dataIndex: "periodicity", key: "periodicity"},
                  { title: "Actions",
                    render: (_, record) => (
                      <>
                        <Space>
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                              setEditingCompany(record);
                              setIsCompanyModalVisible(true);
                            }}
                          />
                          <Button
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteCompany(record.id)}
                          />
                        </Space>
                      </>
                    ),
                  },
                ]}
                rowKey="id"
                pagination= {{ pageSize: 5}}
              />
              </div>
            </Space>
          </div>
        </div>

        {/* Communication Method Management */}
        <div>
          <div className="comm-mgmt">
            <h2>Communication Method Management</h2>
            <Space direction="vertical">

              <div className="btn-mgmt">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setIsMethodModalVisible(true)}
                >
                  Add Communication Method
                </Button>
              </div>

              <div className="comm-table">
                <Table
                  dataSource={methods}
                  columns={[
                    { title: "Name", dataIndex: "name", key: "name" },
                    { title: "Description", dataIndex: "description", key: "description" },
                    { title: "Sequence", dataIndex: "sequence", key: "sequence" },
                    {
                      title: "Mandatory",
                      dataIndex: "mandatory",
                      key: "mandatory",
                      render: (mandatory) => (mandatory ? "Yes" : "No"),
                    },
                    {
                      title: "Actions",
                      render: (_, record) => (
                        <>
                          <Space>
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => {
                                setEditingMethod(record);
                                setIsMethodModalVisible(true);
                              }}
                            />
                            <Button
                              icon={<DeleteOutlined />}
                              onClick={() => handleDeleteMethod(record.id)}
                            />
                          </Space>
                        </>
                      ),
                    },
                  ]}
                  rowKey="id"
                  scroll={{ y: 300 }}
                />
              </div>
            </Space>
          </div>
        </div>

        {/* Modals */}
        <Modal
          title={editingCompany ? "Edit Company" : "Add Company"}
          visible={isCompanyModalVisible}
          onCancel={() => {
            setIsCompanyModalVisible(false);
            setEditingCompany(null);
            form.resetFields(); // Clear form fields when modal is closed
          }}
          footer={null}
        >
          <Form
            form={form}
            initialValues={editingCompany || {}}
            onFinish={handleCompanySubmit}
            layout="vertical"
          >
            <Form.Item name="name" label="Company Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="location" label="Location" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="linkedIn" label="LinkedIn Profile">
              <Input />
            </Form.Item>
            <Form.Item name="email" label="Emails" rules={[{ required: true }]}>
              <Input placeholder="Separate multiple emails with commas" />
            </Form.Item>
            <Form.Item name="phoneNumber" label="Phone Numbers" rules={[{ required: true}]}>
              <Input placeholder="Separate multiple numbers with commas" />
            </Form.Item>
            <Form.Item name="comments" label="Comments">
              <Input.TextArea />
            </Form.Item>
            <Form.Item name="periodicity" label="Communication Periodicity">
              <Select>
                <Option value="weekly">Weekly</Option>
                <Option value="biweekly">Every 2 Weeks</Option>
                <Option value="monthly">Monthly</Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              {editingCompany ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal>

        <Modal
          title={editingMethod ? "Edit Communication Method" : "Add Communication Method"}
          visible={isMethodModalVisible}
          onCancel={() => setIsMethodModalVisible(false)}
          footer={null}
        >
          <Form
            form={form}
            initialValues={editingMethod || {}}
            onFinish={handleMethodSubmit}
            layout="vertical"
          >
            <Form.Item name="name" label="Method Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="Description">
              <Input />
            </Form.Item>
            <Form.Item name="sequence" label="Sequence">
              <Input type="number" />
            </Form.Item>
            <Form.Item name="mandatory" label="Mandatory" valuePropName="checked">
              <Select>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              {editingMethod ? "Update" : "Add"}
            </Button>
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default Admin;