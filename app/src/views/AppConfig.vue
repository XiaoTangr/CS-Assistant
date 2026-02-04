<template>
    <div class="container">
        <div class="groups">
            <template v-for="(g) in groupedViewAppConfig">
                <div class="group">
                    <div class="item">
                        <el-divider border-style="dashed" class="group-title" content-position="left">
                            {{ g.name }}
                        </el-divider>
                        <AppConfigItem class="item-render" v-for="(item, index) in g.configs" :item="item"
                            :key="index" />
                    </div>
                </div>
            </template>
        </div>
        <el-space class="operate">
            <GlassButton size="large" @click="saveModifiedAppConfigHandler" type="primary" round> 保存更改
            </GlassButton>
            <GlassButton size="large" @click="cancelModifiedAppConfigHandler" round> 放弃更改 </GlassButton>
        </el-space>
    </div>
</template>
<script setup lang="ts">
import GlassButton from '@/components/Common/GlassButton.vue';
import AppConfigItem from '@/components/Public/AppConfigItem.vue';
import { useAppConfigStore } from '@/store/appConfigStore';
import { storeToRefs } from 'pinia';

const appConfigStore = useAppConfigStore();

const { groupedViewAppConfig } = storeToRefs(appConfigStore)



const saveModifiedAppConfigHandler = () => {
    appConfigStore.saveModifiedAppConfig();
}
const cancelModifiedAppConfigHandler = () => {

}

</script>

<style scoped lang="scss">
.container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    .groups {
        display: flex;
        flex-direction: column;
        align-items: center;
        transition: $simpel-transition;
        margin-bottom: calc(4rem);
        width: 768px;

        .group {
            margin-top: calc($globe-margin / 2);
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;

            .item {
                width: 100%;

                .group-title {
                    margin-bottom: $globe-margin;
                }

                // .group-title {
                //     margin-top: calc($globe-margin / 2);
                //     // padding-left: calc($globe-margin / 4) ;

                //     * {
                //         bottom: calc(($globe-margin * -2)  - ($globe-margin / 4));
                //         padding: 0;
                //         left: calc($globe-margin / 4);
                //         left: calc($globe-margin + ($globe-margin / 4) + ($globe-padding / 2));
                //         background: none;
                //     }
                // }
            }

            .item-render {
                margin: calc($globe-margin / 4);
            }

            .item-render:first-child {
                margin-top: 0;
                // background-color: red;
            }
        }

        .group:first-child {
            margin-top: 0;
            // background-color: red;
        }

        .group:last-child {
            margin-bottom: 0;
        }
    }

    .operate {
        transition: $simpel-transition;
        position: absolute;
        bottom: calc(24px - 14px);
        right: 0;
        padding-right: 24px;
        height: 4rem;
        display: flex;
        justify-content: center;
    }

}

@media screen and (max-width: calc(20em + 768px)) {
    .container {
        .groups {
            width: 100%;
        }


    }
}
</style>
