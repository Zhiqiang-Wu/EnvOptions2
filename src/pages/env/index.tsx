import {
    DELETE_ENV,
    INSERT_ENV,
    LIST_ENVS,
    SET_ENV,
    UPDATE_ENV,
} from '@/actions/actionTypes';
import useDvaEffect from '@/hooks/useDvaEffect';
import EditModal from '@/pages/env/edit-modal';
import EditModal2 from '@/pages/env/edit-modal-2';
import InsertModal from '@/pages/env/insert-modal';
import EnvView from '@/pages/env/view';
import { useSelector } from '@umijs/max';
import {
    useBoolean,
    useCreation,
    useMemoizedFn,
    useMount,
    useSafeState,
} from 'ahooks';
import { message } from 'antd';
import lodash from 'lodash';
import { createSelector } from 'reselect';

const EnvPage = () => {
    const { listEnvs, setEnv, insertEnv, deleteEnv, updateEnv } =
        useDvaEffect();

    const [dataSource, setDataSource] = useSafeState<Array<Env>>([]);

    const [editEnv, setEditEnv] = useSafeState<any>({});

    const { envViewLoading, insertModalLoading, editModalLoading } =
        useSelector((state) => ({
            envViewLoading: createSelector(
                [
                    (state) => state.loading.effects[LIST_ENVS],
                    (state) => state.loading.effects[DELETE_ENV],
                    (state) => state.loading.effects[SET_ENV],
                ],
                (listEnvsLoading, deleteEnvLoading, setEnvLoading) => {
                    return (
                        !!listEnvsLoading ||
                        !!deleteEnvLoading ||
                        !!setEnvLoading
                    );
                },
            )(state),
            insertModalLoading: createSelector(
                [(state) => state.loading.effects[INSERT_ENV]],
                (insertEnvLoading) => {
                    return !!insertEnvLoading;
                },
            )(state),
            editModalLoading: createSelector(
                [(state) => state.loading.effects[UPDATE_ENV]],
                (updateEnvLoading) => {
                    return !!updateEnvLoading;
                },
            )(state),
        }));

    const [
        insertModalVisible,
        { setTrue: showInsertModal, setFalse: hideInsertModal },
    ] = useBoolean(false);

    const [
        editModalVisible,
        { setTrue: showEditModal, setFalse: hideEditModal },
    ] = useBoolean(false);

    const [
        editModalVisible2,
        { setTrue: showEditModal2, setFalse: hideEditModal2 },
    ] = useBoolean(false);

    const sorted = useMemoizedFn((dataSource) => {
        const obj = lodash.groupBy(dataSource, (env) => {
            return env.name;
        });
        const dataSourceSorted: Array<any> = [];
        for (const objKey in obj) {
            if (obj.hasOwnProperty(objKey)) {
                const arr = obj[objKey];
                dataSourceSorted.push(...arr);
            }
        }
        return dataSourceSorted;
    });

    const onInsertModalOk = useMemoizedFn(
        ({ name, value }: { name: string; value: string }) => {
            const name2: string = name.trim();
            const value2: string = value.trim();

            const exists = dataSource.find((env) => {
                return env.name === name2 && env.value === value2;
            });
            if (exists) {
                message.error('Exists');
                return;
            }

            const regExpandSzNames = dataSource
                .filter((env) => env.type === 'REG_EXPAND_SZ')
                .map((env) => env.name.toLowerCase());
            if (regExpandSzNames.includes(name2.toLowerCase())) {
                message.error('Name invalid');
                return;
            }

            insertEnv({ name: name2, value: value2 })
                .then((result) => {
                    if (result.code !== 200000) {
                        throw new Error(result.message);
                    }
                    hideInsertModal();
                    return listEnvs();
                })
                .then((result) => {
                    if (result.code !== 200000) {
                        throw new Error(result.message);
                    }
                    setDataSource(sorted(result.data));
                })
                .catch((err) => {
                    message.error(err.message);
                });
        },
    );

    const onEditModalOk = useMemoizedFn(({ id, name, value, selected }) => {
        const name2: string = name.trim();
        const value2: string = value.trim();

        const exists = dataSource.find((env) => {
            return env.name === name2 && env.value === value2;
        });
        if (exists) {
            message.error('Exists');
            return;
        }

        updateEnv({ id, name: name2, value: value2, selected })
            .then((result) => {
                if (result.code !== 200000) {
                    throw new Error(result.message);
                }
                hideEditModal();
                return listEnvs();
            })
            .then((result) => {
                if (result.code !== 200000) {
                    throw new Error(result.message);
                }
                setDataSource(sorted(result.data));
            })
            .catch((err) => {
                message.error(err.message);
            });
    });

    const onEditModalOk2 = useMemoizedFn((v) => {
        updateEnv({
            id: editEnv.id,
            name: editEnv.name,
            value: v,
            selected: editEnv.selected,
        })
            .then((result) => {
                if (result.code !== 200000) {
                    throw new Error(result.message);
                }
                hideEditModal2();
                return listEnvs();
            })
            .then((result) => {
                if (result.code !== 200000) {
                    throw new Error(result.message);
                }
                setDataSource(sorted(result.data));
            })
            .catch((err) => {
                message.error(err.message);
            });
    });

    const deleteButtonDisabled = useMemoizedFn((env: Env) => {
        return env.selected || env.type === 'REG_EXPAND_SZ';
    });

    const editButtonDisabled = useMemoizedFn(() => {
        return false;
    });

    const onEdit = useMemoizedFn((env: Env) => {
        setEditEnv(env);
        if (env.name.toUpperCase() === 'PATH') {
            showEditModal2();
        } else {
            showEditModal();
        }
    });

    const checkboxDisabled = useMemoizedFn((env: Env) => {
        return env.type === 'REG_EXPAND_SZ';
    });

    const selectedRowKeys = useCreation(() => {
        return dataSource.filter((env) => env.selected).map((env) => env.id);
    }, [dataSource]);

    const onSelectedChange = useMemoizedFn((ids: Array<number>) => {
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
        setEnv({ selected, name: host.name, value: host.value })
            .then((result) => {
                if (result.code !== 200000) {
                    throw new Error(result.message);
                }
                return listEnvs();
            })
            .then((result) => {
                if (result.code !== 200000) {
                    throw new Error(result.message);
                }
                setDataSource(sorted(result.data));
            })
            .catch((err) => {
                message.error(err.message);
            });
    });

    const onDelete = useMemoizedFn((env: Env) => {
        deleteEnv(env.id)
            .then((result) => {
                if (result.code !== 200000) {
                    throw new Error(result.message);
                }
                return listEnvs();
            })
            .then((result) => {
                if (result.code !== 200000) {
                    throw new Error(result.message);
                }
                setDataSource(sorted(result.data));
            })
            .catch((err) => {
                message.error(err);
            });
    });

    useMount(() => {
        listEnvs().then((result) => {
            if (result.code !== 200000) {
                message.error(result.message);
                return;
            }
            setDataSource(sorted(result.data));
        });
    });

    return (
        <>
            <EnvView
                loading={envViewLoading}
                dataSource={dataSource}
                selectedRowKeys={selectedRowKeys}
                onSelectedChange={onSelectedChange}
                onInsert={showInsertModal}
                onDelete={onDelete}
                deleteButtonDisabled={deleteButtonDisabled}
                checkboxDisabled={checkboxDisabled}
                editButtonDisabled={editButtonDisabled}
                onEdit={onEdit}
            />
            <InsertModal
                loading={insertModalLoading}
                onOk={onInsertModalOk}
                onCancel={hideInsertModal}
                visible={insertModalVisible}
            />
            <EditModal
                data={editEnv}
                visible={editModalVisible}
                loading={editModalLoading}
                onCancel={hideEditModal}
                onOk={onEditModalOk}
            />
            <EditModal2
                data={editEnv}
                visible={editModalVisible2}
                onCancel={hideEditModal2}
                onOk={onEditModalOk2}
                loading={editModalLoading}
            />
        </>
    );
};

export default EnvPage;
