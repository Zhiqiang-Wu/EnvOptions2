import { invoke } from '@tauri-apps/api/tauri';

export const listEnvs = (): Promise<Result> => {
    return invoke('env_list_envs', {});
};