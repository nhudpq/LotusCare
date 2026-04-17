import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Tabs,
  Popconfirm,
  Tag,
  Badge,
  Space,
  Input,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import HerbalFormulaModal from "./HerbalFormulaModal";
import { useTanstack, useTanstackMutation } from "@/hooks/use-tanstack";
import type { HerbalFormulaModel } from "@/models";

const HerbalFormulas: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingFormula, setEditingFormula] =
    useState<HerbalFormulaModel | null>(null);
  const [searchText, setSearchText] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  // Fetch all formulas
  const { data: formulas = [], refetch } = useTanstack<HerbalFormulaModel[]>(
    "/api/herbal-formulas",
    "herbal-formulas",
  );

  // Delete mutation
  const deleteFormulaMutation = useTanstackMutation<{ success: boolean }>(
    "/api/herbal-formulas",
    "DELETE",
  );

  // Count formulas by status
  const activeCount = formulas.filter(f => f.is_active === true).length;
  const inactiveCount = formulas.filter(f => f.is_active === false).length;

  // Filter formulas based on tab and search
  const filteredFormulas = formulas.filter(formula => {
    // Filter by status tab
    if (activeTab === "active" && !formula.is_active) return false;
    if (activeTab === "inactive" && formula.is_active) return false;

    // Filter by search text
    if (!searchText) return true;
    const text = searchText.toLowerCase();
    return (
      formula.code?.toLowerCase().includes(text) ||
      formula.name?.toLowerCase().includes(text) ||
      formula.description?.toLowerCase().includes(text)
    );
  });

  // Handle add formula
  const handleAddFormula = () => {
    setEditingFormula(null);
    setIsModalVisible(true);
  };

  // Handle edit formula
  const handleEditFormula = (formula: HerbalFormulaModel) => {
    setEditingFormula(formula);
    setIsModalVisible(true);
  };

  // Handle close modal
  const handleCloseModal = () => {
    setIsModalVisible(false);
    setEditingFormula(null);
  };

  // Handle formula saved from modal
  const handleFormulaSaved = () => {
    handleCloseModal();
    refetch();
  };

  // Handle delete formula
  const handleDeleteFormula = async (id: number | string | undefined) => {
    try {
      await deleteFormulaMutation.mutateAsync({
        url: `/api/herbal-formulas/${id}`,
        method: "DELETE",
      });
      refetch();
    } catch (error) {
      console.error("Error deleting formula:", error);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Mã HT",
      dataIndex: "code",
      key: "code",
      width: 80,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: "Tên Hỗ Trợ Trị Liệu",
      dataIndex: "name",
      key: "name",
      width: 200,
    },
    {
      title: "Mô Tả",
      dataIndex: "description",
      key: "description",
      width: 200,
      ellipsis: true,
    },
    {
      title: "Chỉ Định",
      dataIndex: "indication",
      key: "indication",
      width: 180,
      ellipsis: true,
      render: (text: string) =>
        text?.substring(0, 50) + (text?.length > 50 ? "..." : ""),
    },
    {
      title: "Chống Chỉ Định",
      dataIndex: "contraindication",
      key: "contraindication",
      width: 180,
      ellipsis: true,
      render: (text: string) =>
        text?.substring(0, 50) + (text?.length > 50 ? "..." : ""),
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (price: number) => `${price.toLocaleString("vi-VN")} ₫`,
    },
    {
      title: "Trạng Thái",
      dataIndex: "is_active",
      key: "is_active",
      width: 100,
      render: (is_active: boolean | number) => (
        <Tag color={is_active ? "#52c41a" : "#f50"}>
          {is_active ? "🟢 Hoạt Động" : "🔴 Không Hoạt Động"}
        </Tag>
      ),
    },
    {
      title: "Thao Tác",
      key: "action",
      width: 100,
      render: (_: unknown, record: HerbalFormulaModel) => (
        <Space size='middle'>
          <Button
            type='primary'
            size='small'
            icon={<EditOutlined />}
            onClick={() => handleEditFormula(record)}>
            Sửa
          </Button>
          <Popconfirm
            title='Xóa hỗ trợ trị liệu'
            description='Bạn có chắc chắn muốn xóa hỗ trợ trị liệu này?'
            onConfirm={() => handleDeleteFormula(record.id)}
            okText='Xóa'
            cancelText='Hủy'>
            <Button danger size='small' icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className='space-y-6'>
      <Card>
        <div className='flex justify-between items-center mb-6'>
          <h1 className='text-2xl font-bold'>Test</h1>
          <Button
            type='primary'
            size='large'
            icon={<PlusOutlined />}
            onClick={handleAddFormula}>
            Thêm Hỗ Trợ Trị Liệu
          </Button>
        </div>

        <div className='mb-4'>
          <Input
            placeholder='Tìm kiếm theo mã, tên hoặc mô tả...'
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
            size='large'
          />
        </div>

        <Tabs
          className='mb-6'
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: "all",
              label: `Tất Cả (${formulas.length})`,
            },
            {
              key: "active",
              label: (
                <>
                  Hoạt Động{" "}
                  {activeCount > 0 && (
                    <Badge
                      count={activeCount}
                      showZero
                      style={{ backgroundColor: "#52c41a" }}
                    />
                  )}
                </>
              ),
            },
            {
              key: "inactive",
              label: (
                <>
                  Không Hoạt Động{" "}
                  {inactiveCount > 0 && (
                    <Badge
                      count={inactiveCount}
                      showZero
                      style={{ backgroundColor: "#f50" }}
                    />
                  )}
                </>
              ),
            },
          ]}
        />

        <Table
          columns={columns}
          dataSource={filteredFormulas}
          rowKey='id'
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      </Card>

      <HerbalFormulaModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        editingFormula={editingFormula}
        onSaved={handleFormulaSaved}
      />
    </div>
  );
};

export default HerbalFormulas;
