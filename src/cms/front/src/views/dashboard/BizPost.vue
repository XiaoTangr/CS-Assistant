<template>
    <el-auto-resizer class="table">
        <template #default="{ height, width }">
            <!-- 唯一子元素：包装层 -->
            <div class="wapper">
                <div class="header">
                    <el-input class="input" @input="handleSearch" clearable v-model="reqParam.keyword"
                        placeholder="搜索标题或内容">
                        <template #append>
                            <el-button @click="handleSearch" :icon="Search" />
                        </template>
                    </el-input>
                </div>
                <el-table-v2 :width="width" fixed :height="height - 96" :columns="columns" :data="tableData" />
                <div class="footer">
                    <el-button class="post-create-btn" type="primary" @click="handleCreate">创建文章</el-button>
                    <el-pagination v-model:current-page="reqParam.page" v-model:page-size="reqParam.size"
                        :page-sizes="[10, 15, 20, 50, 100]" layout="total, sizes, prev, pager, next, jumper"
                        :total="total" @current-change="handlePageChange" @size-change="handleSizeChange" />
                </div>
            </div>
        </template>
    </el-auto-resizer>
    <el-dialog title="审核文章" width="60%" v-model="showStatusDialog" @close="edittingPost = null">
        <el-form label-width="auto" v-if="edittingPost" :model="edittingPost">
            <el-form-item label="文章标题">
                <el-input disabled v-model="edittingPost.title" />
            </el-form-item>
            <el-form-item label="文章内容">
                <el-scrollbar height="12rem">
                    <div v-html="edittingPost.content" />
                </el-scrollbar>
            </el-form-item>
            <el-form-item v-if="edittingPost.author.id !== currentSysUser?.id" label="作者信息">
                <el-link :href="'/profile/' + edittingPost.author.id"> {{ edittingPost.author.username }} </el-link>
            </el-form-item>
            <el-form-item v-if="userRole && userRole == UserRole.ADMIN" label="设置文章状态">
                <el-select v-model="edittingPost.status" placeholder="Select">
                    <el-option v-for="item in postStatus" :key="item.value" :label="item.label" :value="item.value">
                        <el-tag :type="item.tagType">{{ item.label }} </el-tag>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="currentSysUser?.id == edittingPost.author.id" label="是否草稿">
                <el-switch active-text="是" inactive-text="否" v-model="edittingPost.isDraft" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleStatusChange">保存</el-button>
                <el-button @click="showStatusDialog = false; edittingPost = null">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script setup lang="tsx">
// 你的原有逻辑不变，全部保留
import type { BizPostDetailDTO, bizPostQueryParams } from '@/types/bizPost.types';

import { ElMessage, ElNotification, TableV2FixedDir, ElPopconfirm } from 'element-plus';
import { onMounted, reactive, ref, computed } from 'vue';
import type { Column } from 'element-plus';
import { storeToRefs } from 'pinia';
import { useCurrentUserStore } from '@/stores/currentUserStore';
import { UserRole } from '@/enums/common';
import { PostStatusLabels } from '@/enums/descriptions';
import http from '@/util/http/request';
import { useRouter } from 'vue-router';
import { InfoFilled, Search } from '@element-plus/icons-vue';

const router = useRouter()

const currentUserStore = useCurrentUserStore()
const { currentSysUser, userRole } = storeToRefs(currentUserStore)
/**
 * POST   /api/v1/post/me           创建新文章
 * GET    /api/v1/post/me           分页查询本人所有文章
 * PUT    /api/v1/post/me/{id}      修改自己的文章
 * DELETE /api/v1/post/me/{id}      删除自己的文章
 * 
 * GET    /api/v1/admin/post              分页 + 搜索 + 状态筛选全站文章
 * PUT    /api/v1/admin/post/{id}/status  修改文章状态
 * PUT    /api/v1/admin/post/{id}         编辑任意文章
 * DELETE /api/v1/admin/post/{id}         强制删除任意文章
 */
const getBasePostApiUrl = (() => {
    let res = '/api/v1/post/me'
    if (userRole.value && userRole.value >= UserRole.ADMIN) {
        res = '/api/v1/admin/post';
    } return res
})

// ————————————————————————————————— 获取数据 ——————————————————————————————————
// 请求参数
const reqParam = reactive<bizPostQueryParams>({ page: 1, size: 20, keyword: '' })
// 获取数据总数
const total = ref(0)
// 表格数据
const tableData = ref<BizPostDetailDTO[]>([])

/**
 * 搜索事件
 */
const handleSearch = async () => {
    // 去除keyword为空的情况
    if (reqParam.keyword?.trim() === '') {
        reqParam.keyword = undefined
    }
    await fetchData()
}
/**
 * 获取数据
 */
const fetchData = async () => {
    try {
        const res = await http.get(getBasePostApiUrl(), reqParam)
        tableData.value = res.data.records || []
        total.value = res.data.total || 0
    } catch (err: any) {
        ElNotification.error({ title: '错误', message: err.message || '获取失败' })
    }
}


// 表格列配置
const columns: Column<any>[] = [
    { key: 'title', title: '文章标题', dataKey: 'title', width: 180 },
    {
        key: 'content',
        title: '文章内容',
        dataKey: 'content',
        width: 300,
        cellRenderer: ({ rowData }) => (
            // 显示一行，溢出省略
            <el-text truncated ellipsis={1}>{rowData.content} </el-text>
        )
    }, {
        key: 'isDraft',
        title: '草稿',
        dataKey: 'isDraft',
        width: 50,
        cellRenderer:
            ({ rowData }) => (
                <el-tag size="small" type={rowData.isDraft ? 'info' : 'success'}>{rowData.isDraft ? '是' : '否'}</el-tag>
            )
    },
    {
        key: 'status',
        title: '文章状态',
        dataKey: 'status',
        width: 50,
        align: 'center',
        cellRenderer: ({ rowData }) => {
            const config = PostStatusLabels[rowData.status as keyof typeof PostStatusLabels]

            // 如果状态未定义，显示默认的未知状态
            if (!config) {
                return <el-tag size="small" type="info">未知</el-tag>
            }

            // 使用 el-tag 组件显示状态
            return <el-tag size="small" type={config.type}>{config.text}</el-tag>
        }
    },
    {
        key: 'author',
        title: '文章作者',
        dataKey: 'author',
        width: 180,
        cellRenderer: ({ rowData }) => (
            <span>{rowData.author?.nickname || rowData.author?.username || '未知'}</span>
        )
    },
    {
        key: 'createTime',
        title: '创建时间',
        dataKey: 'createTime',
        width: 180,
        cellRenderer: ({ rowData }) => {
            const date = new Date(rowData.createTime)
            return <span>{date.toLocaleString('zh-CN')}</span>
        }
    },
    {
        key: 'updateTime',
        title: '更新时间',
        dataKey: 'updateTime',
        width: 180,
        cellRenderer: ({ rowData }) => {
            const date = new Date(rowData.updateTime)
            return <span>{date.toLocaleString('zh-CN')}</span>
        }
    }, {
        key: 'isPublic',
        title: '公众可见',
        width: 50,
        align: 'center',
        fixed: TableV2FixedDir.RIGHT,
        cellRenderer:
            ({ rowData }) => (
                <el-tag size="small"
                    type={rowData.isDraft === false && rowData.status === 0 ? 'success' : 'danger'}>
                    {rowData.isDraft === false && rowData.status === 0 ? '是' : '否'}
                </el-tag>
            )
    },
    {
        key: 'actions',
        title: '操作',
        width: 200,
        align: 'right',
        fixed: TableV2FixedDir.RIGHT,
        cellRenderer: ({ rowData }) => (
            // 设置div样式为flex，并设置 垂直居中，右边边对齐
            <div style="display: flex; align-items: center;margin-right: 1rem;">
                {/* 只有本人可以编辑 */}
                {rowData.author.id === currentSysUser.value?.id && (
                    <el-button size="small" type="success" onClick={() => handleEidt(rowData)}>编辑</el-button>
                )}
                <el-button size="small" onClick={() => handleShowStatusDialog(rowData)} type="primary">
                    {userRole.value && userRole.value >= UserRole.ADMIN ? '审核' : '修改'}
                </el-button>

                <ElPopconfirm
                    title="确定要删除这篇文章吗？"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    onConfirm={() => handleDelete(rowData)}
                >
                    {{
                        reference: () => <el-button size="small" type="danger">删除</el-button>
                    }}
                </ElPopconfirm>
            </div >
        )
    }
]
// ————————————————————————————————— 分页事件 ——————————————————————————————————
/**
 * 页码改变事件
 */
const handlePageChange = (page: number) => {
    reqParam.page = page
    fetchData()
}

/**
 * 每页条数改变事件
 */
const handleSizeChange = (size: number) => {
    reqParam.size = size
    reqParam.page = 1 // 重置到第一页
    fetchData()
}

// ————————————————————————————  更新文章状态 ——————————————————————————————

const showStatusDialog = ref(false)
const edittingPost = ref<BizPostDetailDTO | null>(null)

// 从 PostStatusLabels 生成下拉选项列表
const postStatus = Object.entries(PostStatusLabels).map(([value, { text, type }]) => ({
    value: Number(value),
    label: text,
    tagType: type
}))

// 显示审核弹窗
const handleShowStatusDialog = (rowData: BizPostDetailDTO) => {
    edittingPost.value = rowData
    showStatusDialog.value = true
}

// 提交审核结果按钮点击事件
const handleStatusChange = async (value: number) => {
    const id = edittingPost.value?.id
    const payload = userRole.value && userRole.value >= UserRole.ADMIN
        ? {
            status: edittingPost.value?.status,
            isDraft: edittingPost.value?.isDraft,
            topOrder: edittingPost.value?.topOrder
        }
        : {
            isDraft: edittingPost.value?.isDraft,
            topOrder: edittingPost.value?.topOrder
        }
    if (!id || !payload) {
        ElMessage.error('发生错误')
        return
    }
    const res = await updatePostStatus(id, payload);
    if (res) {
        ElMessage.success('修改成功')
        showStatusDialog.value = false
        fetchData()
    } else {
        ElMessage.error('修改失败')
    }
}
/**
 * 修改文章状态
 */
const updatePostStatus = async (id: number, payload: any) => {
    return await http.put(getBasePostApiUrl() + `/${id}/status`,
        payload).then(() => {
            return true
        }).catch((err) => {
            return err.message
        })
}

// ——————————————————————————————编辑相关——————————————————————————————
// 编辑文章按钮事件
const handleEidt = async (rowData: BizPostDetailDTO) => {
    // 跳转到编辑页面，传递文章ID
    router.push(`/posteidtor/${rowData.id}`)
}


// ——————————————————————————————创建相关——————————————————————————————
// 创建按钮事件
const handleCreate = async () => {
    router.push('/posteidtor/0')
}

// ————————————————————————————删除相关——————————————————————————————

// 确认删除按钮事件
const handleDelete = async (rowData: BizPostDetailDTO) => {
    if (!rowData.id) {
        ElNotification.warning({
            title: '提示',
            message: '请选择要删除的文章'
        })
        return
    }
    const result = await deletePost(rowData.id)
    if (result) {
        ElNotification.success({
            title: '提示',
            message: '删除成功'
        })
        fetchData()
    } else {
        ElNotification.error({
            title: '提示',
            message: '删除失败'
        })
    }

}

// 发送删除文章请求
const deletePost = async (id: number) => {
    try {
        await http.delete(getBasePostApiUrl() + `/${id}`)
        return true
    } catch (err: any) {
        return err.message
    }
}

// ———————————————————————————— 监听挂载 ——————————————————————————————

onMounted(() => {
    fetchData()
})
</script>

<style scoped lang="scss">
.wapper {
    display: flex;
    flex-direction: column;
    height: 100%;

    .header,
    .footer {
        padding: 0 .5rem;
        height: 48px;
        display: flex;
        align-items: center;
    }

    .header {
        width: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;

        .input {
            max-width: 512px;
        }
    }

    .footer {
        justify-content: space-between;

        .post-create-btn {
            margin-right: .5rem;
        }
    }
}
</style>