<template>
    <div v-bind="$attrs">
        <el-tooltip placement="top" :content="props.url">
            <div v-if="$slots.default" class="third-link-custom" @click="showDialog">
                <slot name="default"></slot>
            </div>
            <template v-else>
                <!-- 如果没有传入 slot 内容，则根据 type 属性决定显示按钮还是链接 -->
                <GlassButton v-if="props.type === 'button'" @click="showDialog" round type="primary" plain>
                    {{ props.title }}
                </GlassButton>
                <el-text v-else class="underline" @click="showDialog" round type="primary">
                    {{ props.title }}
                </el-text>
            </template>
        </el-tooltip>
        <GlassDialog show-close align-center v-model="dialogVisible" append-to-body width="400">
            <template #header>
                <h4>即将前往:{{ props.title }}</h4>
            </template>
            <template #default>
                <p>即将打开第三方链接： {{ props.url }}</p>
                <p> 请注意保护个人隐私及安全! </p>

            </template>
            <template #footer>
                <GlassButton round type="primary" @click="handleCancel">复制该链接</GlassButton>
                <GlassButton round @click="handleConfirm">访问该链接</GlassButton>
            </template>
        </GlassDialog>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import GlassButton from '../Common/GlassButton.vue'
import GlassDialog from '../Common/GlassDialog.vue'
import { ElNotification } from 'element-plus';

const props = withDefaults(
    defineProps<{
        url: string
        title?: string
        type?: 'button' | 'link'
    }>(),
    {
        title: '默认标题',
        type: 'link'
    }
)

// 启用属性继承
defineOptions({
    inheritAttrs: false
})

const dialogVisible = ref(false)
const showDialog = () => {
    dialogVisible.value = true
}

const handleConfirm = () => {
    window.open(props.url)
    dialogVisible.value = false
}

const handleCancel = () => {
    navigator.clipboard.writeText(props.url)
    ElNotification.success({
        title: '复制成功',
        message: '已复制该链接到剪贴板',
        duration: 2000
    })
    dialogVisible.value = false
}
</script>

<style scoped>
.underline:hover {
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1);
    text-decoration: underline
}

.third-link-custom {
    display: inline-block;
    color: var(--el-color-primary);
    cursor: pointer;
    transition: all cubic-bezier(0.075, 0.82, 0.165, 1);
}

.third-link-custom:hover {
    text-decoration: underline;
}
</style>
