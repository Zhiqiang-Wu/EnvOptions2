import { Map } from 'immutable';
import { listHosts, deleteHost, insertHost, setHost, updateHost } from '@/services/hostService';

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
        * setHost({ payload }, { call }) {
            return yield call(setHost, payload);
        }, * updateHost({ payload }, { call }) {
            return yield call(updateHost, payload);
        },
    },
};