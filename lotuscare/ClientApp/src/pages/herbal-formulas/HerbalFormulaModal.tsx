import React, { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  InputNumber,
  Checkbox,
  Button,
  Row,
  Col,
  Card,
  Alert,
} from "antd";

import type { HerbalFormulaModel } from "@/models";
import { useTanstackMutation } from "@/hooks/use-tanstack";

interface HerbalFormulaModalProps {
  visible: boolean;
  onClose: () => void;
  editingFormula?: HerbalFormulaModel | null;
  onSaved?: () => void;
}

const HerbalFormulaModal: React.FC<HerbalFormulaModalProps> = ({
  visible,
  onClose,
  editingFormula,
  onSaved,
}) => {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const isEditing = !!editingFormula;

  // Mutations for create and update
  const createMutation = useTanstackMutation<HerbalFormulaModel>(
    "/api/herbal-formulas",
    "POST",
  );
  const updateMutation = useTanstackMutation<HerbalFormulaModel>(
    "/api/herbal-formulas",
    "PUT",
  );

  useEffect(() => {
    if (visible) {
      if (editingFormula) {
        form.setFieldsValue({
          code: editingFormula.code,
          name: editingFormula.name,
          description: editingFormula.description,
          indication: editingFormula.indication,
          contraindication: editingFormula.contraindication,
          usage_instructions: editingFormula.usage_instructions,
          price: editingFormula.price,
          is_active: editingFormula.is_active,
        });
      } else {
        form.resetFields();
        form.setFieldValue("is_active", true);
      }
    }
  }, [visible, editingFormula, form]);

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateMutation.mutateAsync({
          url: `/api/herbal-formulas/${editingFormula?.id}`,
          data: values,
          method: "PUT",
        });
      } else {
        await createMutation.mutateAsync({
          url: "/api/herbal-formulas",
          data: values,
          method: "POST",
        });
      }
      form.resetFields();
      onSaved?.();
    } catch (error) {
      console.error("Error saving formula:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  const formValues = form.getFieldsValue();

  return (
    <Modal
      title={isEditing ? "Sửa Hỗ Trợ Trị Liệu" : "Thêm Hỗ Trợ Trị Liệu"}
      open={visible}
      onCancel={handleCancel}
      footer={null}
      width={1000}
      destroyOnClose>
      {isEditing && (
        <Alert
          message='Mã hỗ trợ trị liệu không thể chỉnh sửa'
          type='info'
          showIcon
          className='mb-4'
        />
      )}

      <Form form={form} layout='vertical' onFinish={handleSubmit}>
        <Row gutter={24}>
          {/* Left Column - Main Information */}
          <Col xs={24} lg={14}>
            <Card title='Thông Tin Hỗ Trợ Trị Liệu' bordered={false}>
              <Form.Item
                label='Mã HT'
                name='code'
                rules={[
                  { required: true, message: "Vui lòng nhập mã HT" },
                  { min: 2, message: "Mã phải có ít nhất 2 ký tự" },
                ]}>
                <Input placeholder='VD: HF001' disabled={isEditing} />
              </Form.Item>

              <Form.Item
                label='Tên Hỗ Trợ Trị Liệu'
                name='name'
                rules={[
                  { required: true, message: "Vui lòng nhập tên" },
                  { min: 3, message: "Tên phải có ít nhất 3 ký tự" },
                ]}>
                <Input placeholder='VD: Linh Chi Tâm Bình' />
              </Form.Item>

              <Form.Item
                label='Mô Tả'
                name='description'
                rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}>
                <Input.TextArea
                  rows={3}
                  placeholder='Mô tả chi tiết về hỗ trợ trị liệu'
                />
              </Form.Item>

              <Form.Item
                label='Chỉ Định'
                name='indication'
                rules={[{ required: true, message: "Vui lòng nhập chỉ định" }]}>
                <Input.TextArea
                  rows={3}
                  placeholder='VD: Điều trị bất mỉn, tăng cường miễn dịch'
                />
              </Form.Item>

              <Form.Item
                label='Chống Chỉ Định'
                name='contraindication'
                rules={[
                  { required: true, message: "Vui lòng nhập chống chỉ định" },
                ]}>
                <Input.TextArea
                  rows={3}
                  placeholder='VD: Phụ nữ mang thai, người dị ứng'
                />
              </Form.Item>

              <Form.Item
                label='Hướng Dẫn Sử Dụng'
                name='usage_instructions'
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập hướng dẫn sử dụng",
                  },
                ]}>
                <Input.TextArea
                  rows={3}
                  placeholder='VD: Sử dụng 1 gói mỗi ngày trước khi ngủ'
                />
              </Form.Item>

              <Form.Item
                label='Giá (₫)'
                name='price'
                rules={[
                  { required: true, message: "Vui lòng nhập giá" },
                  { type: "number", min: 0, message: "Giá phải lớn hơn 0" },
                ]}>
                <InputNumber
                  formatter={value =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={value =>
                    parseInt(value?.replace(/,/g, "") || "0") as any
                  }
                  min={0}
                  placeholder='0'
                  style={{ width: "100%" }}
                />
              </Form.Item>

              <Form.Item
                label='Trạng Thái'
                name='is_active'
                valuePropName='checked'>
                <Checkbox>
                  {formValues.is_active ? "🟢 Hoạt Động" : "🔴 Không Hoạt Động"}
                </Checkbox>
              </Form.Item>
            </Card>
          </Col>

          {/* Right Column - Summary Panel */}
          <Col xs={24} lg={10}>
            <Card
              title='Tóm Tắt Hỗ Trợ Trị Liệu'
              bordered
              style={{
                position: "sticky",
                top: 20,
                backgroundColor: "#fafafa",
              }}>
              <div className='space-y-4'>
                <div className='border-b pb-3'>
                  <div className='text-sm text-gray-500'>Mã HT</div>
                  <div className='text-lg font-semibold'>
                    {formValues.code || "———"}
                  </div>
                </div>

                <div className='border-b pb-3'>
                  <div className='text-sm text-gray-500'>Tên</div>
                  <div className='text-base font-medium'>
                    {formValues.name || "———"}
                  </div>
                </div>

                <div className='border-b pb-3'>
                  <div className='text-sm text-gray-500'>Mô Tả</div>
                  <div className='text-sm text-gray-700 truncate'>
                    {formValues.description?.substring(0, 50) || "———"}
                    {formValues.description?.length > 50 ? "..." : ""}
                  </div>
                </div>

                <div className='border-b pb-3'>
                  <div className='text-sm text-gray-500'>Chỉ Định</div>
                  <div className='text-sm text-gray-700 truncate'>
                    {formValues.indication?.substring(0, 50) || "———"}
                    {formValues.indication?.length > 50 ? "..." : ""}
                  </div>
                </div>

                <div className='border-b pb-3'>
                  <div className='text-sm text-gray-500'>Chống Chỉ Định</div>
                  <div className='text-sm text-gray-700 truncate'>
                    {formValues.contraindication?.substring(0, 50) || "———"}
                    {formValues.contraindication?.length > 50 ? "..." : ""}
                  </div>
                </div>

                <div className='border-b pb-3'>
                  <div className='text-sm text-gray-500'>Hướng Dẫn Sử Dụng</div>
                  <div className='text-sm text-gray-700 truncate'>
                    {formValues.usage_instructions?.substring(0, 50) || "———"}
                    {formValues.usage_instructions?.length > 50 ? "..." : ""}
                  </div>
                </div>

                <div className='bg-blue-50 p-4 rounded-lg border border-blue-200'>
                  <div className='text-xs text-gray-500 uppercase tracking-wide'>
                    Giá
                  </div>
                  <div className='text-3xl font-bold text-blue-600 mt-2'>
                    {formValues.price
                      ? `${formValues.price.toLocaleString("vi-VN")} ₫`
                      : "———"}
                  </div>
                </div>

                <div
                  className={`p-3 rounded text-center font-semibold ${
                    formValues.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                  {formValues.is_active ? "🟢 Hoạt Động" : "🔴 Không Hoạt Động"}
                </div>

                <div className='pt-4 space-y-2'>
                  <Button
                    type='primary'
                    size='large'
                    htmlType='submit'
                    loading={isLoading}
                    block>
                    {isEditing ? "Lưu Thay Đổi" : "Tạo Mới"}
                  </Button>
                  <Button size='large' onClick={handleCancel} block>
                    Hủy
                  </Button>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default HerbalFormulaModal;
