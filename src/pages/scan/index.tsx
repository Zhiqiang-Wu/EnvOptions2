import React from 'react';
import ScanView from '@/pages/scan/view';
import { useMount, useSafeState, useMemoizedFn, useCreation } from 'ahooks';
import useDvaEffect from '@/hooks/useDvaEffect';
import { useSelector } from '@umijs/max';
import { createSelector } from 'reselect';
import { LIST_VIDEO_INPUT_DEVICES, OPEN_SCAN, CLOSE_SCAN } from '@/actions/actionTypes';
import { message } from 'antd';
import lodash from 'lodash';
import useDvaReducer from '@/hooks/useDvaReducer';

const ScanPage = () => {

    const { listVideoInputDevices, closeScan, openScan } = useDvaEffect();

    const { updateScanModel } = useDvaReducer();

    const [dataSource, setDataSource] = useSafeState([]);

    useMount(() => {
        listVideoInputDevices().then((result) => {
            if (result.code !== 200000) {
                message.error(result.message);
                return;
            }
            if (result.data.length > 0) {
                updateScanModel([
                    { keyPath: ['selectedRowKeys'], value: [result.data[0].deviceId] },
                ]);
            }
            setDataSource(result.data);
        });
    });

    const onSelectedChange = useMemoizedFn((keys: Array<string>) => {
        if (enable) {
            return;
        }
        updateScanModel([
            { keyPath: ['selectedRowKeys'], value: lodash.xor(selectedRowKeys, keys) },
        ]);
    });

    const onSwitchChange = useMemoizedFn((enable) => {
        updateScanModel([{ keyPath: ['enable'], value: enable }]);
        if (enable) {
            openScan({ deviceId: selectedRowKeys[0] });
        } else {
            closeScan();
        }
    });

    const { loading, selectedRowKeys, enable } = useSelector((state) => ({
        loading: createSelector([
            (state) => state.loading.effects[LIST_VIDEO_INPUT_DEVICES],
            (state) => state.loading.effects[OPEN_SCAN],
            (state) => state.loading.effects[CLOSE_SCAN],
        ], (listVideoInputDevicesLoading, openScanLoading, closeScanLoading) => {
            return listVideoInputDevicesLoading || openScanLoading || closeScanLoading;
        })(state),
        selectedRowKeys: createSelector((state) => {
            return state.scanModel.get('selectedRowKeys');
        }, (selectedRowKeys) => {
            return selectedRowKeys.toJS();
        })(state),
        enable: createSelector((state) => {
            return state.scanModel.get('enable');
        }, (enable) => {
            return enable;
        })(state),
    }));

    const switchDisabled = useCreation(() => {
        return selectedRowKeys.length === 0;
    }, [selectedRowKeys]);

    return (
        <ScanView
            // TODO local
            title={'Scan'}
            loading={loading}
            dataSource={dataSource}
            onSelectedChange={onSelectedChange}
            selectedRowKeys={selectedRowKeys}
            onSwitchChange={onSwitchChange}
            enable={enable}
            // TODO local
            checkedChildren={'开启'}
            // TODO local
            unCheckedChildren={'关闭'}
            switchDisabled={switchDisabled}
        />
    );
};

export default ScanPage;