import { ReloadOutlined } from '@ant-design/icons'
import { Empty, Button, Space } from 'antd'

function CustomEmpty ({
  title = 'មិនមានទិន្នន័យ',
  description = 'ព្យាយាមប្តូរពាក្យស្វែងរក ឬតម្រងផ្សេងទៀត',
  onReload
}) {
  return (
    <div className='py-12 flex justify-center items-center'>
      <Empty
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        imageStyle={{ height: 60, opacity: 0.8 }}
        description={
          <Space direction='vertical' size={2} className='mt-2'>
            <h3 className='text-gray-700 text-base font-semibold m-0 leading-tight'>
              {title}
            </h3>
            <p className='text-gray-400 text-xs sm:text-sm max-w-[250px] mx-auto'>
              {description}
            </p>
          </Space>
        }
      >
        {onReload && (
          <Button
            type='default'
            onClick={onReload}
            icon={
              <ReloadOutlined className='text-xs group-hover:rotate-180 transition-transform duration-500 ease-out' />
            }
            className='group mt-5 h-9 rounded-full px-6 inline-flex items-center justify-center gap-2 border-gray-200 bg-white text-sm font-medium text-gray-600 shadow-sm hover:border-blue-500 hover:text-blue-600 hover:shadow-md active:scale-95 transition-all duration-300 mx-auto block'
          >
            បញ្ចូលឡើងវិញ
          </Button>
        )}
      </Empty>
    </div>
  )
}

export default CustomEmpty
