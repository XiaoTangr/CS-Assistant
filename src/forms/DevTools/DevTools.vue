<template>
    <div>
        <el-text v-for=" in 3" type="danger" size="large">这些功能仅供开发者使用!<br></el-text>
        <el-card>
            <template #header>
                database - SettingsDB
            </template>
            <template #default>
                <el-form :ref="dbformRef" label-position="left" label-width="auto" :model="dbsettings">
                    <el-form-item label="key">
                        <el-input v-model="dbsettings.key" />
                    </el-form-item>
                    <el-form-item label="text">
                        <el-input v-model="dbsettings.text" />
                    </el-form-item>
                    <el-form-item label="description">
                        <el-input v-model="dbsettings.description" />
                    </el-form-item>
                    <el-form-item label="Default selected">
                        <el-input v-model="dbsettings.selected" />
                    </el-form-item>
                    <el-form-item label="Type">
                        <el-select v-model="dbsettings.type" placeholder="Select" size="large">
                            <el-option v-for="item in dbsettingsType" :key="item" :label="item" :value="item" />
                        </el-select>
                    </el-form-item>

                    <div v-if="dbsettings.type === 'Select'">
                        <el-form-item v-for="(e, i) in dbsettings.options" :key="i" :label="'e' + i"
                            :prop="'e.' + i + '.value'">
                            <el-form-item label="text">
                                <el-input v-model="e.text" />
                            </el-form-item>
                            <el-form-item label="value">
                                <el-input v-model="e.value" />
                            </el-form-item>
                            <el-form-item>
                                <el-button @click.prevent="delSettingsOption(e)" type="warning">del this</el-button>
                            </el-form-item>
                        </el-form-item>
                        <el-form-item>
                            <el-button @click="addSettingsOption" type="primary">add option item</el-button>
                        </el-form-item>
                    </div>
                    <el-form-item label="chapter">
                        <el-input v-model="dbsettings.chapter" />
                    </el-form-item>
                    <el-form-item label="section">
                        <el-input v-model="dbsettings.section" />
                    </el-form-item>
                    <el-form-item label="操作">

                        <el-button type="info" @click="generateSettingsdbSQL">generate Sql</el-button>
                        <el-button type="success" @click="querySettingsRow">query</el-button>
                        <el-button type="primary" @click="insertSettingsRowtodb">insert</el-button>
                        <el-button type="warning" @click="updateSettingsRow">update</el-button>
                        <el-button type="danger" @click="deleteSettingsRow">delete</el-button>
                    </el-form-item>
                </el-form>
                <el-input v-model="dbsettingsSQLout" :rows="15" type="textarea" placeholder="SQL Output..."></el-input>
            </template>
        </el-card>
    </div>

</template>

<script setup lang="ts">
import { SettingsDO, SettingsRowOptions } from '@/DBA/DO/SettingsDO';
import SettingsDAO from '@/DBA/DTO/SettingsDAO';

import { ElNotification, FormInstance } from 'element-plus';
import { reactive, ref } from 'vue';

const dbformRef = ref<FormInstance>()

const dbsettingsType = ["Input", "Boolean", "Select", "PathInput"]

const dbsettings = reactive<SettingsDO>(
    {
        key: "",
        text: "",
        description: "",
        type: "",
        selected: "",
        options: [],
        chapter: "",
        section: ""
    }
);
const dbsettingsSQLout = ref('')


const delSettingsOption = (item: SettingsRowOptions) => {
    const index = dbsettings.options.indexOf(item)
    if (index !== -1) {
        dbsettings.options.splice(index, 1)
    }
}
const addSettingsOption = () => {
    dbsettings.options.push({
        text: "",
        value: '',
    })
}
const generateSettingsdbSQL = () => {
    const fields = ["key", "text", "description", "selected", "type", "chapter", "section"];
    for (const field of fields) {
        if (!dbsettings[field as keyof typeof dbsettings]) {
            ElNotification.error(`${field} cannot be empty.`);
            return;
        }
    }
    let optionsValue = '[]';
    if (dbsettings.type === 'Boolean') {
        optionsValue = JSON.stringify([
            { text: '启用', value: true },
            { text: '禁用', value: false }
        ]);
    } else if (dbsettings.type === 'Select') {
        optionsValue = JSON.stringify(dbsettings.options);
    }
    const sql = `INSERT INTO Settings (
      key, text, description, type, selected, options, chapter, section
    ) VALUES (
      '${dbsettings.key}',
      '${dbsettings.text.replace(/'/g, "''")}',
      '${dbsettings.description.replace(/'/g, "''")}',
      '${dbsettings.type}',
      '${dbsettings.selected}',
      '${optionsValue.replace(/'/g, "''")}',
      '${dbsettings.chapter}',
      '${dbsettings.section}'
    );`;
    dbsettingsSQLout.value = sql;
};
const insertSettingsRowtodb = () => {
    const fields = ["key", "text", "description", "selected", "type", "chapter", "section"];
    for (const field of fields) {
        if (!dbsettings[field as keyof typeof dbsettings]) {
            ElNotification.error(`${field} cannot be empty.`);
            return;
        }
    }
    let rows: SettingsDO[] = []
    rows.push(dbsettings)
    SettingsDAO.insertRow(rows).then((res) => {
        if (res > 0) {
            ElNotification.success(`Insert Success : ${res}`)
        }
    }).catch(e => ElNotification.error(e))
}
const updateSettingsRow = () => {
    const fields = ["key", "text", "description", "selected", "type", "chapter", "section"];
    for (const field of fields) {
        if (!dbsettings[field as keyof typeof dbsettings]) {
            ElNotification.error(`${field} cannot be empty.`);
            return;
        }
    }
    SettingsDAO.updateRow(dbsettings).then((res) => {
        res > 0 ?
            ElNotification.success(`Update success with key = ${dbsettings.key}`) :
            ElNotification.warning("No data fetched!")
    }).catch(e => ElNotification.error(e))

}
const deleteSettingsRow = async () => {
    if (!dbsettings.key) {
        ElNotification.error("key cannot be empty.")
        return;
    }
    let v = []
    v.push(dbsettings.key)
    // console.log(await dbCRUDUtil.executeSQL("delete from Settings where key = $1;", ["111"]))
    SettingsDAO.deleteRow(dbsettings.key).then((res) => {
        res > 0 ?
            ElNotification.success(`delete success with key = ${dbsettings.key}`) :
            ElNotification.warning("No data fetched!")
    }).catch(e => ElNotification.error(e))
}
const querySettingsRow = () => {
    if (!dbsettings.key) {
        ElNotification.error("key cannot be empty.")
        return;
    }
    SettingsDAO.queryOneByKey(dbsettings.key).then((res) => {
        res ?
            ElNotification.success(`query success with key = ${dbsettings.key}`) :
            ElNotification.warning("No data fetched!");

        dbsettings.key = res?.key || '';
        dbsettings.description = res?.description || "";
        // dbsettings.options = JSON.parse(res?.options.toString() || "[]") || [];
        dbsettings.options = res?.options || [];
        dbsettings.type = res?.type || "";
        dbsettings.text = res?.text || '';
        dbsettings.selected = res?.selected.toString() || '';
        dbsettings.chapter = res?.chapter || '';
        dbsettings.section = res?.section || '';
    }).catch(e => ElNotification.error(e))
}
</script>

<style scoped lang="scss"></style>