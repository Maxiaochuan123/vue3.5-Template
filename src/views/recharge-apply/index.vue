<script setup lang="ts">
import { h, ref, reactive } from 'vue'
import { type DataTableColumns } from 'naive-ui'
import TablePageLayout from '@/core/table/TableLayout.vue'
import SearchForm from '@/core/table/SearchForm.vue'
import Table from '@/core/table/Table.vue'
import DrawerForm, { type FormType } from '@/core/form/DrawerForm.vue'
import TableActions, { type RowActionType } from '@/core/table/table-actions/index.vue'
import { getOptionLabel, rechargeApplyStatusOptions } from '@/enum/options'
import { rechargeApplyApi, type BaseRechargeApplySearch, type RechargeApply } from '@/api/modules/rechargeApply'
import RechargeForm from './components/RechargeForm.vue'

type TableDataRecord = RechargeApply

// 定义默认搜索表单值
const defaultSearchForm = reactive<BaseRechargeApplySearch>({
  key: '',
  mobile: '',
  status: null
})

const tableRef = ref<InstanceType<typeof Table> | null>(null)
const drawerRef = ref<InstanceType<typeof DrawerForm> | null>(null)
const formRef = ref<InstanceType<typeof RechargeForm> | null>(null)
const formType = ref<FormType>('edit')
const editData = ref<Record<string, any>>()


// 搜索
const handleSearch = (values: BaseRechargeApplySearch) => {
  tableRef.value?.loadData(values)
}

// 表格列定义
const columns: DataTableColumns<TableDataRecord> = [
  {
    title: '真实姓名',
    key: 'realName',
  },
  {
    title: '手机号',
    key: 'mobile',
  },
  {
    title: '充值类型',
    key: 'type',
  },
  {
    title: '充值本金',
    key: 'principal',
  },
  {
    title: '充值赠送',
    key: 'giftAmount',
  },
  {
    title: '状态',
    key: 'status',
    render: (row) => {
      return getOptionLabel(rechargeApplyStatusOptions, row.status)
    },
  },
  {
    title: '申请时间',
    key: 'createTime',
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
        permissionId: 'recharge-apply',
        actions: (row.status === 1 || row.status === 2) ? ['detail'] : [],
        onAction: handleTableAction,
        // 添加自定义按钮
        customButtons: [
          ...((row.status === 0) ? [{
            label: '充值',
            action: 'recharge',
            onClick: (row: TableDataRecord) => handleRecharge(row)
          }] : [])
        ],
      })
    },
  },
]

// 处理表格操作
const handleTableAction = async (type: RowActionType, row: TableDataRecord) => {
  if (!row.id) return
  switch (type) {
    case 'detail':
      handleDetail(row)
      break
  }
}

// 获取详情数据
const fetchDetail = async (id: number) => {
  try {
    const { code, data } = await rechargeApplyApi.getRechargeApplyDetail(id)
    if (code === 200) {
      return data
    }
    return null
  } catch (error) {
    console.error('获取详情失败:', error)
    return null
  }
}

// 充值
const handleRecharge = async (row: TableDataRecord) => {
  const detail = await fetchDetail(row.id as number)
  if (detail) {
    const { id, ...otherData } = detail
    editData.value = {
      ...otherData,
      id: row.id,
      status: otherData.status === 0 ? 1 : otherData.status
    }
    console.log(editData.value)

    formType.value = 'edit'
    drawerRef.value?.open()
  }
}

// 处理详情按钮点击
const handleDetail = async (row: TableDataRecord) => {
  const data = await fetchDetail(row.id as number)
  if (data) {
    editData.value = data
    formType.value = 'detail'
    drawerRef.value?.open()
  }
}

const refreshList = () => {
  if (tableRef.value) {
    tableRef.value.refresh()
  }
}
</script>

<template>
  <TablePageLayout>
    <template #search>
      <SearchForm :model="defaultSearchForm" :on-search="handleSearch">
        <template #default="{ searchForm }">
          <NFormItem label="联系人关键词" data-width="md">
            <NInput
              v-model:value="searchForm.key"
              placeholder="请输入联系人关键词"
              clearable
            />
          </NFormItem>

          <NFormItem label="手机号" data-width="md">
            <NInput
              v-model:value="searchForm.mobile"
              placeholder="请输入手机号"
              clearable
            />
          </NFormItem>

          <NFormItem label="状态" data-width="md">
            <NSelect
              v-model:value="searchForm.status"
              :options="rechargeApplyStatusOptions"
            />
          </NFormItem>
        </template>
      </SearchForm>
    </template>

    <!-- 表格 -->
    <template #table>
      <Table ref="tableRef" :columns="columns" :fetch-api="rechargeApplyApi.getRechargeApplyList" />
    </template>

    <!-- 充值 -->
    <DrawerForm
      ref="drawerRef"
      :form-ref="formRef"
      form-type="edit"
      edit-title="充值申请"
      :edit-api="rechargeApplyApi.recharge"
      :refresh-list="refreshList"
      :extra-fields="['id']"
      :edit-data="editData"
      :show-footer="formType === 'detail' ? false : true"
    >
      <RechargeForm ref="formRef" :_formType="formType" />
    </DrawerForm>

  </TablePageLayout>
</template>
