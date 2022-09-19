import { open } from '@tauri-apps/api/dialog';
import { useMemoizedFn } from 'ahooks';
import { Button, Form, Input, Modal, Space } from 'antd';

const { Item, useForm } = Form;

const InsertModal = ({ visible = true, onOk, onCancel, loading }) => {
    const [form] = useForm();

    const afterClose = useMemoizedFn(() => {
        form.resetFields();
    });

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

    return (
        <Modal
            confirmLoading={loading}
            open={visible}
            centered={true}
            title="Insert"
            okText={'Ok'}
            cancelText={'Cancel'}
            onOk={form.submit}
            onCancel={onCancel}
            cancelButtonProps={{
                disabled: loading,
            }}
            afterClose={afterClose}
        >
            <Form form={form} labelCol={{ span: 4 }} onFinish={onOk}>
                <Item
                    name="name"
                    label="name"
                    required
                    rules={[{ required: true, message: 'name is required' }]}
                >
                    <Input disabled={loading} />
                </Item>
                <Item
                    name="value"
                    label="value"
                    required
                    rules={[{ required: true, message: 'value is required' }]}
                >
                    <Input disabled={loading} />
                </Item>
                <Item wrapperCol={{ offset: 4 }}>
                    <Space>
                        <Button disabled={loading} onClick={directory}>
                            directory
                        </Button>
                        <Button disabled={loading} onClick={file}>
                            file
                        </Button>
                    </Space>
                </Item>
            </Form>
        </Modal>
    );
};

export default InsertModal;
