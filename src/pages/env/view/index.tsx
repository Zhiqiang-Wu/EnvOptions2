import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { useCreation } from 'ahooks';
import { Button, Space, Spin, Table, Tooltip, Typography } from 'antd';

const EnvView = ({
    loading,
    dataSource,
    selectedRowKeys,
    onSelectedChange,
    onInsert,
    deleteButtonDisabled,
    onDelete,
    checkboxDisabled,
    editButtonDisabled,
    onEdit,
}) => {
    const columns = useCreation(
        () => [
            {
                title: 'name',
                dataIndex: 'name',
            },
            {
                title: 'type',
                dataIndex: 'type',
                ellipsis: true,
            },
            {
                title: 'value',
                dataIndex: 'value',
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
        <Spin spinning={loading} size="large">
            <div style={{ padding: 25 }}>
                <Button
                    type="primary"
                    style={{ marginBottom: 20 }}
                    onClick={onInsert}
                >
                    Insert
                </Button>
                <Table
                    rowKey={(record) => record.id}
                    columns={columns}
                    dataSource={dataSource}
                    rowSelection={{
                        getCheckboxProps: (record) => ({
                            disabled: checkboxDisabled(record),
                        }),
                        hideSelectAll: true,
                        selectedRowKeys,
                        onChange: onSelectedChange,
                    }}
                />
            </div>
        </Spin>
    );
};

export default EnvView;
