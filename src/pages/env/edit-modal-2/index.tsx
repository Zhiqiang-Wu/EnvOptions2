import React, { useEffect } from 'react';
import { Modal, Input, Space, Button, Row, Typography, Col } from 'antd';
import { MinusCircleOutlined } from '@ant-design/icons';
import { useSafeState, useMemoizedFn, useCreation } from 'ahooks';
import { nanoid } from 'nanoid';
import { open } from '@tauri-apps/api/dialog';

const EditModal = ({ visible, onCancel, data, onOk, loading }) => {

    const [input, setInput] = useSafeState<Array<{ id, value }>>([]);

    const [selectedId, setSelectedId] = useSafeState<string | null>(null);

    const addValue = useMemoizedFn(() => {
        setInput([...input, { id: nanoid(), value: '' }]);
    });

    const removeValue = useMemoizedFn((id) => {
        setInput(input.filter(value => value.id !== id));
    });

    const directory = useMemoizedFn(() => {
        open({ directory: true }).then((result) => {
            if (result) {
                if (selectedId) {
                    setInput(input.map((value) => {
                        if (value.id === selectedId) {
                            return { id: value.id, value: result };
                        }
                        return value;
                    }));
                } else {
                    setInput([...input, { id: nanoid(), value: result }]);
                }
            }
        });
    });

    const onFinish = useMemoizedFn(() => {
        const value = input.filter((obj) => obj.value.trim())
            .map((obj) => obj.value + ';').join('');
        onOk(value);
    });

    const onInputChange = useMemoizedFn((event) => {
        setInput(input.map((value) => {
            if (value.id === selectedId) {
                return { id: value.id, value: event.target.value };
            }
            return value;
        }));
    });

    const directoryButtonDisabled = useCreation(() => {
        return !selectedId || loading;
    }, [selectedId, loading]);

    useEffect(() => {
        if (visible && data.value) {
            const values = data.value.split(';').filter((value) => value).map((value) => ({
                value,
                id: nanoid(),
            }));
            setInput(values);
        }
    }, [visible, data]);

    return (
        <Modal
            confirmLoading={loading}
            visible={visible}
            title='Edit'
            centered
            onOk={onFinish}
            onCancel={onCancel}
            okText={'Ok'}
            cancelText={'Cancel'}
        >
            <Row gutter={20} wrap={false}>
                <Col flex='auto'>
                    <Space direction='vertical' style={{ width: '100%' }}>
                        {
                            input.map((obj) => (
                                <Row gutter={10} key={obj.id} wrap={false} align='middle'>
                                    <Col flex='auto'>
                                        <Input
                                            disabled={loading}
                                            value={obj.value}
                                            onFocus={() => setSelectedId(obj.id)}
                                            onBlur={() => setSelectedId(null)}
                                            onChange={onInputChange}
                                        />
                                    </Col>
                                    <Col flex='none'>
                                        <Typography.Link disabled={loading}>
                                            <MinusCircleOutlined
                                                style={{ fontSize: 22 }}
                                                onClick={() => removeValue(obj.id)}
                                            />
                                        </Typography.Link>
                                    </Col>
                                </Row>
                            ))
                        }
                    </Space>
                </Col>
                <Col flex='none'>
                    <Space direction='vertical'>
                        <Button onClick={addValue} disabled={loading}>Add value</Button>
                        <Button
                            disabled={directoryButtonDisabled}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                directory();
                            }}
                        >
                            Directory
                        </Button>
                    </Space>
                </Col>
            </Row>
        </Modal>
    );
};

export default EditModal;