import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress/cli'
import { viteBundler } from '@vuepress/bundler-vite'

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',

  title: 'zentity',
  description: 'Elasticsearch 实体解析',

  theme: defaultTheme({
    logo: 'https://zentity.io/img/zentity-logo-xl.png',

    navbar: ['/'],
  }),

  bundler: viteBundler(),
})
