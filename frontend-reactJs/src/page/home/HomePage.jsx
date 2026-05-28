import React from "react";
import { Card, Row, Col, Typography, Table, Badge, Tag, Progress, Avatar, Space } from "antd";
import { 
  ArrowUpOutlined, ArrowDownOutlined, MoreOutlined, 
  UserOutlined, ShoppingCartOutlined, EyeOutlined, DollarOutlined 
} from "@ant-design/icons";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, Filler, ArcElement } from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Title, Tooltip, Legend, Filler);

const { Title: AntTitle, Text } = Typography;

const HomePage = () => {
  // --- Data សម្រាប់ Statistics (Cards ខាងលើ) ---
  const stats = [
    { title: "Total Revenue", value: "$48,295", percent: "+12.5%", isUp: true, color: "#10b981", icon: <DollarOutlined /> },
    { title: "Active Users", value: "2,847", percent: "+8.2%", isUp: true, color: "#3b82f6", icon: <UserOutlined /> },
    { title: "Total Orders", value: "1,432", percent: "-3.1%", isUp: false, color: "#ef4444", icon: <ShoppingCartOutlined /> },
    { title: "Page Views", value: "284K", percent: "+24.7%", isUp: true, color: "#f59e0b", icon: <EyeOutlined /> },
  ];

  // --- Data សម្រាប់ Main Chart (Overview) ---
  const mainChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Revenue",
      data: [18000, 22000, 20000, 28000, 32000, 30000, 35000, 38000, 42000, 40000, 48000, 52000],
      borderColor: "#10b981",
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      fill: true,
      tension: 0.4,
    }]
  };

  // --- Data សម្រាប់ Traffic Sources (Donut Chart) ---
  const trafficData = {
    labels: ["Direct", "Organic", "Referral", "Social"],
    datasets: [{
      data: [35, 28, 22, 15],
      backgroundColor: ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899"],
      borderWidth: 0,
    }]
  };

  // --- Data សម្រាប់ Table (Recent Orders) ---
  const columns = [
    { 
      title: "Customer", 
      dataIndex: "name", 
      render: (text, r) => (
        <Space>
          <Avatar src={r.avatar} icon={<UserOutlined />} />
          <div><div className="font-bold">{text}</div><div className="text-xs text-gray-400">{r.email}</div></div>
        </Space>
      ) 
    },
    { title: "Order ID", dataIndex: "orderId" },
    { title: "Product", dataIndex: "product" },
    { 
      title: "Status", 
      dataIndex: "status", 
      render: (s) => (
        <Tag color={s === "Completed" ? "green" : s === "Pending" ? "orange" : s === "Processing" ? "blue" : "red"}>
          {s}
        </Tag>
      ) 
    },
    { title: "Amount", dataIndex: "amount", render: (a) => <b>${a}</b> },
  ];

  const orderData = [
    { key: "1", name: "Emma Wilson", email: "emma@example.com", orderId: "ORD-7891", product: "Pro Dashboard License", status: "Completed", amount: "299.00" },
    { key: "2", name: "James Chen", email: "james@company.io", orderId: "ORD-7890", product: "Team Plan Upgrade", status: "Processing", amount: "599.00" },
    { key: "3", name: "Sofia Garcia", email: "sofia@startup.co", orderId: "ORD-7889", product: "Enterprise License", status: "Completed", amount: "1,499.00" },
  ];

  return (
    <div className="space-y-6">
      {/* ១. ផ្នែក Statistics Cards */}
      <Row gutter={[16, 16]}>
        {stats.map((item, index) => (
          <Col xs={24} sm={12} lg={6} key={index}>
            <Card className="rounded-xl border-none shadow-sm overflow-hidden relative">
              <div className="flex justify-between items-start">
                <div>
                  <Text type="secondary" className="text-xs font-medium">{item.title}</Text>
                  <AntTitle level={3} className="m-0 mt-1 font-bold">{item.value}</AntTitle>
                  <div className={`text-xs mt-2 font-bold ${item.isUp ? "text-emerald-500" : "text-red-500"}`}>
                    {item.isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />} {item.percent} 
                    <span className="text-gray-400 font-normal ml-1">vs last month</span>
                  </div>
                </div>
                <div className={`p-2 rounded-lg bg-gray-50`} style={{ color: item.color }}>
                  {item.icon}
                </div>
              </div>
              {/* Mini Curve Line for aesthetic */}
              <div className="absolute bottom-0 left-0 w-full h-8 opacity-20">
                <Line data={{ labels: [1,2,3,4,5], datasets: [{ data: [10, 15, 8, 20, 18], borderColor: item.color, borderWidth: 2, pointRadius: 0, fill: false }] }} options={{ plugins: { legend: false }, scales: { x: { display: false }, y: { display: false } }, maintainAspectRatio: false }} />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ២. ផ្នែក Overview Chart & Traffic Sources */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Overview" extra={<Text type="secondary">Monthly performance</Text>} className="rounded-xl border-none shadow-sm h-full">
            <div className="h-[350px]">
              <Line data={mainChartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: false } }} />
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <div className="space-y-6">
            <Card title="Traffic Sources" className="rounded-xl border-none shadow-sm">
              <div className="flex flex-col items-center">
                <div className="h-[180px] w-full">
                  <Doughnut data={trafficData} options={{ maintainAspectRatio: false, cutout: "75%", plugins: { legend: { position: 'right' } } }} />
                </div>
                <div className="mt-4 w-full space-y-2 text-xs">
                  <div className="flex justify-between"><span>Direct</span> <b>35%</b></div>
                  <div className="flex justify-between"><span>Organic</span> <b>28%</b></div>
                </div>
              </div>
            </Card>
            <Card title="Monthly Goals" className="rounded-xl border-none shadow-sm text-xs">
               <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1"><span>Monthly Revenue</span> <b>88%</b></div>
                    <Progress percent={88} strokeColor="#10b981" showInfo={false} size="small" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1"><span>New Customers</span> <b>85%</b></div>
                    <Progress percent={85} strokeColor="#3b82f6" showInfo={false} size="small" />
                  </div>
               </div>
            </Card>
          </div>
        </Col>
      </Row>

      {/* ៣. ផ្នែក Recent Orders & Activity */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card title="Recent Orders" extra={<a href="#">View all</a>} className="rounded-xl border-none shadow-sm overflow-hidden">
            <Table columns={columns} dataSource={orderData} pagination={false} className="custom-table" />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="Recent Activity" extra={<MoreOutlined />} className="rounded-xl border-none shadow-sm h-full">
            <div className="space-y-6">
              {[
                { title: "New order placed", desc: "Emma Wilson purchased Pro License", time: "2 min ago", icon: <ShoppingCartOutlined />, bg: "bg-emerald-50 text-emerald-500" },
                { title: "New customer registered", desc: "James Chen created an account", time: "15 min ago", icon: <UserOutlined />, bg: "bg-blue-50 text-blue-500" },
                { title: "Payment received", desc: "$1,499 from Sofia Garcia", time: "2 hours ago", icon: <DollarOutlined />, bg: "bg-purple-50 text-purple-500" },
              ].map((act, i) => (
                <div className="flex gap-4" key={i}>
                  <div className={`p-2 h-10 w-10 flex items-center justify-center rounded-lg ${act.bg}`}>{act.icon}</div>
                  <div>
                    <div className="text-sm font-bold">{act.title}</div>
                    <div className="text-xs text-gray-400">{act.desc}</div>
                    <div className="text-[10px] text-gray-300 mt-1">{act.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;