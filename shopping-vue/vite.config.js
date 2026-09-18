import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// 使用相对路径 base，便于直接双击打开构建产物（file://）或通过任意子路径部署
export default defineConfig({
  plugins: [vue()],
  base: './',
  server: {
    open: true,
    port: 5173
  }
})
