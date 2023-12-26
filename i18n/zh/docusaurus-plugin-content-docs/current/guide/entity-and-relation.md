# Entity and Relation

## Entity

实体和关系是 Interaqt 中数据的基本组织形式。
所有具有"唯一性"的数据都应该使用实体表示。
例如商品 A 和 商品 B，哪怕属性完全相同，他们也是不同的东西，这叫做"唯一性"。
不具备唯一性的数据，例如商品的颜色，应该使用属性来表示。

实体的创建非常简单：

```typescript
const UserEntity = Entity.create({
  name: 'User',
  properties: [
    Property.create({ name: 'name', type: PropertyTypes.String }),
    Property.create({ name: 'roles', type: PropertyTypes.String, collection: true }),
  ],
})
```

注意当我们创建属性时，可以使用 `collection` 来表示是否是集合。

## Relation

关系是实体之间的连接，例如用户和用户之间的上下级关系，用户和商品之间的购买关系等等。
关系上也可有属性来记录关系的一些信息，例如用户和商品之间的购买关系上可以记录购买时间，购买数量等等。
创建关系也非常简单:

```typescript
const supervisorRelation = Relation.create({
  source: UserEntity,
  sourceProperty: 'supervisor',
  target: UserEntity,
  targetProperty: 'subordinate',
  relType: 'n:1',
})
```

其中的 `sourceProperty` 和 `targetProperty` 表示之后我们可以从 source/target 实体上用什么 property 名字
来获取关系数据。

## Computed Data

Computed Data 是 Interaqt 中的核心概念，它描述的是实体关系以及上面的属性是如何来的，应该如何变化。
它通常需要结合 Interaction 的定义一起来使用。在这篇文档中我们只通过两个例子来快速理解。
例如，在很多系统中都有"发起某种申请"的功能，我们需要记录"申请"和"发起人"之间的关系以便之后审批时查看。
在传统的编程方法中，我们需要在"发起申请"的交互中，写出如何创建"申请"和"发起人"之间的关系的代码。
在 Interaqt 中，我们是将这个关系表达成相应的 Interaction 的计算结果，具体如下：

```typescript
const requestRelation = Relation.create({
    source: UserEntity,
    sourceProperty: 'request',
    target: RequestEntity,
    targetProperty: 'from',
    relType: 'n:1',
    properties: [
        Property.create({
            name: 'createdAt',
            type: 'string'
        })
    ]
})

// 将 createInteraction 映射成 requestRelation 的 data
requestRelation.computedData = MapInteraction.create({
    items: [
        MapInteractionItem.create({
            interaction: sendRequestInteraction,
            map: function map(event: any) {
                return {
                    source: event.user,
                    createdAt: Date.now().toString(),
                    target: event.payload.request,
                }
            }
        }),
    ],
})
```

这样，当 `sendRequestInteraction` 发生时，就会自动创建一条新的 requestRelation 数据。

Computed Data 除了基于 Interaction 计算之外，还可以基于其他状态计算，例如基于其他关系的计算，基于其他属性的计算等等。
例如，Request 只有被被所有审批这都同意了，才算是通过了审批，我们可以通过下面的方式来计算：

```typescript
// 先给 Request 定义一个 approved 的属性，表示是否通过审批
const RequestApprovedProp = Property.create({
    name: 'approved',
    type: 'boolean',
    collection: false
})

// 然后定义 approved 的值应该如何变化。它本质上是一个基于 Relation 的 Every 计算。
RequestApprovedProp.computedData = RelationBasedEvery.create({
    relation: ReviewRelation,
    match: (_, relation) => {
        return relation.approved
    }
})
```

所有 Computed Data 的类型可以在 [Computed Data](./computed-data) 中找到。
你也可以在 [Quick Example](../tutorial/quick-example) 中找到更完整的例子。
