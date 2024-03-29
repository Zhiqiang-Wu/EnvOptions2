import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useCreation } from 'ahooks';
import { Button, Space, Spin, Table, Tooltip, Typography } from 'antd';

const HostView = ({
    loading,
    dataSource,
    selectedRowKeys,
    onSelectedChange,
    onDelete,
    onInsert,
    deleteButtonDisabled,
    editButtonDisabled,
    onEdit,
}) => {
    const columns = useCreation(
        () => [
            {
                title: 'ip',
                dataIndex: 'ip',
                ellipsis: true,
            },
            {
                title: 'realm',
                dataIndex: 'realm',
                ellipsis: true,
            },
            {
                title: 'action',
                width: 90,
                render: (record) => {
                    return (
                        <Space>
                            <Tooltip title="Edit">
                                <Typography.Link
                                    disabled={editButtonDisabled(record)}
                                >
                                    <EditOutlined
                                        onClick={() => onEdit(record)}
                                    />
                                </Typography.Link>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <Typography.Link
                                    disabled={deleteButtonDisabled(record)}
                                >
                                    <DeleteOutlined
                                        onClick={() => onDelete(record)}
                                    />
                                </Typography.Link>
                            </Tooltip>
                        </Space>
                    );
                },
            },
        ],
        [],
    );

    return (
        <Spin size="large" spinning={loading}>
            <div style={{ padding: 25 }}>
                <Button
                    onClick={onInsert}
                    type="primary"
                    style={{ marginBottom: 20 }}
                >
                    Insert
                </Button>
                <Table
                    columns={columns}
                    rowKey={(record) => record.id}
                    dataSource={dataSource}
                    rowSelection={{
                        hideSelectAll: true,
                        selectedRowKeys,
                        onChange: onSelectedChange,
                    }}
                    pagination={{ hideOnSinglePage: true }}
                />
            </div>
        </Spin>
    );
};

export default HostView;
