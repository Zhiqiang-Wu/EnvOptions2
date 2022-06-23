import EnvView from '@/pages/env/view';
import React from 'react';
import { useCreation, useMemoizedFn, useMount, useSafeState } from 'ahooks';
import useDvaEffect from '@/hooks/useDvaEffect';
import { useSelector } from '@umijs/max';
import { createSelector } from 'reselect';
import { LIST_ENVS } from '@/actions/actionTypes';
import { message } from 'antd';
import lodash from 'lodash';

const EnvPage = () => {

    const { listEnvs, setEnv } = useDvaEffect();
    const [dataSource, setDataSource] = useSafeState<Array<Env>>([]);

    const { loading } = useSelector((state) => ({
        loading: createSelector([
            (state) => state.loading.effects[LIST_ENVS],
        ], (listEnvsLoading) => {
            return listEnvsLoading;
        })(state),
    }));

    const onSelectedChange = useMemoizedFn((ids: Array<Number>) => {
        let id;
        let selected;
        if (selectedRowKeys.length > ids.length) {
            id = lodash.difference(selectedRowKeys, ids)[0];
            selected = false;
        } else {
            id = lodash.difference(ids, selectedRowKeys)[0];
            selected = true;
        }
        const host: any = dataSource.find((host) => host.id === id);
        setEnv({ selected, name: host.name, value: host.value }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            return listEnvs();
        }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            setDataSource(result.data);
        }).catch((err) => {
            message.error(err.message);
        });
    });

    const selectedRowKeys = useCreation(() => {
        return dataSource.filter((env) => env.selected).map((env) => env.id);
    }, [dataSource]);

    useMount(() => {
        listEnvs().then((result) => {
            if (result.code !== 200000) {
                message.error(result.message);
                return;
            }
            setDataSource(result.data);
        });
    });

    return (
        <EnvView
            loading={loading}
            dataSource={dataSource}
            selectedRowKeys={selectedRowKeys}
            onSelectedChange={onSelectedChange}
        />
    );
};

export default EnvPage;