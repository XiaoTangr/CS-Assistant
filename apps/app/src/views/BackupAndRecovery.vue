<template>
    <GlassCard body-class="list-body" shadow="never" class="container list">
        <template #header>
            备份与恢复
        </template>
        <template #default>
            <el-table class="table" :data="viewData">
                <el-table-column width="160" :formatter="dateFormatter" property="createdAt" label="创建日期" />
                <el-table-column width="120" label="所属账号">
                    <template #default="scope">
                        <el-text truncated line-clamp="1">
                            {{ scope.row.nickName }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column width="180" label="保存路径">
                    <template #default="scope">
                        <el-text truncated line-clamp="1">
                            {{ backupFolderPathStr + scope.row.folderPath }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column label="用户备注">
                    <template #default="scope">
                        <el-text truncated line-clamp="1">
                            {{ scope.row.description }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column width="140" class-name="list-action" fixed="right" align="center" label="操作">
                    <GlassButton class="list-action-item" plain size="small" type="success">还原</GlassButton>
                    <GlassButton class="list-action-item" plain size="small" type="danger">删除</GlassButton>
                </el-table-column>
            </el-table>
            <div class="list-pagination">
                <el-pagination :pager-count="5" v-model:page-size="pageSize" class="pagination"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    layout="prev,pager,next,sizes,total" :page-sizes="PAGE_SIZES" :total="dataCount" />
            </div>
            <GlassDialog v-model="showNewBackup">
                <template #header>
                    新建备份
                </template>
                <template #default>
                    <el-form v-model="newData">
                        <el-form-item label="唯一标识">
                            <el-input disabled v-model="newData.id" placeholder="请输入所属账号..." />
                        </el-form-item>
                        <el-form-item label="所属账号">
                            <!-- !:应该使用下拉框从LogedSteamUserStore中获取 -->
                            <el-input v-model="newData.nickName" placeholder="请输入所属账号..." />
                        </el-form-item>
                        <el-form-item label="FriendID">
                            <!-- !:自动匹配LogedSteamUserStore -->
                            <el-input disabled v-model="newData.friendId" placeholder="请输入所属好友ID..." />
                        </el-form-item>
                        <el-form-item label="保存路径">
                            <el-input disabled v-model="newData.folderPath" placeholder="请输入保存路径..." />
                        </el-form-item>
                        <el-form-item label="输入备注">
                            <el-input type="textarea" v-model="newData.description" placeholder="请输入用户备注..." />
                        </el-form-item>

                    </el-form>
                </template>
                <template #footer>
                    <GlassButton plain round type="primary">保存</GlassButton>
                    <GlassButton plain round>取消</GlassButton>
                </template>
            </GlassDialog>
        </template>
        <template #footer>
            <GlassButton plain round type="primary" @click="showNewBackup = true">新建备份</GlassButton>
        </template>
    </GlassCard>
</template>

<script setup lang="ts">
import GlassButton from '@/components/Common/GlassButton.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
import GlassDialog from '@/components/Common/GlassDialog.vue';
import { BackupAndRecovery } from '@/core/models';
import { formatTimestamp } from '@/core/utils';
import { useBackupAndRecoveryStore } from '@/store/BackupAndRecoveryStore';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
const PAGE_SIZES = [10, 20, 50, 100];
const BARStore = useBackupAndRecoveryStore();
const { viewData, pageSize, currentPage, dataCount, backupFolderPathStr } = storeToRefs(BARStore);

const dateFormatter = (cellValue: BackupAndRecovery) => {
    return formatTimestamp(cellValue.createdAt as number)
}

const handleSizeChange = async (val: number) => {
    pageSize.value = val;
    await BARStore.fetchPageData();
}
const handleCurrentChange = async (val: number) => {
    currentPage.value = val;
    await BARStore.fetchPageData();
}


// ---------------------------------
const showNewBackup = ref(true);

const newData = ref<BackupAndRecovery>({
    id: 0,
    nickName: '',
    friendId: '',
    description: '',
    folderPath: '',
    createdAt: 0
})

</script>

<style scoped lang="scss">
.container {
    width: 100%;



    :deep(.list-body) {
        padding: 0;
    }


    .table {
        width: calc(100vw - 21.6em);
        height: calc(100vh - 18.25em);

        :deep(.list-action) {
            display: flex;
            justify-content: center;
            align-items: center;
            background: rgba(250, 250, 250, 0.95);

            .list-action-item {
                margin: .8em .25em;
            }
        }

    }

    .table.el-table {
        --el-table-header-bg-color: rgba(250, 250, 250, 0.5);
        --el-table-bg-color: none;
        --el-table-tr-bg-color: none;
        --el-table-row-hover-bg-color: rgba(250, 250, 250, 0.5);
    }

    .list-pagination {
        display: flex;
        justify-content: end;
        padding: calc($globe-padding / 2);

        * {
            background-color: #00000000;
        }

        .pagination {
            margin-right: calc($globe-margin / 1);
        }
    }
}
</style>
