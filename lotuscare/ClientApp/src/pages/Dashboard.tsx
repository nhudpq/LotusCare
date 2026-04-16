import {
  Card,
  Row,
  Col,
  Tabs,
  Button,
  Table,
  Badge,
  Tag,
  Space,
  Statistic,
  Select,
} from "antd";
import { ArrowUpOutlined, ArrowDownOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  // Mock data
  const revenueData = [
    { month: "T1", revenue: 45000 },
    { month: "T2", revenue: 52000 },
    { month: "T3", revenue: 48000 },
    { month: "T4", revenue: 61000 },
    { month: "T5", revenue: 55000 },
    { month: "T6", revenue: 67000 },
    { month: "T7", revenue: 72000 },
    { month: "T8", revenue: 58000 },
    { month: "T9", revenue: 64000 },
    { month: "T10", revenue: 71000 },
    { month: "T11", revenue: 68000 },
    { month: "T12", revenue: 75000 },
  ];

  const patientTypeData = [
    { name: "Khám Tổng Quát", value: 35 },
    { name: "Khám Chuyên Khoa", value: 45 },
    { name: "Khám Nha", value: 20 },
  ];

  const genderData = [
    { name: "Nam", value: 60 },
    { name: "Nữ", value: 35 },
    { name: "Khác", value: 5 },
  ];

  const recentOrders = [
    {
      id: 1,
      patient: "Nguyễn Văn A",
      appointment: "ĐỤC-001",
      status: "Hoàn Thành",
      amount: "$129.99",
      time: "23 phút trước",
      statusColor: "green",
    },
    {
      id: 2,
      patient: "Trần Thị B",
      appointment: "ĐỤC-002",
      status: "Đang Xử Lý",
      amount: "$89.95",
      time: "1 giờ trước",
      statusColor: "orange",
    },
    {
      id: 3,
      patient: "Lê Văn C",
      appointment: "ĐỤC-003",
      status: "Hoàn Thành",
      amount: "$34.50",
      time: "2 giờ trước",
      statusColor: "green",
    },
    {
      id: 4,
      patient: "Phạm Thị D",
      appointment: "ĐỤC-004",
      status: "Hủy",
      amount: "$199.00",
      time: "3 giờ trước",
      statusColor: "red",
    },
  ];

  const columns = [
    {
      title: "Bệnh Nhân",
      dataIndex: "patient",
      key: "patient",
    },
    {
      title: "Lịch Hẹn",
      dataIndex: "appointment",
      key: "appointment",
    },
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status: string, record: any) => (
        <Tag color={record.statusColor} style={{ borderRadius: "4px" }}>
          {status}
        </Tag>
      ),
    },
    {
      title: "Số Tiền",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "Thời Gian",
      dataIndex: "time",
      key: "time",
    },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className='  min-h-screen'>
      {/* KPI Cards */}
      <Row gutter={[16, 16]} className='mb-6'>
        <Col xs={24} sm={12} lg={6}>
          <Card className='h-full'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-gray-600 text-sm font-medium'>
                  Tổng Doanh Thu
                </p>
                <p className='text-2xl font-bold mt-2'>$485,000</p>
                <div className='flex items-center gap-1 text-red-600 text-xs mt-2'>
                  <ArrowDownOutlined />
                  <span>13.6% so với tháng trước</span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='h-full'>
            <div>
              <p className='text-gray-600 text-sm font-medium'>
                Tỷ Lệ Chuyên Đổi
              </p>
              <p className='text-2xl font-bold mt-2'>18.5%</p>
              <div className='flex items-center gap-1 text-red-600 text-xs mt-2'>
                <ArrowDownOutlined />
                <span>12.0% so với tháng trước</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='h-full'>
            <div>
              <p className='text-gray-600 text-sm font-medium'>Tổng Lịch Hẹn</p>
              <p className='text-2xl font-bold mt-2'>92</p>
              <div className='flex items-center gap-1 text-green-600 text-xs mt-2'>
                <ArrowUpOutlined />
                <span>125% so với tháng trước</span>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card className='h-full'>
            <div>
              <p className='text-gray-600 text-sm font-medium'>
                Bệnh Nhân Hoạt Động
              </p>
              <p className='text-2xl font-bold mt-2'>38</p>
              <div className='flex items-center gap-1 text-green-600 text-xs mt-2'>
                <ArrowUpOutlined />
                <span>25% so với tháng trước</span>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Charts Section */}
      <Row gutter={[16, 16]} className='mb-6'>
        {/* Sales Revenue */}
        <Col xs={24} lg={16}>
          <Card
            title={
              <div className='flex justify-between items-center'>
                <span>Doanh Thu Bán Hàng</span>
                <Space size='small'>
                  <Button size='small' type='text'>
                    4w
                  </Button>
                  <Button size='small' type='text'>
                    13w
                  </Button>
                  <Button size='small' type='text'>
                    17m
                  </Button>
                </Space>
              </div>
            }>
            <div className='mb-4'>
              <p className='text-2xl font-bold'>$640,000</p>
              <p className='text-green-600 text-sm'>
                <ArrowUpOutlined /> 8.2% so với tháng trước
              </p>
            </div>
            <ResponsiveContainer width='100%' height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Bar dataKey='revenue' fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Loại Dịch Vụ */}
        <Col xs={24} lg={8}>
          <Card title='Loại Dịch Vụ'>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={patientTypeData}
                  cx='50%'
                  cy='50%'
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey='value'>
                  {patientTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className='mt-4 text-sm'>
              {patientTypeData.map((item, idx) => (
                <div key={idx} className='flex items-center gap-2 mb-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: COLORS[idx] }}></div>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Gender & Recent Appointments */}
      <Row gutter={[16, 16]}>
        {/* Gender Distribution */}
        <Col xs={24} lg={8}>
          <Card title='Phân Bố Giới Tính'>
            <ResponsiveContainer width='100%' height={300}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx='50%'
                  cy='50%'
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey='value'>
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        {/* Recent Appointments */}
        <Col xs={24} lg={16}>
          <Card
            title='Lịch Hẹn Gần Đây'
            extra={<Button type='link'>Chi Tiết</Button>}>
            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
              size='small'
              rowKey='id'
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
