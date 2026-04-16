import { Button, Table, Space } from "antd";
import { Plus, Edit, Trash2 } from "lucide-react";

export default function MedicalServices() {
  const columns = [
    {
      title: "Service Name",
      dataIndex: "serviceName",
      key: "serviceName",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (duration: number) => `${duration} mins`,
    },
    {
      title: "Active",
      dataIndex: "active",
      key: "active",
      render: (active: boolean) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
          }`}>
          {active ? "Yes" : "No"}
        </span>
      ),
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
      serviceName: "Consultation",
      category: "General",
      price: 50,
      duration: 30,
      active: true,
    },
    {
      key: "2",
      serviceName: "Physical Therapy",
      category: "Therapy",
      price: 75,
      duration: 60,
      active: true,
    },
    {
      key: "3",
      serviceName: "Blood Test",
      category: "Lab",
      price: 40,
      duration: 15,
      active: true,
    },
  ];

  return (
    <div className='p-8'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-3xl font-bold'>Medical Services</h1>
          <p className='text-gray-600 mt-2'>
            Manage available medical services
          </p>
        </div>
        <Button type='primary' icon={<Plus size={18} />}>
          Add Service
        </Button>
      </div>

      <div className='bg-white rounded-lg shadow border border-gray-200'>
        <Table columns={columns} dataSource={data} pagination={false} />
      </div>
    </div>
  );
}
