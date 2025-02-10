<template>
    <div class="container">
        <div class="tips">
            <div class="tips-text ">使用Ctrl + F 搜索</div>
            <div class="tips-text modifed">表示已更改,记得保存~</div>
        </div>
        <div v-for="(item, index) in modifeddata" class="item-outbox"
            :class="{ modifed: item.selected != data[index].selected }">
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
                    <el-input v-model="item.selected" placeholder="输入内容" style="width: 100%" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
const data = ref([{
    key: 'useViewChicker',
    text: '不提示视图大小兼容性',
    type: 'Boolean',
    selected: true,
    options: [{
        text: '是',
        value: true
    }, {
        text: '否',
        value: false
    }]
}, {
    key: 'appTheme',
    text: '应用主题',
    type: 'Select',
    selected: 'light',
    options: [{
        text: '明亮',
        value: "light",
    }, {
        text: '黑暗',
        value: "dark"
    }, {
        text: '自定义',
        value: "custom"
    }]
}, {
    key: 'steamAppPath',
    text: 'Steam安装路径',
    type: 'Input',
    selected: "C:\\Program Files (x86)\\Steam",
    options: []
}])

const modifeddata = ref()
onMounted(() => {
    modifeddata.value = JSON.parse(JSON.stringify(data.value));
})

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