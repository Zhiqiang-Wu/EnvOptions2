import HostView from '@/pages/host/view';
import React from 'react';
import { useCreation, useMemoizedFn, useMount, useSafeState, useBoolean } from 'ahooks';
import useDvaEffect from '@/hooks/useDvaEffect';
import { message } from 'antd';
import { createSelector } from 'reselect';
import { useSelector } from '@umijs/max';
import { LIST_HOSTS, DELETE_HOST, INSERT_HOST, SET_HOST } from '@/actions/actionTypes';
import InsertModal from '@/pages/host/insert-modal';
import lodash from 'lodash';

const HostPage = () => {

    const { listHosts, deleteHost, insertHost, setHost } = useDvaEffect();

    const [dataSource, setDataSource] = useSafeState<Array<Host>>([]);

    const [insertModalVisible, { setFalse, setTrue }] = useBoolean(false);

    const { hostViewLoading, insertModalLoading } = useSelector((state) => ({
        hostViewLoading: createSelector([
            (state) => state.loading.effects[LIST_HOSTS],
            (state) => state.loading.effects[DELETE_HOST],
            (state) => state.loading.effects[SET_HOST],
        ], (listHostLoading, deleteHostLoading, setHostLoading) => {
            return !!listHostLoading || !!deleteHostLoading || !!setHostLoading;
        })(state),
        insertModalLoading: createSelector([
            (state) => state.loading.effects[INSERT_HOST],
        ], (insertHostLoading) => {
            return !!insertHostLoading;
        })(state),
    }));

    const selectedRowKeys = useCreation(() => {
        return dataSource.filter((host) => host.selected).map((host) => host.id);
    }, [dataSource]);

    const onSelectedChange = useMemoizedFn((ids: Array<Number>) => {
        let selected;
        let id;
        if (ids.length < selectedRowKeys.length) {
            id = lodash.difference(selectedRowKeys, ids)[0];
            selected = false;
        } else {
            selected = true;
            id = lodash.difference(ids, selectedRowKeys)[0];
        }
        const host: any = dataSource.find((host) => host.id === id);
        setHost({ selected, ip: host.ip, realm: host.realm }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            return listHosts();
        }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            setDataSource(result.data);
        }).catch((err) => {
            message.error(err.message);
        });
    });

    const deleteButtonDisabled = useMemoizedFn((host: Host) => {
        return host.selected;
    });

    const onOk = useMemoizedFn(({ ip, realm }: { ip: string, realm: string }) => {
        ip = ip.trim();
        realm = realm.trim();

        const exists = dataSource.find((host: Host) => {
            return host.ip === ip && host.realm === realm;
        });
        if (exists) {
            message.error('Exists');
            return;
        }

        insertHost({ ip, realm }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            setFalse();
            return listHosts();
        }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            setDataSource(result.data);
        }).catch((err) => {
            message.error(err);
        });
    });

    const onDelete = useMemoizedFn((host: Host) => {
        deleteHost(host.id).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            return listHosts();
        }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            setDataSource(result.data);
        }).catch((err) => {
            message.error(err.message);
        });
    });

    useMount(() => {
        listHosts().then((result) => {
            if (result.code !== 200000) {
                message.error(result.message);
                return;
            }
            setDataSource(result.data);
        });
    });

    return (
        <>
            <HostView
                loading={hostViewLoading}
                dataSource={dataSource}
                selectedRowKeys={selectedRowKeys}
                onSelectedChange={onSelectedChange}
                onDelete={onDelete}
                onInsert={setTrue}
                deleteButtonDisabled={deleteButtonDisabled}
            />
            <InsertModal
                loading={insertModalLoading}
                visible={insertModalVisible}
                onCancel={setFalse}
                onOk={onOk}
            />
        </>
    );
};

export default HostPage;