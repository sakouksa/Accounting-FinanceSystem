import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { Typography } from 'antd'

const { Text } = Typography

function AccountsReceivableHeader ({ onAdd }) {
  return (
    <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 px-1'>
      <div className='flex-1'>
        <h2 className='text-2xl font-bold text-gray-900 dark:text-white m-0'>
          គណនីដែលត្រូវទទួលប្រាក់ (Accounts Receivable)
        </h2>
        <Text
          type='secondary'
          className='text-sm dark:text-gray-400 mt-1 block'
        >
          គណនីដែលត្រូវទទួលប្រាក់ (Accounts Receivable) គឺជាកំណត់ត្រាដែលបង្ហាញពីប្រាក់ដែលអតិថិជនត្រូវបង់ឱ្យក្រុមហ៊ុនសម្រាប់ទំនិញឬសេវាកម្មដែលបានផ្តល់។
        </Text>
      </div>
      <div className='flex-shrink-0'>
        <Button
          type='primary'
          onClick={onAdd}
          icon={<PlusOutlined />}
          className=' bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all text-base'
        >
          បង្តើតថ្មី
        </Button>
      </div>
    </div>
  )
}

export default AccountsReceivableHeader
