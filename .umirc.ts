import { defineConfig } from 'umi';


export default defineConfig({
  // dynamicImport: {},
  // styleLoader:{},
  antd: false,
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    { path: '/', component: '@/pages/index' },
  ],
  proxy: {
    '/api': {
      target: 'https://bedrock.netease.com:8010',
      secure: true,
      changeOrigin: true,
    },
    '/image': {
      target: 'https://bedrock.netease.com:8010',
      changeOrigin: true,
      secure: true,
    },
  },
  fastRefresh: {},
  chainWebpack(config) {
    // config.plugin("extract-css").use(require('mini-css-extract-plugin'),[{
    //   filename: '[name].css',
    //   ignoreOrder: false,
    //   chunkFilename: '[name].chunk.css'
    // }])
    // console.dir(config.toConfig(),{depth: 12})
    config.module
      .rule('mjs')
      .test(/\.mjs$/)
      .include.add(/node_modules/).end()
      .type('javascript/auto');
    return config;
  },
});
