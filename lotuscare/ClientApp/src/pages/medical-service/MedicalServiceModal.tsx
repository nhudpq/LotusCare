import {
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Row,
  Col,
  Divider,
  Space,
} from "antd";

import type { MedicalServiceModel } from "@/models";

interface MedicalServiceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<MedicalServiceModel>) => void;
  initialData?: Partial<MedicalServiceModel>;
  isLoading?: boolean;
}

export default function MedicalServiceModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: MedicalServiceModalProps) {
  const [form] = Form.useForm();

  const isEditMode = !!initialData?.id;
  const title = isEditMode ? "Chỉnh Sửa Dịch Vụ Y Tế" : "Thêm mới dịch vụ y tế";
  const description = isEditMode
    ? "Cập nhật thông tin dịch vụ y tế hiện có."
    : "Bắt đầu một dịch vụ mới với thông tin chi tiết và cấu hình cơ bản.";

  const handleReset = () => {
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onCancel={handleClose}
      width={1100}
      footer={null}
      title={null}
      bodyStyle={{ padding: "16px" }}>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div className='flex-1'>
          <h1 className='text-xl font-bold text-gray-900'>{title}</h1>
          <p className='text-gray-500 text-sm mt-1'>{description}</p>
        </div>
        <Space size='large'>
          <Button onClick={handleReset} className='border-gray-300'>
            Đặt Lại
          </Button>
          {isEditMode && (
            <Button onClick={handleClose} className='border-gray-300'>
              Lưu Nháp
            </Button>
          )}
          <Button
            type='primary'
            loading={isLoading}
            onClick={handleSubmit}
            className='bg-gray-900 hover:bg-gray-800'
            size='large'>
            {isEditMode ? "Cập Nhật Dịch Vụ" : "Tạo Dịch Vụ"}
          </Button>
        </Space>
      </div>

      <Form
        form={form}
        layout='vertical'
        initialValues={initialData}
        autoComplete='off'>
        <Row gutter={[24, 24]}>
          {/* Left Column - Main Form */}
          <Col xs={24} lg={16}>
            {/* Thông Tin Dịch Vụ */}
            <div className='border border-gray-200 rounded-lg p-6 mb-6'>
              <div className='mb-4'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Thông Tin Dịch Vụ
                </h2>
                <p className='text-sm text-gray-600 mt-1'>
                  Nhập các chi tiết bắt buộc để xác định và tin tưởng vào dịch
                  vụ này.
                </p>
              </div>

              {/* Mã & Tên Dịch Vụ */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label='Mã Dịch Vụ'
                    name='code'
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập mã dịch vụ",
                      },
                    ]}>
                    <Input
                      placeholder='Ví dụ: SRV001'
                      disabled={isEditMode}
                      size='large'
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label='Tên Dịch Vụ'
                    name='name'
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập tên dịch vụ",
                      },
                    ]}>
                    <Input placeholder='Ví dụ: Khám Tổng Quát' size='large' />
                  </Form.Item>
                </Col>
              </Row>

              {/* Mô Tả */}
              <Form.Item
                label='Mô Tả'
                name='description'
                rules={[
                  {
                    max: 500,
                    message: "Mô tả không vượt quá 500 ký tự",
                  },
                ]}>
                <Input.TextArea
                  placeholder='Nhập mô tả chi tiết về dịch vụ để giúp khách hàng hiểu rõ hơn.'
                  rows={4}
                />
              </Form.Item>
            </div>

            {/* Chi Tiết Giá & Thời Gian */}
            <div className='border border-gray-200 rounded-lg p-6'>
              <div className='mb-4'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Giá & Thời Gian
                </h2>
                <p className='text-md text-gray-600 mt-1'>
                  Đặt giá dịch vụ và thời lượng cần thiết cho khách hàng.
                </p>
              </div>

              {/* Giá */}
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label='Giá Dịch Vụ (VND)'
                    name='price'
                    rules={[
                      {
                        required: true,
                        message: "Vui lòng nhập giá dịch vụ",
                      },
                      {
                        type: "number",
                        min: 0,
                        message: "Giá phải >= 0",
                      },
                    ]}>
                    <InputNumber
                      placeholder='Nhập giá dịch vụ'
                      min={0}
                      step={50000}
                      size='large'
                      style={{ width: "100%" }}
                      className='w-full'
                      formatter={value =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </Col>

                {/* Thời Lượng */}
                <Col xs={24} sm={12}>
                  <Form.Item
                    label='Thời Lượng (Phút)'
                    name='duration_minutes'
                    rules={[
                      {
                        type: "number",
                        min: 0,
                        message: "Thời lượng phải >= 0",
                      },
                    ]}>
                    <InputNumber
                      placeholder='Nhập thời lượng'
                      min={0}
                      size='large'
                      style={{ width: "100%" }}
                      className='w-full'
                    />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Col>

          {/* Right Column - Summary */}
          <Col xs={24} lg={8}>
            <div className='bg-gray-50 px-4 pt-2 pb-1 rounded-lg border-1 border-gray-200 mb-6'>
              <Form.Item
                label='Trạng Thái Dịch Vụ'
                name='status'
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái",
                  },
                ]}>
                <Select
                  placeholder='Chọn trạng thái'
                  options={[
                    {
                      label: "🟢 Hoạt Động",
                      value: "active",
                    },
                    {
                      label: "🔴 Không Hoạt Động",
                      value: "inactive",
                    },
                  ]}
                  size='large'
                />
              </Form.Item>
            </div>
            <div className='border border-gray-200 rounded-lg p-6 sticky top-0'>
              <div className='mb-4'>
                <h2 className='text-lg font-semibold text-gray-900'>
                  Tóm Tắt Dịch Vụ
                </h2>
                <p className='text-sm text-gray-600 mt-1'>
                  Xem nhanh thông tin dịch vụ đang được xây dựng.
                </p>
              </div>

              <Divider />

              {/* Service Details */}
              <div className='space-y-3 mb-6'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Mã Dịch Vụ:</span>
                  <strong className='text-gray-900 font-medium'>
                    {form.getFieldValue("code") || "-"}
                  </strong>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Tên Dịch Vụ:</span>
                  <strong className='text-gray-900 font-medium text-right max-w-[150px] truncate'>
                    {form.getFieldValue("name") || "-"}
                  </strong>
                </div>
              </div>

              <Divider />

              {/* Price Breakdown */}
              <div className='space-y-3 mb-6'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Giá Cơ Bản:</span>
                  <span className='text-gray-900 font-medium'>
                    {form.getFieldValue("price")
                      ? `${form.getFieldValue("price").toLocaleString()} ₫`
                      : "$0.00"}
                  </span>
                </div>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Thời Lượng:</span>
                  <span className='text-gray-900 font-medium'>
                    {form.getFieldValue("duration_minutes")
                      ? `${form.getFieldValue("duration_minutes")} phút`
                      : "-"}
                  </span>
                </div>
              </div>

              <Divider />

              {/* Status & Total */}
              <div className='space-y-3'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>Trạng Thái:</span>
                  <span className='text-gray-900 font-medium'>
                    {form.getFieldValue("status")
                      ? form.getFieldValue("status") === "active"
                        ? "🟢 Hoạt Động"
                        : "🔴 Không Hoạt Động"
                      : "-"}
                  </span>
                </div>
              </div>

              <Divider />
            </div>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
}
