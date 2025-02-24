export class SettingsDO {
    key!: String;
    text!: String;
    description!: String;
    type!: String;
    selected!: String;
    options!: Array<SettingsRowOptions>
    chapter!: String
    section!: String;
}