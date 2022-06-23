import HostView from '@/pages/host/view';
import React from 'react';
import { useCreation, useMemoizedFn, useMount, useSafeState } from 'ahooks';
import useDvaEffect from '@/hooks/useDvaEffect';
import { message } from 'antd';
import { createSelector } from 'reselect';
import { useSelector } from '@umijs/max';
import { LIST_HOSTS, DELETE_HOST, INSERT_HOST } from '@/actions/actionTypes';

const HostPage = () => {

    const { listHosts, deleteHost, insertHost } = useDvaEffect();

    const [dataSource, setDataSource] = useSafeState<Array<Host>>([]);

    const { loading } = useSelector((state) => ({
        loading: createSelector([
            (state) => state.loading.effects[LIST_HOSTS],
            (state) => state.loading.effects[DELETE_HOST],
            (state) => state.loading.effects[INSERT_HOST],
        ], (listHostLoading, deleteHostLoading, insertHostLoading) => {
            return listHostLoading || deleteHostLoading || insertHostLoading;
        })(state),
    }));

    const selectedRowKeys = useCreation(() => {
        return dataSource.filter((host) => host.selected).map((host) => host.id);
    }, [dataSource]);

    const onSelectedChange = useMemoizedFn((ids: Array<Number>) => {
        console.log(ids);
    });

    const onInsert = useMemoizedFn(() => {

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
        <HostView
            title={'Host'}
            loading={loading}
            dataSource={dataSource}
            selectedRowKeys={selectedRowKeys}
            onSelectedChange={onSelectedChange}
            onDelete={onDelete}
            onInsert={onInsert}
        />
    );
};

export default HostPage;