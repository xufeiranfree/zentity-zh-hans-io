import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  base: '/',
  head: [
    ['meta', { name: 'google-site-verification', content: 'q2k6tX5Cr-G8xLqj8gd6y1d972NEjmmAqC-LTYPdTcs' }],
  ],
  lang: 'zh-CN',
  title: 'zentity 中文文档',
  description: 'Elasticsearch 实体解析',

  theme: defaultTheme({
    logo: 'https://zentity.io/img/zentity-logo-xl.png',

    navbar: ['/'],
  }),

  bundler: viteBundler(),
})
