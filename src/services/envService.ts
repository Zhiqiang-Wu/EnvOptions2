import { invoke } from '@tauri-apps/api/tauri';

export const listEnvs = (): Promise<Result> => {
    return invoke('env_list_envs', {});
};

export const setEnv = ({ selected, name, value }): Promise<Result> => {
    return invoke('env_set_env', { selected, name, value });
};

export const insertEnv = ({ name, value }): Promise<Result> => {
    return invoke('env_insert_env', { name, value });
};

export const deleteEnv = (id: Number) => {
    return invoke('env_delete_env', { id });
};