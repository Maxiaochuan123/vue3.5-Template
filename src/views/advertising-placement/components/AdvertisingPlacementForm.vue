<script setup lang="ts">
import { ref, inject, type Ref, onMounted } from 'vue'
import { useThemeVars } from 'naive-ui'
import type { FormInst, SelectOption } from 'naive-ui'
import { advertisingTypeOptions, type AdvertisingType } from '@/enum/options'
import { useFormData } from '@/core/form/hooks/useFormData'
import MediaPreviewPhone from '@/core/upload/media-upload/preview/MediaPreviewPhone.vue'
import { advertisingApi, type AdvertisingOptions } from '@/api/modules/advertising'
import { advertisingPlacementApi, type BillingMethod } from '@/api/modules/advertisingPlacement'
import { userApi } from '@/api/modules/user'
import { type AdvertisingPlacementFormState } from '@/api/modules/advertisingPlacement'
import { type FormType } from '@/core/form/DialogForm.vue'

const themeVars = useThemeVars()

// 注入响应式的 formType
const editData = inject<Ref<Partial<AdvertisingPlacementFormState>>>('editData')!
const formType = inject<Ref<FormType>>('formType')!

const url = ref('')
const formRef = ref<FormInst | null>(null)
const advertisingOptions = ref<SelectOption[]>([])
const advertisingOptionsMap = ref<Map<number, AdvertisingOptions>>(new Map())
const billingMethod = ref<BillingMethod | null>(null)
const balance = ref<number | null>(null)
const agreementChecked = ref(false)

const { formData, initialData } = useFormData<AdvertisingPlacementFormState>({
  initialData: {
    adverInfoId: null,
    type: null,
    price: null,
  },
  editData
})

// 表单验证规则
const rules = {
  adverInfoId: {  type: 'number', required: true, message: '请选择广告', trigger: 'change' },
  type: { type: 'number', required: true, message: '请选择广告类型', trigger: 'change' },
  price: {
    type: 'number',
    required: true, 
    message: '金额最低1000倍数', 
    trigger: 'change',
    validator: (rule: any, value: number) => {
      if (!value) return new Error('金额最低1000倍数')
      if (value < 1000 || value % 1000 !== 0) return new Error('金额最低1000倍数')
      return true
    }
  }
}

// 预设金额选项
const priceOptions = [1000, 5000, 10000, 50000, 100000]

// 格式化金额
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('zh-CN', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  }).format(price)
}

// 自定义金额验证和格式化
const customPrice = ref<number | null>(null)
const handleCustomPriceInput = (value: number | null) => {
  if (value !== null) {
    if (value >= 1000 && value % 1000 === 0) {
      formData.price = value
    } else {
      formData.price = null
    }
  } else {
    formData.price = null
  }
}

// 选择预设金额
const selectPrice = (price: number) => {
  formData.price = formData.price === price ? null : price
  customPrice.value = null
}

// 监听广告选择变化
const handleAdvertisingChange = (value: number | null) => {
  if (value !== null) {
    // 确保使用数字类型进行比较
    const numericValue = Number(value)
    
    if (advertisingOptionsMap.value.has(numericValue)) {
      const selectedAd = advertisingOptionsMap.value.get(numericValue)!
      formData.type = selectedAd.type
      url.value = selectedAd.content
    } else {
      formData.type = null
      url.value = ''
    }
  } else {
    formData.type = null
    url.value = ''
  }
}

// 获取广告选项
const getAdvertisingOptions = async () => {
  try {
    const { code, data } = await advertisingApi.getAdvertisingOptions()
    if (code === 200) {
      // 存储完整的广告选项数据到 Map 中
      advertisingOptionsMap.value = new Map(
        data.map(item => [item.id, item])
      )
      // 转换为 Select 组件所需的选项格式
      advertisingOptions.value = data.map(item => ({
        label: item.title,
        value: item.id
      }))
      
      // 如果是编辑模式，在数据加载完成后设置初始值
      if (formType.value === 'edit' && editData.value.adverInfoId) {
        handleAdvertisingChange(editData.value.adverInfoId)
      }
    }
  } catch (error) {
    console.error('获取广告选项失败:', error)
  }
}

// 获取计费方式
const getBillingMethod = async () => {
  try { 
    const { code, data } = await advertisingPlacementApi.getBillingMethod()
    if (code === 200) {
      billingMethod.value = data
    }
  } catch (error) {
    console.error('获取计费方式失败:', error)
  }
}

// 获取用户余额
const getUserBalance = async () => {
  try {
    const { code, data } = await userApi.getUserBalance()
    if (code === 200) {
      balance.value = data.balance
    }
  } catch (error) {
    console.error('获取用户余额失败:', error)
  }
}

const validate = async () => {
  try {
    await formRef.value?.validate()
    if (!agreementChecked.value) {
      throw new Error('请先阅读并同意《媒体平台广告投放协议》')
  }
  } catch (error) {
    throw error
  }
}

onMounted(async () => {
  await getAdvertisingOptions()
  await getBillingMethod()
  await getUserBalance()
})

// 暴露给父组件的方法和数据
defineExpose({
  formData,
  initialData,
  validate
})
</script>

<template>
  <div class="form-drawer-content">
    <div class="form-content">
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
      >
        <NFormItem label="广告" path="adverInfoId">
          <NSelect 
            v-model:value="formData.adverInfoId" 
            :options="advertisingOptions"
            :disabled="formType === 'edit'"
            placeholder="请选择广告"
            @update:value="handleAdvertisingChange"
          />
        </NFormItem>
        <NFormItem label="广告类型" path="type">
          <NSelect 
            v-model:value="formData.type" 
            :options="advertisingTypeOptions"
            placeholder="请选择广告类型"
            disabled
          />
        </NFormItem>
        <NFormItem label="计费方式" v-if="formData.type">
            <div class="billing-info">
              <div v-if="formData.type === 1">{{ `展示计费：1000次展示=${billingMethod?.cpm || '--'}元` }}</div>
              <div v-if="formData.type === 2">
                <div>{{ `展示计费：1000次展示=${billingMethod?.cpm || '--'}元` }}</div>
                <div>{{ `点击计费：1次点击=${billingMethod?.cpc || '--'}元` }}</div>
              </div>
              <div v-if="formData.type === 3">
                <div>{{ `展示计费：1000次展示=${billingMethod?.cpm || '--'}元` }}</div>
                <div>{{ `下载计费：1次下载=${billingMethod?.cpa || '--'}元` }}</div>
              </div>
            </div>
           </NFormItem>
        <NFormItem label="投放金额" path="price">
          <div class="price">
            <span class="balance-info">选择投放金额（当前账户余额：¥{{ formatPrice(balance || 0) }}）</span>
            <div class="price-options">
              <div 
                v-for="price in priceOptions" 
                :key="price"
                class="price-option"
                :class="{ active: formData.price === price }"
                @click="selectPrice(price)"
              >
                ¥{{ formatPrice(price) }}
              </div>
              <div class="price-option custom">
                <NInputNumber
                  v-model:value="customPrice"
                  placeholder="其他金额"
                  :step="1000"
                  :min="1000"
                  button-placement="right"
                  @update:value="handleCustomPriceInput"
                >
                  <template #prefix>
                    ￥
                  </template>
                </NInputNumber>
              </div>
            </div>
        </div>
        </NFormItem>
      </NForm>
      <div class="agreement">
        <NCheckbox v-model:checked="agreementChecked">
          我已阅读《媒体平台广告投放协议》
        </NCheckbox>
      </div>
    </div>
    <div class="preview-content">
      <MediaPreviewPhone :url="url" title="预览广告创意" />
    </div>
  </div>
</template>

<style scoped lang="less">
.form-drawer-content {
  width: 100%;
  display: flex;
  gap: 24px;
  .form-content {
    flex: 1;

    :deep(.n-form-item.price) {
      .n-form-item-feedback-wrapper {
        padding-left: 178px;
      }
    }
  }
  .preview-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }
}

.billing-info {
  margin-top: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.price {
  display: flex;
  flex-direction: column;
  gap: 8px;
  .balance-info {
    margin-top: 4px;
  }
}

.price-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.price-option {
  padding: 8px 16px;
  border: 1px solid v-bind('themeVars.borderColor');
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  height: 38px;
  line-height: 38px;
  
  &:hover {
    border-color: v-bind('themeVars.primaryColor');
    color: v-bind('themeVars.primaryColor');
  }
  
  &.active {
    background-color: v-bind('themeVars.primaryColor');
    border-color: v-bind('themeVars.primaryColor');
    color: white;
  }
  
  &.custom {
    padding: 0;
    border: none;
    
    :deep(.n-input-number) {
      width: 100%;
      
      .n-input__input-el {
        height: 56px;
        text-align: left;
        padding-left: 24px;
      }

      .n-input-number-suffix {
        padding-right: 0;
      }
    }
  }
}

.agreement {
  display: flex;
  justify-content: center;
  margin-top: 24px;
}
</style>