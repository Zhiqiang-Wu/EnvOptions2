import logo from '@/assets/logo.svg';
import { PageContainer } from '@ant-design/pro-components';
import { Typography } from 'antd';

const AboutView = ({ version }) => {
    return (
        <PageContainer title="About">
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <img alt="" src={logo} />
            </div>
            <Typography.Title level={3}>Env Options {version}</Typography.Title>
        </PageContainer>
    );
};

export default AboutView;
