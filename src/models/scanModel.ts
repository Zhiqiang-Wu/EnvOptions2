import { listVideoInputDevices, closeScan, openScan } from '@/services/scanService';
import { fromJS, Map, List } from 'immutable';

export default {
    namespace: 'scanModel',
    state: Map({
        enable: false,
        selectedRowKeys: List([]),
    }),
    reducers: {
        updateScanModel(state, action) {
            let newState = state;
            action.payload.forEach((value: any) => {
                newState = newState.setIn(value.keyPath, fromJS(value.value));
            });
            return newState;
        },
    },
    effects: {
        * listVideoInputDevices({ payload }, { call }) {
            return yield call(listVideoInputDevices, payload);
        },
        * openScan({ payload }, { call }) {
            return yield call(openScan, payload);
        },
        * closeScan({ payload }, { call }) {
            return yield call(closeScan, payload);
        },
    },
};