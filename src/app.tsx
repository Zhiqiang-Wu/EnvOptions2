import performanceRecord from '@/plugins/performance-record';
import logo from '@/assets/logo.svg';

export const layout = () => ({
    logo,
});

export const dva = {
    plugins: [performanceRecord()],
};