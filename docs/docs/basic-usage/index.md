---
pre:
  text: 安装
  link: /docs/installation.html
next:
  text: 精确名称匹配
  link: /docs/basic-usage/exact-name-matching/index.html
---

### 基础用法教程 📖
本教程是帮助您学习和执行`zentity`基本功能的系列教程之一。每篇教程都会在之前教程的基础上增加一些复杂功能，因此您可以从简单的功能开始，逐步学习更高级的功能。
1. [精确名称匹配](./exact-name-matching/index.html)
2. Robust Name Matching
3. Multiple Attribute Resolution
4. Multiple Resolver Resolution
5. Cross Index Resolution
6. Scoping Resolution

# 先决条件
在学习如何使用`zentity`之前，您必须了解如何使用`Elasticsearch API`。

具体来说，你应该知道：
- [如何创建索引](https://www.elastic.co/guide/en/elasticsearch/reference/current/indices-create-index.html)
- [如何创建索引映射](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html)
- [如何创建文本分析器](https://www.elastic.co/guide/en/elasticsearch/reference/current/analysis.html)
- [如何索引数据](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-index_.html)
- [如何使用查询DSL(领域特定语言)搜索数据](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)

如果您真的想要掌握对于`zentity`来说`Elasticsearch`最重要的方面，那么我建议您参加由`Elasticsearch`的创建者`Elastic`提供的这些培训课程。

- [Elasticsearch Engineer I](https://www.elastic.co/training/elasticsearch-engineer-1)
- [Elasticsearch Engineer II](https://www.elastic.co/training/elasticsearch-engineer-2)
- [Improving Search with Text Analysis](https://www.elastic.co/training/specializations/elasticsearch-advanced-search/improving-search-with-text-analysis)
- [Improving Search with Synonyms](https://www.elastic.co/training/specializations/elasticsearch-advanced-search/improving-search-with-synonyms)

如果你有一些使用`Elasticsearch`的基本经验，那么你就可以学习如何使用`zentity`了。

# 如何使用`zentity`
在深入了解之前，我们先来俯瞰一下`zentity`的典型用法。

你可以将`zentity`包括这三个步骤：

- 步骤 1. 将数据写入索引
- 步骤 2. 定义实体模型
- 步骤 3. 解析实体

让我们细化一下。

## 步骤 1. 将数据写入索引
`zentity`用于操作[Elasticsearch](https://www.elastic.co/products/elasticsearch)索引上的数据，其中`Elasticsearch`是一款用于大规模实时搜索和数据分析的开源搜索引擎。在`Elasticsearch`中，最常用的文档索引工具是[Logstash](https://www.elastic.co/guide/en/logstash/current/introduction.html)和[Beats](https://www.elastic.co/guide/en/beats/libbeat/current/beats-reference.html)，您也可以使用[索引API](https://www.elastic.co/guide/en/elasticsearch/guide/current/index-doc.html)或[批量API](https://www.elastic.co/guide/en/elasticsearch/reference/current/docs-bulk.html)来索引单个文档。在您使用`zentity`之前，需确保`Elasticsearch`中有数据，同时也需了解如何使用`Elasticsearch`。

本系列的每个教程都会提供样本数据，供您练习使用。

## 步骤 2. 定义实体模型
Entity models are the most important constructs you need to learn about. zentity uses entity models to construct queries, match attributes across disparate indices, and resolve entities.

An entity model defines the logic for resolving an entity type such as a person or organization. It defines the attributes of the entity ("attributes"), the logic to match each attribute ("matchers"), the logic to resolve documents to an entity based on the matching attributes ("resolvers"), and the associations between attributes and matchers with index fields ("indices"). This is the step that demands the most thinking. You need to think about what attributes constitute an entity type, what logic goes into matching each attribute, which attributes and matchers map to which fields of which indices, and what combinations of matched attributes lead to resolution.

Luckily, all this thinking will pay off quickly, because entity models have two great features:

**Reusability**

Once you have an entity model you can use it everywhere. As you index new data sets with fields that map to familiar attributes, you can include them in your entity resolution jobs. If you index data with new attributes that aren't already in your model, you can simply update your model to support them.

**Flexibility**

You don't need to change your data to use an entity model. An entity model only controls the execution of queries. So there's no risk in updating or experimenting with an entity model.

## 步骤 3. 解析实体
So you have some data and an entity model. Now you can resolve entities!

Once you have an entity model, you can use the **Resolution API** to run an entity resolution job using some input.

**Example**

Run an entity resolution job using an indexed entity model called person.
``` json
POST _zentity/resolution/person?pretty
{
  "attributes": {
    "name": [ "Alice Jones" ],
    "dob": [ "1984-01-01" ],
    "phone": [ "555-123-4567", "555-987-6543" ]
  }
}
```
Run an entity resolution job using an embeded entity model. This example uses three attributes, two resolvers, and two indices.
``` json
POST _zentity/resolution?pretty
{
  "attributes": {
    "name": [ "Alice Jones" ],
    "dob": [ "1984-01-01" ],
    "phone": [ "555-123-4567", "555-987-6543" ]
  },
  "model": {
    "attributes": {
      "name": {
        "type": "string"
      },
      "dob": {
        "type": "string"
      },
      "phone": {
        "type": "string"
      }
    },
    "resolvers": {
      "name_dob": {
        "attributes": [
          "name", "dob"
        ]
      },
      "name_phone": {
        "attributes": [
          "name", "phone"
        ]
      }
    },
    "matchers": {
      "exact": {
        "clause": {
          "term": {
            "{{ field }}": "{{ value }}"
          }
        }
      },
      "fuzzy": {
        "clause": {
          "match": {
            "{{ field }}": {
              "query": "{{ value }}",
              "fuzziness": "{{ params.fuzziness }}"
            }
          }
        },
        "params": {
          "fuzziness": "auto"
        }
      },
      "standard": {
        "clause": {
          "match": {
            "{{ field }}": "{{ value }}"
          }
        }
      }
    },
    "indices": {
      "foo_index": {
        "fields": {
          "full_name": {
            "attribute": "name",
            "matcher": "fuzzy"
          },
          "full_name.phonetic": {
            "attribute": "name",
            "matcher": "standard"
          },
          "date_of_birth.keyword": {
            "attribute": "dob",
            "matcher": "exact"
          },
          "telephone.keyword": {
            "attribute": "phone",
            "matcher": "exact"
          }
        }
      },
      "bar_index": {
        "fields": {
          "nm": {
            "attribute": "name",
            "matcher": "fuzzy"
          },
          "db": {
            "attribute": "dob",
            "matcher": "standard"
          },
          "ph": {
            "attribute": "phone",
            "matcher": "standard"
          }
        }
      }
    }
  }
}
```
Now that you have a sense of what to expect, let's walk through some guided tutorials to help you master the basic functions of zentity.