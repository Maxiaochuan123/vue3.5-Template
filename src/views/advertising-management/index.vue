<script setup lang="ts">
import { h, ref, onMounted } from 'vue'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NIcon, NSpace } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useSearch } from '@/hooks/useSearch'
import { useTableData } from '@/hooks/useTableData'
import TablePageLayout from '@/components/pageLayout/TablePageLayout.vue'
import type { RequestParams } from '@/hooks/useTableData'
import FormDrawer from '@/components/FormDrawer/index.vue'
import AdvertisingForm from './components/AdvertisingForm.vue'
import VideoPreview from '@/components/preview/Video.vue'

interface AdvertisingRecord {
  id: number
  title: string // 广告标题
  type: 'CPM' | 'CPC' | 'CPA' // 广告类型
  status: '审核通过' | '审核中' | '审核失败' // 审核状态
  creator: string // 创建人
  createTime: string // 创建时间
  failReason?: string // 失败原因
  publishTime: string // 发布时间
  videoUrl: string
  coverUrl?: string // 封面图片
}

interface SearchParams extends RequestParams {
  keyword: string // 添加关键词搜索
  dateRange: [number, number] | null
  type: string | null
  status: string | null
}

// 表单 ref
const searchFormRef = ref<FormInst | null>(null)

// 使用 useTableData
const { loading, data, pagination, loadData, handlePageChange, handlePageSizeChange } =
  useTableData<AdvertisingRecord, SearchParams>({
    async fetchData(_params: SearchParams) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            list: [
              {
                id: 1,
                title: '这里是视频广告的标题，标题长度限制20个字',
                type: 'CPM',
                status: '审核通过',
                creator: '张三',
                createTime: '2023-12-31 21:00:03',
                publishTime: '2023-12-31 21:00:03',
                videoUrl: 'https://example.com/video.mp4',
                coverUrl: 'https://example.com/cover.jpg',
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
                coverUrl: 'https://example.com/cover.jpg',
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
                coverUrl: 'https://example.com/cover.jpg',
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
                coverUrl: 'https://example.com/cover.jpg',
                failReason: '失败原因',
              },
            ],
            total: 100,
          })
        }, 1000)
      })
    },
  })

// 用 useSearch
const { searchForm, handleReset, handleSearch } = useSearch<SearchParams>({
  defaultValues: {
    keyword: '',
    dateRange: null,
    type: null,
    status: null,
  },
  onSearch: (values) => {
    loadData(values)
  },
  searchFormRef,
})

// 广告类型选项
const typeOptions = [
  { label: 'CPM: 展示广告', value: 'CPM' },
  { label: 'CPC: 可点击广告', value: 'CPC' },
  { label: 'CPA: 可下载广告', value: 'CPA' },
]

// 状态选项
const statusOptions = [
  { label: '审核通过', value: 'passed' },
  { label: '审核中', value: 'pending' },
  { label: '审核失败', value: 'failed' },
]

// 表格列定义
const columns: DataTableColumns<AdvertisingRecord> = [
  {
    title: '广告信息',
    key: 'info',
    render: (row: AdvertisingRecord) => {
      return h(
        NSpace,
        {
          align: 'center',
          justify: 'start',
          inline: true,
          size: 16,
        },
        {
          default: () => [
            h(VideoPreview, {
              videoUrl: row.videoUrl,
              coverUrl: row.coverUrl,
            }),
            h('div', { class: 'info-content' }, [
              h('div', { class: 'title-text' }, row.title),
              h('div', { class: 'publish-time' }, row.createTime),
            ]),
          ],
        },
      )
    },
  },
  {
    title: '广告类型',
    key: 'type',
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
  },
  {
    title: '状态',
    key: 'status',
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

// 添加抽屉控制变量
const showDrawer = ref(false)
const drawerLoading = ref(false)

onMounted(() => {
  showDrawer.value = true
})

// 修改 handleAdd 函数
const handleAdd = () => {
  // router.push({ name: 'advertising-add-editor' })
  showDrawer.value = true
}

// 添加抽屉确认处理函数
const formRef = ref(null)

const handleDrawerConfirm = async () => {
  drawerLoading.value = true
  try {
    await formRef.value?.formRef?.validate()
    // 处理表单提交逻辑
    console.log('表单数据:', formRef.value?.model)
    showDrawer.value = false
  } catch (err) {
    console.error('表单验证失败:', err)
  } finally {
    drawerLoading.value = false
  }
}

// 在 setup 中获取 router 实例
const router = useRouter()

// 表格分页配置
const tablePagination = {
  page: pagination.page,
  pageSize: pagination.pageSize,
  showSizePicker: pagination.showSizePicker,
  pageSizes: pagination.pageSizes,
  itemCount: pagination.itemCount,
  onChange: handlePageChange,
  onUpdatePageSize: handlePageSizeChange,
}
</script>

<template>
  <TablePageLayout>
    <template v-if="$route.name !== 'advertising-add-editor'">
      <!-- 搜索表单 -->
      <div class="search-form">
        <NForm
          ref="searchFormRef"
          :model="searchForm"
          inline
          :show-feedback="false"
          :label-width="80"
          size="medium"
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
              :options="typeOptions"
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

          <NFormItem>
            <NSpace>
              <NButton type="primary" @click="handleSearch">查询</NButton>
              <NButton @click="handleReset">重置</NButton>
            </NSpace>
          </NFormItem>
        </NForm>
      </div>

      <!-- 工具栏 -->
      <div class="table-header">
        <NButton type="primary" @click="handleAdd">
          <template #icon>
            <NIcon>
              <AddOutline />
            </NIcon>
          </template>
          新增广告
        </NButton>
      </div>

      <!-- 表格区域 -->
      <div class="table-container">
        <NDataTable
          :columns="columns"
          :data="data"
          :loading="loading"
          :pagination="tablePagination"
        />
      </div>

      <FormDrawer
        v-model="showDrawer"
        title="新增广告"
        page-title="广告管理"
        :loading="drawerLoading"
        @submit="handleDrawerConfirm"
        @cancel="(showDrawer = false)"
      >
        <AdvertisingForm ref="formRef" />
      </FormDrawer>
    </template>

    <router-view v-else />
  </TablePageLayout>
</template>

<style scoped lang="less">
.search-form {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  margin-bottom: 24px;
}

.table-container {
  flex: 1;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

:deep(.n-data-table) {
  flex: 1;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;

  .title-text {
    font-size: 14px;
    color: #333;
    line-height: 1.4;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    word-break: break-all;
  }

  .publish-time {
    font-size: 12px;
    color: #999;
    line-height: 1.2;
  }
}
</style>
