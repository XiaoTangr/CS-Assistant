<template>
    <div class="post-edit-container">
        <el-card>
            <template #header>
                <div class="card-header">
                    <span>{{ edittingPostId === 0 ? '新建文章' : '编辑文章' }}</span>
                    <el-button type="primary" @click="handleSubmit" :loading="submitting">
                        {{ edittingPostId === 0 ? '创建' : '保存' }}
                    </el-button>
                </div>
            </template>

            <el-form class="form" :model="formData" label-width="100px" ref="formRef" :rules="rules">
                <!-- 标题 -->
                <el-form-item label="文章标题" prop="title">
                    <el-input 
                        v-model="formData.title" 
                        placeholder="请输入文章标题" 
                        maxlength="200"
                        show-word-limit
                    />
                </el-form-item>

                <!-- 内容 -->
                <el-form-item label="文章内容" prop="content">
                    <el-input
                        v-model="formData.content"
                        type="textarea"
                        :rows="15"
                        placeholder="请输入文章内容（支持 HTML/Markdown）"
                        resize="vertical"
                    />
                </el-form-item>

                <!-- 是否草稿 -->
                <el-form-item label="是否草稿">
                    <el-switch 
                        v-model="formData.isDraft" 
                        active-text="是" 
                        inactive-text="否" 
                    />
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import type { BizPostDTO } from '@/types/bizPost.types';
import { http } from '@/util';
import { ElMessage } from 'element-plus';
import type { FormInstance, FormRules } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const route = useRoute()
const router = useRouter()
const edittingPostId = ref<number>(0)
const edittingPost = ref<BizPostDTO>()
const formRef = ref<FormInstance>()
const submitting = ref(false)

// 表单数据
const formData = reactive({
    title: '',
    content: '',
    isDraft: false
})

// 表单验证规则
const rules: FormRules = {
    title: [
        { required: true, message: '请输入文章标题', trigger: 'blur' },
        { min: 1, max: 200, message: '标题长度在 1 到 200 个字符', trigger: 'blur' }
    ]
}

onMounted(async () => {
    // 获取路由参数id, 如果id不存在或者为0，则创建新文章
    const id = route.params.id ? Number(route.params.id) : 0
    
    if (id === 0) {
        // 新建文章模式：不需要从服务器获取数据，使用默认表单值
        edittingPostId.value = 0
    } else {
        // 编辑文章模式：需要从服务器获取文章数据
        edittingPostId.value = id
        await fetchbizPostData()
    }
})

const fetchbizPostData = async () => {
    try {
        const res = await http.get<BizPostDTO>(`/api/v1/post/me/${edittingPostId.value}`)
        edittingPost.value = res.data
        
        // 填充表单数据
        formData.title = res.data.title || ''
        formData.content = res.data.content || ''
        formData.isDraft = res.data.isDraft || false
    } catch (err: any) {
        ElMessage.error(err.message || '获取文章数据失败')
    }
}

/**
 * 提交表单
 */
const handleSubmit = async () => {
    if (!formRef.value) return

    // 验证表单
    await formRef.value.validate(async (valid) => {
        if (!valid) return

        submitting.value = true
        try {
            if (edittingPostId.value === 0) {
                // 新建文章
                await http.post('/api/v1/post/me', {
                    ...formData,
                    type: 1 // 默认类型，根据实际情况调整
                })
                ElMessage.success('文章创建成功')
            } else {
                // 更新文章
                await http.put(`/api/v1/post/me/${edittingPostId.value}`, {
                    id: edittingPostId.value,
                    ...formData
                })
                ElMessage.success('文章保存成功')
            }
            
            // 返回列表页
            router.push('/dashboard/bizpost/list')
        } catch (err: any) {
            ElMessage.error(err.message || '操作失败')
        } finally {
            submitting.value = false
        }
    })
}
</script>

<style scoped lang="scss">
.post-edit-container {
    padding: 1rem;
    width: 80vw;
    
    .card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
}
</style>