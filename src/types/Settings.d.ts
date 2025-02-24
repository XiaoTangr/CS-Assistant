
type SettingsRow = {
    key: String
    text: String
    description: String
    type: SettingsRowType;
    selected: String | mull ,
    options: Array<SettingsRowOptions>;
    chapter: String,
    section: String,
}
/**
 * @description 定义设置项的可选选项结构，包含选项的值和显示文本
 */
type SettingsRowOptions = {
    /**
     * @description 选项的值，用于存储和比较
     */
    value: string;

    /**
     * @description 选项的显示文本，用于在界面上显示给用户
     */
    text: string;
}