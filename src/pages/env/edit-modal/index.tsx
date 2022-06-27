import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Space, Button } from 'antd';
import { useMemoizedFn } from 'ahooks';
import { open } from '@tauri-apps/api/dialog';

const { useForm, Item } = Form;
const { Option } = Select;

const EditModal = ({ visible, loading, onCancel, onOk, data }) => {

    const [form] = useForm();

    const file = useMemoizedFn(() => {
        open().then((result) => {
            if (result) {
                form.setFieldsValue({
                    value: result,
                });
            }
        });
    });

    const directory = useMemoizedFn(() => {
        open({ directory: true }).then((result) => {
            if (result) {
                form.setFieldsValue({
                    value: result,
                });
            }
        });
    });

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                id: data.id,
                name: data.name,
                value: data.value,
                selected: data.selected,
            });
        }
    }, [data, visible]);

    return (
        <Modal
            visible={visible}
            title='Edit'
            confirmLoading={loading}
            centered={true}
            okText={'Ok'}
            cancelText={'Cancel'}
            onCancel={onCancel}
            onOk={form.submit}
            cancelButtonProps={{
                disabled: loading,
            }}
        >
            <Form form={form} labelCol={{ span: 4 }} onFinish={onOk}>
                <Item name='id' hidden>
                    <Input disabled={loading} />
                </Item>
                <Item
                    name='name'
                    label='name'
                    required
                    rules={[{ required: true, message: 'name is required' }]}
                >
                    <Input disabled={loading || data.selected} />
                </Item>
                <Item
                    name='value'
                    label='value'
                    required
                    rules={[{ required: true, message: 'value is required' }]}
                >
                    <Input disabled={loading} />
                </Item>
                <Item name='selected' required hidden>
                    <Select>
                        <Option value={true}>true</Option>
                        <Option value={false}>false</Option>
                    </Select>
                </Item>
                <Item wrapperCol={{ offset: 4 }}>
                    <Space>
                        <Button disabled={loading} onClick={directory}>directory</Button>
                        <Button disabled={loading} onClick={file}>file</Button>
                    </Space>
                </Item>
            </Form>
        </Modal>
    );
};

export default EditModal;