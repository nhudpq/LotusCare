import { Button, Table, Space, Tag } from "antd";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function Appointments() {
  const columns = [
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Service",
      dataIndex: "service",
      key: "service",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "time",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "blue";
        if (status === "Completed") color = "green";
        if (status === "Cancelled") color = "red";
        if (status === "Pending") color = "orange";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: () => (
        <Space>
          <Button
            type='text'
            size='small'
            icon={<Edit size={16} />}
            className='text-blue-600'
          />
          <Button
            type='text'
            size='small'
            icon={<Trash2 size={16} />}
            className='text-red-600'
          />
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      patientName: "John Doe",
      service: "Consultation",
      date: "2024-04-20",
      time: "10:00 AM",
      status: "Pending",
    },
    {
      key: "2",
      patientName: "Jane Smith",
      service: "Physical Therapy",
      date: "2024-04-21",
      time: "02:00 PM",
      status: "Completed",
    },
    {
      key: "3",
      patientName: "Bob Johnson",
      service: "Blood Test",
      date: "2024-04-19",
      time: "03:00 PM",
      status: "Cancelled",
    },
  ];

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Appointments</h1>
          <p className='text-gray-600 mt-2'>Manage and schedule appointments</p>
        </div>
        <Button type='primary' icon={<Plus size={18} />}>
          Schedule Appointment
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow border border-gray-200'>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
}
