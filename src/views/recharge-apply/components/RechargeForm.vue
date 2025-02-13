<script setup lang="ts">
import { ref, inject,type Ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { useFormData } from '@/core/form/composables/useFormData'
import { type RechargeApplyAuditForm } from '@/api/modules/rechargeApply'
import { submitAuditStatusOptions, changeTypeOptions, getOptionLabel } from '@/enum/options'
import { ImageOutline as ImageOutlineIcon } from '@vicons/ionicons5'

const props = defineProps<{
  _formType: string
}>() 

// 注入响应式的数据
const formRef = ref<FormInst | null>(null)
const editData = inject<Ref<Record<string, any>>>('editData')!

const { formData, initialData } = useFormData<RechargeApplyAuditForm>({
  initialData: {
    id: null,
    status: 1,
    auditContent: '',
  },
  editData
})

// 表单验证规则
const rules = {
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
  formData,
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
        :disabled="props._formType === 'detail'"
      >
        <NCard class="detail-card">
          <div class="form-grid">
            <!-- 左侧列：合同凭证 -->
            <div class="form-column">
              <div class="section-title">合同凭证</div>
              <NImageGroup>
                <NSpace>
                  <NImage
                    v-for="(img, index) in editData?.identityImgList"
                    :key="index"
                    :src="img"
                    width="100"
                    height="100"
                  >
                    <template #error>
                      <n-icon :size="100" color="lightGrey">
                        <ImageOutlineIcon />
                      </n-icon>
                    </template>
                  </NImage>
                </NSpace>
              </NImageGroup>
            </div>

            <!-- 中间列：汇款凭证 -->
            <div class="form-column">
              <div class="section-title">汇款凭证</div>
              <NImage :src="editData?.enterpriseImg" width="100" height="100">
                <template #error>
                  <n-icon :size="100" color="lightGrey">
                    <ImageOutlineIcon />
                  </n-icon>
                </template>
              </NImage>
            </div>

            <!-- 右侧列：充值信息 -->
            <div class="form-column">
              <div class="section-title">充值信息</div>
              <NDescriptions :column="1" :label-placement="'left'" :label-align="'right'">
                <NDescriptionsItem label="充值对象">{{ editData?.realName }}</NDescriptionsItem>
                <NDescriptionsItem label="公司名称">{{ editData?.companyName }}</NDescriptionsItem>
                <NDescriptionsItem label="手机号">{{ editData?.mobile }}</NDescriptionsItem>
                <NDescriptionsItem label="充值类型">{{ getOptionLabel(changeTypeOptions, editData?.types) }}</NDescriptionsItem>
                <NDescriptionsItem label="充值本金">{{ editData?.rechargePrincipal }}</NDescriptionsItem>
                <NDescriptionsItem label="赠送金额">{{ editData?.rechargeGift }}</NDescriptionsItem>
              </NDescriptions>
            </div>
          </div>
        </NCard>

        <NFormItem label="审核结果" path="status" required>
          <NRadioGroup v-model:value="formData.status">
            <NRadio
              v-for="option in submitAuditStatusOptions"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </NRadio>
          </NRadioGroup>
        </NFormItem>

        <NFormItem 
          label="审核意见" 
          path="auditContent" 
          :required="formData.status === 2"
        >
          <NInput
            v-model:value="formData.auditContent"
            type="textarea"
            placeholder="请输入审核意见"
            :rows="3"
          />
        </NFormItem>
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

    .detail-card {
      margin-bottom: 24px;
    }

    .form-grid {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr;
      gap: 24px;
      
      .form-column {
        .section-title {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 16px;
        }
      }
    }
  }
}
</style>