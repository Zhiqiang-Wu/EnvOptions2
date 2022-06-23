import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Popconfirm, Tooltip, Typography, Button } from 'antd';
import { useCreation } from 'ahooks';
import { DeleteOutlined } from '@ant-design/icons';

const HostView = ({ title, loading, dataSource, selectedRowKeys, onSelectedChange, onDelete, onInsert }) => {

    const columns = useCreation(() => [
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
                    <Popconfirm
                        title='确认删除？'
                        onConfirm={() => onDelete(record)}
                    >
                        <Tooltip title='删除'>
                            <Typography.Link>
                                <DeleteOutlined />
                            </Typography.Link>
                        </Tooltip>
                    </Popconfirm>
                );
            },
        },
    ], []);

    return (
        <PageContainer title={title} loading={loading}>
            <Button onClick={onInsert} type='primary' style={{ marginBottom: 20 }}>添加</Button>
            <Table
                columns={columns}
                rowKey={(record) => record.id}
                dataSource={dataSource}
                rowSelection={{
                    hideSelectAll: true,
                    selectedRowKeys,
                    onChange: onSelectedChange,
                }}
            />
        </PageContainer>
    );
};

export default HostView;