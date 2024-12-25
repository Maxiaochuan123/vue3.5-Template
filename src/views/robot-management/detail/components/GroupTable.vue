<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="群名" data-width="md">
            <NInput v-model:value="searchForm.keyword" placeholder="请输入" clearable />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <NSpace>
        <NButton type="primary" @click="handleSendMessage"> 发送消息 </NButton>
      </NSpace>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table
        ref="tableRef"
        :columns="columns"
        :fetch-api="tableFetchApi"
        :row-selection="true"
        @update:checked-row-keys="handleSelectionChange"
        @update:checked-rows="handleCheckedRowsChange"
      />
    </template>
  </TablePageLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { NButton, NSpace, type DataTableColumns, useMessage } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'

interface TableDataRecord {
  id: number
  name: string
  memberCount: number
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
const checkedRowKeys = ref<(string | number)[]>([])
const checkedRows = ref<TableDataRecord[]>([])

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 选择变化处理
const handleSelectionChange = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
}

const handleCheckedRowsChange = (rows: TableDataRecord[]) => {
  checkedRows.value = rows
}

// 发送消息处理函数
const handleSendMessage = () => {
  if (checkedRows.value.length === 0) {
    message.warning('请选择要发送消息的群')
    return
  }
  const selectedIds = checkedRows.value.map((row) => row.id)
  console.log('发送消息给选中的群ID:', selectedIds)
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
            name: '资源群1',
            memberCount: 20,
          },
          {
            id: 2,
            name: '资源群2',
            memberCount: 100,
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
    type: 'selection',
    width: 50,
    align: 'center',
    fixed: 'left',
  },
  {
    title: 'ID',
    key: 'id',
    width: 100,
    align: 'center',
  },
  {
    title: '群名',
    key: 'name',
    width: 300,
  },
  {
    title: '人数',
    key: 'memberCount',
    width: 100,
    align: 'center',
  },
]
</script>
