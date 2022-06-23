import React from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Table } from 'antd';
import { useCreation } from 'ahooks';

const EnvView = ({ loading, dataSource, selectedRowKeys, onSelectedChange }) => {

    const columns = useCreation(() => ([
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
    ]), []);

    return (
        <PageContainer loading={loading} title={'Env'}>
            <Table
                rowKey={(record) => record.id}
                columns={columns}
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

export default EnvView;