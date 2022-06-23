import { listVideoInputDevices, closeScan, openScan, listHosts, insertHost, deleteHost } from '@/actions/actions';
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
    };
};

export default useDvaEffect;
