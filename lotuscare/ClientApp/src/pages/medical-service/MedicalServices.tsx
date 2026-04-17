import { useTanstack, useTanstackMutation } from "@/hooks/use-tanstack";
import type { MedicalServiceModel } from "@/models";
import {
  Button,
  Table,
  Space,
  message,
  Popconfirm,
  Tag,
  Tabs,
  Badge,
} from "antd";
import { Plus, Edit, Trash2, Settings } from "lucide-react";
import { useState } from "react";
import MedicalServiceModal from "./MedicalServiceModal";

export default function MedicalServices() {
  const { data: services = [], refetch } = useTanstack<MedicalServiceModel[]>(
    "/api/medical-services",
    "medical-services",
  );
  const createMutation = useTanstackMutation<MedicalServiceModel>(
    "/api/medical-services",
    "POST",
  );
  const updateMutation = useTanstackMutation<MedicalServiceModel>(
    "/api/medical-services",
    "PUT",
  );
  const deleteMutation = useTanstackMutation<{ success: boolean }>(
    "/api/medical-services",
    "DELETE",
  );

  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] =
    useState<Partial<MedicalServiceModel> | null>(null);

  const handleOpenModal = (service?: MedicalServiceModel) => {
    if (service) {
      setSelectedService(service);
    } else {
      setSelectedService(null);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedService(null);
  };

  const handleSubmit = async (values: Partial<MedicalServiceModel>) => {
    try {
      if (selectedService?.id) {
        await updateMutation.mutateAsync({
          url: `/api/medical-services/${selectedService.id}`,
          data: values,
          method: "PUT",
        });
        message.success("Cập nhật dịch vụ thành công!");
      } else {
        await createMutation.mutateAsync({
          url: "/api/medical-services",
          data: values,
          method: "POST",
        });
        message.success("Thêm dịch vụ thành công!");
      }
      refetch();
      handleCloseModal();
    } catch (error) {
      message.error("Lỗi khi lưu dịch vụ!");
      console.error("Error saving service:", error);
    }
  };

  const handleDelete = async (id: string | number) => {
    try {
      await deleteMutation.mutateAsync({
        url: `/api/medical-services/${id}`,
        method: "DELETE",
      });
      message.success("Xóa dịch vụ thành công!");
      refetch();
    } catch (error) {
      message.error("Lỗi khi xóa dịch vụ!");
      console.error("Error deleting service:", error);
    }
  };

  const columns = [
    {
      title: "Mã Dịch Vụ",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Tên Dịch Vụ",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: 250,
      ellipsis: true,
      render: (text: string) => text || "-",
    },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      width: 120,
      render: (price: number) => `${price.toLocaleString()}`,
    },
    {
      title: "Thời Lượng",
      dataIndex: "duration_minutes",
      key: "duration_minutes",
      width: 110,
      render: (duration: number) => (duration ? `${duration} phút` : "-"),
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={status === "active" ? "green" : "gray"}>
          {status === "active" ? "Hoạt Động" : "Không Hoạt Động"}
        </Tag>
      ),
    },
    {
      title: "Thao Tác",
      key: "actions",
      width: 100,
      align: "center" as const,
      render: (_: any, record: MedicalServiceModel) => (
        <Space size='small'>
          <Button
            type='text'
            size='small'
            icon={<Edit size={16} />}
            className='text-blue-600 hover:text-blue-800'
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title='Xóa Dịch Vụ'
            description='Bạn có chắc chắn muốn xóa dịch vụ này?'
            onConfirm={() => handleDelete(record.id!)}
            okText='Có'
            cancelText='Không'>
            <Button
              type='text'
              size='small'
              icon={<Trash2 size={16} />}
              className='text-red-600 hover:text-red-800'
              loading={deleteMutation.isPending}
            />
          </Popconfirm>
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
          Hoạt Động
          <Badge
            count={services?.filter(s => s.status === "active").length || 0}
            style={{ backgroundColor: "#52c41a" }}
          />
        </span>
      ),
    },
    {
      key: "inactive",
      label: (
        <span>
          Không Hoạt Động
          <Badge
            count={services?.filter(s => s.status === "inactive").length || 0}
            style={{ backgroundColor: "#faad14" }}
          />
        </span>
      ),
    },
  ];

  const filteredData =
    activeTab === "all"
      ? services
      : activeTab === "active"
        ? services?.filter(s => s.status === "active")
        : services?.filter(s => s.status === "inactive");

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
                Thêm Dịch Vụ
              </Button>
            </div>
          }
        />
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg border border-gray-200 overflow-hidden'>
        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 10,
            position: ["bottomRight"],
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]} - ${range[1]} của ${total} dịch vụ`,
          }}
          rowKey='id'
          size='small'
          bordered={false}
          loading={!services}
        />
      </div>

      {/* Medical Service Modal */}
      <MedicalServiceModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialData={selectedService || undefined}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
