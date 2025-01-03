<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { NButton, type DataTableColumns, NIcon, NTooltip } from 'naive-ui'
import { InformationCircleOutline } from '@vicons/ionicons5'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import DrawerForm, { type FormType } from '@/core/form/DrawerForm.vue'
import TableActions from '@/core/table/table-actions/index.vue'
import { advertisingTypeOptions, advertPlacementStatusOptions, getOptionLabel } from '@/enum/options'
import { renderAdvertisingInfo } from '@/components/TableColumns/renderAdvertisingInfo'
import AdvertisingPlacementForm from './components/AdvertisingPlacementForm.vue'
import { advertisingPlacementApi, type BaseAdvertPlacementSearch, type AdvertisingPlacement, type AdvertisingPlacementFormState } from '@/api/modules/advertisingPlacement'
import { useRouter } from 'vue-router'

const router = useRouter()

type TableDataRecord = AdvertisingPlacement

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseAdvertPlacementSearch>({
  key: '',
  dateRange: null,
  status: null,
  type: null,
})

// 搜索参数转换
const transformSearchParams = (params: any) => {
  console.log('transformSearchParams:', params)
  const { dateRange, ...rest } = params;
  return {
    ...rest,
    startDate: dateRange?.[0] ? new Date(dateRange[0]).toISOString().split('T')[0] : null,
    endDate: dateRange?.[1] ? new Date(dateRange[1]).toISOString().split('T')[0] : null
  }
}

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const drawerRef = ref<InstanceType<typeof DrawerForm> | null>(null)
const formRef = ref<InstanceType<typeof AdvertisingPlacementForm> | null>(null)
const formType = ref<FormType>('add')
const editData = ref<Partial<AdvertisingPlacementFormState>>({})

// 搜索
const handleSearch = (values: BaseAdvertPlacementSearch) => {
  tableRef.value?.loadData(values)
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '投放广告',
    key: 'desc',
    width: 400,
    render: renderAdvertisingInfo,
  },
  {
    title: '广告类型',
    key: 'type',
    render: (row) => {
      return getOptionLabel(advertisingTypeOptions, row.type)
    },
  },
  {
    title: '投放金额',
    key: 'price',
    render: (row) => {
      return `￥${row.price}`
    }
  },
  {
    title: () => {
      return h(
        'div',
        {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }
        },
        [
          '展示次数',
          h(NTooltip, {}, {
            trigger: () => h(NIcon, {
              style: {
                cursor: 'help'
              },
              size: 20
            }, {
              default: () => h(InformationCircleOutline)
            }),
            default: () => '投放数据5分钟更新一次'
          })
        ]
      )
    },
    key: 'num',
  },
  {
    title: '状态',
    key: 'status',
    render: (row) => {
      return getOptionLabel(advertPlacementStatusOptions, row.type)
    },
  },
  {
    title: '结束时间',
    key: 'placeEndTime',
    render: (row) => {
      return row.placeEndTime ? row.placeEndTime : '--'
    }
  },
  {
    title: '操作',
    key: 'actions',
    width: 200,
    fixed: 'right',
    titleAlign: 'center',
    render: (row: TableDataRecord) => {
      return h(TableActions, {
        row,
        permissionId: 'advertising-placement',
        // 添加自定义按钮
        customButtons: [
          {
            label: '追投',
            action: 'followUpInvestment',
            onClick: handleAdvertisingForm
          },
          {
            label: '投放数据',
            type: 'warning',
            action: 'placementData',
            onClick: handlePlacementData
          }
        ],
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

// 投放数据
const handlePlacementData = (row: Record<string, any>) => {
  router.push({
    path: `/advertising-placement/${row.id}`,
    query: {
      type: row.type
    }
  })
}

// 编辑处理
const handleAdvertisingForm = (row: Record<string, any>) => {
  formType.value = 'edit'
  editData.value = row
  drawerRef.value?.open()
}
</script>

<template>
  <!-- 如果有子路由，显示子路由内容 -->
  <router-view v-if="$route.name === 'advertising-placement-detail'" />

  <TablePageLayout v-else>
    <template #search>
      <SearchForm :model="defaultSearchForm" :transform-params="transformSearchParams" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="关键词" data-width="md">
            <NInput
              v-model:value="searchForm.key"
              placeholder="请输入标题关键词"
              clearable
            />
          </NFormItem>

          <NFormItem label="投放日期范围" data-width="lg">
            <NDatePicker
              v-model:value="searchForm.dateRange"
              type="daterange"
              clearable
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 工具栏 -->
    <template #toolbar>
      <NButton
        type="primary"
        v-btnPermission="['advertising-placement', 'advertisingPlacement']"
        @click="handleAdd"
      >
        投放广告
      </NButton>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="advertisingPlacementApi.getAdvertisingPlacementList" />
    </template>

    <!-- 投放/追投广告 -->
    <DrawerForm
      ref="drawerRef"
      :form-ref="formRef"
      :formType="formType"
      add-title="投放广告"
      edit-title="追投广告"
      :add-api="advertisingPlacementApi.createAdvertisingPlacement"
      :edit-api="advertisingPlacementApi.updateAdvertisingPlacement"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
    >
      <AdvertisingPlacementForm ref="formRef" />
    </DrawerForm>

  </TablePageLayout>
</template>
