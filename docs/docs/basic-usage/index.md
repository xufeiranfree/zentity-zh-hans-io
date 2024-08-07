---
title: 基础用法教程
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
[实体模型](https://zentity.io/docs/entity-models)是您需要了解的最重要的结构。`zentity`使用实体模型来构建查询、匹配不同索引中的属性以及解析实体。

实体模型定义了解析某种实体类型（如个人或组织）的逻辑，它定义了实体的属性（“`attributes`”）、每个属性的匹配逻辑（“`matchers`”）、基于匹配的属性将文档解析到实体的解析逻辑（“`resolvers`”）以及属性和匹配器与索引字段之间的关联（“`indices`”）。这一步需要大量思考，需要考虑哪些属性构成一个实体类型，每个属性的匹配逻辑是什么，哪些属性和匹配器映射到哪些索引字段，以及哪些匹配属性的组合会导致解析。

幸运的是，所有这些思考很快就会得到回报，因为实体模型有两个很棒的特性：

**可重用性**

一旦您有了一个实体模型，就可以在任何地方使用它。当您为新的数据集建立索引，如果这些数据集的字段映射到了熟悉的属性，您就可以对它们实施实体解析。如果您为具有新属性的数据建立索引，而这些属性在您的模型中尚未包含，您只需更新您的模型以支持它们。

**灵活性**

您无需更改数据即可使用实体模型。实体模型仅控制查询的执行。因此，更新或试验实体模型没有风险。

## 步骤 3. 解析实体

所以您有了一些数据和一个实体模型，现在您可以解析实体了！

一旦有了[实体模型](https://zentity.io/docs/entity-models)，您就可以使用[**Resolution API**](https://zentity.io/docs/rest-apis/resolution-api)，通过一些输入来实行实体解析任务。

**样例**

使用一个名为 `person` 的、已索引的实体模型，运行实体解析任务。
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

使用一个嵌入的实体模型运行实体解析任务，示例使用了三个属性、两个解析器和两个索引。
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
现在，您已经了解了预期内容，让我们通过一些引导式教程来帮助您掌握 zentity 的基本功能。