<script setup lang="ts">
import { ref, inject, type Ref, computed } from 'vue'
import type { FormInst } from 'naive-ui'
import { useFormData } from '@/core/form/hooks/useFormData'
import { type CustomerDetail, type CustomerSaveForm } from '@/api/modules/customer'
import { getOptionLabel, genderOptions, auditStatusOptions } from '@/enum/options'
import { useMediaUploaderValidator } from '@/core/form/hooks/useUploaderValidator'
import MediaUpload from '@/core/upload/media-upload/MediaUpload.vue'

// 注入响应式的数据
const formRef = ref<FormInst | null>(null)
const editData = inject<Ref<Record<string, any>>>('editData')!

// 媒体文件最大数量
const idCardMaxCount = 2
const enterpriseMaxCount = 1

const { formData, initialData } = useFormData<CustomerSaveForm>({
  initialData: {
    realName: '',
    companyName: '',
    enterpriseImg: '',
    identityImgList: [],
  },
  editData
})

// 身份证验证器
const idCardValidator = useMediaUploaderValidator({
  formRef,
  key: 'identityImgList',
  required: true,
  message: '请上传身份证照片',
  requiredCount: idCardMaxCount
})

// 企业证照验证器
const enterpriseValidator = useMediaUploaderValidator({
  formRef,
  key: 'enterpriseImg',
  required: true,
  message: '请上传企业证照',
  requiredCount: enterpriseMaxCount
})

// 表单验证规则
const rules = {
  realName: { required: true, message: '请输入真实姓名', trigger: 'blur' },
  companyName: { required: true, message: '请输入公司名称', trigger: 'blur' },
  identityImgList: idCardValidator.rule,
  enterpriseImg: enterpriseValidator.rule,
}

// 计算属性：是否显示财务信息
const showFinanceInfo = computed(() => editData.value?.status !== 2)

// 计算属性：是否显示不通过理由
const showRejectReason = computed(() => editData.value?.status === 1)

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
      <!-- 客户信息卡片 -->
      <NCard class="detail-card">
        <div class="info-row">
          <div class="info-section">
            <div class="section-title">基本信息</div>
            <NDescriptions :column="1" :label-placement="'left'" :label-align="'right'">
              <NDescriptionsItem label="联系人">{{ editData?.userName }}</NDescriptionsItem>
              <NDescriptionsItem label="性别">{{ getOptionLabel(genderOptions, editData?.gender) }}</NDescriptionsItem>
              <NDescriptionsItem label="手机号">{{ editData?.mobile }}</NDescriptionsItem>
              <NDescriptionsItem label="归属地区">{{ editData?.address }}</NDescriptionsItem>
              <NDescriptionsItem label="申请注册时间">{{ editData?.createTime }}</NDescriptionsItem>
            </NDescriptions>
          </div>

          <div v-if="showFinanceInfo" class="info-section">
            <div class="section-title">充值信息</div>
            <NDescriptions :column="1" :label-placement="'left'" :label-align="'right'">
              <NDescriptionsItem label="累计充值">{{ editData?.allRecharge }}</NDescriptionsItem>
              <NDescriptionsItem label="充值本金">{{ editData?.rechargePrincipal }}</NDescriptionsItem>
              <NDescriptionsItem label="赠送金额">{{ editData?.rechargeGift }}</NDescriptionsItem>
              <NDescriptionsItem label="充值记录">
                <NButton text type="primary" size="small">点击查询 ></NButton>
              </NDescriptionsItem>
            </NDescriptions>
          </div>

          <div v-if="showFinanceInfo" class="info-section">
            <div class="section-title">余额变动</div>
            <NDescriptions :column="1" :label-placement="'left'" :label-align="'right'">
              <NDescriptionsItem label="当前本金">{{ editData?.principal }}</NDescriptionsItem>
              <NDescriptionsItem label="当前赠金">{{ editData?.gift }}</NDescriptionsItem>
              <NDescriptionsItem label="变动明细">
                <NButton text type="primary" size="small">点击查询 ></NButton>
              </NDescriptionsItem>
            </NDescriptions>
          </div>
        </div>
      </NCard>

      <!-- 审核信息卡片 -->
      <NCard class="detail-card">
        <div class="info-row">
          <div class="info-section">
            <div class="section-title">审核信息</div>
            <NDescriptions :column="3" :label-placement="'left'" :label-align="'right'">
              <NDescriptionsItem label="审核人">{{ editData?.auditUser }}</NDescriptionsItem>
              <NDescriptionsItem label="审核结果">{{ getOptionLabel(auditStatusOptions, editData?.status) }}</NDescriptionsItem>
              <NDescriptionsItem label="审核时间">{{ editData?.auditTime }}</NDescriptionsItem>
              <NDescriptionsItem v-if="showRejectReason" label="不通过理由">{{ editData?.auditContent }}</NDescriptionsItem>
            </NDescriptions>
          </div>
        </div>
      </NCard>

      <!-- 实名信息表单 -->
      <NForm
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-placement="left"
        label-width="120"
      >
        <NCard class="detail-card">
          <div class="info-row">
            <div class="info-section">
              <div class="section-title">实名信息</div>
              <NFormItem label="真实姓名" path="realName">
                <NInput v-model:value="formData.realName" placeholder="请输入真实姓名" />
              </NFormItem>
              <NFormItem label="身份证照片" path="identityImgList">
                <MediaUpload
                  v-model="formData.identityImgList"
                  :max-count="idCardMaxCount"
                  accept="img"
                  max-size="2MB"
                  direction="column"
                  @upload-success="idCardValidator.revalidate"
                >
                  <template #description>
                    <span>请上传身份证正反面照片</span>
                    <span>支持jpg、png等常见格式，每张不超过2MB</span>
                  </template>
                </MediaUpload>
              </NFormItem>
            </div>

            <div class="info-section">
              <div class="section-title">公司实名信息</div>
              <NFormItem label="公司名称" path="companyName">
                <NInput v-model:value="formData.companyName" placeholder="请输入公司名称" />
              </NFormItem>
              <NFormItem label="企业证照" path="enterpriseImg">
                <MediaUpload
                  v-model="formData.enterpriseImg"
                  :max-count="enterpriseMaxCount"
                  accept="img"
                  max-size="2MB"
                  direction="row"
                  @upload-success="enterpriseValidator.revalidate"
                >
                  <template #description>
                    <span>请上传营业执照等企业证照</span>
                    <span>支持jpg、png等常见格式，不超过2MB</span>
                  </template>
                </MediaUpload>
              </NFormItem>
            </div>
          </div>
        </NCard>
      </NForm>
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
    .detail-card {
      margin-bottom: 24px;
    }
    .info-row {
      display: flex;
      gap: 24px;
      .info-section {
        flex: 1;
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