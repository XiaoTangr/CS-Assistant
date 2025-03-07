export class SettingsDO {
    key!: string;
    text!: string;
    description!: string;
    type!: string;
    selected!: string;
    options!: Array<SettingsRowOptions>
    chapter!: string
    section!: string;
}