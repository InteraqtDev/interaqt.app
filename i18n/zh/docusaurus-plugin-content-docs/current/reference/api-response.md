# API Response

## Interaction API

Interaction API 调用将返回 InteractionResponse 类型的对象，以 JSON 格式返回给客户端。
以下是类型定义：

```typescript
type InteractionCallResponse= {
    // 调用过程中的任何错误信息，常见有 ConditionError/AttributiveError
    error?: any,
    // Get Interaction 将返回获取的 实体/关系/全局状态等数据
    data?: any,
    // 本次调用产生的事件
    event: InteractionEvent
    // interaction 中产生的 record create/update 等数据变化信息
    effects? : any[]
    // interaction 的 sideEffect 调用的结果和错误信息
    sideEffects?: {
        [k: string]: SideEffectResult
    }
    // interaction 调用时附加产生的上下文，例如 activityId
    context?: {
        [k: string]: any
    }
}

type InteractionEvent = {
    interactionId: string,
    interactionName: string,
    activityId?: string,
    args: InteractionEventArgs
}

type SideEffectResult = {
    result: any,
    error: any
}
```

### 示例
我们有一个叫做 `createPost` 的 Interaction，它自身的定义和相关的实体关系定义如下：

```typescript
const titleProp = Property.create({
    name: 'title',
    type: 'string',
    collection: false,
})

const bodyProp = Property.create({
    name: 'body',
    type: 'string',
    collection: false,
})

const createdAtProp = Property.create({
    name: 'createdAt',
    type: 'number',
    collection: false,
    computed: () => {
        return Date.now()
    }
})


const postEntity = Entity.create({
    name: 'Post',
    properties: [
        titleProp,
        bodyProp,
        createdAtProp,
    ]
})

const userEntity = Entity.create({
    name: 'User',
    properties: [
        Property.create({
            name: 'name',
            type: 'string',
            collection: false,
        }),
    ]
})

// post 和 user 的有一个叫做 ownerRelation 的关系
const ownerRelation = Relation.create({
    source: PostEntity,
    sourceProperty: 'owner',
    target: UserEntity,
    targetProperty: 'posts',
    relType: 'n:1',
})


const createPostInteraction = Interaction.create({
    name: 'createPost',
    action: Action.create({name: 'createPost'}),
    payload: Payload.create({
        items: [
            PayloadItem.create({
                name: 'content',
                base: UserEntity,
                itemRef: userRef
            }),
        ]
    }),
})

// post.createAt 是每次执行 createPostInteraction 时自动计算的
createAtProp.computedData = MapInteraction.create({
    items: [
        MapInteractionItem.create({
            interaction: createInteraction,
            map: () => Date.now(),
            computeTarget: (event: InteractionEventArgs) => {
                return {id: event.payload!.content.id }
            }
        })
    ]
})

// post 和 user 之间的 ownerRelation 是每次执行 createPostInteraction 时自动计算的
ownerRelation.computedData = MapInteraction.create({
    items: [
        MapInteractionItem.create({
            interaction: createInteraction,
            map: (event: InteractionEventArgs) => {
                return {
                    source: event.user,
                    target: event.payload!.content
                }
            },
            computeTarget: (event: InteractionEventArgs) => {
                return {id: event.payload!.content.id }
            }
        })
    ]
})
```

当调用 `createPostInteraction` 时，我们会得到如下的 InteractionResponse：

```json
{
  "sideEffects": {},
  "event": {
    "interactionName": "createPost",
    "interactionId": "8911382d-c80a-4fa2-a052-fcf022ff1444",
    "args": {
      "user": {
        "name": "A",
        "id": 1
      },
      "payload": {
        "content": {
          "title": "t1",
          "body": "b1",
          "id": 1
        }
      }
    }
  },
  "effects": [
    {
      "type": "update",
      "recordName": "Post",
      "record": [
        {
          "createdAt": 1704180768027,
          "id": 1
        }
      ]
    },
    {
      "type": "create",
      "recordName": "User_post_owner_Post",
      "record": {
        "source": {
          "name": "A",
          "id": 1
        },
        "target": {
          "title": "t1",
          "body": "b1",
          "createdAt": "1704180768027.0",
          "id": 1
        },
        "id": 1
      }
    }
  ]
}
```


## Custom API

用户的 Custom API 函数返回值将以  JSON 格式返回给客户端。
### 示例

```typescript
const hello = createDataAPI(
    function hello(this: Controller, context: DataAPIContext, name: string) {
        return { message: `hello ${name}` }
    },
    { allowAnonymous: true, params: ['string'] }
)

startServer(controller,  {
    port: 8082,
    parseUserId: async (headers) => {
        // ...
    }
}, {
    hello,
})
```

当调用 `hello` 并传入参数 `name` 为 "world"时，我们会得到如下的 InteractionResponse：

```json
{
  "message": "hello world"
}
```