import { createAction } from 'redux-actions';
import {
    LIST_VIDEO_INPUT_DEVICES,
    CLOSE_SCAN,
    OPEN_SCAN,
    UPDATE_SCAN_MODEL,
    LIST_HOSTS,
    INSERT_HOST,
    DELETE_HOST,
    LIST_ENVS,
    SET_ENV,
    DELETE_ENV,
    INSERT_ENV,
} from '@/actions/actionTypes';

export const listVideoInputDevices = createAction(LIST_VIDEO_INPUT_DEVICES);
export const openScan = createAction(OPEN_SCAN);
export const closeScan = createAction(CLOSE_SCAN);
export const updateScanModel = createAction(UPDATE_SCAN_MODEL);

export const listHosts = createAction(LIST_HOSTS);
export const insertHost = createAction(INSERT_HOST);
export const deleteHost = createAction(DELETE_HOST);

export const listEnvs = createAction(LIST_ENVS);
export const setEnv = createAction(SET_ENV);
export const deleteEnv = createAction(DELETE_ENV);
export const insertEnv = createAction(INSERT_ENV);