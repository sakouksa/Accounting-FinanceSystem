import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Typography } from 'antd'

const { Text } = Typography

function CashFlowHeader ({ onAdd }) {
  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-1'>
      {/* Left Side - Title */}
      <div className='flex-1'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white m-0'>
        លំហូរសាច់ប្រាក់ (Cash Flows)
        </h2>
        <Text
          type='secondary'
          className='text-sm dark:text-gray-400 mt-1 block'
        >
          គ្រប់គ្រងលំហូរសាច់ប្រាក់ចូល-ចេញ និងតាមដានរាល់ប្រតិបត្តិការគណនេយ្យរបស់អ្នក
        </Text>
      </div>
      {/* Right Side - Add Button */}
      <div className='flex-shrink-0'>
        <Button
          type='primary'
          onClick={onAdd}
          icon={<PlusOutlined />}
          className=' bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all text-base'
        >
          បន្ថែមថ្មី
        </Button>
      </div>
    </div>
  )
}

export default CashFlowHeader
