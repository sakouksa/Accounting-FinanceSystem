import React from 'react'
import { Input, Select, Button, Space, DatePicker } from 'antd'
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

const { RangePicker } = DatePicker

function PaymentFilter ({
  filter,
  setFilter,
  transaction,
  accounts_payable,
  accounts_receivable,
  payment_method,
  onFilter,
  onReset
}) {
  const handleDateChange = dates => {
    setFilter(prev => ({
      ...prev,
      from_date: dates && dates[0] ? dates[0].format('YYYY-MM-DD') : null,
      to_date: dates && dates[1] ? dates[1].format('YYYY-MM-DD') : null
    }))
  }

  return (
    <div className='bg-white p-6 rounded-2xl shadow-sm border border-gray-100'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        {/* Search Input */}
        <Input
          allowClear
          prefix={<SearchOutlined className='text-gray-400' />}
          value={filter?.txt_search || ''}
          onChange={e =>
            setFilter(prev => ({ ...prev, txt_search: e.target.value }))
          }
          placeholder='ស្វែងរកលេខទូទាត់ ឬលេខយោង...'
          onPressEnter={onFilter}
          style={{ width: 250 }}
        />
        {/* Filter Options */}
        <Space wrap size={12}>
          {/* Range Picker */}
          <RangePicker
            onChange={handleDateChange}
            value={
              filter?.from_date && filter?.to_date
                ? [dayjs(filter.from_date), dayjs(filter.to_date)]
                : null
            }
          />

          {/* Filter for Payment Type */}
          <Select
            allowClear
            placeholder='ប្រភេទការទូទាត់'
            style={{ width: 160 }}
            value={filter?.payment_type}
            onChange={val =>
              setFilter(prev => ({
                ...prev,
                payment_type: val,
                payable_id: null,
                receivable_id: null
              }))
            }
            options={[
              { label: 'ចំណាយ (Payable)', value: 'payable' },
              { label: 'ចំណូល (Receivable)', value: 'receivable' }
            ]}
          />

          {/* Filter for Purchase Invoice (Payable) when payment type is Payable or not selected */}
          {(!filter?.payment_type || filter?.payment_type === 'payable') && (
            <Select
              allowClear
              showSearch
              optionFilterProp='label'
              placeholder='យោងវិក្កយបត្រទិញ (AP)'
              style={{ width: 190 }}
              value={filter?.payable_id}
              onChange={val =>
                setFilter(prev => ({ ...prev, payable_id: val }))
              }
              options={accounts_payable.map(ap => ({
                label: ap.bill_no,
                value: ap.id
              }))}
            />
          )}
          {/* Filter for Sales Invoice (Receivable) when payment type is Receivable or not selected */}
          {(!filter?.payment_type || filter?.payment_type === 'receivable') && (
            <Select
              allowClear
              showSearch
              optionFilterProp='label'
              placeholder='យោងវិក្កយបត្រលក់ (AR)'
              style={{ width: 190 }}
              value={filter?.receivable_id}
              onChange={val =>
                setFilter(prev => ({ ...prev, receivable_id: val }))
              }
              options={accounts_receivable.map(ar => ({
                label: ar.invoice_no,
                value: ar.id
              }))}
            />
          )}
          {/* Filter for Payment Method */}
          <Select
            allowClear
            showSearch
            optionFilterProp='label'
            placeholder='វិធីសាស្ត្រទូទាត់'
            style={{ width: 160 }}
            value={filter?.payment_method_id}
            onChange={val =>
              setFilter(prev => ({ ...prev, payment_method_id: val }))
            }
            options={payment_method.map(pm => ({
              label: pm.name,
              value: pm.id
            }))}
          />

          {/* Options for Status */}
          <Select
            allowClear
            placeholder='ស្ថានភាព'
            style={{ width: 140 }}
            value={filter?.status}
            onChange={val => setFilter(prev => ({ ...prev, status: val }))}
            options={[
              { label: 'កំពុងរង់ចាំ', value: 'pending' },
              { label: 'រួចរាល់', value: 'completed' },
              { label: 'បានបោះបង់', value: 'cancelled' }
            ]}
          />

          {/* Buttons */}
          <Button onClick={onReset} icon={<ReloadOutlined />}>
            កំណត់ឡើងវិញ
          </Button>

          <Button
            type='primary'
            onClick={onFilter}
            icon={<FilterOutlined />}
            className='bg-indigo-600 hover:bg-indigo-700 border-0'
          >
            តម្រងទិន្នន័យ
          </Button>
        </Space>
      </div>
    </div>
  )
}

export default PaymentFilter
