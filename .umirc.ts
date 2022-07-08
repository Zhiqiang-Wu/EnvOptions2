import { defineConfig } from '@umijs/max';

export default defineConfig({
    antd: {},
    dva: {},
    layout: {
        title: 'Env Options',
    },
    headScripts: [
        `
        document.addEventListener('DOMContentLoaded', () => {
            window.__TAURI__.invoke('close_splashscreen');
        });
        `,
    ],
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
        {
            name: 'about',
            path: '/about',
            icon: 'infoCircle',
            component: './about',
        },
    ],
    npmClient: 'pnpm',
});
