import performanceRecord from '@/plugins/performance-record';

export const dva = {
    plugins: [performanceRecord()]
};