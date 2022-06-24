import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useMemoizedFn } from 'ahooks';

const { Item, useForm } = Form;

const InsertModal = ({ visible, onOk, onCancel, loading }) => {

    const [form] = useForm();

    const afterClose = useMemoizedFn(() => {
        form.resetFields();
    });

    return (
        <Modal
            confirmLoading={loading}
            visible={visible}
            title='Insert'
            centered={true}
            okText={'Ok'}
            cancelText={'Cancel'}
            onOk={form.submit}
            onCancel={onCancel}
            cancelButtonProps={{
                disabled: loading,
            }}
            afterClose={afterClose}
        >
            <Form form={form} onFinish={onOk} labelCol={{ span: 4 }}>
                <Item
                    name='ip'
                    label='ip'
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
                    name='realm'
                    label='realm'
                    required
                    rules={[{ required: true, message: 'realm is required' }]}
                >
                    <Input disabled={loading} />
                </Item>
            </Form>
        </Modal>
    );
};

export default InsertModal;