<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="任务名称" data-width="md">
            <NInput v-model:value="searchForm.keyword" placeholder="请输入" clearable />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <NSpace>
        <NButton type="primary" @click="handleAddTask">添加任务</NButton>
      </NSpace>
    </template>

    <!-- 表格 -->
    <template #table>
      <div class="table-container">
        <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" :scroll-x="1140" />
      </div>
    </template>
  </TablePageLayout>

  <!-- 添加任务弹窗 -->
  <NModal v-model:show="showAddModal" preset="dialog" title="添加任务">
    <NForm>
      <NFormItem label="选择任务">
        <NSelect v-model:value="selectedTask" :options="taskOptions" placeholder="请选择任务" />
      </NFormItem>
    </NForm>
    <template #action>
      <NSpace>
        <NButton @click="showAddModal = false">取消</NButton>
        <NButton type="primary" @click="handleConfirmAdd">确认</NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped>
.table-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>

<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import {
  NButton,
  NTag,
  NSpace,
  NModal,
  NForm,
  NFormItem,
  NSelect,
  type DataTableColumns,
  useMessage,
} from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'

interface TableDataRecord {
  id: number
  name: string
  status: '未开始' | '进行中' | '已完成'
  type: string
  createTime: string
  updateTime: string
  creator: string
}

interface SearchParams {
  keyword: string | null
}

const message = useMessage()

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const showAddModal = ref(false)
const selectedTask = ref<string | null>(null)

// 任务选项
const taskOptions = [
  { label: '获取好友列表', value: 'getFriendList' },
  { label: '获取好友圈信息', value: 'getFriendCircle' },
  { label: '心跳', value: 'heartbeat' },
  { label: '获取指定好友朋友圈', value: 'getSpecificFriendCircle' },
]

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 添加任务
const handleAddTask = () => {
  showAddModal.value = true
}

// 确认添加任务
const handleConfirmAdd = () => {
  if (!selectedTask.value) {
    message.warning('请选择任务类型')
    return
  }
  console.log('添加任务:', selectedTask.value)
  showAddModal.value = false
  selectedTask.value = null
}

// 删除任务
const handleDelete = (row: TableDataRecord) => {
  console.log('删除任务:', row.id)
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
            id: 4,
            name: '获取好友列表',
            status: '未开始',
            type: '获取好友列表',
            createTime: '2024-12-12 10:30:30',
            updateTime: '2024-12-12 10:30:30',
            creator: '张三\n17761234567',
          },
          {
            id: 5,
            name: '获取朋友圈信息',
            status: '进行中',
            type: '获取朋友圈信息',
            createTime: '2024-12-12 10:30:30',
            updateTime: '2024-12-12 10:30:30',
            creator: '张三\n17761234567',
          },
        ],
        total: 2,
      })
    }, 500)
  })
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '编号',
    key: 'id',
    width: 80,
    align: 'center',
  },
  {
    title: '任务名称',
    key: 'name',
    width: 200,
  },
  {
    title: '任务状态',
    key: 'status',
    width: 100,
    align: 'center',
  },
  {
    title: '任务类型',
    key: 'type',
    width: 150,
  },
  {
    title: '创建时间',
    key: 'createTime',
    width: 180,
  },
  {
    title: '更新时间',
    key: 'updateTime',
    width: 180,
  },
  {
    title: '创建人',
    key: 'creator',
    width: 150,
  },
  {
    title: '操作',
    key: 'actions',
    width: 100,
    fixed: 'right',
    render: (row) => {
      return h(
        NButton,
        {
          text: true,
          type: 'error',
          onClick: () => handleDelete(row),
        },
        { default: () => '删除' },
      )
    },
  },
]
</script>
