<template>
    <div class="container">
        <el-card v-if="showForm === 'login'" class="login-card">

            <h3 style="text-align: center; margin-bottom: 20px;">
                欢迎使用CS-Assistant CMS系统!
            </h3>

            <el-form :model="loginForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="loginSubmitHandler">登录</el-button>
                    <el-button @click="showForm = 'register'">注册</el-button>
                </el-form-item>
                <div style="text-align: right; margin-top: -10px;">
                    <el-link type="danger" @click="showForm = 'reset'" style="cursor: pointer;">
                        忘记密码？
                    </el-link>
                </div>
            </el-form>
        </el-card>
        <el-card v-if="showForm === 'register'" class="register-card">
            <el-form :model="registerForm" label-width="80px">
                <div style="display: flex; align-items: center; justify-content: center; padding: 1rem;">
                    <el-avatar :size="64" icon="el-icon-user" :src="registerForm.avatar" />
                </div>
                <el-form-item label="头像地址">
                    <el-input v-model="registerForm.avatar" placeholder="请输入头像URL" />
                </el-form-item>
                <el-form-item label="用户名" required>
                    <el-input v-model="registerForm.username" placeholder="请输入用户名" />
                </el-form-item>
                <el-form-item label="昵称">
                    <el-input v-model="registerForm.nickname" placeholder="请输入昵称" />
                </el-form-item>
                <el-form-item label="邮箱" required>
                    <el-input v-model="registerForm.email" type="email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="密码" required>
                    <el-input v-model="registerForm.password" type="password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="确认密码" required>
                    <el-input v-model="registerForm.confirmPassword" type="password" placeholder="请再次输入密码" />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="registerSubmitHandler">注册</el-button>
                    <el-button @click="showForm = 'login'">返回登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <!-- 重置密码表单 -->
        <el-card v-if="showForm === 'reset'" class="reset-card">
            <h2 style="text-align: center; margin-bottom: 20px;">重置密码</h2>
            <el-form :model="resetForm" label-width="100px">
                <el-form-item label="用户名" required>
                    <el-input v-model="resetForm.username" placeholder="请输入用户名" />
                </el-form-item>

                <el-form-item label="邮箱" required>
                    <el-input v-model="resetForm.email" placeholder="请输入邮箱" />
                </el-form-item>
                <el-form-item label="新密码" required>
                    <el-input v-model="resetForm.newPassword" type="password" placeholder="请输入新密码" show-password />
                </el-form-item>
                <el-form-item label="确认密码" required>
                    <el-input v-model="resetForm.confirmPassword" type="password" placeholder="请再次输入新密码"
                        show-password />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="resetPasswordHandler">重置密码</el-button>
                    <el-button @click="showForm = 'login'">返回登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useCurrentUserStore } from '@/stores/currentUserStore';
import { ElMessage, ElNotification } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { http } from '@/util';
import type { UserRegisterDTO } from '@/types/SysUserDTO';

const currentUserStore = useCurrentUserStore();
const router = useRouter();
const route = useRoute();

const { currentSysUser } = storeToRefs(currentUserStore);

const showForm = ref<'login' | 'register' | 'reset'>("login");

// --------------------登录--------------------

// 表单数据对象
const loginForm = reactive({
    username: '',
    password: ''
})

const loginSubmitHandler = async () => {
    // 如需表单验证，可通过 loginFormRef.value.validate() 调用
    await currentUserStore.login(loginForm.username, loginForm.password).then((res) => {
        if (res.code !== 200) {
            ElNotification.error({ title: '登录失败', message: res.message })
        } else {
            ElMessage.success({
                message: '登录成功'
            })
            router.push('/')
        }
    })
}

// --------------------注册--------------------
// 注册表单数据
const registerForm = reactive<UserRegisterDTO>({
    username: '',
    password: '',
    confirmPassword: '',
    nickname: '',
    email: '',
    avatar: ''
})

// 注册处理函数
const registerSubmitHandler = async () => {
    // 1. 基础校验
    if (!registerForm.username || !registerForm.password) {
        ElNotification.error({ title: '错误', message: '用户名和密码不能为空' })
        return
    }

    // 2. 密码一致性校验
    if (registerForm.password !== registerForm.confirmPassword) {
        ElNotification.error({ title: '错误', message: '两次密码输入不一致' })
        return
    }

    try {
        // 3. 调用注册接口
        const result = await currentUserStore.register(registerForm)

        if (result === 0) {
            ElNotification.success({ title: '提示', message: '注册成功，自动登录' })
            await currentUserStore.login(registerForm.username, registerForm.password).then(() => {
                router.push('/')
            })
        } else {
            ElNotification.error({ title: '注册失败', message: result as string })
        }
    } catch (error) {
        ElNotification.error({ title: '注册失败', message: '请稍后重试' })
    }
}

// --------------------重置密码--------------------
// 重置密码表单数据
const resetForm = reactive({
    username: '',
    email: '',
    newPassword: '',
    confirmPassword: ''
})

// 重置密码处理函数
const resetPasswordHandler = async () => {
    // 1. 基础校验
    if (!resetForm.username || !resetForm.username.trim()) {
        ElNotification.error({ title: '错误', message: '用户名不能为空' })
        return
    }

    if (!resetForm.email || !resetForm.email.trim()) {
        ElNotification.error({ title: '错误', message: '邮箱不能为空' })
        return
    }

    if (!resetForm.newPassword || !resetForm.newPassword.trim()) {
        ElNotification.error({ title: '错误', message: '新密码不能为空' })
        return
    }

    if (!resetForm.confirmPassword || !resetForm.confirmPassword.trim()) {
        ElNotification.error({ title: '错误', message: '请再次输入新密码' })
        return
    }

    // 2. 密码一致性校验
    if (resetForm.newPassword !== resetForm.confirmPassword) {
        ElNotification.error({ title: '错误', message: '两次输入的密码不一致' })
        return
    }

    try {
        // 3. 调用重置密码接口
        const result = await http.post('/api/v1/auth/reset', {
            username: resetForm.username,
            email: resetForm.email,
            password: resetForm.newPassword,
            confirmPassword: resetForm.confirmPassword
        }, { withToken: false })

        if (result.code === 200) {
            ElNotification.success({ title: '成功', message: '密码重置成功，请重新登录' })
            // 重置表单
            resetForm.username = ''
            resetForm.email = ''
            resetForm.newPassword = ''
            resetForm.confirmPassword = ''
            // 返回登录页面
            showForm.value = 'login'
        } else {
            ElNotification.error({ title: '重置失败', message: result.message || '密码重置失败' })
        }
    } catch (error) {
        ElNotification.error({ title: '重置失败', message: '请稍后重试' })
    }
}
onMounted(async () => {
    // 根据 type 参数显示不同的表单（由于路由守卫已确保 type 有效，这里不需要默认值判断）
    const type = route.params.type as string

    switch (type) {
        case 'register':
            showForm.value = 'register'
            break
        case 'reset':
            showForm.value = 'reset'
            break
        default:
            showForm.value = 'login'
            break
    }

    // 如果已经登录，直接跳转到对应页面
    if (currentUserStore.isLogined) {
        ElNotification.success(
            {
                title: '登录成功',
                message: `欢迎回来，${currentSysUser.value?.nickname || currentSysUser.value?.username}!`
            }
        )
        router.push('/')
        return
    }


    // 尝试自动登录（如果有有效的 token）
    await currentUserStore.fetchData().then(() => {
        if (currentUserStore.isLogined) {
            ElNotification.success(
                {
                    title: '登陆成功',
                    dangerouslyUseHTMLString: true,
                    message: `具有有效凭证，自动登录成功。<br>欢迎回来, ${currentSysUser.value?.nickname || currentSysUser.value?.username}!`
                }
            )
            router.push('/')
        }
    })
})

</script>

<style>
.container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.login-card,
.register-card,
.reset-card {
    width: 400px;
}
</style>