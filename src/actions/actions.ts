import { createAction } from 'redux-actions';
import { LIST_VIDEO_INPUT_DEVICES, CLOSE_SCAN, OPEN_SCAN, UPDATE_SCAN_MODEL } from '@/actions/actionTypes';

export const listVideoInputDevices = createAction(LIST_VIDEO_INPUT_DEVICES);
export const openScan = createAction(OPEN_SCAN);
export const closeScan = createAction(CLOSE_SCAN);
export const updateScanModel = createAction(UPDATE_SCAN_MODEL);