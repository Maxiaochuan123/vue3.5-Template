<script setup lang="ts">
import { h, ref, onMounted, reactive } from 'vue'
import { NButton, NIcon, NSpace, type DataTableColumns } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { advertisementTypeOptions, statusOptions } from '@/enum/options'
import { renderAdvertisingInfo } from '@/components/TableColumns/renderAdvertisingInfo'
import TablePageLayout from '@/components/PageLayout/TablePageLayout.vue'
import AdvertisingForm, { type FormState } from './components/AdvertisingForm.vue'
import SearchForm from '@/components/SearchForm/index.vue'
import Table from '@/components/Table/index.vue'

type AdvertisingRecord = Record<string, any>

interface SearchParams {
  keyword: string
  dateRange: [number, number] | null
  adType: 'CPM' | 'CPC' | 'CPA' | null
  status: '审核通过' | '审核中' | '审核失败' | null
}

// 定义获取数据的方法
const fetchData = async (
  params: SearchParams,
): Promise<{ list: AdvertisingRecord[]; total: number }> => {
  // 打印完整的搜索参数
  console.log('搜索参数:', params)

  return new Promise((resolve) => {
    resolve({
      list: [
        {
          id: 1,
          adType: 'CPM',
          media: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
          title:
            '这里是视频广告的标题，标题长度限制20个字这里是视频广告的标题，标题长度限制20个字这里是视频广告的标题，标题长度限制20个字',
          description:
            '这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字这里是视频广告的描述，描述长度限制200个字',
          adIcon: ['https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4'],
          buttonText: '立即下载',
          landingUrl: 'https://www.baidu.com',
          androidUrl: 'https://www.baidu.com',
          iosUrl: 'https://www.baidu.com',
          status: '审核通过',
          creator: '张三',
          createTime: '2023-12-31 21:00:03',
          publishTime: '2023-12-31 21:00:03',
        },
      ],
      total: 100,
    })
  })
}

// 表格列定义
const columns: DataTableColumns<Record<string, any>> = [
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
      const typeMap = {
        CPM: '展示广告',
        CPC: '可点击广告',
        CPA: '可下载广告',
      }
      return h(
        'div',
        {
          style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
        },
        `${row.adType} ${typeMap[row.adType]}`,
      )
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
    render: (row: AdvertisingRecord) => {
      return h(
        NSpace,
        { justify: 'center', align: 'center' },
        {
          default: () => [
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                type: 'primary',
                onClick: () => handleEdit(row),
              },
              { default: () => '编辑' },
            ),
            h(
              NButton,
              {
                size: 'small',
                quaternary: true,
                type: 'error',
                onClick: () => {
                  console.log('删除', row)
                },
              },
              { default: () => '删除' },
            ),
          ],
        },
      )
    },
  },
]

onMounted(() => {
  // drawerRef.value?.open()
})

const formRef = ref<InstanceType<typeof AdvertisingForm> | null>(null)

// 打开抽屉
const handleAdd = () => {
  formType.value = 'add'
  editData.value = {}
  formRef.value?.show()
}

// 在 setup 中获取 router 实例
const router = useRouter()

// 定义默认搜索表单值
const defaultSearchForm = reactive<SearchParams>({
  keyword: '',
  dateRange: null,
  adType: null,
  status: null,
})

// 定义一个统一的搜索处理函数
const handleSearch = (values: SearchParams) => {
  tableRef.value?.loadData(values)
}

// 表格引用
const tableRef = ref()

// 修改 handleEdit 函数
const handleEdit = (row: Record<string, any>) => {
  formType.value = 'edit'
  // 确保所有数据都有默认值
  editData.value = {
    adType: row.adType || 'CPM',
    title: row.title || '',
    media: Array.isArray(row.media) ? [...row.media] : [],
    adIcon: Array.isArray(row.adIcon) ? [...row.adIcon] : [],
    description: row.description || '',
    buttonText: row.buttonText || '',
    landingUrl: row.landingUrl || '',
    androidUrl: row.androidUrl || '',
    iosUrl: row.iosUrl || '',
    // 保留原始数据中的其他字段
    ...row,
  }
  formRef.value?.show()
}

// 在 script setup 顶部添加这些状态变量
const formType = ref<'add' | 'edit'>('add')
const editData = ref<Partial<FormState>>({})
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
              :style="{ width: '240px' }"
            />
          </NFormItem>

          <NFormItem label="创建时间">
            <NDatePicker
              v-model:value="form.dateRange"
              type="daterange"
              clearable
              :style="{ width: '320px' }"
            />
          </NFormItem>

          <NFormItem label="广告类型">
            <NSelect
              v-model:value="form.type"
              :options="advertisementTypeOptions"
              placeholder="请选择广告类型"
              clearable
              :style="{ width: '160px' }"
            />
          </NFormItem>

          <NFormItem label="审核状态">
            <NSelect
              v-model:value="form.status"
              :options="statusOptions"
              placeholder="请选择审核状态"
              clearable
              :style="{ width: '200px' }"
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
      <Table ref="tableRef" :columns="columns" :fetch-data="fetchData" />
    </template>

    <!-- 新增/编辑广告 -->
    <AdvertisingForm
      ref="formRef"
      :form-type="formType"
      :data="editData"
      :extra-fields="['id']"
      :on-success="tableRef?.refresh"
    />
  </TablePageLayout>
</template>
