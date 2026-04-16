import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Row,
  Col,
  Upload,
  Divider,
  InputNumber,
  Space,
} from "antd";
import type { FormInstance } from "antd";
import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import type { PatientModel } from "@/models";

interface PatientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: Partial<PatientModel>) => void;
  initialData?: Partial<PatientModel>;
  isLoading?: boolean;
}

export default function PatientModal({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading = false,
}: PatientModalProps) {
  const [form] = Form.useForm();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    (initialData?.hinh_anh as string) || null,
  );

  const isEditMode = !!initialData?.id;
  const title = isEditMode ? "Chỉnh Sửa Bệnh Nhân" : "Thêm Mới Bệnh Nhân";
  const description = isEditMode
    ? "Cập nhật thông tin bệnh nhân"
    : "Tạo hồ sơ bệnh nhân mới với đầy đủ thông tin cần thiết.";

  const handleReset = () => {
    form.resetFields();
    setPreview(null);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        form.setFieldValue("hinh_anh", reader.result);
      };
      reader.readAsDataURL(file);
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
      width={1400}
      footer={
        <Space size='middle'>
          <Button onClick={handleReset} className='border-gray-300'>
            Đặt Lại
          </Button>
          <Button onClick={handleClose} className='border-gray-300'>
            Hủy
          </Button>
          <Button
            type='primary'
            loading={isLoading}
            onClick={handleSubmit}
            className='bg-gray-900'>
            {isEditMode ? "Cập Nhật" : "Thêm Mới"}
          </Button>
        </Space>
      }
      centered
      title={null}
      bodyStyle={{ padding: "12px" }}>
      {/* Header */}
      <div className='flex items-start justify-between mb-8'>
        <div>
          <h4 className='text-xl font-bold text-gray-900'>{title}</h4>
          <p className='text-gray-500 text-sm mt-2'>{description}</p>
        </div>
      </div>

      <div
        style={{ maxHeight: "74vh", overflowY: "auto", overflowX: "hidden" }}>
        <Form
          form={form}
          layout='vertical'
          initialValues={initialData}
          autoComplete='off'>
          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <div className='bg-gray-50 p-6 rounded-lg mb-6'>
                <h2 className='text-lg font-semibold text-gray-900 mb-2'>
                  Thông Tin Cơ Bản
                </h2>
                <p className='text-sm text-gray-600 mb-6'>
                  Nhập hoặc cập nhật thông tin cơ bản của bệnh nhân.
                </p>

                {/* Avatar Upload */}
                <div className='mb-6'>
                  <label className='text-sm font-medium text-gray-700 mb-3 block'>
                    Ảnh Đại Diện
                  </label>
                  <div className='flex items-center gap-4'>
                    <div className='w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden'>
                      {preview ? (
                        <img
                          src={preview}
                          alt='preview'
                          className='w-full h-full object-cover'
                        />
                      ) : (
                        <Camera className='text-gray-400' size={32} />
                      )}
                    </div>
                    <div>
                      <input
                        ref={fileInputRef}
                        type='file'
                        accept='image/*'
                        onChange={handleImageUpload}
                        hidden
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className='mb-2'>
                        Tải Lên Ảnh
                      </Button>
                      {preview && (
                        <Button
                          onClick={() => setPreview(null)}
                          danger
                          type='text'>
                          Xóa
                        </Button>
                      )}
                      <p className='text-xs text-gray-500 mt-2'>
                        JPG hoặc PNG. Khuyến nghị 1000x1000px.
                      </p>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Họ Tên */}
                <Form.Item
                  label='Họ Tên'
                  name='ho_ten'
                  rules={[{ required: true, message: "Vui lòng nhập họ tên" }]}>
                  <Input placeholder='Ví dụ: Nguyễn Văn A' size='large' />
                </Form.Item>

                {/* Giới Tính & Ngày Sinh */}
                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Item
                      label='Giới Tính'
                      name='gioi_tinh'
                      rules={[
                        { required: true, message: "Vui lòng chọn giới tính" },
                      ]}>
                      <Select
                        placeholder='Chọn giới tính'
                        options={[
                          { label: "Nam", value: 1 },
                          { label: "Nữ", value: 2 },
                          { label: "Khác", value: 3 },
                        ]}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label='Ngày Sinh'
                      name='ngay_sinh'
                      rules={[
                        { required: true, message: "Vui lòng chọn ngày sinh" },
                      ]}>
                      <Input type='date' />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Điện Thoại & Email */}
                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Item
                      label='Điện Thoại'
                      name='phone'
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập số điện thoại",
                        },
                        {
                          pattern: /^[0-9]{10,11}$/,
                          message: "Số điện thoại không hợp lệ",
                        },
                      ]}>
                      <Input placeholder='0901234567' />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label='Email'
                      name='email'
                      rules={[
                        { type: "email", message: "Email không hợp lệ" },
                        { required: true, message: "Vui lòng nhập email" },
                      ]}>
                      <Input placeholder='example@email.com' type='email' />
                    </Form.Item>
                  </Col>
                </Row>

                {/* Mã Bệnh Nhân & CMND */}
                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Item
                      label='Mã Bệnh Nhân'
                      name='ma_bn'
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập mã bệnh nhân",
                        },
                      ]}>
                      <Input placeholder='Ví dụ: BN001' disabled={isEditMode} />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item
                      label='Số CMND/CCCD'
                      name='so_cmnd'
                      rules={[
                        { required: true, message: "Vui lòng nhập số CMND" },
                      ]}>
                      <Input placeholder='123456789' />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              {/* Thông Tin Liên Hệ */}
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Thông Tin Liên Hệ Khác
                </h3>

                <Form.Item
                  label='Điện Thoại Cha/Người Thân'
                  name='father_phone'
                  rules={[
                    {
                      pattern: /^[0-9]{10,11}$/,
                      message: "Số điện thoại không hợp lệ",
                    },
                  ]}>
                  <Input placeholder='0909876543' />
                </Form.Item>

                <Form.Item label='Họ Tên Cha' name='ho_ten_cha'>
                  <Input placeholder='Ví dụ: Nguyễn Văn B' />
                </Form.Item>

                <Form.Item label='Họ Tên Mẹ' name='ho_ten_ncs'>
                  <Input placeholder='Ví dụ: Trần Thị C' />
                </Form.Item>
              </div>
            </Col>

            {/* Right Column */}
            <Col xs={24} lg={12}>
              {/* Địa Chỉ */}
              <div className='bg-gray-50 p-6 rounded-lg mb-6'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Địa Chỉ
                </h3>

                <Form.Item
                  label='Địa Chỉ Chi Tiết'
                  name='dia_chi'
                  rules={[
                    { required: true, message: "Vui lòng nhập địa chỉ" },
                  ]}>
                  <Input.TextArea
                    placeholder='Ví dụ: 123 Lê Lợi, Quận 1, TP.HCM'
                    rows={3}
                  />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={12}>
                    <Form.Item label='Tỉnh/Thành Phố' name='tinh'>
                      <Input placeholder='Ví dụ: 01' />
                    </Form.Item>
                  </Col>
                  <Col xs={12}>
                    <Form.Item label='Quận/Huyện' name='huyen'>
                      <Input placeholder='Ví dụ: 001' />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label='Phường/Xã' name='xa'>
                  <Input placeholder='Ví dụ: 00001' />
                </Form.Item>

                <Form.Item label='Quốc Tịch' name='ma_quoc_tich'>
                  <Input placeholder='Ví dụ: VN' />
                </Form.Item>
              </div>

              {/* Thông Tin Y Tế */}
              <div className='bg-gray-50 p-6 rounded-lg'>
                <h3 className='text-lg font-semibold text-gray-900 mb-4'>
                  Thông Tin Y Tế
                </h3>

                <Form.Item label='Tiền Sử Bệnh' name='tien_su_benh' rules={[]}>
                  <Input.TextArea
                    placeholder='Nhập tiền sử bệnh (nếu có)'
                    rows={4}
                  />
                </Form.Item>

                <Form.Item label='Dị Ứng' name='di_ung' rules={[]}>
                  <Input.TextArea
                    placeholder='Ví dụ: Phấn hoa, Penicillin...'
                    rows={3}
                  />
                </Form.Item>

                <Form.Item label='Ghi Chú' name='ghi_chu' rules={[]}>
                  <Input.TextArea
                    placeholder='Thêm ghi chú khác (nếu cần)'
                    rows={3}
                  />
                </Form.Item>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
}
