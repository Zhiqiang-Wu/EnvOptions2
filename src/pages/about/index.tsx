import AboutView from '@/pages/about/view';
import { getVersion } from '@tauri-apps/api/app';
import { useSafeState } from 'ahooks';
import { useLayoutEffect } from 'react';

const AboutPage = () => {
    const [version, setVersion] = useSafeState<string>('');

    useLayoutEffect(() => {
        getVersion().then((v) => {
            setVersion(v);
        });
    }, []);

    return <AboutView version={version} />;
};

export default AboutPage;
