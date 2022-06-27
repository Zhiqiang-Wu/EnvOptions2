import {
    listVideoInputDevices,
    closeScan,
    openScan,
    listHosts,
    insertHost,
    deleteHost,
    listEnvs,
    setEnv,
    deleteEnv,
    insertEnv,
    setHost,
    updateHost,
} from '@/actions/actions';
import { useDispatch } from '@umijs/max';

const useDvaEffect = () => {

    const dispatch = useDispatch();

    return {
        listVideoInputDevices: (): Promise<Result> => dispatch(listVideoInputDevices()),
        openScan: ({ deviceId }: { deviceId: string }): void => dispatch(openScan({ deviceId })),
        closeScan: (): void => dispatch(closeScan()),
        listHosts: (): Promise<Result> => dispatch(listHosts()),
        deleteHost: (id: Number): Promise<Result> => dispatch(deleteHost(id)),
        insertHost: ({ ip, realm }: { ip: string, realm: string }): Promise<Result> => {
            return dispatch(insertHost({ ip, realm }));
        },
        setHost: ({ selected, ip, realm }: { selected: boolean, ip: string, realm: string }): Promise<Result> => {
            return dispatch(setHost({ selected, ip, realm }));
        },
        listEnvs: (): Promise<Result> => dispatch(listEnvs()),
        setEnv: ({ selected, name, value }: { selected: boolean, name: string, value?: string }): Promise<Result> => {
            return dispatch(setEnv({ selected, name, value }));
        },
        deleteEnv: (id: Number): Promise<Result> => dispatch(deleteEnv(id)),
        insertEnv: ({ name, value }: { name: string, value: string }): Promise<Result> => {
            return dispatch(insertEnv({ name, value }));
        },
        updateHost: ({ id, ip, realm }: { id: number, ip: string, realm: string }): Promise<Result> => {
            return dispatch(updateHost({ id, ip, realm }));
        },
    };
};

export default useDvaEffect;
