import { defineConfig } from '@umijs/max';

export default defineConfig({
    antd: {},
    dva: {},
    layout: {
        title: 'Env Options',
    },
    routes: [
        {
            path: '/',
            redirect: '/env',
        },
        {
            name: 'env',
            path: '/env',
            icon: 'windows',
            component: './env',
        },
        {
            name: 'host',
            path: '/host',
            icon: 'cluster',
            component: './host',
        },
        {
            name: 'scan',
            path: '/scan',
            icon: 'qrcode',
            component: './scan',
        },
    ],
    npmClient: 'pnpm',
});

