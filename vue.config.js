/* eslint-disable indent */
module.exports = {
    configureWebpack: {
        devServer: {
            proxy: {
                '/api': {
                    target: 'http://localhost:8080',
                    changeOrigin: true,
                    pathRewrite: {
                        '^/api': '/mock'
                    }
                }
            }
        },
        resolve: {
            alias: {
                components: '@/components',
                common: '@/components/Common',
                assets: '@/assets',
                views: '@/views'
            }
        }
    },
    publicPath: process.env.NODE_ENV === 'production'
        ? '/ygo-pie/'
        : '/',
    assetsDir: './'
}
