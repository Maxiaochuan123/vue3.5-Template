<script setup lang="ts">
import { h, ref, computed, onMounted } from 'vue'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NIcon, NSpace } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import TablePageLayout from '@/components/PageLayout/TablePageLayout.vue'
import type { RequestParams } from '@/hooks/useTableData'
import FormDrawer from '@/components/FormDrawer/index.vue'
import AdvertisingForm from './components/AdvertisingForm.vue'
import Phone from '@/components/MediaUploader/preview/components/ImgVideoPreviewPhone.vue'
import { advertisementTypeOptions, statusOptions } from '@/enum/options'
import { renderAdvertisingInfo } from '@/components/TableColumns/renderAdvertisingInfo'
import SearchForm from '@/components/SearchForm/index.vue'
import Table from '@/components/Table/index.vue'
import { useSearch } from '@/hooks/useSearch'

interface AdvertisingRecord {
  id: number
  title: string // 广告标题
  type: 'CPM' | 'CPC' | 'CPA' // 广告类型
  status: '审核通过' | '审核中' | '审核失败' // 审核状态
  creator: string // 创建���
  createTime: string // 创建时间
  failReason?: string // 失败原因
  publishTime: string // 发布时间
  videoUrl: string
  coverUrl?: string // 封面图片
}

interface SearchParams extends RequestParams {
  keyword: string;
  dateRange: [number, number] | null;
  type: 'CPM' | 'CPC' | 'CPA' | null;
  status: '审核通过' | '审核中' | '审核失败' | null;
}

// 定义获取数据的方法
const fetchData = async (params: SearchParams): Promise<{ list: AdvertisingRecord[]; total: number }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        list: [
          {
            id: 1,
            title:
              '这里是视频广告的标题，标题长度限制20个字这里是视频广告的标题，标题长度限制20个字这里是视频广告的标题，标题长度限制20个字',
            type: 'CPM',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-31 21:00:03',
            publishTime: '2023-12-31 21:00:03',
            videoUrl: 'https://file.moujiang.com/moujiang/1734412010818-WeChat_20241126193121.mp4',
          },
          {
            id: 2,
            title: '这里是视频广告的标题，标题长度限制20个字',
            type: 'CPC',
            status: '审核通过',
            creator: '张三',
            createTime: '2023-12-30 21:00:03',
            publishTime: '2023-12-30 21:00:03',
            videoUrl: 'https://example.com/video.mp4',
          },
          {
            id: 3,
            title: '这里是视频广告的标题，标题长度限制20个字',
            type: 'CPA',
            status: '审核中',
            creator: '张三',
            createTime: '2023-12-30 21:00:03',
            publishTime: '2023-12-30 21:00:03',
            videoUrl: 'https://example.com/video.mp4',
          },
          {
            id: 4,
            title: '这里是视频广告的标题，标题长度限制20个字',
            type: 'CPA',
            status: '审核失败',
            creator: '张三',
            createTime: '2023-12-30 21:00:03',
            publishTime: '2023-12-30 21:00:03',
            videoUrl: 'https://example.com/video.mp4',
            failReason: '失败原因',
          },
        ],
        total: 100,
      })
    }, 1000)
  })
}

// 表格列定义
const columns: DataTableColumns<AdvertisingRecord> = [
  {
    title: '广告信息',
    key: 'info',
    width: 400,
    render: renderAdvertisingInfo
  },
  {
    title: '广告类型',
    key: 'type',
    width: 150,
    render: (row) => {
      const typeMap = {
        CPM: '展示广告',
        CPC: '可点击广告',
        CPA: '可下载广告',
      }
      return h('div', { 
        style: 'white-space: nowrap; overflow: hidden; text-overflow: ellipsis;'
      }, `${row.type} ${typeMap[row.type]}`)
    },
  },
  {
    title: '广告类型',
    key: 'type',
    width: 150,
    ellipsis: {
      tooltip: true
    },
    render: (row) => {
      const typeMap = {
        CPM: '展示广告',
        CPC: '可点击广告',
        CPA: '可下载广告',
      }
      return `${row.type}\n${typeMap[row.type]}`
    },
  },
  {
    title: '创建人',
    key: 'creator',
    width: 120,
    ellipsis: {
      tooltip: true
    },
  },
  {
    title: '状态',
    key: 'status',
    width: 150,
    ellipsis: {
      tooltip: true
    },
    render: (row) => {
      if (row.status === '审核失败') {
        return h('div', { class: 'flex flex-col gap-1' }, [
          h('span', '审核失败'),
          h('span', { class: 'text-red-500 text-sm' }, row.failReason),
        ])
      }
      return row.status
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
                onClick: () => {
                  router.push(`/advertising-management/add-editor/${row.id}`)
                },
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
            ...(row.status === '审核失败'
              ? [
                  h(
                    NButton,
                    {
                      size: 'small',
                      onClick: () => {
                        console.log('失败原因', row)
                      },
                    },
                    { default: () => '失败原因' },
                  ),
                ]
              : []),
          ],
        },
      )
    },
  },
]

onMounted(() => {
  // drawerRef.value?.open()
})

const formRef = ref<FormInst | null>(null)
const drawerRef = ref<InstanceType<typeof FormDrawer> | null>(null)

// 打开抽屉
const handleAdd = () => {
  drawerRef.value?.open()
}

const mockSubmit = async (data: any) => {
  console.log('提交的数据:', data)
  return Promise.resolve()
}

// 在 setup 中获取 router 实例
const router = useRouter()

// 获取广告表单中的媒体链接
const mediaUrl = computed(() => formRef.value?.media)

// 添加 SearchTable 的 ref
const searchTableRef = ref()

// 表单数据
const { searchForm, handleReset } = useSearch<SearchParams>({
  defaultValues: {
    keyword: '',
    dateRange: null,
    type: null,
    status: null,
    page: 1,
    pageSize: 10
  },
  onSearch: (values) => {
    console.log('搜索参数:', values);
    tableRef.value?.loadData(values);
  }
});

// 定义一个统一的搜索处理函数
const handleSearch = (values: SearchParams) => {
  console.log('搜索参数:', values);
  tableRef.value?.loadData(values);
};

// 表格引用
const tableRef = ref()

// 修改抽屉刷新方法
const handleDrawerRefresh = () => {
  console.log('handleDrawerRefresh');
  tableRef.value?.refresh()
}

</script>

<template>
  <TablePageLayout>
    <!-- 搜索表单 -->
    <template #search>
      <SearchForm
        :model="searchForm"
        :on-search="handleSearch"
        :on-reset="handleReset"
      >
        <NFormItem label="关键词">
          <NInput
            v-model:value="searchForm.keyword"
            placeholder="请输入标题关键词"
            :style="{ width: '240px' }"
          />
        </NFormItem>

        <NFormItem label="创建时间">
          <NDatePicker
            v-model:value="searchForm.dateRange"
            type="daterange"
            clearable
            :style="{ width: '320px' }"
          />
        </NFormItem>

        <NFormItem label="广告类型">
          <NSelect
            v-model:value="searchForm.type"
            :options="advertisementTypeOptions"
            placeholder="请选择广告类型"
            clearable
            :style="{ width: '160px' }"
          />
        </NFormItem>

        <NFormItem label="审核状态">
          <NSelect
            v-model:value="searchForm.status"
            :options="statusOptions"
            placeholder="请选择审核状态"
            clearable
            :style="{ width: '200px' }"
          />
        </NFormItem>
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
      <Table
        ref="tableRef"
        :columns="columns"
        :fetch-data="fetchData"
      />
    </template>

    <FormDrawer
      ref="drawerRef"
      title="新增广告"
      :submit-api="mockSubmit"
      :form-ref="formRef"
      :refresh-list="handleDrawerRefresh"
    >
      <div class="form-drawer-content">
        <div class="form-content">
          <AdvertisingForm ref="formRef" />
        </div>
        <div class="preview-content">
          <Phone :url="mediaUrl" title="预览广告创意" />
        </div>
      </div>
    </FormDrawer>
  </TablePageLayout>
</template>

<style scoped lang="less">
.form-drawer-content {
  width: 100%;
  display: flex;
  gap: 24px;
  .form-content {
    flex: 1;
  }
  .preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
}
</style>
