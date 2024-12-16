<script setup lang="ts">
import { h, ref, computed, onMounted } from 'vue'
import type { DataTableColumns, FormInst } from 'naive-ui'
import { NButton, NIcon, NSpace, NEllipsis } from 'naive-ui'
import { AddOutline } from '@vicons/ionicons5'
import { useRouter } from 'vue-router'
import { useSearch } from '@/hooks/useSearch'
import { useTableData } from '@/hooks/useTableData'
import TablePageLayout from '@/components/pageLayout/TablePageLayout.vue'
import type { RequestParams } from '@/hooks/useTableData'
import FormDrawer from '@/components/FormDrawer/index.vue'
import AdvertisingForm from './components/AdvertisingForm.vue'
import Phone from '@/components/MediaUploader/preview/Phone.vue'
import VideoPreview from '@/components/preview/Video.vue'
import { advertisementTypeOptions, statusOptions } from '@/enum/options'

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
                title: '这里是视频广告的标题，标题长度限制20个字这里是视频广告的标题，标题长度限制20个字这里是视频广告的标题，标题长度限制20个字',
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

// 表格列定义
const columns: DataTableColumns<AdvertisingRecord> = [
  {
    title: '广告信息',
    key: 'info',
    width: 400,
    render: (row: AdvertisingRecord) => {
      return h(
        'div',
        {
          style: 'display: flex; align-items: center; gap: 16px; width: 100%;'
        },
        [
          h(VideoPreview, {
            videoUrl: row.videoUrl,
            coverUrl: row.coverUrl,
            style: 'width: 120px; flex-shrink: 0;'
          }),
          h('div', { 
            style: 'flex: 1; max-width: calc(100% - 136px);'
          }, [
            h(NEllipsis, {  // 使用 NEllipsis 组件
              style: 'width: 100%;'
            }, {
              default: () => row.title
            }),
            h('div', { 
              style: 'font-size: 12px; color: #999; margin-top: 4px;'
            }, row.createTime)
          ])
        ]
      )
    }
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

const formRef = ref(null)
const drawerRef = ref(null)

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

// 获取广告表单中的媒体链接
const mediaUrl = computed(() => formRef.value?.media)
</script>

<template>
  <TablePageLayout>
    <!-- 搜索表单 -->
    <template #search>
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

        <NFormItem>
          <NSpace>
            <NButton type="primary" @click="handleSearch">查询</NButton>
            <NButton @click="handleReset">重置</NButton>
          </NSpace>
        </NFormItem>
      </NForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <NButton type="primary" @click="handleAdd">
        <template #icon>
          <NIcon>
            <AddOutline />
          </NIcon>
        </template>
        新增广告
      </NButton>
    </template>

    <!-- 表格区域 -->
    <template #table>
      <NDataTable
        :columns="columns"
        :data="data"
        :loading="loading"
        :pagination="tablePagination"
      />
    </template>

    <FormDrawer
      ref="drawerRef"
      title="新增广告"
      :submit-api="mockSubmit"
      :form-ref="formRef"
      :refresh-list="() => loadData(searchForm)"
    >
      <div class="form-drawer-content">
        <div class="form-content">
          <AdvertisingForm ref="formRef" />
        </div>
        <div class="preview-content">
          <Phone :media-url="mediaUrl" title="预览广告创意" />
        </div>
      </div>
    </FormDrawer>
  </TablePageLayout>
</template>

<style scoped lang="less">
// .info-content {
//   display: flex;
//   flex-direction: column;
//   gap: 8px;
//   min-width: 0;

//   .title-text {
//     font-size: 14px;
//     color: #333;
//     line-height: 1.4;
//     overflow: hidden;
//     text-overflow: ellipsis;
//     display: -webkit-box;
//     -webkit-line-clamp: 2;
//     -webkit-box-orient: vertical;
//     word-break: break-all;
//   }

//   .publish-time {
//     font-size: 12px;
//     color: #999;
//     line-height: 1.2;
//   }
// }
.info-content {
  display: flex;
  align-items: center; // 垂直居中对齐
  gap: 12px;
  min-width: 0;
  flex: 1;

  .title-text {
    flex: 1; // 让标题占据剩余空间
    font-size: 14px;
    color: #333;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .publish-time {
    flex-shrink: 0; // 防止时间被压缩
    font-size: 12px;
    color: #999;
    line-height: 1.2;
    white-space: nowrap; // 防止时间换行
  }
}

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
