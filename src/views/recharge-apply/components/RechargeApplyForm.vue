<script setup lang="ts">
import { ref, inject, onMounted,type Ref } from 'vue'
import type { FormInst } from 'naive-ui'
import { rechargeApplyApi } from '@/api/modules/rechargeApply'
import { useFormData } from '@/core/form/hooks/useFormData'
import { type RechargeApplyAuditForm, type RechargeApplyDetail } from '@/api/modules/rechargeApply'
import { submitAuditStatusOptions } from '@/enum/options'
import { ImageOutline as ImageOutlineIcon } from '@vicons/ionicons5'

// 注入响应式的数据
const formRef = ref<FormInst | null>(null)
const editData = inject<Ref<Partial<RechargeApplyAuditForm>>>('editData')!

// 充值详情数据
const rechargeApplyDetail = ref<RechargeApplyDetail | null>(null)
const getRechargeApplyDetail = async () => {
  const { code, data } = await rechargeApplyApi.getRechargeApplyDetail(editData.value.id as number)
  if (code === 200) {
    rechargeApplyDetail.value = data
  }
}

onMounted(() => {
  getRechargeApplyDetail()
})

const { formData, initialData } = useFormData<RechargeApplyAuditForm>({
  initialData: {
    id: null,
    status: 1,
    autditContent: '',
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
  formRef,
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
      >
        <NCard class="detail-card">
          <div class="form-grid">
            <!-- 左侧列：合同凭证 -->
            <div class="form-column">
              <div class="section-title">合同凭证</div>
              <NImageGroup>
                <NSpace>
                  <NImage
                    v-for="(img, index) in rechargeApplyDetail?.identityImgList"
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
              <NImage :src="rechargeApplyDetail?.enterpriseImg" width="100" height="100">
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
                <NDescriptionsItem label="充值对象">{{ rechargeApplyDetail?.realName }}</NDescriptionsItem>
                <NDescriptionsItem label="公司名称">{{ rechargeApplyDetail?.companyName }}</NDescriptionsItem>
                <NDescriptionsItem label="手机号">{{ rechargeApplyDetail?.mobile }}</NDescriptionsItem>
                <NDescriptionsItem label="充值类型">{{ rechargeApplyDetail?.type }}</NDescriptionsItem>
                <NDescriptionsItem label="充值本金">{{ rechargeApplyDetail?.rechargePrincipal }}</NDescriptionsItem>
                <NDescriptionsItem label="赠送金额">{{ rechargeApplyDetail?.rechargeGift }}</NDescriptionsItem>
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
            v-model:value="formData.autditContent"
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