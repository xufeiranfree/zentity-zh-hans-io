---
title: 强大的名称匹配
pre:
  text: 精确的名称匹配
  link: /docs/basic-usage/exact-name-matching/index.html
next:
  text: 多属性解析
  link: /docs/basic-usage/multiple-attribute-resolution/index.html
---

### 基础用法教程 📖
本教程是帮助您学习和执行 zentity 基本功能的系列教程之一。每篇教程都会在之前教程的基础上增加一些复杂功能，因此您可以从简单的功能开始，逐步学习更高级的功能。
1. [精确的名称匹配](/docs/basic-usage/exact-name-matching/index.html)
2. **强大的名称匹配** ← _你在这里_
3. [多属性解析](/docs/basic-usage/multiple-attribute-resolution/index.html)
4. [多解析器解析](/docs/basic-usage/multiple-resolver-resolution/index.html)
5. [跨索引解析](/docs/basic-usage/cross-index-resolution/index.html)
6. [Scoping Resolution](/docs/basic-usage/scoping-resolution/index.html)

# 强大的名称匹配
本教程是在前一篇“精确名称匹配”基础上增加了些复杂度。你将学习如何将一个属性映射到单个索引中的多个字段。

通过在属性和索引字段之间建立一对多关系，可以将一个属性值与索引中的多个表现形式进行比较。Elasticsearch 允许你创建子字段，对同一个值以不同方式进行索引。例如，你可能希望：使用 keyword 类型索引名称的精确值，使用 text 类型索引名称的全文，或者通过 phonetic analysis 插件 索引其语音编码形式。Elasticsearch 支持对这些字段进行查询，并返回原始值。

你可以借助 zentity 利用这些能力。只需将属性和匹配器映射到这些字段。在提交实体解析任务时，属性值将被与其映射的所有索引字段进行比对。

让我们开始吧。

> **开始之前**
> 
> 要完成本教程，你需要安装 Elasticsearch、Kibana 和 zentity。教程在 zentity-1.6.1-elasticsearch-7.10.1 环境下测试通过。

> **快速开始**

> 你可以使用包含所需软件和数据的 zentity 沙箱，跳过大多数设置步骤。

## 1. 准备工作
### 1.1 安装所需插件
> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

本教程使用了 Elasticsearch 的 [phonetic 分析插件[(https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-phonetic.html)和 [ICU 分析插件](https://www.elastic.co/guide/en/elasticsearch/plugins/current/analysis-icu.html)。在安装前需停止 Elasticsearch，安装插件后再启动服务。

Linux 安装命令： (in the $ES_HOME directory of a .tar.gz installation):
``` sh
sudo bin/elasticsearch-plugin install analysis-phonetic
sudo bin/elasticsearch-plugin install analysis-icu
```
Windows 安装命令： (in the $ES_HOME directory of a .zip installation):
``` sh
bin/elasticsearch-plugin.bat install analysis-phonetic
bin/elasticsearch-plugin.bat install analysis-icu
```
### 1.2 打开 Kibana Console UI
Kibana 控制台 UI 可以方便地向 Elasticsearch 提交请求并查看响应。

### 1.3 删除旧的教程索引
> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

从头开始，删除之前教程创建的任何索引。
``` json
DELETE zentity_tutorial_2_*
```
### 1.4 Create the tutorial index
> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

为当前教程创建索引
``` json
PUT zentity_tutorial_2_robust_name_matching
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 0,
      "analysis" : {
        "filter" : {
          "street_suffix_map" : {
            "pattern" : "(st)",
            "type" : "pattern_replace",
            "replacement" : "street"
          },
          "phonetic" : {
            "type" : "phonetic",
            "encoder" : "nysiis"
          },
          "punct_white" : {
            "pattern" : "\\p{Punct}",
            "type" : "pattern_replace",
            "replacement" : " "
          },
          "remove_non_digits" : {
            "pattern" : "[^\\d]",
            "type" : "pattern_replace",
            "replacement" : ""
          }
        },
        "analyzer" : {
          "name_clean" : {
            "filter" : [
              "icu_normalizer",
              "icu_folding",
              "punct_white"
            ],
            "tokenizer" : "standard"
          },
          "name_phonetic" : {
            "filter" : [
              "icu_normalizer",
              "icu_folding",
              "punct_white",
              "phonetic"
            ],
            "tokenizer" : "standard"
          },
          "street_clean" : {
            "filter" : [
              "icu_normalizer",
              "icu_folding",
              "punct_white",
              "trim"
            ],
            "tokenizer" : "keyword"
          },
          "phone_clean" : {
            "filter" : [
              "remove_non_digits"
            ],
            "tokenizer" : "keyword"
          }
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "keyword"
      },
      "first_name": {
        "type": "text",
        "fields": {
          "clean": {
            "type": "text",
            "analyzer": "name_clean"
          },
          "phonetic": {
            "type": "text",
            "analyzer": "name_phonetic"
          }
        }
      },
      "last_name": {
        "type": "text",
        "fields": {
          "clean": {
            "type": "text",
            "analyzer": "name_clean"
          },
          "phonetic": {
            "type": "text",
            "analyzer": "name_phonetic"
          }
        }
      },
      "street": {
        "type": "text",
        "fields": {
          "clean": {
            "type": "text",
            "analyzer": "street_clean"
          }
        }
      },
      "city": {
        "type": "text",
        "fields": {
          "clean": {
            "type": "text",
            "analyzer": "name_clean"
          }
        }
      },
      "state": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      },
      "phone": {
        "type": "text",
        "fields": {
          "clean": {
            "type": "text",
            "analyzer": "phone_clean"
          }
        }
      },
      "email": {
        "type": "text",
        "fields": {
          "keyword": {
            "type": "keyword"
          }
        }
      }
    }
  }
}
```

请注意，该索引在 `first_name` 和 `last_name` 字段下定义了多个子字段。我们可以对这两个字段查询以下三种形式：

- `first_name` 和 `last_name` 使用的是标准分析器（standard analyzer）。
- `first_name.clean` 和 `last_name.clean` 使用名为 `name_clean` 的自定义分析器。
- `first_name.phonetic` 和 `last_name.phonetic` 使用名为 `name_phonetic` 的自定义分析器。

我们在索引的设置中定义了 `name_clean` 和 `name_phonetic` 这两个分析器。
`name_clean` 使用 `icu_normalizer` 和 `icu_folding` 过滤器，将带有重音符号的 Unicode 字符转换为等效的 ASCII 字符，并统一字符的大小写。
`name_phonetic` 执行相同的处理，然后使用 NYSIIS 语音编码算法将词元（token）转换为其语音表示形式。


> **提示**
> 
> 分析器是提升实体解析准确性的强大工具，但它们也带来一些代价。 第一个代价是性能。当你向 Elasticsearch 提交查询时，分析器会处理输入的值。zentity 在一次实体解析任务中可能提交大量查询，如果你的分析器中使用了正则表达式或其他计算密集型的过滤器，会显著影响任务的整体性能。 第二个代价是灵活性。你无法在不重新索引数据的情况下更改字段所使用的分析器。因此，在生产环境中使用之前，你应该认真设计分析器，并充分测试其效果。

接下来，我们看看这些分析器是如何对相同的值生成不同的词元（tokens）的。

#### `name_clean` 示例

我们的 `name_clean` 分析器使用标准分词器（standard tokenizer），将带有重音符号的字符转换为其对应的 ASCII 字符，并统一字符的大小写。

**请求**
``` json
POST zentity_tutorial_2_robust_name_matching/_analyze
{
  "text": "Alice Jones-Smith",
  "analyzer": "name_clean"
}
```

**响应**
``` json
{
  "tokens": [
    {
      "token": "alice",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "jones",
      "start_offset": 6,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "smith",
      "start_offset": 12,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```

#### `name_phonetic` 示例

我们的 `name_phonetic` 分析器执行与 `name_clean` 分析器相同的处理步骤，然后使用 NYSIIS 算法对每个词元进行语音编码。
注意，词元 "Alice" 会被编码为 "ALAC"，这个编码与一些语音相似的名字（如 "Alicia"）或拼写错误（如 "Allice"）是一样的。

**请求**
``` json
POST zentity_tutorial_2_robust_name_matching/_analyze
{
  "text": "Alice Jones-Smith",
  "analyzer": "name_phonetic"
}
```

**响应**
``` json
{
  "tokens": [
    {
      "token": "ALAC",
      "start_offset": 0,
      "end_offset": 5,
      "type": "<ALPHANUM>",
      "position": 0
    },
    {
      "token": "JAN",
      "start_offset": 6,
      "end_offset": 11,
      "type": "<ALPHANUM>",
      "position": 1
    },
    {
      "token": "SNAT",
      "start_offset": 12,
      "end_offset": 17,
      "type": "<ALPHANUM>",
      "position": 2
    }
  ]
}
```

### 1.5 加载教程数据

> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

将教程数据添加到索引中。

```
POST _bulk?refresh
{"index": {"_id": "1", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "allie@example.net", "first_name": "Allie", "id": "1", "last_name": "Jones", "phone": "202-555-1234", "state": "DC", "street": "123 Main St"}
{"index": {"_id": "2", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "", "first_name": "Alicia", "id": "2", "last_name": "Johnson", "phone": "202-123-4567", "state": "DC", "street": "300 Main St"}
{"index": {"_id": "3", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "", "first_name": "Allie", "id": "3", "last_name": "Jones", "phone": "", "state": "DC", "street": "123 Main St"}
{"index": {"_id": "4", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "", "email": "", "first_name": "Ally", "id": "4", "last_name": "Joans", "phone": "202-555-1234", "state": "", "street": ""}
{"index": {"_id": "5", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Arlington", "email": "ej@example.net", "first_name": "Eli", "id": "5", "last_name": "Jonas", "phone": "", "state": "VA", "street": "500 23rd Street"}
{"index": {"_id": "6", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "allie@example.net", "first_name": "Allison", "id": "6", "last_name": "Jones", "phone": "202-555-1234", "state": "DC", "street": "123 Main St"}
{"index": {"_id": "7", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "", "first_name": "Allison", "id": "7", "last_name": "Smith", "phone": "+1 (202) 555 1234", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "8", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "alan.smith@example.net", "first_name": "Alan", "id": "8", "last_name": "Smith", "phone": "202-000-5555", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "9", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "alan.smith@example.net", "first_name": "Alan", "id": "9", "last_name": "Smith", "phone": "2020005555", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "10", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "", "first_name": "Alison", "id": "10", "last_name": "Smith", "phone": "202-555-9876", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "11", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "", "email": "allie@example.net", "first_name": "Alison", "id": "11", "last_name": "Jones-Smith", "phone": "2025559867", "state": "", "street": ""}
{"index": {"_id": "12", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Washington", "email": "allison.j.smith@corp.example.net", "first_name": "Allison", "id": "12", "last_name": "Jones-Smith", "phone": "", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "13", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Arlington", "email": "allison.j.smith@corp.example.net", "first_name": "Allison", "id": "13", "last_name": "Jones Smith", "phone": "703-555-5555", "state": "VA", "street": "1 Corporate Way"}
{"index": {"_id": "14", "_index": "zentity_tutorial_2_robust_name_matching"}}
{"city": "Arlington", "email": "elise.jonas@corp.example.net", "first_name": "Elise", "id": "14", "last_name": "Jonas", "phone": "703-555-5555", "state": "VA", "street": "1 Corporate Way"}
```
以下是教程数据的示意表：

| id  | first_name | last_name       | street           | city        | state | phone          | email                         |
|-----|------------|-----------------|------------------|-------------|-------|----------------|-------------------------------|
| 1   | Allie      | Jones           | 123 Main St      | Washington  | DC    | 202-555-1234   | allie@example.net             |
| 2   | Alicia     | Johnson         | 300 Main St      | Washington  | DC    | 202-123-4567   |                               |
| 3   | Allie      | Jones           | 123 Main St      | Washington  | DC    |                |                               |
| 4   | Ally       | Joans           |                  |             |       | 202-555-1234   |                               |
| 5   | Eli        | Jonas           | 500 23rd Street  | Arlington   | VA    |                | ej@example.net                |
| 6   | Allison    | Jones           | 123 Main St      | Washington  | DC    | 202-555-1234   | allie@example.net             |
| 7   | Allison    | Smith           | 555 Broad St     | Washington  | DC    | +1 (202) 555 1234 |                               |
| 8   | Alan       | Smith           | 555 Broad St     | Washington  | DC    | 202-000-5555   | alan.smith@example.net        |
| 9   | Alan       | Smith           | 555 Broad St     | Washington  | DC    | 2020005555     | alan.smith@example.net        |
| 10  | Alison     | Smith           | 555 Broad St     | Washington  | DC    | 202-555-9876   |                               |
| 11  | Alison     | Jones-Smith     |                  |             |       | 2025559867     | allie@example.net             |
| 12  | Allison    | Jones-Smith     | 555 Broad St     | Washington  | DC    |                | allison.j.smith@corp.example.net |
| 13  | Allison    | Jones Smith     | 1 Corporate Way  | Arlington   | VA    | 703-555-5555   | allison.j.smith@corp.example.net |
| 14  | Elise      | Jonas           | 1 Corporate Way  | Arlington   | VA    | 703-555-5555   | elise.jonas@corp.example.net   |

## 2. 创建实体模型

> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

我们将使用 Models API 创建如下的实体模型。接下来我们会逐部分详细讲解该模型的结构。

**请求**
``` json
PUT _zentity/models/zentity_tutorial_2_person
{
  "attributes": {
    "first_name": {
      "type": "string"
    },
    "last_name": {
      "type": "string"
    }
  },
  "resolvers": {
    "name_only": {
      "attributes": [ "first_name", "last_name" ]
    }
  },
  "matchers": {
    "simple": {
      "clause": {
        "match": {
          "{{ field }}": "{{ value }}"
        }
      }
    },
    "fuzzy": {
      "clause": {
        "match": {
          "{{ field }}": {
            "query": "{{ value }}",
            "fuzziness": "1"
          }
        }
      }
    }
  },
  "indices": {
    "zentity_tutorial_2_robust_name_matching": {
      "fields": {
        "first_name.clean": {
          "attribute": "first_name",
          "matcher": "fuzzy"
        },
        "first_name.phonetic": {
          "attribute": "first_name",
          "matcher": "simple"
        },
        "last_name.clean": {
          "attribute": "last_name",
          "matcher": "fuzzy"
        },
        "last_name.phonetic": {
          "attribute": "last_name",
          "matcher": "simple"
        }
      }
    }
  }
}
```

**响应**
``` json
{
  "_index" : ".zentity-models",
  "_id" : "zentity_tutorial_2_person",
  "_version" : 1,
  "result" : "created",
  "_shards" : {
    "total" : 2,
    "successful" : 1,
    "failed" : 0
  },
  "_seq_no" : 1,
  "_primary_term" : 1
}
```

### 2.1 查看属性定义

我们定义了两个属性，分别是 `"first_name"` 和 `"last_name"`，如下所示：

``` json
{
  "attributes": {
    "first_name": {
      "type": "string"
    },
    "last_name": {
      "type": "string"
    }
  }
}
```

这与“精确名称匹配”教程中的实体模型中的 `"attributes"` 字段完全相同。

### 2.2 查看解析器（resolvers）

我们定义了一个名为 `"name_only"` 的解析器，具体如下所示：

``` json
{
  "resolvers": {
    "name_only": {
      "attributes": [ "first_name", "last_name" ]
    }
  }
}
```

这与“精确名称匹配”教程中的实体模型中的 `"resolvers"` 字段也是完全相同的。

> **提示**
>
> 大多数解析器应当使用多个属性来解析实体，以尽量减少误报。很多人可能同名，但很少有人拥有相同的姓名和地址。你应该考虑哪些属性组合能够高置信度地标识一个实体，并为每种组合定义一个解析器。后续的教程将介绍如何使用包含多个属性的解析器。

### 2.3 查看匹配器（matchers）

我们定义了两个匹配器，分别名为 `"simple"` 和 `"fuzzy"`，如下所示：

``` json
{
  "matchers": {
    "simple": {
      "clause": {
        "match": {
          "{{ field }}": "{{ value }}"
        }
      }
    },
    "fuzzy": {
      "clause": {
        "match": {
          "{{ field }}": {
            "query": "{{ value }}",
            "fuzziness": "1"
          }
        }
      }
    }
  }
}
```

`"simple"` 匹配器使用了一个简单的 `match` 子句，如下所示：

``` json
{
  "match": {
    "{{ field }}": "{{ value }}"
  }
}
```

`"fuzzy"` 匹配器使用带有 `fuzziness` 参数的 `match` 子句，它可以匹配存在轻微差异（如拼写错误）的值。Elasticsearch 使用 **Damerau-Levenshtein 编辑距离** 算法来执行这种模糊匹配。

``` json
{
  "match": {
    "{{ field }}": {
      "query": "{{ value }}"
      "fuzziness": "1"
    }
  }
}
```

`"{{ field }}"` 和 `"{{ value }}"` 是特殊变量。每个匹配器的 `"clause"` 字段中都应包含这两个变量。zentity 会将 `"{{ field }}"` 替换为索引字段名，将 `"{{ value }}"` 替换为属性值。

### 2.4 查看索引定义

我们定义了一个索引，如下所示：

``` json
{
  "indices": {
    "zentity_tutorial_2_robust_name_matching": {
      "fields": {
        "first_name.clean": {
          "attribute": "first_name",
          "matcher": "fuzzy"
        },
        "first_name.phonetic": {
          "attribute": "first_name",
          "matcher": "simple"
        },
        "last_name.clean": {
          "attribute": "last_name",
          "matcher": "fuzzy"
        },
        "last_name.phonetic": {
          "attribute": "last_name",
          "matcher": "simple"
        }
      }
    }
  }
}
```

## 3. 解析实体
### 3.1 运行基本的解析任务
我们将使用 Resolution API 来解析一个已知名字和姓氏的人员实体。

**请求**
``` json
POST _zentity/resolution/zentity_tutorial_2_person?pretty&_source=false
{
  "attributes": {
    "first_name": [ "Allie" ],
    "last_name": [ "Jones" ]
  }
}
```

**响应**
``` json
{
  "took" : 10,
  "hits" : {
    "total" : 3,
    "hits" : [ {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "1",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Allie" ],
        "last_name" : [ "Jones" ]
      }
    }, {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "3",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Allie" ],
        "last_name" : [ "Jones" ]
      }
    }, {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "4",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Ally" ],
        "last_name" : [ "Joans" ]
      }
    } ]
  }
}
```

正如预期，我们检索到了三个文档，它们的名字是 "Allie"，姓氏是 "Jones"。这些匹配包括了精确匹配、语音匹配，甚至是顺序变换的匹配。结果中还包括一个名字为 "Ally"，姓氏为 "Joans" 的文档，它也符合匹配条件。所有文档都来自同一个索引、同一个查询和同一个跳数，这些信息可以在 `_index`、`_hop` 和 `_query` 字段中看到。

### 3.2 显示 `_source` 字段

我们可以查看 Elasticsearch 中每个文档的原始值。

现在我们重新运行解析任务，并包含每个文档的 `_source` 字段。`_source` 字段是存储在 Elasticsearch 索引中的原始 JSON 文档。

**请求**
``` json
POST _zentity/resolution/zentity_tutorial_2_person?pretty&_source=true
{
  "attributes": {
    "first_name": [ "Allie" ],
    "last_name": [ "Jones" ]
  }
}
```

**响应**
``` json
{
  "took" : 9,
  "hits" : {
    "total" : 3,
    "hits" : [ {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "1",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Allie" ],
        "last_name" : [ "Jones" ]
      },
      "_source" : {
        "city" : "Washington",
        "email" : "allie@example.net",
        "first_name" : "Allie",
        "id" : "1",
        "last_name" : "Jones",
        "phone" : "202-555-1234",
        "state" : "DC",
        "street" : "123 Main St"
      }
    }, {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "3",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Allie" ],
        "last_name" : [ "Jones" ]
      },
      "_source" : {
        "city" : "Washington",
        "email" : "",
        "first_name" : "Allie",
        "id" : "3",
        "last_name" : "Jones",
        "phone" : "",
        "state" : "DC",
        "street" : "123 Main St"
      }
    }, {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "4",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Ally" ],
        "last_name" : [ "Joans" ]
      },
      "_source" : {
        "city" : "",
        "email" : "",
        "first_name" : "Ally",
        "id" : "4",
        "last_name" : "Joans",
        "phone" : "202-555-1234",
        "state" : "",
        "street" : ""
      }
    } ]
  }
}
```

现在，除了映射到标准化 `_attributes` 的值之外，我们还可以查看这些属性的原始值，以及文档中所有其他字段在 `_source` 中的实际存储内容。

### 3.3 显示 `_explanation` 字段

我们还可以了解这些文档是如何匹配成功的。

让我们再次运行解析任务，并这次加入 `_explanation` 字段，以准确了解每个文档为何被匹配上。
`_explanation` 字段会告诉我们是哪些解析器（resolvers）导致了匹配发生，更具体地，还会指出是哪个输入值通过哪个 matcher 与哪个索引字段中的哪个值匹配的，以及使用了哪些匹配参数。

**请求**
``` json
POST _zentity/resolution/zentity_tutorial_2_person?pretty&_source=true&_explanation=true
{
  "attributes": {
    "first_name": [ "Allie" ],
    "last_name": [ "Jones" ]
  }
}
```

**响应**
``` json
{
  "took" : 12,
  "hits" : {
    "total" : 3,
    "hits" : [ {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "1",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Allie" ],
        "last_name" : [ "Jones" ]
      },
      "_explanation" : {
        "resolvers" : {
          "name_only" : {
            "attributes" : [ "first_name", "last_name" ]
          }
        },
        "matches" : [ {
          "attribute" : "first_name",
          "target_field" : "first_name.clean",
          "target_value" : "Allie",
          "input_value" : "Allie",
          "input_matcher" : "fuzzy",
          "input_matcher_params" : { }
        }, {
          "attribute" : "first_name",
          "target_field" : "first_name.phonetic",
          "target_value" : "Allie",
          "input_value" : "Allie",
          "input_matcher" : "simple",
          "input_matcher_params" : { }
        }, {
          "attribute" : "last_name",
          "target_field" : "last_name.clean",
          "target_value" : "Jones",
          "input_value" : "Jones",
          "input_matcher" : "fuzzy",
          "input_matcher_params" : { }
        }, {
          "attribute" : "last_name",
          "target_field" : "last_name.phonetic",
          "target_value" : "Jones",
          "input_value" : "Jones",
          "input_matcher" : "simple",
          "input_matcher_params" : { }
        } ]
      },
      "_source" : {
        "city" : "Washington",
        "email" : "allie@example.net",
        "first_name" : "Allie",
        "id" : "1",
        "last_name" : "Jones",
        "phone" : "202-555-1234",
        "state" : "DC",
        "street" : "123 Main St"
      }
    }, {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "3",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Allie" ],
        "last_name" : [ "Jones" ]
      },
      "_explanation" : {
        "resolvers" : {
          "name_only" : {
            "attributes" : [ "first_name", "last_name" ]
          }
        },
        "matches" : [ {
          "attribute" : "first_name",
          "target_field" : "first_name.clean",
          "target_value" : "Allie",
          "input_value" : "Allie",
          "input_matcher" : "fuzzy",
          "input_matcher_params" : { }
        }, {
          "attribute" : "first_name",
          "target_field" : "first_name.phonetic",
          "target_value" : "Allie",
          "input_value" : "Allie",
          "input_matcher" : "simple",
          "input_matcher_params" : { }
        }, {
          "attribute" : "last_name",
          "target_field" : "last_name.clean",
          "target_value" : "Jones",
          "input_value" : "Jones",
          "input_matcher" : "fuzzy",
          "input_matcher_params" : { }
        }, {
          "attribute" : "last_name",
          "target_field" : "last_name.phonetic",
          "target_value" : "Jones",
          "input_value" : "Jones",
          "input_matcher" : "simple",
          "input_matcher_params" : { }
        } ]
      },
      "_source" : {
        "city" : "Washington",
        "email" : "",
        "first_name" : "Allie",
        "id" : "3",
        "last_name" : "Jones",
        "phone" : "",
        "state" : "DC",
        "street" : "123 Main St"
      }
    }, {
      "_index" : "zentity_tutorial_2_robust_name_matching",
      "_id" : "4",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Ally" ],
        "last_name" : [ "Joans" ]
      },
      "_explanation" : {
        "resolvers" : {
          "name_only" : {
            "attributes" : [ "first_name", "last_name" ]
          }
        },
        "matches" : [ {
          "attribute" : "first_name",
          "target_field" : "first_name.phonetic",
          "target_value" : "Ally",
          "input_value" : "Allie",
          "input_matcher" : "simple",
          "input_matcher_params" : { }
        }, {
          "attribute" : "last_name",
          "target_field" : "last_name.phonetic",
          "target_value" : "Joans",
          "input_value" : "Jones",
          "input_matcher" : "simple",
          "input_matcher_params" : { }
        } ]
      },
      "_source" : {
        "city" : "",
        "email" : "",
        "first_name" : "Ally",
        "id" : "4",
        "last_name" : "Joans",
        "phone" : "202-555-1234",
        "state" : "",
        "street" : ""
      }
    } ]
  }
}
```

每个文档之所以被匹配上，是因为使用了 `"name_only"` 解析器，这一点可以在 `_explanation.resolvers` 字段中看到。而其中两个文档的属性分别通过两种不同的方式进行了匹配，这些信息可以在 `_explanation.matches` 字段中找到。

我们来看几个匹配示例：

``` json
"_explanation": {
  ...
  "matches" : [
    {
      "attribute" : "first_name",
      "target_field" : "first_name.clean",
      "target_value" : "Allie",
      "input_value" : "Allie",
      "input_matcher" : "fuzzy",
      "input_matcher_params" : { }
    },{
      "attribute" : "first_name",
      "target_field" : "first_name.phonetic",
      "target_value" : "Allie",
      "input_value" : "Allie",
      "input_matcher" : "simple",
      "input_matcher_params" : { }
    },
    ...
  ]
}
```
These two matches tell us that the "first_name" attribute was discovered at two index fields called "first_name.clean" and "first_name.phonetic". We can see that both fields had a value of "Allie" that matched a prior known attribute value of "Allie" using the "fuzzy" and "simple" matchers that we defined in our entity model. In other words, there were multiple reasons for the match.
```
"_explanation": {
  ...
  "matches" : [
    {
      "attribute" : "last_name",
      "target_field" : "last_name.phonetic",
      "target_value" : "Joans",
      "input_value" : "Jones",
      "input_matcher" : "simple",
      "input_matcher_params" : { }
    }
    ...
  ]
}
```

这个匹配结果比之前“精确名称匹配”的教程更有趣。这一次，`"target_value"`（"Joans"）和 `"input_value"`（"Jones"）是不同的值，但它们仍然被视为匹配项，因为字段 `"last_name.phonetic"` 中的文本值是以语音编码的形式存储的，它与输入值的语音编码形式相匹配。

> **提示**
>
> 请注意，`_explanation.matches` 中的 `"target_value"` 表示的是**文本分析之前的原始值**。在这个例子中，字段 `"last_name.phonetic"` 是一个启用了语音分析的文本字段。因此，真正的匹配是发生在 `"target_value"` 和 `"input_value"` 经分析器处理之后生成的词元之间的。

``` json
POST zentity_tutorial_2_robust_name_matching/_analyze
{
  "text": "Jones",
  "analyzer": "name_phonetic"
}
```
``` json
POST zentity_tutorial_2_robust_name_matching/_analyze
{
  "text": "Joans",
  "analyzer": "name_phonetic"
}
```

我们在索引设置中定义的 `name_phonetic` 分析器，会将 "Jones" 和 "Joans" 都转换为词元 `"JAN"`，因此它们可以成功匹配。

# 总结

恭喜你！你已经学会了如何将一个属性映射到同一索引中的多个字段。你还了解了如何通过模糊匹配、语音分析器和 ICU 分析器来实现更强大的名称匹配。

但仅仅进行名称匹配还不够，对吧？很多人都有相同的名字。那么，我们如何进一步提升匹配的准确性呢？

下一个教程将介绍**多属性解析**。你将学习如何使用多个属性，并将它们映射到同一索引的多个字段来解析一个实体。
