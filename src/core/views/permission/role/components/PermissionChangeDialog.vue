<script setup lang="ts">
import { ref } from 'vue'
import type { PermissionChanges } from './RoleFormConfig'
import { WarningFilled } from '@vicons/carbon'

interface Props {
    changes: PermissionChanges
}

interface Emits {
    (e: 'confirm'): void
}

defineProps<Props>()

const emit = defineEmits<Emits>()

const visible = ref(false)

const handleClose = () => {
    visible.value = false
}

const handleConfirm = () => {
    emit('confirm')
    handleClose()
}

// 打开对话框
const open = () => {
    visible.value = true
}

// 关闭对话框
const close = () => {
    visible.value = false
}

// 暴露方法给父组件
defineExpose({
    open,
    close
})
</script>

<template>
    <NModal v-model:show="visible" preset="card" style="width: 600px">
        <template #header>
            <div class="header-content">
                <n-icon size="24">
                    <WarningFilled />
                </n-icon>
                <span>权限配置更新提醒</span>
            </div>
        </template>
        <div class="permission-changes">


            <!-- 权限删除信息 -->
            <template v-if="changes.removedPermissions.length > 0">
                <div class="change-section">
                    <div class="section-title">【权限删除变更】</div>
                    <div v-for="item in changes.removedPermissions" :key="item.menuName" class="change-item">
                        {{ item.menuName }}：{{ item.permissions.join('、') }}
                    </div>
                </div>
            </template>

            <!-- 菜单名称变更信息 -->
            <template v-if="changes.nameChanges.length > 0">
                <div class="change-section">
                    <div class="section-title">【菜单名称变更】</div>
                    <div v-for="item in changes.nameChanges" :key="item.key" class="change-item">
                        {{ item.oldName }} → {{ item.newName }}
                    </div>
                </div>
            </template>
        </div>

        <template #footer>
            <div class="dialog-footer">
                <NButton size="large" @click="handleClose">取消</NButton>
                <NButton type="warning" size="large" @click="handleConfirm">去更新</NButton>
            </div>
        </template>
    </NModal>
</template>

<style scoped lang="less">
.header-content {
    display: flex;
    align-items: center;
    gap: 8px;
    line-height: 2;

    :deep(.n-icon) {
        color: #f0a020;
    }
}

.change-section {
    margin-bottom: 16px;
}

.section-title {
    font-weight: 500;
    margin-bottom: 8px;
    color: var(--warning-color);
}

.change-item {
    padding: 4px 0 4px 16px;
    line-height: 1.6;
}

.dialog-footer {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding-top: 16px;
}
</style>