<script setup lang="ts">
import { h, ref, onMounted, reactive } from 'vue'
import { NButton, NIcon, NSpace, type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import DrawerForm from '@/core/form/DrawerForm.vue'
import TableToolbarActions from '@/core/table/table-tool-actions/index.vue'
import TableActions from '@/core/table/table-actions/index.vue'
import { advertisementTypeOptions, auditStatusOptions, getOptionLabel } from '@/enum/options'
import { renderAdvertisingInfo } from '@/components/TableColumns/renderAdvertisingInfo'
import AdvertisingForm, { type FormState } from './components/AdvertisingForm.vue'

type TableDataRecord = Record<string, any>

interface SearchParams {
  keyword: string | null
  dateRange: [number, number] | null
  adType: 'CPM' | 'CPC' | 'CPA' | null
  status: '审核通过' | '审核中' | '审核失败' | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive({
  keyword: null,
  dateRange: null,
  adType: null,
  status: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const drawerRef = ref<InstanceType<typeof DrawerForm> | null>(null)
const formRef = ref<InstanceType<typeof AdvertisingForm> | null>(null)
const formType = ref<'add' | 'edit' | 'view'>('add')
const editData = ref<Partial<FormState>>({})
        
onMounted(() => {
// drawerRef.value?.open()
})

// 搜索
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 定义获取数据的方法
const tableFetchApi = async ( params: SearchParams ): Promise<{ list: TableDataRecord[]; total: number }> => {
  // 打印完整的搜索参数
  console.log('搜索参数:', params)

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            adType: 'CPM',
            media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            title: 'AAA',
            description: '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
            adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
            buttonText: '立即下载',
            landingUrl: 'https://www.baidu.com',
            androidUrl: 'https://www.baidu.com',
            iosUrl: 'https://www.baidu.com',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
          }
        ],
        total: 100,
      })
    }, 500)
  })
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '广告信息',
    key: 'info',
    width: 400,
    render: renderAdvertisingInfo,
  },
  {
    title: '广告类型',
    key: 'adType',
    width: 150,
    render: (row) => {
      return getOptionLabel(advertisementTypeOptions, row.adType)
    },
  },
  {
    title: '创建人',
    key: 'creator',
    width: 120,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 150,
    ellipsis: {
      tooltip: true,
    },
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    render: (row: TableDataRecord) => {
      return h(TableActions, {
        row,
        deleteConfig: {
          content: '确定要删除该广告吗？删除后不可恢复！',
        },
        onAction: (type, rowData) => {
          switch (type) {
            case 'edit':
            case 'view':
              handleAdvertisingForm(rowData, type)
              break
            case 'delete':
              console.log('删除', rowData)
              break
          }
        }
      })
    },
  },
]


// 打开抽屉
const handleAdd = () => {
  formType.value = 'add'
  editData.value = {}
  drawerRef.value?.open()
}

const refreshList = () => {
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}

// 编辑处理
const handleAdvertisingForm = (row: Record<string, any>, type: 'edit' | 'view') => {
  const formattedData = {
    ...row,
    media: Array.isArray(row.media) ? row.media : [],
    adIcon: Array.isArray(row.adIcon) ? row.adIcon : []
  }
  
  formType.value = type
  editData.value = formattedData
  drawerRef.value?.open()
}

// 表单提交
const submitApi = async (formData: FormState) => {
  console.log('提交的数据:', formData)
  return Promise.resolve()
}
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput
              v-model:value="searchForm.keyword"
              placeholder="请输入标题关键词"
              clearable
            />
          </NFormItem>

          <NFormItem label="创建时间" data-width="lg">
            <NDatePicker
              v-model:value="searchForm.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>

          <NFormItem label="广告类型" data-width="sm">
            <NSelect
              v-model:value="searchForm.adType"
              :options="advertisementTypeOptions"
              placeholder="请选择广告类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="审核状态" data-width="sm">
            <NSelect
              v-model:value="searchForm.status"
              :options="auditStatusOptions"
              placeholder="请选择审核状态"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <TableToolbarActions :on-add="handleAdd" />
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
    </template>

    <!-- 新增/编辑广告 -->
    <DrawerForm
      ref="drawerRef"
      :form-ref="formRef"
      :formType="formType"
      :submit-api="submitApi"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
    >
      <AdvertisingForm ref="formRef" />
    </DrawerForm>
  </TablePageLayout>
</template>
