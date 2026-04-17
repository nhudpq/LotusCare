import { useState, useEffect } from "react";
import { useTanstackMutation } from "@/hooks/use-tanstack";

import { Input } from "@/components/ui/input";
import { AcupointModal } from "./AcupointModal";
import type { AcupointModel, MeridianModel } from "@/models";
import { Table, Popconfirm, Space, Button as AntButton, Select, Spin } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";

interface PaginationResponse {
  data: AcupointModel[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function Acupoints() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMeridian, setSelectedMeridian] = useState<string>("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAcupoint, setSelectedAcupoint] =
    useState<AcupointModel | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  
  // Data state
  const [acupointData, setAcupointData] = useState<PaginationResponse>({
    data: [],
    pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
  });
  const [meridians, setMeridians] = useState<MeridianModel[]>([]);
  const [loading, setLoading] = useState(false);
  const [meridiansLoading, setMeridiansLoading] = useState(false);

  // Delete mutation
  const deleteMutation = useTanstackMutation("/acupoints", "DELETE");

  // Fetch meridians
  useEffect(() => {
    const fetchMeridians = async () => {
      try {
        setMeridiansLoading(true);
        const response = await fetch("/api/meridians");
        const data = await response.json();
        setMeridians(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching meridians:", error);
      } finally {
        setMeridiansLoading(false);
      }
    };
    fetchMeridians();
  }, []);

  // Fetch acupoints based on search and filters
  useEffect(() => {
    const fetchAcupoints = async () => {
      try {
        setLoading(true);
        let url = `/api/acupoints?page=${page}&limit=${limit}`;
        
        if (searchTerm) {
          url = `/api/acupoints/search-paginated?q=${encodeURIComponent(searchTerm)}&page=${page}&limit=${limit}`;
        } else if (selectedMeridian) {
          url = `/api/acupoints/meridian/${selectedMeridian}/paginated?page=${page}&limit=${limit}`;
        }
        
        const response = await fetch(url);
        const data: PaginationResponse = await response.json();
        setAcupointData(data);
      } catch (error) {
        console.error("Error fetching acupoints:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Reset to page 1 when search or filter changes
    if (searchTerm || selectedMeridian) {
      setPage(1);
    }
    
    fetchAcupoints();
  }, [searchTerm, selectedMeridian, page, limit]);

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
      // Refetch data
      setPage(1);
    } catch (error) {
      console.error("Error deleting acupoint:", error);
    }
  };

  const handleModalSuccess = () => {
    // Refetch data after successful create/update
    setPage(1);
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
        <Spin spinning={loading || meridiansLoading}>
          <Table
            columns={columns}
            dataSource={acupointData.data}
            rowKey='id'
            pagination={{
              current: acupointData.pagination.page,
              pageSize: acupointData.pagination.limit,
              total: acupointData.pagination.total,
              onChange: (newPage, pageSize) => {
                setPage(newPage);
                setLimit(pageSize);
              },
              onShowSizeChange: (current, size) => {
                setPage(1);
                setLimit(size);
              },
              showSizeChanger: true,
              showTotal: (total) =>
                `${total} huyệt${selectedMeridian ? " trong kinh lạc đã chọn" : ""}${searchTerm ? ` khớp với "${searchTerm}"` : ""}`,
              pageSizeOptions: ['10', '20', '50', '100'],
            }}
            scroll={{ x: true, y: "60vh" }}
          />
        </Spin>
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
