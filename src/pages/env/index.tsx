import EnvView from '@/pages/env/view';
import React from 'react';
import { useCreation, useMemoizedFn, useMount, useSafeState, useBoolean } from 'ahooks';
import useDvaEffect from '@/hooks/useDvaEffect';
import { useSelector } from '@umijs/max';
import { createSelector } from 'reselect';
import { LIST_ENVS, INSERT_ENV, DELETE_ENV, SET_ENV } from '@/actions/actionTypes';
import { message } from 'antd';
import lodash from 'lodash';
import InsertModal from '@/pages/env/insert-modal';

const EnvPage = () => {

    const { listEnvs, setEnv, insertEnv, deleteEnv } = useDvaEffect();

    const [dataSource, setDataSource] = useSafeState<Array<Env>>([]);

    const { envViewLoading, insertModalLoading } = useSelector((state) => ({
        envViewLoading: createSelector([
            (state) => state.loading.effects[LIST_ENVS],
            (state) => state.loading.effects[DELETE_ENV],
            (state) => state.loading.effects[SET_ENV],
        ], (listEnvsLoading, deleteEnvLoading, setEnvLoading) => {
            return !!listEnvsLoading || !!deleteEnvLoading || !!setEnvLoading;
        })(state),
        insertModalLoading: createSelector([
            (state) => state.loading.effects[INSERT_ENV],
        ], (insertEnvLoading) => {
            return !!insertEnvLoading;
        })(state),
    }));

    const [insertModalVisible, { setTrue, setFalse }] = useBoolean(false);

    const onOk = useMemoizedFn(({ name, value }: { name: string, value: string }) => {
        name = name.trim();
        value = value.trim();

        const exists = dataSource.find((env) => {
            return env.name === name && env.value === name;
        });
        if (exists) {
            message.error('Exists');
            return;
        }

        const regExpandSzNames = dataSource.filter((env) => env.type === 'REG_EXPAND_SZ').map((env) => env.name.toLowerCase());
        if (regExpandSzNames.includes(name.toLowerCase())) {
            message.error('Name invalid');
            return;
        }

        insertEnv({ name, value }).then((result) => {
            if (result.code !== 200000) {
                throw new Error(result.message);
            }
            setFalse();
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

    const deleteButtonDisabled = useMemoizedFn((env: Env) => {
        return env.selected || env.type === 'REG_EXPAND_SZ';
    });

    const checkboxDisabled = useMemoizedFn((env: Env) => {
        return env.type === 'REG_EXPAND_SZ';
    });

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

    const onDelete = useMemoizedFn((env: Env) => {
        deleteEnv(env.id).then((result) => {
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
            message.error(err);
        });
    });

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
        <>
            <EnvView
                loading={envViewLoading}
                dataSource={dataSource}
                selectedRowKeys={selectedRowKeys}
                onSelectedChange={onSelectedChange}
                onInsert={setTrue}
                onDelete={onDelete}
                deleteButtonDisabled={deleteButtonDisabled}
                checkboxDisabled={checkboxDisabled}
            />
            <InsertModal
                loading={insertModalLoading}
                onOk={onOk}
                onCancel={setFalse}
                visible={insertModalVisible}
            />
        </>
    );
};

export default EnvPage;