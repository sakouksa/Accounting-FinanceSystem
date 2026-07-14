import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

function CurrencyHeader({ onAdd }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2">
          បញ្ជីរូបិយប័ណ្ណ
        </h2>
        <Text type="secondary" className="text-sm dark:text-gray-400">
          គ្រប់គ្រងព័ត៌មានរូបិយប័ណ្ណទាំងអស់នៅក្នុងប្រព័ន្ធ
        </Text>
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
        <Button
          type="primary"
          onClick={onAdd}
          icon={<PlusOutlined />}
          className="h-9 px-5 bg-indigo-600 hover:bg-indigo-700 border-0 rounded-lg font-medium shadow-sm flex items-center transition-all"
        >
          បង្កើតថ្មី
        </Button>
      </div>
    </div>
  );
}

export default CurrencyHeader;
