<script setup lang="ts">
import { ArrowBack } from '@vicons/ionicons5';
import { NButton, NDrawer, NDrawerContent, NIcon } from 'naive-ui';
defineOptions({
  name: 'FormDrawer'
});

interface Props {
  /** 抽屉标题 */
  title?: string;
  /** 抽屉宽度 */
  width?: number | string;
  /** 确认按钮文字 */
  confirmText?: string;
  /** 取消按钮文字 */
  cancelText?: string;
  /** 返回按钮文字 */
  backText?: string;
  /** 是否显示底部按钮 */
  showFooter?: boolean;
  /** 加载状态 */
  loading?: boolean;
  /** 页面标题 */
  pageTitle?: string;
}

// 使用 withDefaults 定义默认值
withDefaults(defineProps<Props>(), {
  title: '',
  width: 500,
  confirmText: '确认',
  cancelText: '取消',
  backText: '返回',
  showFooter: true,
  loading: false,
  pageTitle: '未知页面'
});

// 使用 defineModel 处理双向绑定
const visible = defineModel('show', { type: Boolean, default: false });

const emit = defineEmits(['cancel', 'confirm']);

const handleClose = () => {
  visible.value = false;
  emit('cancel');
};

const handleConfirm = () => {
  emit('confirm');
};
</script>

<template>
  <NDrawer
    v-model:show="visible"
    placement="top"
    :trap-focus="false"
    :block-scroll="false"
    height="100%"
    to=".n-card__content"
    :width="width"
    @close="handleClose"
  >
    <NDrawerContent closable>
      <!-- 返回按钮和页面标题 -->
      <template #header>
        <div class="flex items-center">
          <div class="flex cursor-pointer items-center" @click="handleClose">
            <NIcon :component="ArrowBack" :size="20" />
            <span class="ml-1">{{ backText }}</span>
          </div>
          <div class="mx-4 h-4 w-[1px] bg-gray-300"></div>
          <span class="text-base">{{ pageTitle }}</span>
        </div>
      </template>

      <!-- 内容区域 -->
      <div class="drawer-content flex-1">
        <slot></slot>
      </div>

      <!-- 底部按钮 -->
      <template #footer>
        <div v-if="showFooter" class="w-full flex justify-center">
          <div class="flex gap-4">
            <NButton :disabled="loading" size="large" @click="handleClose">
              {{ cancelText }}
            </NButton>
            <NButton type="primary" :loading="loading" size="large" @click="handleConfirm">
              {{ confirmText }}
            </NButton>
          </div>
        </div>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
.drawer-content {
  min-height: 300px;
}
</style>
