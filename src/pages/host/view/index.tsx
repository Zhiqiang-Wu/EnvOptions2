import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Table, Tooltip, Typography, Button, Spin } from 'antd';
import { useCreation } from 'ahooks';
import { DeleteOutlined } from '@ant-design/icons';

const HostView = ({
                      loading,
                      dataSource,
                      selectedRowKeys,
                      onSelectedChange,
                      onDelete,
                      onInsert,
                      deleteButtonDisabled,
                  }) => {

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
                    <Tooltip title='Delete'>
                        <Typography.Link disabled={deleteButtonDisabled(record)}>
                            <DeleteOutlined onClick={() => onDelete(record)} />
                        </Typography.Link>
                    </Tooltip>
                );
            },
        },
    ], []);

    return (
        <Spin size='large' spinning={loading}>
            <PageContainer title='Host'>
                <Button onClick={onInsert} type='primary' style={{ marginBottom: 20 }}>Insert</Button>
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
        </Spin>
    );
};

export default HostView;