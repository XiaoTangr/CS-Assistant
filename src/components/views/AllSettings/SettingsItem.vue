<template>
    <div class="container">
        <div class="tips">
            <div class="tips-text ">使用Ctrl + F 搜索</div>
            <div class="tips-text modifed">表示已更改,记得保存~</div>
        </div>
        <div v-if="!hasData" class="item-nodata">
            没有数据!
        </div>
        <div v-else v-for="(item, index) in modifedData" class="item-outbox">
            <div v-if="item.type === 'Boolean'" class="settings-item item-Boolean">
                <p :class="{ modifed: item.selected != originData[index].selected }" class="item-name">{{ item.text }}
                </p>
                <div class="item-container">
                    <div class="item-desc">
                        {{ item.description }}
                    </div>

                    <div class="item-options">
                        <el-switch v-model="item.selected" :active-text="item.options[0].text"
                            :inactive-text="item.options[1].text" />
                    </div>
                </div>
            </div>
            <div v-if="item.type === 'Select'" class="settings-item item-Select">

                <p :class="{ modifed: item.selected != originData[index].selected }" class="item-name">{{ item.text }}
                </p>
                <div class="item-container">
                    <div class="item-desc">
                        {{ item.description }}
                    </div>

                    <div class="item-options">
                        <el-select v-model="item.selected" placeholder="Select" style="width: 100%">
                            <el-option v-for="i in item.options" :key="i.value" :label="i.text" :value="i.value" />
                        </el-select>
                    </div>
                </div>


            </div>
            <div v-if="item.type === 'Input'" class="settings-item  item-Input">
                <p :class="{ modifed: item.selected != originData[index].selected }" class="item-name">{{ item.text }}
                </p>
                <div class="item-container">
                    <div class="item-desc">
                        {{ item.description }}
                    </div>
                    <div class="item-options">
                        <el-input v-model="item.selected" placeholder="..." style="width: 100%" />
                    </div>
                </div>
            </div>
            <div v-if="item.type === 'PathInput'" class="settings-item item-FilePath">
                <p :class="{ modifed: item.selected != originData[index].selected }" class="item-name">{{ item.text
                }}
                </p>
                <div class="item-container">
                    <div class="item-desc">
                        {{ item.description }}
                    </div>
                    <div class="item-options">
                        <el-input class="path-item" v-model="item.selected" placeholder="选择路径" />
                        <el-button class="path-item" @click="openPathChoose(index)" type="primary" :icon="FolderOpened"
                            circle plain />
                    </div>
                </div>

            </div>
        </div>
        <div class="Operate-Container">
            <div class="bg">
                <el-button type="primary" v-if="isDataupdated == true" @click="savaChanges">保存更改</el-button>
                <el-button type="warning" @click="useDefault">恢复默认</el-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FolderOpened } from '@element-plus/icons-vue';
import { computed, ref, watchEffect } from 'vue';
import { open } from '@tauri-apps/plugin-dialog';
// import { useSettingsStore } from '@/store/SettingsStore';
// const props = defineProps({
//     chapter: {
//         type: Number,
//         required: true
//     },
//     section: {
//         type: String,
//         required: true
//     }
// })


// const SettingsStore = useSettingsStore();


const originData = ref()
const modifedData = ref()


watchEffect(() => {
    // originData.value = SettingsStore.getDataByChapterAndSection(props.chapter, props.section);
    // modifedData.value = SettingsStore.getModifedDataByChapterAndSection(props.chapter, props.section);
})
const hasData = computed(() => {
    return originData.value && originData.value.length > 0 ? true : false
})


const isDataupdated = computed(() => {
    return JSON.stringify(originData.value) !== JSON.stringify(modifedData.value)
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

const savaChanges = () => {
    // SettingsStore.saveModifedDataByChapterAndSection(props.chapter, props.section);
}
const useDefault = () => {
    
}
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
            flex-direction: column;
            width: 100%;

            .item-name {
                padding-top: calc($globe-padding / 4);
                font-weight: $font-weight-bold;
                width: 100%;
                display: flex;
                margin-left: $font-size;
                justify-content: left;
                align-items: center;
            }



            .item-container {
                display: flex;
                justify-content: space-between;
                flex-direction: row;
                align-items: center;
                width: calc(100% - $font-size);
                margin-left: $font-size;

                .item-options {
                    display: flex;
                    justify-content: right;
                    align-items: center;

                    .path-item:first-child {
                        margin-right: calc($globe-margin / 4);
                    }
                }
            }

            .item-text,
            .item-options {
                width: 50%;
                padding: calc($globe-padding / 4);
            }
        }
    }

    .Operate-Container {
        // background-color: red;
        display: flex;
        position: sticky;
        bottom: 0;
        justify-content: center;
        transition: all 0.5s;


        background: $content-background-color;
        border-radius: $globe-border-radius;
        border: $simple-border;
        margin: calc($globe-margin / 4);
        margin-bottom: 0;
        padding: calc($globe-padding / 2);
        backdrop-filter: $globe-backdrop-filter;
        box-shadow: $simple-box-shadow;

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
    color: $mac-yellow;
    margin-left: - $font-size;
}

@media screen and (max-width: 1024px) {

    .container {
        width: 100%;
    }
}
</style>