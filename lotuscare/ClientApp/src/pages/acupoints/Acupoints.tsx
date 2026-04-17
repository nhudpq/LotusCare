import { useState, useMemo } from "react";
import { useTanstack, useTanstackMutation } from "@/hooks/use-tanstack";

import { Button } from "antd";
import { Input } from "@/components/ui/input";
import { AcupointModal } from "./AcupointModal";
import type { AcupointModel, MeridianModel } from "@/models";
import { Table, Popconfirm, Space, Button as AntButton, Select } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

export function Acupoints() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeridian, setSelectedMeridian] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAcupoint, setSelectedAcupoint] =
    useState<AcupointModel | null>(null);

  // Fetch acupoints
  const {
    data: acupoints = [],
    isLoading: acupointsLoading,
    refetch,
  } = useTanstack<AcupointModel[]>("/acupoints", "acupoints");

  // Fetch meridians for filter
  const { data: meridians = [], isLoading: meridiansLoading } = useTanstack<
    MeridianModel[]
  >("/meridians", "meridians");

  // Delete mutation
  const deleteMutation = useTanstackMutation("/acupoints", "DELETE");

  // Filter acupoints based on search and meridian
  const filteredAcupoints = useMemo(() => {
    return acupoints.filter((acupoint: AcupointModel) => {
      const matchesSearch =
        !searchTerm ||
        acupoint.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acupoint.name_vi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        acupoint.indication?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesMeridian =
        !selectedMeridian ||
        acupoint.meridian_id?.toString() === selectedMeridian;

      return matchesSearch && matchesMeridian;
    });
  }, [acupoints, searchTerm, selectedMeridian]);

  const handleAddAcupoint = () => {
    setSelectedAcupoint(null);
    setModalOpen(true);
  };

  const handleEditAcupoint = (acupoint: AcupointModel) => {
    setSelectedAcupoint(acupoint);
    setModalOpen(true);
  };

  const handleDeleteAcupoint = async (id: number) => {
    if (!confirm("Bạn có chắc chắn muốn xóa huyệt này?")) return;

    try {
      await deleteMutation.mutateAsync({
        url: `/acupoints/${id}`,
        data: null,
        method: "DELETE",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting acupoint:", error);
    }
  };

  const handleModalSuccess = () => {
    refetch();
  };

  const getMeridianName = (meridianId: number) => {
    return (
      meridians.find((m: MeridianModel) => m.id === meridianId)?.name_vi || "-"
    );
  };

  const columns = [
    {
      title: "Mã",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (text: string) => <span className='font-semibold'>{text}</span>,
    },
    {
      title: "Tên Tiếng Việt",
      dataIndex: "name_vi",
      key: "name_vi",
      width: 150,
    },
    {
      title: "Kinh Lạc",
      dataIndex: "meridian_id",
      key: "meridian_id",
      width: 150,
      render: (meridian_id: number) => getMeridianName(meridian_id),
    },
    {
      title: "Vị Trí",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
      render: (text: string) => text || "-",
    },
    {
      title: "Chỉ Định",
      dataIndex: "indication",
      key: "indication",
      ellipsis: true,
      render: (text: string) => text || "-",
    },
    {
      title: "Hành Động",
      key: "action",
      width: 120,
      align: "center" as const,
      render: (_: any, record: AcupointModel) => (
        <Space size='small'>
          <AntButton
            type='primary'
            size='small'
            icon={<EditOutlined />}
            onClick={() => handleEditAcupoint(record)}
          />
          <Popconfirm
            title='Xóa huyệt'
            description='Bạn có chắc chắn muốn xóa huyệt này?'
            onConfirm={() => handleDeleteAcupoint(record.id!)}
            okText='Xóa'
            cancelText='Hủy'
            okButtonProps={{ danger: true }}>
            <AntButton
              type='primary'
              danger
              size='small'
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className='space-y-6 p-2'>
      {/* Header */}
      <div className='flex justify-between items-start'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Huyệt</h1>
        </div>
        <AntButton
          type='primary'
          size='large'
          icon={<PlusOutlined />}
          onClick={handleAddAcupoint}>
          Thêm Huyệt
        </AntButton>
      </div>

      {/* Filters Section */}
      <div className='bg-white rounded-lg p-4 space-y-4'>
        <h2 className='text-sm font-semibold text-gray-900'>Tất cả huyệt</h2>

        <div className='flex gap-3 flex-wrap'>
          <div className='flex-1 min-w-[200px]'>
            <div className='relative'>
              <Input
                placeholder='Tìm kiếm huyệt...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='pl-10'
              />
              <svg
                className='absolute left-3 top-2.5 h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
          </div>

          <Select
            placeholder='Kinh Lạc'
            value={selectedMeridian || undefined}
            onChange={value => setSelectedMeridian(value || "")}
            allowClear
            style={{ width: 200 }}
            options={[
              { label: "Tất cả kinh lạc", value: "" },
              ...meridians.map((m: MeridianModel) => ({
                label: m.name_vi,
                value: m.id?.toString(),
              })),
            ]}
          />
        </div>
      </div>

      {/* Table */}
      <div className='bg-white rounded-lg overflow-hidden'>
        <Table
          columns={columns}
          dataSource={filteredAcupoints}
          rowKey='id'
          loading={acupointsLoading || meridiansLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: total =>
              `${total} huyệt${selectedMeridian ? " trong kinh lạc đã chọn" : ""}${searchTerm ? ` khớp với "${searchTerm}"` : ""}`,
          }}
          scroll={{ x: true, y: "60vh" }}
        />
      </div>

      {/* Modal */}
      <AcupointModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        acupoint={selectedAcupoint}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
}
