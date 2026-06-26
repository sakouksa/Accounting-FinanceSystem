import React from 'react'
import {
  Card,
  Row,
  Col,
  Typography,
  Table,
  Tag,
  Progress,
  Avatar,
  Space
} from 'antd'
import {
  ArrowUpOutlined,
  ArrowDownOutlined,
  MoreOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  EyeOutlined,
  DollarOutlined,
  FileTextOutlined,
  SwapOutlined
} from '@ant-design/icons'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js'
import { Line, Doughnut } from 'react-chartjs-2'
import MainPage from '../../components/layout/MainPage'
import { useDashboard } from './hooks/useDashboard'
import { FaRegUser } from 'react-icons/fa'
// Register ChartJS modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const { Title: AntTitle, Text, Link } = Typography

const HomePage = () => {
  const { state } = useDashboard()

  // Null safety and fallback values from dashboard state
  const stats = state?.stats ?? {}
  const overviewChart = state?.overviewChart ?? { labels: [], data: [] }
  const trafficSources = state?.trafficSources ?? [0, 0, 0, 0]
  const recentTransactions = state?.recentTransactions ?? []
  const recentActivities = state?.recentActivities ?? []

  // Configuration for top statistics cards
  const cardStats = [
    {
      title: 'ចំណូលសរុប (Total Revenue)',
      value: `$${Number(stats.totalRevenue ?? 0).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`,
      percent: `${stats.revenuePercent ?? '0.0'}%`,
      isUp: stats.isRevenueUp ?? true,
      color: '#10b981',
      icon: <DollarOutlined />
    },
    {
      title: 'អ្នកប្រើប្រាស់ក្នុងប្រព័ន្ធ (Active Users)',
      value: Number(stats.activeUsers ?? 0).toLocaleString(),
      percent: 'ស្ថិរភាព',
      isUp: true,
      color: '#3b82f6',
      icon: <UserOutlined />
    },
    {
      title: 'ប្រតិបត្តិការសរុប (Total Transactions)',
      value: Number(stats.totalTransactions ?? 0).toLocaleString(),
      percent: `${stats.trxPercent ?? '0.0'}%`,
      isUp: stats.isTrxUp ?? true,
      color: '#8b5cf6',
      icon: <SwapOutlined />
    },
    {
      title: 'ការពិនិត្យសវនកម្ម (Audit Logs Count)',
      value: Number(stats.pageViews ?? 0).toLocaleString(),
      percent: 'សុវត្ថិភាព',
      isUp: true,
      color: '#f59e0b',
      icon: <EyeOutlined />
    }
  ]

  // Data structure for the Line chart (Financial Overview)
  const mainChartData = {
    labels: overviewChart.labels,
    datasets: [
      {
        label: 'លំហូរចំណូលសរុប ($)',
        data: overviewChart.data,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  }

  // Data structure for the Doughnut chart (Transaction Entry)
  const trafficData = {
    labels: [
      'ប្រព័ន្ធ POS',
      'វិក្កយបត្រដៃ (Invoice)',
      'បំណុលចាស់ (AR)',
      'សវនកម្មផ្ទាល់ (JV)'
    ],
    datasets: [
      {
        data: trafficSources,
        backgroundColor: ['#10b981', '#3b82f6', '#8b5cf6', '#ec4899'],
        borderWidth: 0
      }
    ]
  }

  // Table columns definition for Recent Transactions
  const columns = [
    {
      title: 'បេក្ខជន/អតិថិជន',
      dataIndex: 'name',
      key: 'name',
      render: (text, r) => {
        // Explicitly check if avatar exists and is not an empty string
        const hasAvatar = r.avatar && r.avatar.trim() !== ''

        return (
          <Space>

            <div>
              <div className='font-bold text-gray-700'>{text}</div>
              <div className='text-xs text-gray-400'>{r.email}</div>
            </div>
          </Space>
        )
      }
    },
    {
      title: 'លេខកូដប្រតិបត្តិការ',
      dataIndex: 'transaction_no',
      key: 'transaction_no',
      render: text => (
        <span className='font-mono font-medium text-blue-600'>{text}</span>
      )
    },
    {
      title: 'បរិយាយ / ព័ត៌មានយោង',
      dataIndex: 'description',
      key: 'description'
    },
    {
      title: 'ស្ថានភាព',
      dataIndex: 'status',
      key: 'status',
      render: s => {
        let color = 'orange'
        let textKh = 'រង់ចាំពិនិត្យ'

        // Dynamic status coloring based on backend string response
        const statusClean = s?.toLowerCase()
        if (
          statusClean === 'completed' ||
          statusClean === 'approved' ||
          statusClean === 'ជោគជ័យ' ||
          statusClean === 'posted'
        ) {
          color = 'green'
          textKh = 'អនុម័តរួច (Posted)'
        } else if (statusClean === 'pending' || statusClean === 'រង់ចាំ') {
          color = 'orange'
          textKh = 'រង់ចាំការអនុម័ត'
        } else if (
          statusClean === 'rejected' ||
          statusClean === 'banned' ||
          statusClean === 'voided'
        ) {
          color = 'red'
          textKh = 'បដិសេធ (Voided)'
        } else if (statusClean === 'draft' || statusClean === 'ព្រាង') {
          color = 'gray'
          textKh = 'ឯកសារព្រាង (Draft)'
        }

        return (
          <Tag color={color} className='rounded-md px-2'>
            {textKh}
          </Tag>
        )
      }
    },
    {
      title: 'ទឹកប្រាក់',
      dataIndex: 'amount',
      key: 'amount',
      render: a => <b className='text-gray-800'>${Number(a).toFixed(2)}</b>
    }
  ]

  // Dynamic mapper for Audit Log icons based on transaction type
  const getActivityIcon = type => {
    const typeClean = type?.toUpperCase()

    if (typeClean?.includes('ADV')) {
      return { icon: <FileTextOutlined />, bg: 'bg-cyan-50 text-cyan-500' }
    }

    switch (typeClean) {
      case 'SALE':
      case 'REC':
        return {
          icon: <DollarOutlined />,
          bg: 'bg-emerald-50 text-emerald-500'
        }
      case 'PAY':
        return { icon: <ShoppingCartOutlined />, bg: 'bg-red-50 text-red-500' }
      case 'JV':
        return { icon: <FileTextOutlined />, bg: 'bg-blue-50 text-blue-500' }
      default:
        return { icon: <SwapOutlined />, bg: 'bg-purple-50 text-purple-500' }
    }
  }

  return (
    <MainPage loading={state?.loading}>
      <div className='space-y-6'>
        {/* Top Summarized Grid Cards */}
        <Row gutter={[16, 16]}>
          {cardStats.map((item, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                className='rounded-xl border-none shadow-sm overflow-hidden relative'
                bordered={false}
              >
                <div className='flex justify-between items-start'>
                  <div>
                    <Text type='secondary' className='text-xs font-medium'>
                      {item.title}
                    </Text>
                    <AntTitle level={3} className='m-0 mt-1 font-bold'>
                      {item.value}
                    </AntTitle>
                    <div
                      className={`text-xs mt-2 font-bold ${
                        item.isUp ? 'text-emerald-500' : 'text-red-500'
                      }`}
                    >
                      {item.percent !== 'ស្ថិរភាព' &&
                        item.percent !== 'សុវត្ថិភាព' &&
                        (item.isUp ? (
                          <ArrowUpOutlined />
                        ) : (
                          <ArrowDownOutlined />
                        ))}{' '}
                      {item.percent}
                      <span className='text-gray-400 font-normal ml-1'>
                        ធៀបខែមុន
                      </span>
                    </div>
                  </div>
                  <div
                    className='p-2 rounded-lg bg-gray-50'
                    style={{ color: item.color }}
                  >
                    {item.icon}
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts & Analytical Section */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title='គំនូសលំហូរហិរញ្ញវត្ថុទូទៅ (Financial Overview)'
              extra={<Text type='secondary'>ស្ថិតិប្រចាំខែក្នុងឆ្នាំនេះ</Text>}
              className='rounded-xl border-none shadow-sm h-full'
              bordered={false}
            >
              <div className='h-[350px]'>
                <Line
                  data={mainChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: false }
                  }}
                />
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <div className='space-y-6'>
              {/* Doughnut Traffic Analysis */}
              <Card
                title='ប្រភពនៃប្រតិបត្តិការ (Transaction Entry)'
                className='rounded-xl border-none shadow-sm'
                bordered={false}
              >
                <div className='flex flex-col items-center'>
                  <div className='h-[180px] w-full'>
                    <Doughnut
                      data={trafficData}
                      options={{
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: { legend: { position: 'right' } }
                      }}
                    />
                  </div>
                  <div className='mt-4 w-full space-y-2 text-xs'>
                    <div className='flex justify-between'>
                      <span>ប្រព័ន្ធ POS</span> <b>{trafficSources[0] ?? 0}%</b>
                    </div>
                    <div className='flex justify-between'>
                      <span>វិក្កយបត្រដៃ (Invoice)</span>{' '}
                      <b>{trafficSources[1] ?? 0}%</b>
                    </div>
                    <div className='flex justify-between'>
                      <span>បំណុលចាស់ (AR)</span>{' '}
                      <b>{trafficSources[2] ?? 0}%</b>
                    </div>
                    <div className='flex justify-between'>
                      <span>សវនកម្មផ្ទាល់ (JV)</span>{' '}
                      <b>{trafficSources[3] ?? 0}%</b>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Progress-based Balance Sheet Overview (AR/AP) */}
              <Card
                title='សេចក្តីសង្ខេបគណនេយ្យ (AR & AP Summary)'
                className='rounded-xl border-none shadow-sm text-xs'
                bordered={false}
              >
                <div className='space-y-4'>
                  <div>
                    <div className='flex justify-between mb-1'>
                      <span>ត្រូវទទួលពីអតិថិជន (Accounts Receivable)</span>{' '}
                      <b>
                        $
                        {Number(stats.receivable ?? 0).toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2 }
                        )}
                      </b>
                    </div>
                    <Progress
                      percent={stats.arPercent ?? 0}
                      strokeColor='#3b82f6'
                      showInfo={false}
                      size='small'
                    />
                  </div>
                  <div>
                    <div className='flex justify-between mb-1'>
                      <span>ត្រូវសងទៅអ្នកផ្គត់ផ្គង់ (Accounts Payable)</span>{' '}
                      <b>
                        $
                        {Number(stats.payable ?? 0).toLocaleString(undefined, {
                          minimumFractionDigits: 2
                        })}
                      </b>
                    </div>
                    <Progress
                      percent={stats.apPercent ?? 0}
                      strokeColor='#ef4444'
                      showInfo={false}
                      size='small'
                    />
                  </div>
                </div>
              </Card>
            </div>
          </Col>
        </Row>

        {/* Operational Records (Tables & Audit Timeline) */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <Card
              title='ប្រតិបត្តិការថ្មីៗ (Recent Transactions)'
              extra={<Link href='/transactions'>មើលទាំងអស់</Link>}
              className='rounded-xl border-none shadow-sm overflow-hidden'
              bordered={false}
            >
              <Table
                columns={columns}
                dataSource={recentTransactions}
                pagination={false}
                rowKey={record => record.key}
              />
            </Card>
          </Col>
          <Col xs={24} lg={8}>
            <Card
              title='ប្រវត្តិកត់ត្រាសកម្មភាពសវនកម្ម (Audit Logs)'
              extra={<MoreOutlined />}
              className='rounded-xl border-none shadow-sm h-full'
              bordered={false}
            >
              <div className='space-y-6'>
                {recentActivities.map((act, i) => {
                  const iconStyle = getActivityIcon(act.type)
                  return (
                    <div className='flex gap-4' key={i}>
                      <div
                        className={`p-2 h-10 w-10 flex items-center justify-center rounded-lg ${iconStyle.bg}`}
                      >
                        {iconStyle.icon}
                      </div>
                      <div>
                        <div className='text-sm font-bold text-gray-700'>
                          {act.title}
                        </div>
                        <div className='text-xs text-gray-400 font-mono'>
                          {act.desc}
                        </div>
                        <div className='text-[10px] text-blue-500 mt-1 bg-blue-50 px-1.5 py-0.5 rounded inline-block'>
                          {act.time}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </MainPage>
  )
}

export default HomePage
