# API Response

## Interaction API

The Interaction API invocation returns an object of type InteractionResponse in JSON format to the client. 
Below is the type definition:

```typescript
type InteractionCallResponse= {
    // Any error information during the call, common ones include ConditionError/AttributiveError
    error?: any,
    // Get Interaction will return the fetched data such as entities/relations/global states, etc.
    data?: any,
    // Event object generated during this call
    event: InteractionEvent
    // Information about data changes like record create/update, etc., generated in the interaction
    effects? : any[]
    // Results and error information from sideEffect calls in the interaction
    sideEffects?: {
        [k: string]: SideEffectResult
    }
    // Context generated during the interaction call, such as activityId
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

### Example
Suppose we have an Interaction named createPost, with its own definition and related entity/relations definitions as follows:

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

// relation between post and user who created the post
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

// post.createAt is automatically calculated each time createPostInteraction is executed
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

// The ownerRelation between post and user is automatically calculated each time createPostInteraction is executed.
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

When calling createPostInteraction, we will receive the following InteractionResponse:

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

The return value of a user's Custom API function is returned to the client in JSON format.
### Example

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

When calling hello with the parameter name set to "world", we will receive the following InteractionResponse:

```json
{
  "message": "hello world"
}
```