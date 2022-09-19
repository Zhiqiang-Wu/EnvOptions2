import logo from '@/assets/logo.svg';
import { Typography } from 'antd';

const AboutView = ({ version }) => {
    return (
        <div style={{ padding: 25 }}>
            <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <img alt="" src={logo} />
            </div>
            <Typography.Title level={3}>Env Options {version}</Typography.Title>
        </div>
    );
};

export default AboutView;
