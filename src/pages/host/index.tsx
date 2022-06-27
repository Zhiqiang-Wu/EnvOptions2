import HostView from '@/pages/host/view';
import React from 'react';
import { useCreation, useMemoizedFn, useMount, useSafeState, useBoolean } from 'ahooks';
import useDvaEffect from '@/hooks/useDvaEffect';
import { message } from 'antd';
import { createSelector } from 'reselect';
import { useSelector } from '@umijs/max';
import { LIST_HOSTS, DELETE_HOST, INSERT_HOST, SET_HOST, UPDATE_HOST } from '@/actions/actionTypes';
import InsertModal from '@/pages/host/insert-modal';
import lodash from 'lodash';
import EditModal from '@/pages/host/edit-modal';

const HostPage = () => {

    const { listHosts, deleteHost, insertHost, setHost, updateHost } = useDvaEffect();

    const [dataSource, setDataSource] = useSafeState<Array<Host>>([]);

    const [editHost, setEditHost] = useSafeState({});

    const [insertModalVisible, { setFalse: hideInsertModal, setTrue: showInsertModal }] = useBoolean(false);

    const [editModalVisible, { setFalse: hideEditModal, setTrue: showEdieModal }] = useBoolean(false);

    const { hostViewLoading, insertModalLoading, editModalLoading } = useSelector((state) => ({
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
        editModalLoading: createSelector([
            (state) => state.loading.effects[UPDATE_HOST],
        ], (updateHostLoading) => {
            return !!updateHostLoading;
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

    const editButtonDisabled = useMemoizedFn((host: Host) => {
        return host.selected;
    });

    const onInsertModalOk = useMemoizedFn(({ ip, realm }: { ip: string, realm: string }) => {
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
            hideInsertModal();
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

    const onEditModalOk = useMemoizedFn(({ id, ip, realm }) => {
        ip = ip.trim();
        realm = realm.trim();

        const exists = dataSource.find((host: Host) => {
            return host.ip === ip && host.realm === realm;
        });
        if (exists) {
            message.error('Exists');
            return;
        }

        updateHost({ ip, id, realm }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            hideEditModal();
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

    const onEdit = useMemoizedFn((host: Host) => {
        setEditHost(host);
        showEdieModal();
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
                onInsert={showInsertModal}
                onEdit={onEdit}
                deleteButtonDisabled={deleteButtonDisabled}
                editButtonDisabled={editButtonDisabled}
            />
            <InsertModal
                loading={insertModalLoading}
                visible={insertModalVisible}
                onCancel={hideInsertModal}
                onOk={onInsertModalOk}
            />
            <EditModal
                visible={editModalVisible}
                onCancel={hideEditModal}
                loading={editModalLoading}
                onOk={onEditModalOk}
                data={editHost}
            />
        </>
    );
};

export default HostPage;