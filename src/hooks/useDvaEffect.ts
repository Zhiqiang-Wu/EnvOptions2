import {
    deleteEnv,
    deleteHost,
    insertEnv,
    insertHost,
    listEnvs,
    listHosts,
    setEnv,
    setHost,
    updateEnv,
    updateHost,
} from '@/actions/actions';
import { useDispatch } from '@umijs/max';

const useDvaEffect = () => {
    const dispatch = useDispatch();

    return {
        listHosts: (): Promise<Result> => dispatch(listHosts()),
        deleteHost: (id: number): Promise<Result> => dispatch(deleteHost(id)),
        insertHost: ({
            ip,
            realm,
        }: {
            ip: string;
            realm: string;
        }): Promise<Result> => {
            return dispatch(insertHost({ ip, realm }));
        },
        setHost: ({
            selected,
            ip,
            realm,
        }: {
            selected: boolean;
            ip: string;
            realm: string;
        }): Promise<Result> => {
            return dispatch(setHost({ selected, ip, realm }));
        },
        listEnvs: (): Promise<Result> => dispatch(listEnvs()),
        setEnv: ({
            selected,
            name,
            value,
        }: {
            selected: boolean;
            name: string;
            value?: string;
        }): Promise<Result> => {
            return dispatch(setEnv({ selected, name, value }));
        },
        deleteEnv: (id: number): Promise<Result> => dispatch(deleteEnv(id)),
        insertEnv: ({
            name,
            value,
        }: {
            name: string;
            value: string;
        }): Promise<Result> => {
            return dispatch(insertEnv({ name, value }));
        },
        updateHost: ({
            id,
            ip,
            realm,
        }: {
            id: number;
            ip: string;
            realm: string;
        }): Promise<Result> => {
            return dispatch(updateHost({ id, ip, realm }));
        },
        updateEnv: ({
            id,
            name,
            value,
            selected,
        }: {
            id: number;
            name: string;
            value: string;
            selected: boolean;
        }): Promise<Result> => {
            return dispatch(updateEnv({ id, name, value, selected }));
        },
    };
};

export default useDvaEffect;
