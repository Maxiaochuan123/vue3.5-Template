<script setup lang="ts">
import { ref, inject, computed, type Ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { InformationCircleOutline } from '@vicons/ionicons5'
import { useFormData } from '@/core/form/hooks/useFormData'
import { type AddContract } from '@/api/modules/customer'
import { useMediaUploaderValidator } from '@/core/form/hooks/useUploaderValidator'
import MediaUpload from '@/core/upload/media-upload/MediaUpload.vue'

// 注入响应式的数据
const formRef = ref<FormInst | null>(null)
const editData = inject<Ref<Partial<AddContract & { id?: number }>>>('editData')!

// 媒体文件最大数量
const contractUrlMaxCount = 8
const pricePrincipalMaxCount = 1

const { formData, initialData } = useFormData<AddContract>({
  initialData: {
    customerId: null,
    contractPrice: '',
    contractUrl: [],
    figtAmount: '',
    pricePrincipal: '',
    principal: '',
    type: '',
  },
  editData
})

// 合同照片验证器
const contractUrlValidator = useMediaUploaderValidator({
  formRef,
  key: 'contractUrl',
  required: true,
  message: '请上传合同照片',
  requiredCount: 1
})

// 汇款凭证验证器
const pricePrincipalValidator = useMediaUploaderValidator({
  formRef,
  key: 'pricePrincipal',
  required: true,
  message: '请上传汇款凭证',
  requiredCount: 1
})

// 表单验证规则
const rules = {
  contractUrl: contractUrlValidator.rule,
  pricePrincipal: pricePrincipalValidator.rule,
  contractPrice: {
    required: true,
    message: '请输入合同价',
    trigger: ['blur', 'input'],
    type: 'number'
  },
  type: {
    required: true,
    message: '请输入充值类型',
    trigger: ['blur', 'input']
  },
  figtAmount: {
    required: true,
    message: '请输入充值金额',
    trigger: ['blur', 'input'],
    type: 'number'
  },
  principal: {
    required: true,
    message: '请输入赠送金额',
    trigger: ['blur', 'input'],
    type: 'number'
  }
}

// 暴露给父组件的方法和数据
defineExpose({
  formRef,
  formData: computed(() => {
    const { id, ...other } = formData
    return {
      ...other,
      customerId: id
    }
  }),
  initialData,
  validate: () => formRef.value?.validate()
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
        <div class="form-grid">
          <!-- 左侧列：合同凭证 -->
          <div class="form-column">
            <div class="column-title">合同凭证</div>
            <NFormItem path="contractUrl">
              <MediaUpload
                v-model="formData.contractUrl"
                :max-count="contractUrlMaxCount"
                accept="img"
                max-size="2MB"
                direction="column"
                @upload-success="contractUrlValidator.revalidate"
              >
                <template #description>
                  <span>请上传合同照片</span>
                  <span>支持jpg、png等常见格式，每张不超过2MB</span>
                </template>
              </MediaUpload>
            </NFormItem>
          </div>

          <!-- 中间列：汇款凭证 -->
          <div class="form-column">
            <div class="column-title">汇款凭证</div>
            <NFormItem path="pricePrincipal">
              <MediaUpload
                v-model="formData.pricePrincipal"
                :max-count="pricePrincipalMaxCount"
                accept="img"
                max-size="2MB"
                direction="column"
                @upload-success="pricePrincipalValidator.revalidate"
              >
                <template #description>
                  <span>请上传汇款凭证</span>
                  <span>支持jpg、png等常见格式，每张不超过2MB</span>
                </template>
              </MediaUpload>
            </NFormItem>
          </div>

          <!-- 右侧列：账户充值参数 -->
          <div class="form-column">
            <div class="column-title" style="margin-left: 40px;">
              账户充值参数
              <NTooltip trigger="hover">
                <template #trigger>
                  <NIcon size="18">
                    <InformationCircleOutline />
                  </NIcon>
                </template>
                财务为广告主投放账户充值的唯一依据，请确保信息无误
              </NTooltip>
            </div>
            <NFormItem label="合同价" path="contractPrice" required>
              <NInputNumber
                v-model:value="formData.contractPrice"
                placeholder="请输入合同价"
                :min="0"
                :show-button="false"
                clearable
                style="width: 100%"
              >
                <template #suffix>元</template>
              </NInputNumber>
            </NFormItem>
            <NFormItem label="充值类型" path="type" required>
              <NInput
                v-model:value="formData.type"
                placeholder="请输入充值类型"
                clearable
                style="width: 100%"
              />
            </NFormItem>
            <NFormItem label="充值金额" path="figtAmount" required>
              <NInputNumber
                v-model:value="formData.figtAmount"
                placeholder="请输入充值金额"
                :min="0"
                :show-button="false"
                clearable
                style="width: 100%"
              >
                <template #suffix>元</template>
              </NInputNumber>
            </NFormItem>
            <NFormItem label="赠送金额" path="principal" required>
              <NInputNumber
                v-model:value="formData.principal"
                placeholder="请输入赠送金额"
                :min="0"
                :show-button="false"
                clearable
                style="width: 100%"
              >
                <template #suffix>元</template>
              </NInputNumber>
            </NFormItem>
          </div>
        </div>
      </NForm>
    </div>
  </div>
</template>

<style scoped lang="less">
.form-drawer-content {
  width: 100%;
  padding: 0 30px;
  box-sizing: border-box;
  .form-content {
    flex: 1;
    .form-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 24px;
      
      .form-column {
        .column-title {
          font-size: 16px;
          font-weight: 500;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
    }
  }
}
</style>