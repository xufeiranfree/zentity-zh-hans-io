---
title: 精确的名称匹配
pre:
  text: 基础用法
  link: /docs/basic-usage/index.html
next:
  text: 强大的名称匹配
  link: /docs/basic-usage/robust-name-matching/index.html
---

### 基础用法教程 📖
本教程是帮助您学习和执行 zentity 基本功能的系列教程之一。每篇教程都会在之前教程的基础上增加一些复杂功能，因此您可以从简单的功能开始，逐步学习更高级的功能。
1. **精确的名称匹配** ← _你在这里_
2. [强大的名称匹配](/docs/basic-usage/robust-name-matching/index.html)
3. [多属性解析](/docs/basic-usage/multiple-attribute-resolution/index.html)
4. [多解析器解析](/docs/basic-usage/multiple-resolver-resolution/index.html)
5. [跨索引解析](/docs/basic-usage/cross-index-resolution/index.html)
6. [Scoping Resolution](/docs/basic-usage/scoping-resolution/index.html)

# 精确的名称匹配
欢迎来到实体解析的“Hello world!”

本教程将指导您了解实体解析的一种最简单形式——精确的名称匹配。您将学习如何创建实体模型，以及如何使用映射到**单索引——单字段**的**单个 attribute** 来解析实体。本教程旨在向您介绍使用 zentity 进行实体解析的最基本功能。

让我们一探究竟。

> **开始之前**
> 
> 您必须安装 [Elasticsearch](https://www.elastic.co/downloads/elasticsearch)、[Kibana](https://www.elastic.co/downloads/kibana) 和 [zentity](/docs/installation/index.html) 才能完成本教程。本教程使用 [zentity-1.6.1-elasticsearch-7.10.1](https://zentity.io/releases#zentity-1.6.1) 进行测试。
> 
> **快速上手**
> 
> 您可以使用 [zentity 沙盒](https://zentity.io/sandbox)，其中包含这些教程所需的软件和数据。这样可以跳过许多设置步骤。

## 1. 准备
### 1.1 打开 Kibana Console 界面
通过 [Kibana Console 界面](https://www.elastic.co/guide/en/kibana/current/console-kibana.html)，可以轻松向 Elasticsearch 提交请求并读取响应。

### 1.2 删除所有旧教程使用的索引
> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

让我们从头开始，删除所有从其他教程中创建的索引。
``` json
DELETE zentity_tutorial_1_*
```

### 1.3 创建教程索引
> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

现在为本教程创建索引。
``` json
PUT zentity_tutorial_1_exact_name_matching
{
  "settings": {
    "index": {
      "number_of_shards": 1,
      "number_of_replicas": 0
    }
  },
  "mappings": {
    "properties": {
      "id": {
        "type": "keyword"
      },
      "first_name": {
        "type": "text"
      },
      "last_name": {
        "type": "text"
      },
      "street": {
        "type": "text"
      },
      "city": {
        "type": "text"
      },
      "state": {
        "type": "text"
      },
      "phone": {
        "type": "text"
      },
      "email": {
        "type": "text"
      }
    }
  }
}
```

### 1.4 加载教程数据
> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

将教程数据添加到索引中。
``` json
POST _bulk?refresh
{"index": {"_id": "1", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "allie@example.net", "first_name": "Allie", "id": "1", "last_name": "Jones", "phone": "202-555-1234", "state": "DC", "street": "123 Main St"}
{"index": {"_id": "2", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "", "first_name": "Alicia", "id": "2", "last_name": "Johnson", "phone": "202-123-4567", "state": "DC", "street": "300 Main St"}
{"index": {"_id": "3", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "", "first_name": "Allie", "id": "3", "last_name": "Jones", "phone": "", "state": "DC", "street": "123 Main St"}
{"index": {"_id": "4", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "", "email": "", "first_name": "Ally", "id": "4", "last_name": "Joans", "phone": "202-555-1234", "state": "", "street": ""}
{"index": {"_id": "5", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Arlington", "email": "ej@example.net", "first_name": "Eli", "id": "5", "last_name": "Jonas", "phone": "", "state": "VA", "street": "500 23rd Street"}
{"index": {"_id": "6", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "allie@example.net", "first_name": "Allison", "id": "6", "last_name": "Jones", "phone": "202-555-1234", "state": "DC", "street": "123 Main St"}
{"index": {"_id": "7", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "", "first_name": "Allison", "id": "7", "last_name": "Smith", "phone": "+1 (202) 555 1234", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "8", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "alan.smith@example.net", "first_name": "Alan", "id": "8", "last_name": "Smith", "phone": "202-000-5555", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "9", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "alan.smith@example.net", "first_name": "Alan", "id": "9", "last_name": "Smith", "phone": "2020005555", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "10", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "", "first_name": "Alison", "id": "10", "last_name": "Smith", "phone": "202-555-9876", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "11", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "", "email": "allie@example.net", "first_name": "Alison", "id": "11", "last_name": "Jones-Smith", "phone": "2025559867", "state": "", "street": ""}
{"index": {"_id": "12", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Washington", "email": "allison.j.smith@corp.example.net", "first_name": "Allison", "id": "12", "last_name": "Jones-Smith", "phone": "", "state": "DC", "street": "555 Broad St"}
{"index": {"_id": "13", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Arlington", "email": "allison.j.smith@corp.example.net", "first_name": "Allison", "id": "13", "last_name": "Jones Smith", "phone": "703-555-5555", "state": "VA", "street": "1 Corporate Way"}
{"index": {"_id": "14", "_index": "zentity_tutorial_1_exact_name_matching"}}
{"city": "Arlington", "email": "elise.jonas@corp.example.net", "first_name": "Elise", "id": "14", "last_name": "Jonas", "phone": "703-555-5555", "state": "VA", "street": "1 Corporate Way"}
```

下面是教程数据的样子。
| id  | first_name | last_name       | street            | city        | state | phone            | email                             |
|-----|------------|-----------------|-------------------|-------------|-------|------------------|-----------------------------------|
| 1   | Allie      | Jones           | 123 Main St       | Washington  | DC    | 202-555-1234     | allie@example.net                 |
| 2   | Alicia     | Johnson         | 300 Main St       | Washington  | DC    | 202-123-4567     |                                   |
| 3   | Allie      | Jones           | 123 Main St       | Washington  | DC    |                  |                                   |
| 4   | Ally       | Joans           |                   |             |       | 202-555-1234     |                                   |
| 5   | Eli        | Jonas           | 500 23rd Street   | Arlington   | VA    |                  | ej@example.net                    |
| 6   | Allison    | Jones           | 123 Main St       | Washington  | DC    | 202-555-1234     | allie@example.net                 |
| 7   | Allison    | Smith           | 555 Broad St      | Washington  | DC    | +1 (202) 555 1234|                                   |
| 8   | Alan       | Smith           | 555 Broad St      | Washington  | DC    | 202-000-5555     | alan.smith@example.net            |
| 9   | Alan       | Smith           | 555 Broad St      | Washington  | DC    | 2020005555       | alan.smith@example.net            |
| 10  | Alison     | Smith           | 555 Broad St      | Washington  | DC    | 202-555-9876     |                                   |
| 11  | Alison     | Jones-Smith     |                   |             |       | 2025559867       | allie@example.net                 |
| 12  | Allison    | Jones-Smith     | 555 Broad St      | Washington  | DC    |                  | allison.j.smith@corp.example.net  |
| 13  | Allison    | Jones Smith     | 1 Corporate Way   | Arlington   | VA    | 703-555-5555     | allison.j.smith@corp.example.net  |
| 14  | Elise      | Jonas           | 1 Corporate Way   | Arlington   | VA    | 703-555-5555     | elise.jonas@corp.example.net      |

## 2. 创建实体模型
> **注意：** 如果您使用的是 [zentity 沙盒](https://zentity.io/sandbox)，请跳过这一步。

让我们使用[模型 API](https://zentity.io/docs/rest-apis/models-api)创建下面的实体模型，我们将深入查看模型的每个部分。

**请求**
``` json
PUT _zentity/models/zentity_tutorial_1_person
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
    }
  },
  "indices": {
    "zentity_tutorial_1_exact_name_matching": {
      "fields": {
        "first_name": {
          "attribute": "first_name",
          "matcher": "simple"
        },
        "last_name": {
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
  "_id" : "zentity_tutorial_1_person",
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

### 2.1 查看属性
如本节所示，我们定义了名为`first_name`和`last_name`的两个属性：

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

任何属性的默认类型都是`字符串`，您可以像这样忽略`类型`，以简化实体模型：
``` json
{
  "attributes": {
    "first_name": {},
    "last_name": {}
  }
}
```

### 2.2 查看解析器
如本节所示，我们定义了一个名为`name_only`的解析器：

``` json
{
  "resolvers": {
    "name_only": {
      "attributes": [ "first_name", "last_name" ]
    }
  }
}
```

该解析器只需要`first_name`和`last_name`属性即可解析实体。因此，如果您尝试解析一个名为“Alice”的人，那么所有名称为“Alice”的文档都将与她归为一组。显然，这在现实世界中会产生很多误报。我们这样做是为了简单地介绍实体解析的概念。

> 提示
> 
> 大多数解析器应使用多个属性来解析一个实体，以尽量减少误报。可能有很多人重名，但很少有人名字和地址都一样。考虑所有能够可靠解析实体的属性组合，然后为每种组合创建一个解析器。[其他教程](https://zentity.io/docs/basic-usage)将探讨如何使用具有多个属性的解析器。

### 2.3 查看匹配器
如本节所示，我们定义了一个名为`simple`的匹配器：

```json
{
  "matchers": {
    "simple": {
      "clause": {
        "match": {
          "{{ field }}": "{{ value }}"
        }
      }
    }
  }
}
```

该匹配器使用一个简单的[匹配](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-match-query.html)子句：

``` json
{
  "match": {
    "{{ field }}": "{{ value }}"
  }
}
```

'{{ field }}' 和 '{{ value }}' 字符串是特殊变量，zentity 会用索引字段的名称替换'{{ field }}'变量，用属性值替换'{{ value }}'变量。

### 2.4 查看索引

如本节所示，我们定义了一个索引：

``` json
{
  "indices": {
    "zentity_tutorial_1_exact_name_matching": {
      "fields": {
        "first_name": {
          "attribute": "first_name",
          "matcher": "simple"
        },
        "last_name": {
          "attribute": "last_name",
          "matcher": "simple"
        }
      }
    }
  }
}
```

## 3. 查看实体
### 3.1 运行一个基础的解析任务
让我们使用[解析 API](https://zentity.io/docs/rest-apis/resolution-api) 来解析一个已知名字和姓氏的人。

**请求**
``` json
POST _zentity/resolution/zentity_tutorial_1_person?pretty&_source=false
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
  "took" : 3,
  "hits" : {
    "total" : 2,
    "hits" : [ {
      "_index" : "zentity_tutorial_1_exact_name_matching",
      "_id" : "1",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Allie" ],
        "last_name" : [ "Jones" ]
      }
    }, {
      "_index" : "zentity_tutorial_1_exact_name_matching",
      "_id" : "3",
      "_hop" : 0,
      "_query" : 0,
      "_attributes" : {
        "first_name" : [ "Allie" ],
        "last_name" : [ "Jones" ]
      }
    } ]
  }
}
```

正如预期的那样，我们检索到两份文档，其名字精确匹配“Allie”，姓氏精确匹配“Jones”。如'_index'、'_hop'和'_query'字段所示，这两个文档都来自同一跳转的同一查询的同一索引。由于我们要求这两个字段精确匹配，因此所有其他文档，包括与这些文档相似的文档，都被排除在结果之外。

### 3.2 展示`_source`
我们可以获取 Elasticsearch 中文档的原始值。

让我们再次运行任务，将每个文档的 [_source](https://zentity.io/docs/entity-resolution/output-specification/#hits.hits._source) 字段也包含进来，其中 [_source](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping-source-field.html) 字段是存储在 Elasticsearch 索引中的原始 JSON 文档。

**请求**
``` json
POST _zentity/resolution/zentity_tutorial_1_person?pretty&_source=true
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
  "took" : 4,
  "hits" : {
    "total" : 2,
    "hits" : [ {
      "_index" : "zentity_tutorial_1_exact_name_matching",
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
      "_index" : "zentity_tutorial_1_exact_name_matching",
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
    } ]
  }
}
```

现在，除了映射到规范化的`_attributes`的值之外，我们还可以在文档的`_source`中看到每个其他字段的值。

### 3.3 展示`_explanation`
我们还可以了解文件是如何匹配的。

让我们再次运行任务，现在让我们加入 [_explanation](https://zentity.io/docs/entity-resolution/output-specification/#hits.hits._explanation) 字段，看看每个文档匹配的确切原因。`_explanation`字段告诉我们是哪个解析器导致了文档的匹配，更具体地说，是哪个输入值通过哪个匹配器和参数匹配了哪个索引中的值。

**请求**
``` json
POST _zentity/resolution/zentity_tutorial_1_person?pretty&_source=true&_explanation=true
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
  "took" : 4,
  "hits" : {
    "total" : 2,
    "hits" : [ {
      "_index" : "zentity_tutorial_1_exact_name_matching",
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
          "target_field" : "first_name",
          "target_value" : "Allie",
          "input_value" : "Allie",
          "input_matcher" : "simple",
          "input_matcher_params" : { }
        }, {
          "attribute" : "last_name",
          "target_field" : "last_name",
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
      "_index" : "zentity_tutorial_1_exact_name_matching",
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
          "target_field" : "first_name",
          "target_value" : "Allie",
          "input_value" : "Allie",
          "input_matcher" : "simple",
          "input_matcher_params" : { }
        }, {
          "attribute" : "last_name",
          "target_field" : "last_name",
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
    } ]
  }
}
```

如 `_explanation.resolvers`'中所示，由于使用了`name_only`解析器，两个文档都匹配到了。如 `_explanation.matched`中所示，每个文档都有两个匹配字段。

让我们来看看其中的一个匹配：
``` json
"_explanation": {
  ...
  "matches": [
    {
      "attribute" : "first_name",
      "target_field" : "first_name",
      "target_value" : "Allie",
      "input_value" : "Allie",
      "input_matcher" : "simple",
      "input_matcher_params" : { }
    },
    ...
  ]
}
```

这告诉我们，`first_name`属性是在一个名为`first_name`的索引字段中发现的，该索引字段的值为`Allie`，通过使用实体模型中定义的`简单`匹配器，该值与之前已知的属性值`Allie`相匹配。换句话说，找到了一个精确匹配的属性。

# 总结
恭喜您！你刚刚完成了实体解析中最简单的一种形式——精确的名称匹配。

还不算太激动吧？让我们把事情变得更有趣一些吧。

下一篇教程将介绍如何使用名称的多种形式实现[强大的名称匹配](/docs/basic-usage/robust-name-matching/index.html)，以应对错别字或语音差异等挑战。您将使用匹配到单索引——多字段的**单个attribute**，而不是用**单索引——单字段**来解析实体。