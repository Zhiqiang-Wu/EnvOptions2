import { PageContainer } from '@ant-design/pro-components';
import { Table, Switch, Spin } from 'antd';
import React from 'react';
import { useCreation } from 'ahooks';

const ScanView = ({
                      title,
                      enable,
                      loading,
                      dataSource,
                      selectedRowKeys,
                      onSelectedChange,
                      onSwitchChange,
                      checkedChildren,
                      unCheckedChildren,
                      switchDisabled,
                  }) => {

    const columns = useCreation(() => {
        return [
            {
                title: 'deviceId',
                dataIndex: 'deviceId',
                ellipsis: true,
            },
            {
                title: 'groupId',
                dataIndex: 'groupId',
                ellipsis: true,
            },
            {
                title: 'label',
                dataIndex: 'label',
                ellipsis: true,
            },
        ];
    }, []);

    return (
        <Spin spinning={loading} size='large'>
            <PageContainer title={title}>
                <Switch
                    style={{ marginBottom: 20 }}
                    disabled={switchDisabled}
                    onChange={onSwitchChange}
                    checked={enable}
                    checkedChildren={checkedChildren}
                    unCheckedChildren={unCheckedChildren}
                />
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey={(record) => record.deviceId}
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

export default ScanView;