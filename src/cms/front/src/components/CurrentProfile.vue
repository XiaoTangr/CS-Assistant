<template>
    <div class="container">
        <el-card class="profile-card">
            <template #header>
                欢迎用户: {{ currentSysUser?.username }}
            </template>
            <template #default>
                <!-- 展示个人信息 -->
                <el-row>
                    <el-col :span="24">
                        <center>
                            <el-avatar :size="100" :src="currentSysUser?.avatar"></el-avatar>
                        </center>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">用户名:</el-col>
                    <el-col :span="18">{{ currentSysUser?.username }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">昵称:</el-col>
                    <el-col :span="18">{{ currentSysUser?.nickname }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">邮箱:</el-col>
                    <el-col :span="18">{{ currentSysUser?.email }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">SteamID:</el-col>
                    <el-col :span="18">{{ currentSysUser?.steamId === 0 ? "未绑定" : currentSysUser?.steamId }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">注册时间:</el-col>
                    <el-col :span="18">{{ currentSysUser?.createTime }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">角色:</el-col>
                    <el-col :span="18">
                        {{
                            currentSysUser?.role === 0 ? "普通用户" :
                                currentSysUser?.role === 1 ? "创作者" : "系统管理员"
                        }}
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">状态:</el-col>
                    <el-col :span="18">{{ currentSysUser?.isDisable ? "禁用" : "正常" }}</el-col>
                </el-row>
            </template>
            <template #footer>
                <el-button type="primary" @click="EditProfileHandler">编辑资料</el-button>
                <el-button type="danger" @click="logoutHandler">退出登录</el-button>
            </template>
        </el-card>
        <el-dialog v-model="isEditShow" title="编辑资料" width="30%">

            <el-form :model="editForm">
                <center>
                    <el-avatar :size="100" :src="editForm?.avatar"></el-avatar>
                </center>
                <el-form-item label="昵称">
                    <el-input v-model="editForm.nickname"></el-input>
                </el-form-item>
                <el-form-item label="头像">
                    <el-input v-model="editForm.avatar"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="editForm.email"></el-input>
                </el-form-item>
                <el-form-item label="SteamID">
                    <el-input v-model="editForm.steamId"></el-input>
                </el-form-item>

            </el-form>
            <template #footer>
                <el-button type="primary" @click="saveProfileHandler">保存</el-button>
            </template>
        </el-dialog>

    </div>
</template>

<script setup lang="ts">
import { put } from '@/util';
import { useCurrentUserStore } from '@/stores/currentUserStore';
import { ElNotification } from 'element-plus';
import { storeToRefs } from 'pinia';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ApiResponse } from '@/types/apiResponse';
import type { SysUserDTO } from '@/types/SysUserDTO';


const currentUserStore = useCurrentUserStore();
const router = useRouter();
const { currentSysUser } = storeToRefs(currentUserStore);

const logoutHandler = async () => {
    currentUserStore.logout()
    ElNotification.info({
        title: '提示',
        message: '已退出登录',
        duration: 2000,
    });
    router.push('/')
}

const isEditShow = ref(false)

const editForm = reactive<{
    nickname: string,
    avatar: string,
    email: string,
    steamId: number,
}>({
    nickname: '',
    avatar: '',
    email: '',
    steamId: 0,
})

const EditProfileHandler = () => {
    //使用当前用户信息初始化表单
    editForm.nickname = currentSysUser.value?.nickname || ''
    editForm.avatar = currentSysUser.value?.avatar || ''
    editForm.email = currentSysUser.value?.email || ''
    editForm.steamId = currentSysUser.value?.steamId || 0
    isEditShow.value = true
    console.log(editForm)
}
const saveProfileHandler = () => {


    // 检查是否有修改
    if (editForm.nickname === currentSysUser.value?.nickname &&
        editForm.avatar === currentSysUser.value?.avatar &&
        editForm.email === currentSysUser.value?.email &&
        editForm.steamId === currentSysUser.value?.steamId) {
        isEditShow.value = false
        // 清除表单数据
        editForm.nickname = ''
        editForm.avatar = ''
        editForm.email = ''
        editForm.steamId = 0
        ElNotification.info({ title: '提示', message: '没有修改任何信息' })
        return
    }



    put('/api/v1/profile', {
        nickname: editForm.nickname,
        avatar: editForm.avatar,
        email: editForm.email,
        steamId: editForm.steamId,
    }).then(async (res: ApiResponse<SysUserDTO>) => {
        if (res.code === 200) {
            ElNotification.success({ title: '成功', message: '资料更新成功' })
            // 更新当前用户信息
            await currentUserStore.fetchData()
            isEditShow.value = false
            // 清除表单数据
            editForm.nickname = ''
            editForm.avatar = ''
            editForm.email = ''
            editForm.steamId = 0
        } else {
            ElNotification.error({ title: '失败', message: res.message })
        }
    }).catch((err) => {
        ElNotification.error({ title: '错误', message: err.message })

    })
}

</script>

<style scoped lang="scss">
.container {
    padding-top: 1rem;
    height: 100% !important;

    .profile-card {
        min-width: 24rem;
    }
}
</style>