import { KeyValue } from "../models";
import { KeyValueRepository } from "../repositories";
import { fromDb } from "../utils";
import LogService from "./Log.service";
export default class KeyValueService {
    private static instance: KeyValueService;
    private keyValueRepository: KeyValueRepository;

    private constructor() {
        this.keyValueRepository = KeyValueRepository.getInstance();
    }
    static getInstance(): KeyValueService {
        if (!KeyValueService.instance) {
            KeyValueService.instance = new KeyValueService();
        }
        return KeyValueService.instance;
    }

    async getAll(): Promise<KeyValue[]> {
        let res = await this.keyValueRepository.findAll();
        return fromDb(res);
    }


    async getValue(appConfigKey: string): Promise<KeyValue | null> {
        let res = await this.keyValueRepository.findOne({ c_key: appConfigKey });
        return res ? fromDb(res) : null
    }
    async setValue(appConfigKey: string, NewValue: string): Promise<number> {
        let data = [{ c_value: NewValue }]
        let where = [{ c_key: appConfigKey }]
        return await this.keyValueRepository.update(data, where);
    }
    async setValues(payloads: KeyValue[]): Promise<number> {
        let data = payloads;
        let where = payloads.map(item => {
            return { c_key: item.key }
        })
        LogService.error(where);
        return await this.keyValueRepository.update(data, where);
    }
}
