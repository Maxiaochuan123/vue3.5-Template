<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput v-model:value="searchForm.keyword" placeholder="请输入群名称/群号" clearable />
          </NFormItem>

          <NFormItem label="群状态" data-width="sm">
            <NSelect
              v-model:value="searchForm.status"
              :options="groupStatusOptions"
              placeholder="请选择群状态"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
    </template>
  </TablePageLayout>
</template>

<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { NButton, NAvatar, type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import TableActions from '@/core/table/TableActions.vue'
import type { RowActionType } from '@/core/table/TableActions.vue'

interface TableDataRecord {
  id: number
  avatar: string
  name: string
  groupId: string
  memberCount: number
  status: 'active' | 'inactive'
  lastActiveTime: string
}

interface SearchParams {
  keyword: string | null
  status: string | null
}

// 群状态选项
const groupStatusOptions = [
  { label: '活跃', value: 'active' },
  { label: '不活跃', value: 'inactive' },
]

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
  status: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 定义获取数据的方法
const tableFetchApi = async (
  params: SearchParams,
): Promise<{ list: TableDataRecord[]; total: number }> => {
  console.log('搜索参数:', params)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
            name: '技术交流群',
            groupId: '12345678',
            memberCount: 500,
            status: 'active',
            lastActiveTime: '2024-03-15 10:30:00',
          },
          {
            id: 2,
            avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
            name: '产品交流群',
            groupId: '87654321',
            memberCount: 300,
            status: 'inactive',
            lastActiveTime: '2024-03-15 09:30:00',
          },
        ],
        total: 100,
      })
    }, 500)
  })
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '群头像',
    key: 'avatar',
    width: 80,
    render: (row) => {
      return h(NAvatar, {
        size: 'small',
        round: true,
        src: row.avatar,
      })
    },
  },
  {
    title: '群名称',
    key: 'name',
    width: 200,
  },
  {
    title: '群号',
    key: 'groupId',
    width: 150,
  },
  {
    title: '成员数',
    key: 'memberCount',
    width: 100,
  },
  {
    title: '状态',
    key: 'status',
    width: 120,
    render: (row) => {
      const statusMap = {
        active: { type: 'success', text: '活跃' },
        inactive: { type: 'warning', text: '不活跃' },
      }
      const status = statusMap[row.status]
      return h(
        NButton,
        {
          size: 'tiny',
          type: status.type as 'success' | 'warning',
          round: true,
        },
        { default: () => status.text },
      )
    },
  },
  {
    title: '最后活跃时间',
    key: 'lastActiveTime',
    width: 180,
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render: (row: TableDataRecord) => {
      const actions: RowActionType[] = [
        {
          label: '查看成员',
          onClick: () => console.log('查看成员', row),
        },
        {
          label: '退出群聊',
          type: 'error',
          onClick: () => console.log('退出群聊', row),
        },
      ]

      return h(TableActions, {
        row,
        actions,
      })
    },
  },
]
</script>
