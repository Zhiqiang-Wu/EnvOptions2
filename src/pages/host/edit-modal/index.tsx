import { Modal, Form, Input } from 'antd';
import React, { useEffect } from 'react';

const { Item, useForm } = Form;

const EditModal = ({ visible, onCancel, loading, onOk, data }) => {

    const [form] = useForm();

    useEffect(() => {
        if (visible) {
            form.setFieldsValue({
                id: data.id,
                ip: data.ip,
                realm: data.realm,
            });
        }
    }, [data, visible]);

    return (
        <Modal
            confirmLoading={loading}
            title='Edit'
            visible={visible}
            centered={true}
            okText={'Ok'}
            cancelText={'Cancel'}
            onCancel={onCancel}
            onOk={form.submit}
            cancelButtonProps={{
                disabled: loading,
            }}
        >
            <Form labelCol={{ span: 4 }} onFinish={onOk} form={form}>
                <Item name='id' hidden>
                    <Input disabled={loading} />
                </Item>
                <Item
                    label='ip'
                    name='ip'
                    required
                    rules={[
                        { required: true, message: 'ip is required' },
                        {
                            pattern: /^(\b25[0-5]|\b2[0-4][0-9]|\b[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
                            message: 'format error',
                        },
                    ]}
                >
                    <Input disabled={loading} />
                </Item>
                <Item
                    label='realm'
                    name='realm'
                    required
                    rules={[{ required: true, message: 'realm is required' }]}
                >
                    <Input disabled={loading} />
                </Item>
            </Form>
        </Modal>
    );
};

export default EditModal;