<script setup lang="ts">
import { h, ref, onMounted, reactive } from 'vue'
import { NButton, NIcon, NSpace, type DataTableColumns } from 'naive-ui'
import { advertisementTypeOptions, statusOptions } from '@/enum/options'
import { renderAdvertisingInfo } from '@/components/TableColumns/renderAdvertisingInfo'
import TablePageLayout from '@/components/PageLayout/TablePageLayout.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import Table from '@/components/Table/index.vue'
import FormDrawer from '@/components/FormDrawer/index.vue'
import AdvertisingForm, { type FormState } from './components/AdvertisingForm.vue'
import { getOptionLabel } from '@/enum/options'
import { AddOutline } from '@vicons/ionicons5'
import TableActions from '@/components/TableActions/index.vue'

type TableDataRecord = Record<string, any>

interface SearchParams {
  keyword: string | null
  dateRange: [number, number] | null
  adType: 'CPM' | 'CPC' | 'CPA' | null
  status: '审核通过' | '审核中' | '审核失败' | null
}

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: null,
  dateRange: null,
  adType: null,
  status: null,
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const drawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)
const formRef = ref<InstanceType<typeof AdvertisingForm> | null>(null)
const formType = ref<'add' | 'edit' | 'view'>('add')
const editData = ref<Partial<FormState>>({})

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
          content: '确定要删除该广告吗？删除后不可恢复',
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

onMounted(() => {
  // drawerRef.value?.open()
})

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
const onSubmit = async (formData: FormState) => {
  console.log('提交的数据:', formData)
  return Promise.resolve()
}
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ form }">
          <NFormItem label="关键词">
            <NInput
              v-model:value="form.keyword"
              placeholder="请输入标题关键词"
            />
          </NFormItem>

          <NFormItem label="创建时间" data-width="lg">
            <NDatePicker
              v-model:value="form.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>

          <NFormItem label="广告类型" data-width="sm">
            <NSelect
              v-model:value="form.type"
              :options="advertisementTypeOptions"
              placeholder="请选择广告类型"
              clearable
            />
          </NFormItem>

          <NFormItem label="审核状态" data-width="sm">
            <NSelect
              v-model:value="form.status"
              :options="statusOptions"
              placeholder="请选择审核状态"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <NButton type="primary" @click="handleAdd">
        <template #icon>
          <NIcon><AddOutline /></NIcon>
        </template>
        新增广告
      </NButton>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="tableFetchApi" />
    </template>

    <!-- 新增/编辑广告 -->
    <FormDrawer
      ref="drawerRef"
      :formType="formType"
      :form-ref="formRef"
      :submit-api="onSubmit"
      :refresh-list="refreshList"
      :extra-fields="['id']"
    >
      <AdvertisingForm
        ref="formRef"
        :data="editData"
      />
    </FormDrawer>
  </TablePageLayout>
</template>
