import {
    DELETE_ENV,
    DELETE_HOST,
    INSERT_ENV,
    INSERT_HOST,
    LIST_ENVS,
    LIST_HOSTS,
    SET_ENV,
    SET_HOST,
    UPDATE_ENV,
    UPDATE_HOST,
} from '@/actions/actionTypes';
import { createAction } from 'redux-actions';

export const listHosts = createAction(LIST_HOSTS);
export const insertHost = createAction(INSERT_HOST);
export const deleteHost = createAction(DELETE_HOST);
export const setHost = createAction(SET_HOST);
export const updateHost = createAction(UPDATE_HOST);

export const listEnvs = createAction(LIST_ENVS);
export const setEnv = createAction(SET_ENV);
export const deleteEnv = createAction(DELETE_ENV);
export const insertEnv = createAction(INSERT_ENV);
export const updateEnv = createAction(UPDATE_ENV);
