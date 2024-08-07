---
home: true
title: Home
heroImage: https://zentity.io/img/zentity-logo-xl.png
actions:
  - text: 文档
    link: /docs/index.html
    type: primary

  - text: 版本
    link: /版本.html
    type: secondary

  - text: 沙箱
    link: https://zentity.io/sandbox/
    type: secondary

  - text: Github
    link: https://github.com/zentity-io/zentity
    type: secondary
footerHtml: true
footer: <div class="footer">&copy; 2024 - Now XU Feiran. <br />Translated from <a href="https://github.com/davemoore-" target="_blank">Dave Moore</a>'s <a href="https://www.zentity.io" target="_blank"zentity.io<a>zentity.io</a><br />Licensed under the <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache License, Version 2.0</a><br />Elasticsearch is a trademark of Elasticsearch BV.</div>
---

# 禅式实体解析
zentity 是用于实时实体解析的 [Elasticsearch](https://www.elastic.co/elasticsearch) 插件。 它的目标是:

- 简单 - 实体解析很难，而 zentity 让它变得简单。
- 快速 - 以交互式速度获取结果，毫秒到几秒内。
- 通用 - 解析任意事物，人员、公司、地点、会议等等。
- 传递性 - 通过多次跳跃进行解析，递归找到动态标识。
- 多源 - 通过多个具有不同映射的索引进行解析。
- 包容性 - 按照数据现有的状态进行操作，不改变或重新索引数据。
- 逻辑 - 逻辑比统计更容易阅读、排除故障和优化。
- 100% Elasticsearch - Elasticsearch 是实体解析的重要基础。

# 下载最新版本

## zentity-1.8.3

选择与您的 Elasticsearch 版本相匹配的插件版本：

- [Elasticsearch 8.14.0](https://zentity.io/releases/zentity-1.8.3-elasticsearch-8.14.0.zip)
- [Elasticsearch 8.13.4](https://zentity.io/releases/zentity-1.8.3-elasticsearch-8.13.4.zip)
- [Elasticsearch 8.13.3](https://zentity.io/releases/zentity-1.8.3-elasticsearch-8.13.3.zip)
- [Elasticsearch 8.13.2](https://zentity.io/releases/zentity-1.8.3-elasticsearch-8.13.2.zip)
- [Elasticsearch 8.13.1](https://zentity.io/releases/zentity-1.8.3-elasticsearch-8.13.1.zip)
- [Elasticsearch 8.13.0](https://zentity.io/releases/zentity-1.8.3-elasticsearch-8.13.0.zip)

# 快速开始
安装 Elasticsearch 后，可以通过远程 URL 或本地文件安装 zentity。

1. 浏览[版本](/版本.html)。
2. 查找与您的 Elasticsearch 版本相匹配的版本。复制 .zip 文件的名称。
3. 使用 Elasticsearch 附带的```elasticsearch-plugin```脚本安装插件。

例如:

```elasticsearch-plugin install https://zentity.io/releases/zentity-1.8.3-elasticsearch-8.14.0.zip```

详情请阅读[安装](/安装.html)文档。

# 下一步
阅读[文档](/docs/index.html)，了解[实体模型](实体模型.html)、如何[管理实体模型](/管理实体模型.html)以及如何[解析实体](/解析实体.html)。