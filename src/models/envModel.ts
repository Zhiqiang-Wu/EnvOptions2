import { Map } from 'immutable';
import { listEnvs } from '@/services/envService';


export default {
    namespace: 'envModel',
    state: Map({}),
    effects: {
        * listEnvs({ payload }, { call }) {
            return yield call(listEnvs, payload);
        },
    },
};