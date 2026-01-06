export interface AppConfigGroup {
    // 分组排序标识
    groupId: number;
    // 分组名称
    name: string;
}

export interface AppConfig<T extends AppConfigGroup = AppConfigGroup> {
    // 唯一标识
    key: string;
    // 存放默认值
    value: string | number | boolean;
    // 显示名称
    title: string;
    // 描述
    description: string;
    // 指定选项类型
    type: "Input" | "PathInput" | "Boolean" | "Select";
    // 选项
    options: BooleanOptions | SelectOption[] | null;
    // 排序标识
    order: number;
    // 所属分组id (必须是 AppConfigGroup.groupId)
    groupId: T['groupId'];
}

// 布尔类型选项
export interface BooleanOptions {
    // true label
    true: string;
    // false label
    false: string;
}

// 选择类型选项
export interface SelectOption {
    //  排序标识
    order?: number;
    // 选项名称
    label: string;
    // 值
    value: any;
}
