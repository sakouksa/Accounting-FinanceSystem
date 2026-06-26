import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Typography } from 'antd'

const { Text } = Typography

function TransactionHeader ({ onAdd }) {
  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-1'>
      {/* Left Side - Title */}
      <div className='flex-1'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white m-0'>
          គណនីសៀវភៅ
        </h2>
        <Text
          type='secondary'
          className='text-sm dark:text-gray-400 mt-1 block'
        >
          គ្រប់គ្រងគណនីសៀវភៅ និងប្រភេទគណនីសម្រាប់ប្រតិបត្តិការណ៍ហិរញ្ញវត្ថុ
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
          បង្កើតគណនីថ្មី
        </Button>
      </div>
    </div>
  )
}

export default TransactionHeader
