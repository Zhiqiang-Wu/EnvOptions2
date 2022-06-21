import { updateScanModel } from '@/actions/actions';
import { useDispatch } from '@umijs/max';

const useDvaReducer = () => {

    const dispatch = useDispatch();

    return {
        updateScanModel: (payload: Array<Payload>): void => dispatch(updateScanModel(payload)),
    };
};

export default useDvaReducer;
