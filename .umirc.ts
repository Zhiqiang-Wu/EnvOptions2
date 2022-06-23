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
            component: './env',
        },
        {
            name: 'host',
            path: '/host',
            component: './host',
        },
        {
            name: 'scan',
            path: '/scan',
            component: './scan',
        },
    ],
    npmClient: 'pnpm',
});

