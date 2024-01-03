# 10 分钟创建一个 CMS

内容管理是现代应用中一个很重要的功能。
常见的 CMS 基于"内容"这个概念提供了：
- 内容的增删改查
- 内容的权限管理
- 附带的用户、组织管理
等功能。

Interaqt 也提供了专门用于创建"内容"的 utility 来帮助开发者快速获得内容管理的能力。并且开发出来的系统会比常见 CMS 更灵活。

## cms utility 的基础使用

我们可以使用 `@interaqt/utility/cms` 来快速创建一个内容类型的实体以及相应的增删改查交互。

```typescript
const userEntity = Entity.create({
    name: 'User',
})

const titleProp = Property.create({
    name: 'title',
    type: PropertyTypes.String,
})

const bodyProp = Property.create({
    name: 'body',
    type: PropertyTypes.String,
})

const { contentEntity, ownerRelation, interactions} = createContent(
    'Post',
    [titleProp, bodyProp],
    userEntity
)
```

这样我们就得到了一个名为 `Post` 的内容类型，它有 `title` 和 `body` 两个字段。
并自动创建了和 user 之间的 `owerRelation`。在需要的场景中可以使用 `User.posts` 来获取某个用户创建的所有 post，也可以使用 `Post.owner` 来获取某个 post 的创建者。

同时，我们还得到了一些交互，可以通过 `interactions` 来获取：
- `create` 用于创建 post
- `update` 用于更新 post
- `delete` 用于删除 post
- `list` 用于获取 post
- `readOne` 用于获取单个 post

我们可以把这些交互注册到 controller 中，然后就可以使用它们了。
```typescript
const system = new MonoSystem()
const controller = new Controller(
    system,
    [contentEntity, userEntity],
    [ownerRelation, supervisorRelation],
    [],
    [interactions.create, interactions.update, interactions.delete, interactions.list, interactions.readOne],
    []
)
startServer(controller, {
    port: 8082,
    parseUserId: () => {
        //...
    }
})
```

如果你是使用 `npx create-interaqt-app` 创建的应用，那么你可以直接在 `/app/index.ts` 中导出这些信息就能使用了。
```typescript
// app/index.ts
export const entities = [contentEntity, userEntity]
export const relations = [ownerRelation]
export const interactions = [interactions.create, interactions.update, interactions.delete, interactions.list, interactions.readOne]
```

## 实现 RBAC

CMS 中最常见的权限控制是 RBAC(Role Based Access Control)。 在 Interaqt 中，我们可以通过 Attributive 来快速实现 RBAC。

我们先给 UserEntity 添加一个 `roles` 字段，用于存储用户的角色信息。
```typescript
const rolesProp = Property.create({
    name: 'roles',
    type: PropertyTypes.String,
    collection: true,
})
userEntity.properties.push(rolesProp)
```

然后创建你想要的角色定语，例如：
```typescript
const editorRole = Attributive.create({
    name: 'editor',
    content: function (this: Controller, request, {user}) {
        return user.roles.includes('editor')
    }
})

const readerRole = Attributive.create({
    name: 'reader',
    content: function (this: Controller, request, {user}) {
        return user.roles.includes('reader')
    }
})
```

接着用这些定语来限制交互的权限，例如只有 editor 才能创建 post：

```typescript
interactions.create.userAttributives = editorRole
```

当然也可以通过 `BoolExp` 来对定语进行组合，具体请参考 [guide/interaction](../guide/interaction)。

## 更灵活的权限控制

有时候我们需要更加灵活的权限控制场景，简单的 RBAC 是无法满足的。例如，我们需要限制只有"创建者"才能修改自己的 post。
"创建者"并不是一个可以写在 `roles` 属性中的具体的角色，而是一个动态的概念，它是相对于当前要修改的 Post 来说的。
这在 Interaqt 中可以通过 Attributive 来实现。
我们利用 Interaction 中的 Condition 来实现一个复杂的场景：只有 Post 的创建者才能修改 Post，创建者的 supervisor 可以修改 title。

先定义 `supervisor` 的 relation:
```typescript
const supervisorRelation = Relation.create({
    name: 'supervisor',
    source: userEntity,
    target: userEntity,
    sourceProperty: 'supervisor',
    targetProperty: 'subordinates',
    relType: 'n:1'
})
```

再开始定义两个 Condition:
- 是否是 owner
- 是否是 owner 的 supervisor
并通过 BoolExp 来组合这两个 Condition:

```typescript
const isOwnerCondition = Condition.create({
    name: 'owner',
    content: async function (this: Controller, event: InteractionEventArgs) {
        const BoolExp = this.globals.BoolExp
        const match = BoolExp.atom({
            key: 'id',
            value: ['=', event.payload.content.id]
        })
        const contentWithOwner = await this.system.storage.findOne('User', match, undefined, 
            [['owner', {attributeQuery: ['*']}]]
        )
        return contentWithOwner.owner.id === event.user.id
    }
})

const supervisorUpdateCondition = Condition.create({
    name: 'isSupervisor',
    content: async function(this: Controller, event: any) {
        const BoolExp = this.globals.BoolExp
        const match = BoolExp.atom({key: 'id', value: ['=', event.payload.content.id]})
        const content = await this.system.storage.findOne('Post', match, undefined, ['*', ['owner', {attributeQuery: ['*']}]])
        // Interaqt 中支持通过类似递归的写法获取树形的数据
        const ownerWithSupervisors = await this.system.storage.findOne(
            'User',
            BoolExp.atom({key: 'id', value: ['=', content.owner.id]}),
            undefined,
            ['*', ['supervisor', {
                label: 'supervisorQuery',
                attributeQuery: ['*', ['supervisor', { goto: 'supervisorQuery'}]]
            }]]
        )

        // 遍历整颗树，获取所有的 supervisor
        const allSupervisors = []
        let root = ownerWithSupervisors
        while(root.supervisor) {
            allSupervisors.push(root.supervisor)
            root = root.supervisor
        }
        // 判断所有的 supervisor 中有没有当前用户
        const isSupervisor = allSupervisors.some((supervisor: any) => supervisor.id === event.user.id)
        const allowKeys = ['id', 'title']
        // 判断 payload 中的属性是否都是允许存在的。
        const isAllUpdateKeysAllowed = Object.keys(event.payload.content).every(key => allowKeys.includes(key))
        return isSupervisor && isAllUpdateKeysAllowed
    }
})

// 通过 BoolExp 来组合两个 Condition，并通过 boolExpToConditions 转换成 Condition
interactions.update.conditions = boolExpToConditions(BooleanExp.and(isOwnerCondition, supervisorUpdateCondition))
```

在 Interaqt 的  Condition 中因为你可以拿到这次交互的所有数据，所有可以实现任何复杂的权限控制。

## 使用正确的交互、活动等抽象

传统的 CMS 常面临的一个问题是：如果应用变复杂，不再只是简单的内容管理，那么就使用起来就会变得很困难。
现在的  CMS 有的要么封装很多的功能，尽量覆盖用户的场景。要么提供自定义 controller 等概念，让用户能把 CMS 当成实体系统来使用，与使用 ORM 无异。
而在 Interaqt 中，我们提供了更正确的抽象让你来描述整个应用。

考虑内容"点赞"功能的实现。有的 CMS 直接封装了这个功能，有的 CMS 需要你自定义一个 like 字段，并通过自定义接口去操作数据实现。
而在 Interaqt 中的实现，是最符合业务语义的：

首先定义一个"点赞"的交互：
```typescript
// 定义 like Interaction
const likeInteraction = Interaction.create({
    name: 'like',
    action: Action.create({name: 'like'}),
    payload: Payload.create({
        items: [
            PayloadItem.create({
                name: 'content',
                base: contentEntity,
                isRef: true,
            })
        ]
    })
})
```

本质上，点赞是建立一种"用户"和内容的关系。这个关系的建立是由 `likeInteraction` 产生的，所以接下来这样定义一个"用户"和"内容"之间的关系。
```typescript
const likeRelation = Relation.create({
    source: UserEntity,
    sourceProperty: 'like',
    target: ContentEntity,
    targetProperty: 'likedBy',
    relType: 'n:n',
    computedData: MapInteraction.create({
        items: [
            MapInteractionItem.create({
                sourceInteraction: likeInteraction,
                map: async function map(this: Controller, event: any) {
                    return [{
                        source: event.user,
                        target: event.payload.content,
                    }]
                }
            })
        ]
    })
})
```

我们可以还可以继续给 like Interaction 加上一些限制条件，例如不能重复 like，不能给自己的内容 like 等等。

```typescript
const likeCondition = Condition.create({
    name: 'shouldNotDuplicateLike',
    content: async function (this: Controller, event: InteractionEventArgs) {
        const BoolExp = this.globals.BoolExp
        const match = BoolExp.atom({
            key: 'source.id',
            value: ['=', event.user.id]
        }).and({
            key: 'target.id',
            value: ['=', event.payload.content.id]
        })
        const likeRelationName = this.system.storage.getRelationName('User', 'like')
        return !(await this.system.storage.findOneRelationByName(likeRelationName, match))
    }
})

const  shouldNotLikeOwnContentCondition = Condition.create({
    name: 'shouldNotLikeOwnContent',
    content: async function (this: Controller, event: InteractionEventArgs) {
        const BoolExp = this.globals.BoolExp
        const match = BoolExp.atom({
            key: 'id',
            value: ['=', event.payload.content.id]
        })
        const content = await this.system.storage.findOne('Post', match, undefined, [['owner', {attributeQuery: ['*']}]])
        return content.owner.id !== event.user.id
    }
})

likeInteraction.conditions = boolExpToConditions(BoolExp.and(likeCondition, shouldNotLikeOwnContentCondition))
```

再考虑这样一个场景：24 小时之内只能给同一个用户的内容点赞最多十次。
这个场景在传统的 CMS 中是很难实现的，因为传统的 CMS 往往只有完整的"内容"抽象，缺乏"关系"、"事件" 等抽象。
就算手动实现，也比较麻烦，需要手动计数等操作。
而在 Interaqt 中，关系上可以记录"点赞"的时间，同时系统也自带 Event 实体，可以用于查询事件。

```typescript
// 先在 likeRelation 中添加一个 createdAt 属性
const createdAtProp = Property.create({
    name: 'createdAt',
    type: PropertyTypes.Timestamp,
    computedData: MapInteraction.create({
        items: [
            MapInteractionItem.create({
                sourceInteraction: likeInteraction,
                map: async function map(this: Controller, event: any) {
                    return new Date.now()
                }
            })
        ]
    })
})
likeRelation.properties.push(createdAtProp)


// 再增加一个 Condition
const shouldNotLikeSameUserInOneDayCondition = Condition.create({
    name: 'shouldNotLikeSameUserIn24h',
    content: async function (this: Controller, event: InteractionEventArgs) {
        const BoolExp = this.globals.BoolExp
        const matchContent = BoolExp.atom({
            key: 'target.id',
            value: ['=', event.payload.content.id]
        })
        const contentWithOwner = await this.system.storage.findOne('Post', matchContent, undefined, [['owner', {attributeQuery: ['*']}]])
        
        
        const matchRelation = BoolExp.atom({
            key: 'source.id',
            value: ['=', event.user.id]
        }).and({
            key: 'target.owner.id',
            value: ['=', contentWithOwner.owner.id]
        }).and({
            key: 'createdAt',
            value: ['>', new Date.now() - 24 * 60 * 60 * 1000]
        })
        
        const likeRelationName = this.system.storage.getRelationName('User', 'like')
        return (await this.system.storage.findRelationByName(likeRelationName, matchRelation)).length < 10
    }
})

likeInteraction.conditions = boolExpToConditions(BoolExp.and(likeCondition, shouldNotLikeOwnContentCondition, shouldNotLikeSameUserInOneDayCondition))
```



说到底，Interaqt 和传统 CMS 最大的区别是, CMS 以"内容"这个概念为中心，然后通过各种辅助手段去构建应用。
而 Interaqt 以应用本身应有的概念为中心，然后针对内容类型的场景提供工具来帮助快速实现。
这使得 Interaqt 使用的抽象更正确，也更灵活。

为了产品的完整性，CMS 往往还会附带用户、组织等管理系统，但在复杂的应用中，用户往往有自己的用户系统。
CMS 提供的用户系统反而使得用户要在做额外的同步工作。
在 Interaqt 中没有任何这样的预设，你可以自由的选择你想要的用户系统，例如 Auth0 等。
参考 [advanced/use-logto-as-authentication-system](../advanced/use-logto-as-authentication-system)。