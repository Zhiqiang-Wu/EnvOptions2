import RightContentView from '@/pages/right-content/view';
import {
    ClusterOutlined,
    InfoCircleOutlined,
    WindowsOutlined,
} from '@ant-design/icons';
import { useLocation } from '@umijs/max';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';

const RightContentPage = () => {
    const { pathname } = useLocation();

    const [title, setTitle] = useSafeState<string>('Env');

    const [fontSize] = useSafeState<number>(20);

    const [icon, setIcon] = useSafeState(
        <WindowsOutlined style={{ fontSize }} />,
    );

    useEffect(() => {
        switch (pathname) {
            case '/env':
                setTitle('Env');
                setIcon(<WindowsOutlined style={{ fontSize }} />);
                break;
            case '/host':
                setTitle('Host');
                setIcon(<ClusterOutlined style={{ fontSize }} />);
                break;
            case '/about':
                setTitle('About');
                setIcon(<InfoCircleOutlined style={{ fontSize }} />);
                break;
            default:
        }
    }, [pathname]);

    return <RightContentView title={title} icon={icon} />;
};

export default RightContentPage;
