import logo from '@/assets/logo.svg';
import RightContentPage from '@/pages/right-content';
import performanceRecord from '@/plugins/performance-record';

export const layout = () => ({
    logo,
    rightContentRender: RightContentPage,
});

export const dva = {
    plugins: [performanceRecord()],
};
