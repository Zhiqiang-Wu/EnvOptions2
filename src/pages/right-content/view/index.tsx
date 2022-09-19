import { Space } from 'antd';

const RightContentView = ({ title, icon }) => {
    return (
        <Space align={'baseline'} style={{ paddingRight: 25 }}>
            {icon}
            <h1>{title}</h1>
        </Space>
    );
};

export default RightContentView;
