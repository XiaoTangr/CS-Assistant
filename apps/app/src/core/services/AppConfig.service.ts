import { AppConfig, KeyValue } from "../models";
import { KeyValueRepository } from "../repositories";
import { appConfigs } from "../static";
import { toDb } from "../utils";
export default class AppConfigService {


    private static instance: AppConfigService;
    private kvRepo: KeyValueRepository;

    private constructor() {
        this.kvRepo = KeyValueRepository.getInstance();
    }

    static getInstance(): AppConfigService {
        if (!AppConfigService.instance) {
            AppConfigService.instance = new AppConfigService();
        }
        return AppConfigService.instance;
    }

    async getSettingByKey(key: string): Promise<any | null> {
        return await this.kvRepo.findOne({ c_key: key }) ?? null;
    }



    async getAll(): Promise<AppConfig[]> {
        let staticData = appConfigs;
        let dbKV: KeyValue[];
        let filterKey = "c_key";
        let filterValue: string[] = staticData.map(item => {
            return item.key
        });
        let filter = { [filterKey]: filterValue }
        dbKV = await this.kvRepo.findWhereIn(filter);

        return staticData.map(item => {
            let dbValue = dbKV.find(kv => kv.key === item.key)?.value;
            if (dbValue === undefined) {
                dbValue = item.value;
            }
            return {
                ...item,
                value: dbValue
            }
        })
    }

    async getValue(appConfigKey: string): Promise<unknown | null> {
        return (await this.kvRepo.findOne({ c_key: appConfigKey }))?.value ?? null;
    }
    async setValue(appConfigKey: string, NewValue: any): Promise<number> {
        let payload = {
            key: appConfigKey,
            value: NewValue,
        }
        let res = await this.kvRepo.update([payload], [{ c_key: appConfigKey }])
        return res
    }
    async setValues(payloads: KeyValue[]): Promise<number> {
        let data = payloads;
        let where = payloads.map(item => {
            return { c_key: item.key }
        })
        return await this.kvRepo.update(toDb(data), where);
    }
}
