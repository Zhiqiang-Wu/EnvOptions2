import { Map } from 'immutable';
import { listHosts, deleteHost, insertHost } from '@/services/hostService';

export default {
    namespace: 'hostModel',
    state: Map({}),
    effects: {
        * listHosts({ payload }, { call }) {
            return yield call(listHosts, payload);
        },
        * deleteHost({ payload }, { call }) {
            return yield call(deleteHost, payload);
        },
        * insertHost({ payload }, { call }) {
            return yield call(insertHost, payload);
        },
    },
};