<template>
    <GlassCard body-class="list-body" shadow="never" class="container list">
        <template #header>
            备份与恢复
        </template>
        <template #default>
            <el-table class="table" :data="viewData">
                <el-table-column width="160" property="createdAt" label="创建日期">
                    <template #default="scope">
                        {{ formatTimestamp(scope.row.createdAt) }}
                    </template>
                </el-table-column>
                <el-table-column width="120" label="所属用户FID">
                    <template #default="scope">
                        <el-text truncated line-clamp="1">
                            {{ scope.row.friendId }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column width="120" label="所属用户昵称">
                    <template #default="scope">
                        <el-text truncated line-clamp="1">
                            {{ scope.row.nickName }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip width="180" label="保存路径">
                    <template #default="scope">
                        <CopyText :value="scope.row.folderPath" />
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template #default="scope">
                        <el-text truncated line-clamp="1">
                            {{ scope.row.description }}
                        </el-text>
                    </template>
                </el-table-column>
                <el-table-column width="140" class-name="list-action" fixed="right" align="center" label="操作">
                    <template #default="scope">
                        <GlassButton class="list-action-item" @click="setRestoreBackupIdHandler(scope.row.id)" plain
                            size="small" type="success">还原</GlassButton>
                        <GlassButton class="list-action-item" @click="setDeleteBackupIdhandler(scope.row.id)" plain
                            size="small" type="danger">删除</GlassButton>
                    </template>
                </el-table-column>
            </el-table>
            <div class="list-pagination">
                <el-pagination :pager-count="5" v-model:page-size="pageSize" class="pagination"
                    @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    layout="prev,pager,next,sizes,total" :page-sizes="PAGE_SIZES" :total="dataCount" />
            </div>
            <!-- 新建备份的对话框 -->
            <GlassDialog @closed="cancelCreateHandler" v-model="showNewBackup">
                <template #header>
                    新建备份
                </template>
                <template #default>
                    <el-form v-model="confirmCreateBackupData">
                        <el-form-item label="所属账号">
                            <el-select v-model="confirmCreateBackupData.nickName" placeholder="选择一个目标为其创建备份...">
                                <el-option v-for="item in loginedSteamUserData" :key="item.PersonaName"
                                    :label="item.PersonaName" :value="item.PersonaName" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="输入备注">
                            <el-input type="textarea" v-model="confirmCreateBackupData.description"
                                placeholder="请输入用户备注..." style="max-height: 20vh;overflow-y: auto ;" />
                        </el-form-item>
                        <el-form-item label="唯一标识">
                            <el-input disabled v-model="confirmCreateBackupData.id" placeholder="自动识别" />
                        </el-form-item>
                        <el-form-item label="FriendID">
                            <el-input disabled v-model="confirmCreateBackupData.friendId" placeholder="选择目标后自动识别" />
                        </el-form-item>
                        <el-form-item label="保存路径">
                            <el-input disabled v-model="confirmCreateBackupData.folderPath" placeholder="选择目标后自动生成" />
                        </el-form-item>


                    </el-form>
                </template>
                <template #footer>
                    <GlassButton plain round @click="confirmCreateHandler" type="primary">确定</GlassButton>
                    <GlassButton plain round @click="cancelCreateHandler">取消</GlassButton>
                </template>
            </GlassDialog>

            <!-- 恢复备份的对话框 -->
            <GlassDialog @closed="resetRestoreBackupId" :destroy-on-close="true" v-model="showRestoreBackup">
                <template #header>
                    恢复 {{ confirmRestoreData?.nickName }} 的备份
                </template>
                <template #default>
                    创建于: {{ formatTimestamp(confirmRestoreData?.createdAt ?? 0) }}
                    <br>
                    <CopyText prefix="保存于: " :value="confirmRestoreData?.folderPath" />
                    <br>
                    <span v-if="confirmRestoreData?.description">
                        描述: {{ confirmRestoreData?.description }}
                        <br>
                    </span>
                    <el-checkbox v-model="keepBackUpWhenRestore" label="恢复时保留备份数据" />
                </template>
                <template #footer>
                    <GlassButton plain round @click="confirmRestoreHandler" type="primary">确认</GlassButton>
                    <GlassButton plain round @click="cancelRestoreHandler">取消</GlassButton>
                </template>
            </GlassDialog>
            <!-- 删除备份的对话框 -->
            <GlassDialog @closed="resetDeleteBackupId" :destroy-on-close="true" v-model="showDeleteBackup">
                <template #header>
                    删除 {{ confirmDeleteData?.nickName }} 的备份
                </template>
                <template #default>
                    创建于: {{ formatTimestamp(confirmDeleteData?.createdAt ?? 0) }}
                    <br>
                    <CopyText prefix="保存于: " :value="confirmDeleteData?.folderPath" />
                    <br>
                    <span v-if="confirmDeleteData?.description">
                        描述: {{ confirmDeleteData?.description }}
                    </span>
                </template>
                <template #footer>
                    <GlassButton plain round @click="confirmDeleteHandler" type="danger">确认</GlassButton>
                    <GlassButton plain round @click="cancelDeleteHandler">取消</GlassButton>
                </template>
            </GlassDialog>
        </template>
        <template #footer>
            <GlassButton plain round type="primary" @click='setconfirmCreateBackupDataIdHandler'>新建备份
            </GlassButton>
        </template>
    </GlassCard>
</template>

<script setup lang="ts">
import CopyText from '@/components/Common/CopyText.vue';
import GlassButton from '@/components/Common/GlassButton.vue';
import GlassCard from '@/components/Common/GlassCard.vue';
import GlassDialog from '@/components/Common/GlassDialog.vue';
import { BackupAndRecovery } from '@/core/models';
import { BackupAndRecoveryService } from '@/core/services';
import { formatTimestamp } from '@/core/utils';
import { useBackupAndRecoveryStore } from '@/store/BackupAndRecoveryStore';
import { ElNotification } from 'element-plus';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';
const PAGE_SIZES = [10, 20, 50, 100];
const BARStore = useBackupAndRecoveryStore();
const { loginedSteamUserData, viewData, pageSize, currentPage, dataCount } = storeToRefs(BARStore);

const handleSizeChange = async (val: number) => {
    pageSize.value = val;
    await BARStore.fetchPageData();
}
const handleCurrentChange = async (val: number) => {
    currentPage.value = val;
    await BARStore.fetchPageData();
}


// ——————————————— 新建备份 ————————————————————

const { confirmCreateBackupData } = storeToRefs(BARStore);


const setconfirmCreateBackupDataIdHandler = () => {
    BARStore.setConfirmCreateBackupData();
}

const showNewBackup = computed(() => {
    return confirmCreateBackupData.value.id > 0;
});

const confirmCreateHandler = async () => {
    await BARStore.createBackup()
        .then((res) => {
            ElNotification.success({
                title: '成功',
                type: 'success',
                message: `备份成功: ${res} `,
                duration: 3000,
            })
        })
        .catch((err) => {
            ElNotification.error({
                title: '失败',
                type: 'error',
                message: `备份失败: ${err = -1 ? "未指定备份目标" : err} `,
                duration: 3000,
            })
        })
    BARStore.setConfirmCreateBackupData({ reset: true });
    BARStore.fetchData()

}
const cancelCreateHandler = () => {
    BARStore.setConfirmCreateBackupData({ reset: true });
}
// ——————————————— 恢复备份 ————————————————————

// 恢复备份ID
const RestoreBackupId = ref(-1);
// 是否保留备份数据
const keepBackUpWhenRestore = ref(true);

// 是否显示恢复备份对话框
const showRestoreBackup = computed(() => {
    return RestoreBackupId.value > 0;
});
// 操作数据
const confirmRestoreData = computed<BackupAndRecovery | null>(() => {
    return viewData.value.find(item => item.id === RestoreBackupId.value) ?? null;
});

// 设置恢复备份ID
const setRestoreBackupIdHandler = async (id: number) => {
    RestoreBackupId.value = id;
}
// 重置恢复备份ID
const resetRestoreBackupId = () => {
    RestoreBackupId.value = -1;
}
const confirmRestoreHandler = async () => {
    await BackupAndRecoveryService.restoreBackUp(confirmRestoreData.value!.id, keepBackUpWhenRestore.value).then(() => {
        ElNotification({
            title: '成功',
            message: '备份恢复成功',
            type: 'success',
            duration: 5000
        });
    }).catch((error: Error) => {
        ElNotification.error({
            title: '错误',
            message: `备份恢复失败: ${error.message}`,
            duration: 5000
        });
    });
    resetRestoreBackupId();
    BARStore.fetchPageData();
}
const cancelRestoreHandler = () => {
    resetRestoreBackupId();
}

// ——————————————— 删除备份 ————————————————————
// 删除备份ID
const DeleteBackupId = ref(-1);
// 是否显示删除备份对话框
const showDeleteBackup = computed(() => {
    return DeleteBackupId.value > 0;
});
// 操作数据
const confirmDeleteData = computed<BackupAndRecovery | null>(() => {
    return viewData.value.find(item => item.id === DeleteBackupId.value) ?? null;
});
// 设置删除备份ID
const setDeleteBackupIdhandler = async (id: number) => {
    DeleteBackupId.value = id;
}
// 重置删除备份ID
const resetDeleteBackupId = () => {
    DeleteBackupId.value = -1;
}
const confirmDeleteHandler = async () => {
    await BackupAndRecoveryService.deleteBackup(confirmDeleteData.value!.id).then(() => {

        ElNotification({
            title: '成功',
            message: '备份删除成功',
            type: 'success',
            duration: 5000
        });
    }).catch((error: Error) => {
        ElNotification.error({
            title: '错误',
            message: error.message,
            type: 'error',
            duration: 5000
        });
    });
    resetDeleteBackupId();
    BARStore.fetchPageData();
}
const cancelDeleteHandler = () => {
    resetDeleteBackupId();
}
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
