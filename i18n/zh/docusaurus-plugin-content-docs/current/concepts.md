# 核心概念

## 1. 快速理解

![](../../../../static/img/concepts-1.png)

这张图囊括了 Interaqt 的核心概念。
Interaqt 认为系统的现在的状态是初始状态和中间交互事件的一种计算结果，或者是基于现在的其他状态的计算结果。
过去的编程方法中，几乎都是针对具体的交互事件，写出如何修改数据的代码。
而在 Interaqt 中，只要写出数据的"定义"。数据在什么交互发生时，应该如何变化是自动发生的。
如果你熟悉响应式编程，你可以认为 Interaqt 把响应式编程搬到了后端！

例如在一个有多人审批的审批系统中，只有所有人都同意了，才能通过审批。
在传统的编程方法中：
- 在"添加审批人"的交互中，建立审批人和审批请求的关系 
- 在"同意"交互的响应代码中去计算审批结果

```javascript
async function addReviewer(currentUser, request) {
    // 前置检查条件，例如
    //  - 关系是否已经添加过
    //  - request 是否完结
    //  ...
    await SOME_ORM.create('review_relation', 
      { user: currentUser, request: request}
    )
}

async function ApproveCallback(currentUser, request) {
      // 前置检查条件，例如
      //  - request 是否完结
      //  ...
    const currentReviewRelation = await SOME_ORM.updateOne('review_relation', 
      { user: currentUser, approved:true,  request: request}
    )
    const allReviewRelations = await SOME_ORM.find('review_relation', 
      { request: request}
    )
  
    if (allReviewRelations.every( relation => relation.approved)) {
        await SOME_ORM.updateOne('request', 
          { id: request.id, approved: true}
        )
    }
}
```

工程师为了性能，还可能会在 Request 存一个当前 reviewRelation 的总数和 approved 的总数，
这样只需要在每次 reviewRelation 变化时，对比一下这两个字段是否相等，就不用每次都去查询所有的 reviewRelation 了。

而在 Interaqt 中，我们只需要定义好数据，就自动获得了上述的所有能力，包括数据的前置检查、为了更好性能而实现的 "增量对比"：

```javascript
// 基于发生的 interaction 的计算
ReviewRelation.comptuedData = MapInteraction.create({
  items: [
    MapInteractionItem.create({
      interaction: AddReviewerRelation,
      map: function map(event) {
        return { source: event.payload.request, target: event.user}
      }
    })
  ]
})

ReviewRelationApprovedProp.computedData = MapInteraction.create({
    relation: ApproveInteraction,
    match: (_, relation) => true
})

// 基于其他状态的计算
RequestApprovedProp.computedData = RelationBasedEvery.create({
    relation: ReviewRelation,
    match: (_, relation) => {
        return relation.approved
    }
})
```


## 2. 为什么 Interaqt 的方法更好

日光之下，无新鲜事。Interaqt 的方法你或许在很多地方都有见过相似的，例如：
- 响应式编程
- 函数式编程
- 事件驱动编程
甚至在编程教学中强调的"表达是什么比表达怎么做更重要"都是相似的思路。

Interaqt 只是做了一些关键的工作，将"表达是什么"的想法搬到了应用框架中。其中最重要的是：
- Interaqt 通过"思维学"交叉学科的方法，确保了表达能力足够强，在目标场景中能覆盖住用户的所有需求。
- Interaqt 通过"自动增量实现"的方式，解决了传统响应式编程中的"性能"问题。

通过 Interaqt 再回看过去对数据进行操作的方式，你会发现几乎我们写的所有代码都是"手动增量编程"，因为绝大部分场景只有这样才能保障性能需求。

有了完整的表达 "是什么" 的能力之后，软件的自动实现、随用户规模和数据规模的自动架构与迁移才可能自动实现。
过去这些研发工作要企业数百万甚至上亿的研发经费，在 Interaqt 的方法下，这些全都可以自动实现。
在大模型的时代，我们认为应该把"基于语言推理"的能力用在理解人的需求上，而不是产出传统代码上。
从 "是什么" 到 "如何做" 的这个阶段中，应该像数学公理一样完全正确，而不是基于概率上的正确，否则仍然无法排除程序员，做到完全的自动化。

看看 Interaqt 是如何更好地与 ChatGPT 结合并产出真实可用的系统的。[Use With ChatGPT](./tutorial/use-with-gpt)


## 3. Interaqt 不是"银弹"

适合的场景：常见多实体关系等数据概念的应用软件。

用处不大的场景：数据简单，主要复杂度表现在对数据的编辑（前端）的场景。

不适用的常见: 系统软件，如操作系统、数据库等。

