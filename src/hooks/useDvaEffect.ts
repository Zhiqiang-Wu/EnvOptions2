import { listVideoInputDevices, closeScan, openScan } from '@/actions/actions';
import { useDispatch } from '@umijs/max';

const useDvaEffect = () => {

    const dispatch = useDispatch();

    return {
        listVideoInputDevices: (): Promise<Result> => dispatch(listVideoInputDevices()),
        openScan: (): void => dispatch(openScan()),
        closeScan: (): void => dispatch(closeScan()),
    };
};

export default useDvaEffect;
