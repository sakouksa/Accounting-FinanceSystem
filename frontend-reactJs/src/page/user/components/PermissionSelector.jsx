import React from 'react'
import { Card, Row, Col, Checkbox, Button } from 'antd'

function PermissionSelector ({
  customPermissions = [],
  customSelectedModules = {},
  onChange
}) {
  const isAllChecked = customPermissions.length > 0 && customPermissions.every(mod =>
    mod.actions.create && mod.actions.read && mod.actions.update && mod.actions.delete
  )

  const handleSelectAllGlobal = () => {
    const updated = customPermissions.map(mod => ({
      ...mod,
      actions: {
        create: !isAllChecked,
        read: !isAllChecked,
        update: !isAllChecked,
        delete: !isAllChecked
      }
    }))

    const updatedSelectedModules = {}
    updated.forEach(mod => {
      updatedSelectedModules[mod.key] = !isAllChecked
    })

    onChange(updated, updatedSelectedModules)
  }

  const handleToggleModule = (key, checked) => {
    const updated = customPermissions.map(mod =>
      mod.key === key
        ? {
            ...mod,
            actions: {
              create: checked,
              read: checked,
              update: checked,
              delete: checked
            }
          }
        : mod
    )

    const updatedSelectedModules = {
      ...customSelectedModules,
      [key]: checked
    }

    onChange(updated, updatedSelectedModules)
  }

  const handleToggleAction = (moduleKey, action, checked) => {
    const updated = customPermissions.map(mod => {
      if (mod.key === moduleKey) {
        return {
          ...mod,
          actions: {
            ...mod.actions,
            [action]: checked
          }
        }
      }
      return mod
    })

    const target = updated.find(m => m.key === moduleKey)
    const isAnyChecked = Object.values(target.actions).some(v => v)
    const updatedSelectedModules = {
      ...customSelectedModules,
      [moduleKey]: isAnyChecked
    }

    onChange(updated, updatedSelectedModules)
  }

  return (
    <div className="space-y-4 mt-4">
      <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
        <span className="text-xs font-semibold text-gray-700">កំណត់សិទ្ធិផ្ទាល់ខ្លួន (Custom Permissions)</span>
        <Button
          size="small"
          type={isAllChecked ? 'default' : 'primary'}
          onClick={handleSelectAllGlobal}
          className="text-xs rounded bg-indigo-600 border-0 text-white hover:bg-indigo-700"
        >
          {isAllChecked ? 'ដកការជ្រើសរើសទាំងអស់' : 'ជ្រើសរើសទាំងអស់'}
        </Button>
      </div>

      <Row gutter={[12, 12]}>
        {customPermissions.map(mod => {
          const moduleChecked = !!customSelectedModules[mod.key]
          const actions = [
            { key: 'create', label: 'Create' },
            { key: 'read', label: 'View' },
            { key: 'update', label: 'Update' },
            { key: 'delete', label: 'Delete' }
          ]

          return (
            <Col xs={24} sm={12} lg={6} key={mod.key}>
              <Card
                size="small"
                className="rounded-xl border border-gray-200 bg-white"
                title={
                  <div className="flex items-center justify-between">
                    <Checkbox
                      checked={moduleChecked}
                      onChange={e => handleToggleModule(mod.key, e.target.checked)}
                      className="font-bold text-gray-800 text-xs capitalize"
                    >
                      {mod.name}
                    </Checkbox>
                  </div>
                }
              >
                <div className="flex flex-col gap-2 p-1">
                  {actions.map(act => {
                    const actionChecked = !!mod.actions[act.key]
                    return (
                      <Checkbox
                        key={act.key}
                        checked={actionChecked}
                        onChange={e => handleToggleAction(mod.key, act.key, e.target.checked)}
                        className="text-xs text-gray-600"
                      >
                        {act.label}
                      </Checkbox>
                    )
                  })}
                </div>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

export default PermissionSelector
