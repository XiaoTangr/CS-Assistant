<template>
    <div class="container">
        <div class="tips">
            <div class="tips-text ">使用Ctrl + F 搜索</div>
            <div class="tips-text modifed">表示已更改,记得保存~</div>
        </div>
        <div v-if="!hasData" class="item-nodata">
            没有数据!
        </div>
        <div v-else v-for="(item, index) in modifedData" class="item-outbox"
            :class="{ modifed: item.selected != originData[index].selected }">
            <div v-if="item.type === 'Boolean'" class="settings-item item-Boolean">
                <p class="item-text">{{ item.text }}</p>
                <div class="item-options">
                    <el-switch v-model="item.selected" :active-text="item.options[0].text"
                        :inactive-text="item.options[1].text" />
                </div>

            </div>
            <div v-if="item.type === 'Select'" class="settings-item item-Select">
                <p class="item-text">{{ item.text }}</p>
                <div class="item-options">
                    <el-select v-model="item.selected" placeholder="Select" style="width: 100%">
                        <el-option v-for="i in item.options" :key="i.value" :label="i.text" :value="i.value" />
                    </el-select>
                </div>
            </div>
            <div v-if="item.type === 'Input'" class="settings-item  item-Input">
                <p class="item-text">{{ item.text }}</p>
                <div class="item-options">
                    <el-input v-model="item.selected" :placeholder="item.description" style="width: 100%" />
                </div>
            </div>
            <div v-if="item.type === 'PathInput'" class="settings-item  item-FilePath">
                <p class="item-text">{{ item.text }}</p>
                <div class="item-options">
                    <el-input class="path-item" v-model="item.selected" placeholder="输入内容" />
                    <el-button class="path-item" @click="openPathChoose(index)" type="primary" :icon="FolderOpened"
                        circle plain />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue';
import { computed, ref, watchEffect } from 'vue';
import { open } from '@tauri-apps/plugin-dialog';

const props = defineProps({
    renderData: {
        type: Array<SettingsRow> || undefined
    }
})

const originData = ref()
const modifedData = ref()


watchEffect(() => {
    originData.value = props.renderData;
    modifedData.value = JSON.parse(JSON.stringify(props.renderData));
})
const hasData = computed(() => {
    return originData.value && originData.value.length > 0 ? true : false
})
const openPathChoose = async (index: number) => {
    try {
        const file = await open({
            multiple: false,
            directory: true,
        });
        modifedData.value[index].selected = file;
    } catch (error: any) {
        throw (error)
    }
};


</script>

<style scoped lang="scss">
.container {

    width: 60%;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    transition: all .5s;

    .tips {
        margin: calc($globe-margin / 4);
        padding: calc($globe-padding / 4);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: end;
        border: $simple-border;
        border-radius: $globe-border-radius;

        .tips-text {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: calc($globe-padding / 4);
        }
    }

    .item-nodata {
        margin: calc($globe-margin / 4);
        padding: calc($globe-padding / 4);
        display: flex;
        flex-direction: row;
        border: $simple-border;
        border-radius: $globe-border-radius;
        justify-content: center;
        justify-content: center;
    }

    .item-outbox {
        margin: calc($globe-margin / 4);
        padding: calc($globe-padding / 4);
        display: flex;
        flex-direction: row;
        justify-content: end;
        align-items: center;
        border: $simple-border;
        border-radius: $globe-border-radius;

        .settings-item {
            display: flex;
            width: calc(100% - $font-size);
            justify-content: space-between;
            flex-direction: row;
            align-items: center;

            .item-options {
                display: flex;
                justify-content: center;
                align-items: center;

                .path-item:first-child {
                    margin-right: calc($globe-margin / 4);
                }
            }

            .item-text,
            .item-options {

                width: 50%;
                padding: calc($globe-padding / 4);

            }
        }
    }

    .modifed::before {
        content: "●";
        display: flex;
        justify-content: center;
        align-items: center;
        width: $font-size;
        height: $font-size;
        font-weight: $font-weight-bold;
        color: $traffic-light-yellow;
    }
}

@media screen and (max-width: 1024px) {

    .container {
        width: 100%;
    }
}
</style>