export const isDev = process.env.NODE_ENV === 'development';

const configApi = {
    development: {
        srv: 'https://testerp.giapdc.ru',
        avatarUrl: '/index.php/profile/photo/250/'
    },
    production: {
        srv: '',
        avatarUrl: '/index.php/profile/photo/250/'
    },
};

export default isDev ? configApi.development : configApi.production;
