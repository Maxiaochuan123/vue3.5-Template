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
        <NButton type="primary" @click="handleSendMessage"> 发送消息 </NButton>
        <NButton type="primary" @click="handleGetFriendCircle"> 获取好友圈 </NButton>
      </NSpace>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
    </template>
  </TablePageLayout>
</template>

<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { NButton, NAvatar, NSpace, type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'

type TableDataRecord = Record<string, any>

interface SearchParams {
  keyword: string | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
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

// 添加处理函数
const handleSendMessage = () => {
  console.log('发送消息')
}

const handleGetFriendCircle = () => {
  console.log('获取好友圈')
}
</script>
