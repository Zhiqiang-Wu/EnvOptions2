import { Map } from 'immutable';
import { listEnvs, setEnv, insertEnv, deleteEnv } from '@/services/envService';

export default {
    namespace: 'envModel',
    state: Map({}),
    effects: {
        * listEnvs({ payload }, { call }) {
            return yield call(listEnvs, payload);
        },
        * setEnv({ payload }, { call }) {
            return yield call(setEnv, payload);
        },
        * insertEnv({ payload }, { call }) {
            return yield call(insertEnv, payload);
        },
        * deleteEnv({ payload }, { call }) {
            return yield call(deleteEnv, payload);
        },
    },
};