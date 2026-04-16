import { Table, Tag } from "antd";

export default function History() {
  const columns = [
    {
      title: "Action",
      dataIndex: "action",
      key: "action",
    },
    {
      title: "Details",
      dataIndex: "details",
      key: "details",
    },
    {
      title: "Date & Time",
      dataIndex: "timestamp",
      key: "timestamp",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const color =
          status === "Success" ? "green" : status === "Failed" ? "red" : "blue";
        return <Tag color={color}>{status}</Tag>;
      },
    },
  ];

  const data = [
    {
      key: "1",
      action: "Patient Created",
      details: "John Doe profile created",
      timestamp: "2024-04-18 10:30 AM",
      status: "Success",
    },
    {
      key: "2",
      action: "Appointment Scheduled",
      details: "Consultation appointment set",
      timestamp: "2024-04-17 03:15 PM",
      status: "Success",
    },
    {
      key: "3",
      action: "Service Added",
      details: "Physical Therapy service added",
      timestamp: "2024-04-16 11:00 AM",
      status: "Success",
    },
    {
      key: "4",
      action: "Appointment Cancelled",
      details: "Appointment ID #1023 cancelled",
      timestamp: "2024-04-15 02:45 PM",
      status: "Success",
    },
  ];

  return (
    <div className='p-8'>
      <div className='mb-8'>
        <h1 className='text-3xl font-bold'>History</h1>
        <p className='text-gray-600 mt-2'>View your activity history</p>
      </div>

      <div className='bg-white rounded-lg shadow border border-gray-200'>
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 10 }}
        />
      </div>
    </div>
  );
}
