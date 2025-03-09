export class SettingsDO {
    key!: string;
    text!: string;
    description!: string;
    type!: string;
    selected!: string | boolean;
    options!: Array<SettingsRowOptions>
    chapter!: string
    section!: string;


}
class SettingsRowOptions {
    /**
     * @description 选项的值，用于存储和比较
     */
    value!: string;

    /**
     * @description 选项的显示文本，用于在界面上显示给用户
     */
    text!: string;
}