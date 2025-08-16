<template>
    <div class="container">
        <el-space class="container-inner" wrap direction="vertical" fill>
            <el-text class="item" v-for="n in 3" :key="n" type="danger" size="large">这些功能仅供开发者使用!<br /></el-text>
            <GlassCard class="item">
                <template #header>
                    操作
                </template>
                <template #default>
                    none
                </template>
            </GlassCard>
            <GlassCard class="item">
                <template #header>
                    SQL ExecuteRaw
                </template>
                <template #default>
                    <GlassButton round type="primary" @click="executeSQL">执行 SQL</GlassButton>

                    <el-space style="width: 100%;" fill>
                        <!-- sql输入框  -->
                        <el-input v-model="sqlInput" type="textarea" :rows="10" placeholder="输入 SQL 语句"></el-input>
                        <!-- 输出结果 -->
                        <el-input v-model="sqlOutput" type="textarea" :rows="10" placeholder="输出结果..."
                            readonly></el-input>
                    </el-space>


                </template>
            </GlassCard>
            <GlassCard class="item">
                <template #header> database - SettingsDB </template>
                <el-form ref="dbformRef" label-position="left" label-width="auto" :model="dbsettings">
                    <el-form-item label="index(PK)">
                        <el-input v-model.number="dbsettings.index" />
                    </el-form-item>
                    <el-form-item label="key">
                        <el-input v-model="dbsettings.key" />
                    </el-form-item>
                    <el-form-item label="Text">
                        <el-input v-model="dbsettings.text" />
                    </el-form-item>
                    <el-form-item label="Description">
                        <el-input v-model="dbsettings.description" />
                    </el-form-item>
                    <el-form-item label="Selected">
                        <el-input v-model="dbsettings.selected" />
                    </el-form-item>
                    <el-form-item label="Type">
                        <el-select v-model="dbsettings.type" placeholder="Select" size="large">
                            <el-option v-for="item in dbsettingsType" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>

                    <div v-if="dbsettings.type === 'Select'">
                        <el-form-item v-for="(e, i) in dbsettings.options" :key="i" :label="'option_' + (i + 1)">
                            <el-form style="width: 100%;">
                                <el-form-item label="text:">
                                    <el-input v-model="e.text" />
                                </el-form-item>
                                <el-form-item label="value:">
                                    <el-input v-model="e.value" />
                                </el-form-item>
                                <el-form-item>
                                    <GlassButton @click.prevent="delSettingsOption(e)" type="warning">删除选项</GlassButton>
                                </el-form-item>
                            </el-form>

                        </el-form-item>
                        <el-form-item>
                            <GlassButton @click="addSettingsOption" type="primary">添加选项</GlassButton>
                        </el-form-item>
                    </div>

                    <el-form-item label="groupName">
                        <el-input v-model="dbsettings.groupName" />
                    </el-form-item>
                    <el-form-item label="groupIndex">
                        <el-input v-model.number="dbsettings.groupIndex" />
                    </el-form-item>
                    <el-form-item label="操作">
                        <GlassButton plain round type="info" @click="generateSettingsdbSQL">生成 SQL</GlassButton>
                        <GlassButton plain round type="success" @click="querySettingsRowByKey">查询 by key</GlassButton>
                        <GlassButton plain round type="success" @click="querySettingsRowByText">查询 by text</GlassButton>
                        <GlassButton plain round type="primary" @click="insertSettingsRowtodb">插入</GlassButton>
                        <GlassButton plain round type="warning" @click="updateSettingsRow">更新</GlassButton>
                        <GlassButton plain round type="danger" @click="deleteSettingsRow">删除</GlassButton>
                    </el-form-item>
                </el-form>
                <el-input v-model="dbsettingsSQLout" :rows="15" type="textarea" placeholder="SQL Output..."></el-input>
            </GlassCard>
            <GlassCard class="item">
                <ComponentTest />
            </GlassCard>

        </el-space>
    </div>

</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElNotification, FormInstance } from 'element-plus';
import { Settings, SettingsRowOptions } from '@/core/models';
import SettingsRepository from '@/core/repositories/Settings.Repository';
import SettingsService from '@/core/services/Settings.services';
import { baseCRUD } from "@/core/database";
import LogServices from "@/core/services/Log.services";
import GlassCard from '@/components/Common/GlassCard.vue';
import ComponentTest from '@/components/views/DevTools/ComponentTest.vue';
import { desVal } from '@/core/utils';
import GlassButton from '@/components/Common/GlassButton.vue';
const dbformRef = ref<FormInstance>();

const dbsettingsType = ['Input', 'Boolean', 'Select', 'PathInput'];

const dbsettings = reactive<Settings & { options: SettingsRowOptions[] }>({
    index: 0,
    key: '',
    text: '',
    description: '',
    selected: '',
    type: '',
    options: [],
    groupIndex: 0,
    groupName: ''
});

const dbsettingsSQLout = ref('');
// 错误处理函数
const handleDBError = (error: any, action: string) => {
    LogServices.error(`[DevTools] Database operation failed: ${action}`, {
        error,
        dbsettings: JSON.parse(JSON.stringify(dbsettings)), // 模拟 cloneDeep
        timestamp: new Date().toISOString()
    });
    ElNotification.error(`操作失败：${error}`);
};

// 表单验证
const validateForm = async () => {
    try {
        await dbformRef.value?.validate();
        return true;
    } catch (error) {
        ElNotification.warning('请填写完整信息');
        return false;
    }
};

// 清除表单数据
const resetForm = () => {
    Object.assign(dbsettings, {
        index: 0,
        key: '',
        text: '',
        description: '',
        selected: '',
        type: '',
        options: [],
        groupName: '',
        groupIndex: 0
    });
};

// 添加选项
const addSettingsOption = () => {
    dbsettings.options.push({ text: '', value: '' });
};

// 删除选项
const delSettingsOption = (item: SettingsRowOptions) => {
    const index = dbsettings.options.indexOf(item);
    if (index !== -1) {
        dbsettings.options.splice(index, 1);
    }
};

// 转义字符串以防止 SQL 注入
const escapeSQLString = (str: string | null) => {

    return str !== null ? str.replace(/'/g, "''") : '';
}

// 格式化 SQL 输出
const formatSQL = (sql: string) => {
    return sql
        .replace(/\s+/g, ' ')
        .replace(/,/g, ', ')
        .replace(/\s*VALUES\s*/i, '\nVALUES\n  ')
        .replace(/\s*INSERT INTO\s+/i, 'INSERT INTO ');
};

// 生成 SQL
const generateSettingsdbSQL = async () => {
    if (!(await validateForm())) return;

    let optionsValue = '[]';
    if (dbsettings.type === 'Boolean') {
        optionsValue = JSON.stringify([
            { text: '启用', value: true },
            { text: '禁用', value: false }
        ]);
    } else if (dbsettings.type === 'Select') {
        optionsValue = JSON.stringify(dbsettings.options);
    }

    const sql = `
INSERT INTO t_Settings (
    c_key, c_text, c_description, c_type, c_selected, c_options, c_groupName, c_groupIndex
) VALUES (
    '${escapeSQLString(dbsettings.key ?? '')}',
    '${escapeSQLString(dbsettings.text ?? '')}',
    '${escapeSQLString(dbsettings.description ?? '')}',
    '${dbsettings.type}',
    '${dbsettings.selected}',
    '${escapeSQLString(optionsValue)}',
    '${dbsettings.groupName}',
    ${dbsettings.groupIndex}
);`;

    dbsettingsSQLout.value = formatSQL(sql);
};

// 插入配置项
const insertSettingsRowtodb = async () => {
    if (!(await validateForm())) return;

    const payload = JSON.parse(JSON.stringify(dbsettings)); // 替代 cloneDeep
    try {
        const res = await SettingsService.addSettingsItem(payload);
        if (res > 0) {
            ElNotification.success(`插入成功`);
            resetForm();
        }
    } catch (e) {
        LogServices.error(e);
    }
};

// 更新配置项
const updateSettingsRow = async () => {
    if (!(await validateForm())) return;

    const payload = JSON.parse(JSON.stringify(dbsettings));
    try {
        const res = await SettingsRepository.updateOne(payload);
        if (res > 0) {
            ElNotification.success(`更新成功`);
            resetForm();
        } else {
            ElNotification.warning('未找到匹配的记录');
        }
    } catch (e) {
        handleDBError(e, '更新配置');
    }
};

// 查询配置项
const querySettingsRowByKey = async () => {
    if (!dbsettings.key?.trim()) {
        ElNotification.error('key 不能为空');
        return;
    }

    try {
        let res = await SettingsRepository.findOne({ c_key: dbsettings.key });

        if (res) {
            res = desVal(res);
            Object.assign(dbsettings, res);
            ElNotification.success(`查询成功`);
        } else {
            ElNotification.warning('未找到记录');
        }
    } catch (e) {
        handleDBError(e, '查询配置');
    }
};

const querySettingsRowByText = async () => {

    if (!dbsettings.text?.trim()) {
        ElNotification.error('text 不能为空');
        return;
    }

    try {
        let res = await SettingsRepository.findOne({ c_text: dbsettings.text });

        if (res) {
            res = desVal(res);
            Object.assign(dbsettings, res);
            ElNotification.success(`查询成功`);
        } else {
            ElNotification.warning('未找到记录');
        }
    } catch (e) {
        handleDBError(e, '查询配置');
    }
};


// 删除配置项
const deleteSettingsRow = async () => {
    if (!dbsettings.key?.trim()) {
        ElNotification.error('key 不能为空');
        return;
    }

    try {
        const res = await SettingsRepository.deleteOne({ c_key: dbsettings.key });
        if (res > 0) {
            ElNotification.success(`删除成功`);
            resetForm();
        } else {
            ElNotification.warning('未找到记录');
        }
    } catch (e) {
        handleDBError(e, '删除配置');
    }
};




const sqlInput = ref('');
const sqlOutput = ref('');
const executeSQL = async () => {

    try {
        const res = await baseCRUD.executeRaw(sqlInput.value);
        LogServices.debug(res)
        sqlOutput.value = JSON.stringify(res, null, 2);
    } catch (e) {
        handleDBError(e, '执行SQL');
    }


}
</script>

<style scoped lang="scss">
.container {
    width: 100%;
    // background-color: red;

    .container-inner {
        width: 100%;
    }
}
</style>
