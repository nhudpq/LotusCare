import { useTanstack, useTanstackMutation } from "@/hooks/use-tanstack";
import type { PatientModel } from "@/models";
import { Button, Table, Space, Tabs, Badge, Tag, message } from "antd";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { useState } from "react";
import PatientModal from "./PatientModal";

export default function Patients() {
  const { data } = useTanstack<PatientModel>({ apiName: "/patients" });
  const { mutate: createPatient, isPending: isCreating } =
    useTanstackMutation<PatientModel>({
      apiName: "/patients",
    });
  const { mutate: updatePatient, isPending: isUpdating } =
    useTanstackMutation<PatientModel>({
      apiName: "/patients",
    });

  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] =
    useState<Partial<PatientModel> | null>(null);

  const handleOpenModal = (patient?: PatientModel) => {
    if (patient) {
      setSelectedPatient(patient);
    } else {
      setSelectedPatient(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPatient(null);
  };

  const handleSubmit = (values: Partial<PatientModel>) => {
    if (selectedPatient?.id) {
      updatePatient(values, {
        onSuccess: () => {
          message.success("Cập nhật bệnh nhân thành công!");
          handleCloseModal();
        },
        onError: () => {
          message.error("Cập nhật bệnh nhân thất bại!");
        },
      });
    } else {
      createPatient(values, {
        onSuccess: () => {
          message.success("Thêm bệnh nhân thành công!");
          handleCloseModal();
        },
        onError: () => {
          message.error("Thêm bệnh nhân thất bại!");
        },
      });
    }
  };

  const columns = [
    {
      title: "Mã BN",
      dataIndex: "ma_bn",
      key: "ma_bn",
      width: 120,
    },
    {
      title: "Họ Tên",
      dataIndex: "ho_ten",
      key: "ho_ten",
      width: 160,
    },
    {
      title: "Giới Tính",
      dataIndex: "gioi_tinh",
      key: "gioi_tinh",
      width: 90,
      render: (gender: number) => (
        <span className='text-gray-700'>
          {gender === 1 ? "Nam" : gender === 2 ? "Nữ" : "Khác"}
        </span>
      ),
    },
    {
      title: "Ngày Sinh",
      dataIndex: "ngay_sinh",
      key: "ngay_sinh",
      width: 130,
      render: (date: string) =>
        date ? new Date(date).toLocaleDateString("vi-VN") : "-",
    },
    {
      title: "Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      width: 130,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
      ellipsis: true,
    },
    {
      title: "Địa Chỉ",
      dataIndex: "dia_chi",
      key: "dia_chi",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Trạng Thái",
      key: "status",
      width: 100,
      render: () => (
        <Tag color='green' style={{ borderRadius: "4px" }}>
          Hoạt Động
        </Tag>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: 100,
      align: "center" as const,
      render: (_: any, record: PatientModel) => (
        <Space size='small'>
          <Button
            type='text'
            size='small'
            icon={<Edit size={16} />}
            className='text-blue-600 hover:text-blue-800'
            onClick={() => handleOpenModal(record)}
          />
          <Button
            type='text'
            size='small'
            icon={<Trash2 size={16} />}
            className='text-red-600 hover:text-red-800'
          />
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: "all",
      label: "Tất Cả",
    },
    {
      key: "active",
      label: (
        <span>
          Đang Điều Trị
          <Badge count={12} style={{ backgroundColor: "#52c41a" }} />
        </span>
      ),
    },
    {
      key: "archived",
      label: (
        <span>
          Đã Lưu Trữ
          <Badge count={5} style={{ backgroundColor: "#faad14" }} />
        </span>
      ),
    },
  ];

  return (
    <div className='p-6'>
      {/* Header with Tabs */}
      <div className='mb-6'>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          tabBarExtraContent={
            <div className='flex gap-3'>
              <Button
                icon={<Settings size={18} />}
                style={{ border: "1px solid #d9d9d9" }}>
                Tùy Chỉnh Cột
              </Button>
              <Button
                type='primary'
                icon={<Plus size={18} />}
                onClick={() => handleOpenModal()}>
                Thêm Bệnh Nhân
              </Button>
            </div>
          }
        />
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <Table
          columns={columns}
          dataSource={data as any}
          pagination={{
            pageSize: 10,
            position: ["bottomCenter"],
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} của ${total} bệnh nhân`,
          }}
          rowKey='id'
          size='small'
          bordered={false}
        />
      </div>

      {/* Patient Modal */}
      <PatientModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedPatient || undefined}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
}
