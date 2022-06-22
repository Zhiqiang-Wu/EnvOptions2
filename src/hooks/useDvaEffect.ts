import { listVideoInputDevices, closeScan, openScan } from '@/actions/actions';
import { useDispatch } from '@umijs/max';

const useDvaEffect = () => {

    const dispatch = useDispatch();

    return {
        listVideoInputDevices: (): Promise<Result> => dispatch(listVideoInputDevices()),
        openScan: ({deviceId}: {deviceId: string}): void => dispatch(openScan({ deviceId })),
        closeScan: (): void => dispatch(closeScan()),
    };
};

export default useDvaEffect;
