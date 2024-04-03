// https://vitejs.dev/config/
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
//引入svg需要用到的插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from 'unplugin-vue-components/resolvers'
//mock插件提供方法
// import { viteMockServe } from 'vite-plugin-mock'
export default defineConfig(({ command }) => {
  return {
    server: {
      proxy: {
        '/api': {
        //   target: 'http://121.43.61.179:8080/',
          target: 'http://localhost:8080/',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    plugins: [
      vue(),
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue'],
        // 生成自动导入的TS声明文件
        dts: './auto-import.d.ts',
      }),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // viteMockServe({
      //   localEnabled: command === 'serve', //保证开发阶段可以使用mock接口
      // }),
      Components({
        resolvers: [PrimeVueResolver()],
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'), //相对路径别名配置,使用@代替src
      },
    },
    //scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          javascriptEnabled: true,
          additionalData: '@import "./src/styles/variable.scss";',
        },
      },
    },
  }
})
