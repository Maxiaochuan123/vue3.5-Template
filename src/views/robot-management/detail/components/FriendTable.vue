<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="好友信息" data-width="md">
            <NInput
              v-model:value="searchForm.keyword"
              placeholder="请输入昵称/备注/微信号"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <NSpace>
        <NButton type="primary" @click="handleSendMessage">发送消息</NButton>
        <NButton type="primary" @click="handleGetFriendCircle">获取好友圈</NButton>
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
import { h, ref, reactive } from 'vue'
import { NButton, NAvatar, NSpace, type DataTableColumns, useMessage } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'

interface TableDataRecord {
  id: number
  avatar: string
  nickname: string
  weixinId: string
  remark: string
  customer: string
  customerPhone?: string
  customerAvatar?: string
  syncCount: number
  syncStatus: string
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

// 选择变化处理
const handleSelectionChange = (keys: (string | number)[]) => {
  checkedRowKeys.value = keys
}

const handleCheckedRowsChange = (rows: TableDataRecord[]) => {
  checkedRows.value = rows
}

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
            nickname: '好友昵称',
            weixinId: 'weixinhao',
            remark: '小鹿车商-URA2X',
            customer: '张三丰',
            customerPhone: '13558552521',
            customerAvatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
            syncCount: 30,
            syncStatus: '手动同步朋友圈',
          },
          {
            id: 2,
            avatar: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
            nickname: '好友昵称2',
            weixinId: 'weixinhao2',
            remark: '',
            customer: '',
            syncCount: 30,
            syncStatus: '手动同步中',
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
    type: 'selection',
    width: 50,
    align: 'center',
    fixed: 'left',
  },
  {
    title: '好友',
    key: 'friend',
    width: 300,
    render: (row) => {
      return h('div', { style: 'display: flex; align-items: center; gap: 12px;' }, [
        h(NAvatar, {
          size: 'small',
          round: true,
          src: row.avatar,
        }),
        h('div', { style: 'display: flex; flex-direction: column;' }, [
          h('div', { style: 'font-weight: 500;' }, row.nickname),
          h('div', { style: 'color: #666; font-size: 12px;' }, row.weixinId),
          h('div', { style: 'color: #666; font-size: 12px;' }, row.remark),
        ]),
      ])
    },
  },
  {
    title: '绑定客户',
    key: 'customer',
    width: 300,
    render: (row) => {
      if (!row.customer) {
        return h(
          NButton,
          {
            text: true,
            type: 'primary',
            size: 'small',
          },
          { default: () => '绑定客户' },
        )
      }
      return h('div', { style: 'display: flex; align-items: center; gap: 12px;' }, [
        h(NAvatar, {
          size: 'small',
          round: true,
          src: row.customerAvatar,
        }),
        h('div', { style: 'display: flex; flex-direction: column;' }, [
          h('div', null, row.customer),
          h('div', { style: 'color: #666; font-size: 12px;' }, row.customerPhone),
        ]),
        h(
          NButton,
          {
            text: true,
            size: 'small',
          },
          { default: () => '取消绑定' },
        ),
      ])
    },
  },
  {
    title: '已同步朋友圈',
    key: 'syncCount',
    width: 120,
    align: 'center',
    render: (row) => {
      return h('span', { style: 'color: #2080f0;' }, row.syncCount || '30')
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 300,
    fixed: 'right',
    render: (row) => {
      return h(NSpace, null, [
        h(
          NButton,
          {
            text: true,
            type: 'primary',
            onClick: () => console.log('获取好友细节', row),
          },
          { default: () => '获取好友细节' },
        ),
        h(
          NButton,
          {
            text: true,
            type: 'primary',
            onClick: () => console.log('发送消息', row),
          },
          { default: () => '发送消息' },
        ),
        h('div', { style: 'color: #666;' }, row.syncStatus || '手动同步朋友圈'),
      ])
    },
  },
]

// 发送消息处理函数
const handleSendMessage = () => {
  if (checkedRows.value.length === 0) {
    message.warning('请选择要发送消息的好友')
    return
  }
  const selectedIds = checkedRows.value.map((row) => row.id)
  console.log('发送消息给选中的好友ID:', selectedIds)
}

// 获取好友圈处理函数
const handleGetFriendCircle = () => {
  if (checkedRows.value.length === 0) {
    message.warning('请选择要获取朋友圈的好友')
    return
  }
  const selectedIds = checkedRows.value.map((row) => row.id)
  console.log('获取选中好友的朋友圈ID:', selectedIds)
}
</script>

<style scoped lang="less">
:deep(.n-data-table) {
  height: 100%;
  .n-data-table-base-table {
    height: 100%;
  }
  .n-data-table-base-table-body {
    height: calc(100% - 41px); // 减去表头高度
  }
}
</style>
