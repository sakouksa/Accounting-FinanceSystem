import React, { useEffect, useState } from 'react'
import { Drawer, Button, Card, Row, Col, Space, Typography, Tag, Checkbox } from 'antd'
import { RiSave3Fill } from 'react-icons/ri'
import { AppstoreOutlined, CheckCircleOutlined, SafetyCertificateOutlined } from '@ant-design/icons'

const { Text } = Typography

function PermissionDrawer({ open, onClose, permissionsList, onFinish, role, loading }) {
  const [selectedIds, setSelectedIds] = useState([])

  // Load initial permissions when role changes
  useEffect(() => {
    if (open && role?.id) {
      fetchRolePermissions()
    } else {
      setSelectedIds([])
    }
  }, [open, role])

  const fetchRolePermissions = async () => {
    // Note: We use the parent logic or fetch here. To keep code cleaner, we can fetch from parent or fetch directly.
    // Let's fetch directly or let the parent pass selectedIds. Let's fetch directly to keep it self-contained.
    try {
      const { request } = await import('../../../util/request')
      const res = await request(`role-permissions/${role.id}`, 'get')
      if (res && res.data) {
        setSelectedIds(res.data.map(p => p.id))
      }
    } catch (err) {
      console.error(err)
    }
  }

  // Flattened array of all permission IDs
  const allPermissionIds = Object.values(permissionsList).flat().map(p => p.id)
  const isAllSelected = allPermissionIds.length > 0 && selectedIds.length === allPermissionIds.length

  const handleSelectAllGlobal = () => {
    if (isAllSelected) {
      setSelectedIds([])
    } else {
      setSelectedIds(allPermissionIds)
    }
  }

  const handleToggle = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
  }

  const handleSelectAllModule = (moduleName, perms) => {
    const moduleIds = perms.map(p => p.id)
    const allModuleSelected = moduleIds.every(id => selectedIds.includes(id))

    if (allModuleSelected) {
      setSelectedIds(prev => prev.filter(id => !moduleIds.includes(id)))
    } else {
      setSelectedIds(prev => [...new Set([...prev, ...moduleIds])])
    }
  }

  const handleSave = () => {
    onFinish({ permissions: selectedIds })
  }

  return (
    <Drawer
      title={
        <div className="py-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-lg font-bold text-gray-800 tracking-tight flex items-center gap-2">
              <SafetyCertificateOutlined className="text-indigo-600" />
              កំណត់សិទ្ធិ (Assign Permissions)
            </span>
            <p className="text-xs font-normal text-gray-400 m-0 mt-1">
              កំណត់សិទ្ធិប្រើប្រាស់មុខងារសម្រាប់តួនាទី: <span className="font-semibold text-gray-700">{role?.name}</span>
            </p>
          </div>
          {allPermissionIds.length > 0 && (
            <Button
              onClick={handleSelectAllGlobal}
              type={isAllSelected ? 'default' : 'dashed'}
              className={`rounded-xl h-[36px] transition-all duration-300 font-medium ${isAllSelected ? 'bg-gray-50 border-gray-300 text-gray-600' : 'border-indigo-500 text-indigo-600 hover:text-indigo-700'
                }`}
            >
              {isAllSelected ? 'ដកការជ្រើសរើសទាំងអស់' : 'ជ្រើសរើសទាំងអស់ (All Modules)'}
            </Button>
          )}
        </div>
      }
      placement="right"
      width={window.innerWidth > 1024 ? 850 : '100%'}
      onClose={onClose}
      open={open}
      maskClosable={!loading}
      keyboard={!loading}
      styles={{
        header: {
          borderBottom: '1px solid #f3f4f6',
          padding: '20px 24px'
        },
        body: {
          padding: '24px',
          background: '#f8fafc'
        },
        footer: {
          borderTop: '1px solid #f3f4f6',
          padding: '16px 24px',
          background: '#fcfcfd'
        }
      }}
      footer={
        <div className="flex justify-between items-center">
          <Text type="secondary" className="text-sm font-medium">
            បានជ្រើសរើស៖ <span className="text-indigo-600 font-bold">{selectedIds.length}</span> សិទ្ធិ
          </Text>
          <Space size="middle">
            <Button
              size="large"
              disabled={loading}
              onClick={onClose}
              className="rounded-xl px-5 border-gray-200 text-gray-500 hover:text-gray-700 transition-all duration-300"
            >
              បោះបង់
            </Button>
            <Button
              type="primary"
              size="large"
              loading={loading}
              onClick={handleSave}
              className="px-6 bg-indigo-600 border-0 hover:bg-indigo-700 transition-all duration-300 flex items-center gap-1.5 shadow-sm font-semibold text-white"
            >
              <RiSave3Fill className="text-lg" />
              <span>រក្សាទុកសិទ្ធិ</span>
            </Button>
          </Space>
        </div>
      }
    >
      <div className="space-y-6">
        {Object.keys(permissionsList).map(moduleName => {
          const perms = permissionsList[moduleName]
          const moduleIds = perms.map(p => p.id)
          const allModuleSelected = moduleIds.every(id => selectedIds.includes(id))
          const someModuleSelected = moduleIds.some(id => selectedIds.includes(id)) && !allModuleSelected

          return (
            <Card
              key={moduleName}
              size="small"
              className="rounded-2xl border border-gray-100 shadow-sm overflow-hidden bg-white"
              title={
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-sm">
                      <AppstoreOutlined />
                    </div>
                    <span className="font-bold text-gray-800 text-sm capitalize">
                      {moduleName}
                    </span>
                    <Tag color="indigo" className="rounded-full ml-1 border-0 bg-indigo-50 text-indigo-600 font-semibold px-2">
                      {perms.filter(p => selectedIds.includes(p.id)).length} / {perms.length}
                    </Tag>
                  </div>
                  <Button
                    size="small"
                    type="link"
                    onClick={() => handleSelectAllModule(moduleName, perms)}
                    className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-all"
                  >
                    {allModuleSelected ? 'ដកការជ្រើសរើស' : 'ជ្រើសរើសទាំងអស់'}
                  </Button>
                </div>
              }
            >
              <Row gutter={[12, 12]} className="p-2">
                {perms.map(perm => {
                  const isChecked = selectedIds.includes(perm.id)
                  return (
                    <Col xs={24} sm={12} lg={8} key={perm.id}>
                      <div
                        onClick={() => handleToggle(perm.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer select-none transition-all duration-300 flex items-start gap-3 h-full hover:shadow-md ${isChecked
                          ? 'border-indigo-500 bg-indigo-50/30 shadow-sm'
                          : 'border-gray-100 hover:border-indigo-200 bg-white'
                          }`}
                      >
                        <div className="mt-0.5">
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggle(perm.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="pointer-events-none"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-800 text-xs truncate mb-1">
                            {perm.name}
                          </div>
                          <div className="text-[10px] text-gray-400 font-mono break-all leading-tight">
                            {perm.code}
                          </div>
                        </div>
                      </div>
                    </Col>
                  )
                })}
              </Row>
            </Card>
          )
        })}
      </div>
    </Drawer>
  )
}

export default PermissionDrawer
