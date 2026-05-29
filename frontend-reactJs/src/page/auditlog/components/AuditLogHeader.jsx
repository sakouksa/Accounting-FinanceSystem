import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Typography } from 'antd';

const { Text } = Typography;

function AuditLogHeader({ onAdd }) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white m-0 flex flex-col md:flex-row md:items-center gap-2">
          កំណត់ហេតុការត្រា
        </h2>
        <Text type="secondary" className="text-sm dark:text-gray-400">
          តារាងនេះបង្ហាញពីកំណត់ហេតុការត្រាត្រូវទាំងអស់ដែលបានកើតឡើងនៅក្នុងប្រព័ន្ធ។
        </Text>
      </div>
    </div>
  );
}

export default AuditLogHeader;