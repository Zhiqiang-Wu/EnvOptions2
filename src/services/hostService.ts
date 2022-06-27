import { invoke } from '@tauri-apps/api/tauri';

export const listHosts = (): Promise<Result> => {
    return invoke('host_list_hosts', {});
};

export const insertHost = ({ ip, realm }): Promise<Result> => {
    return invoke('host_insert_host', { ip, realm });
};

export const deleteHost = (id): Promise<Result> => {
    return invoke('host_delete_host', { id });
};

export const setHost = ({ selected, ip, realm }): Promise<Result> => {
    return invoke('host_set_host', { selected, ip, realm });
};

export const updateHost = ({ id, ip, realm }): Promise<Result> => {
    return invoke('host_update_host', { ip, id, realm });
};