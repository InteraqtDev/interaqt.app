# Create a CMS in 10 min

Content management is a critical function in modern applications. 
Common Content Management Systems (CMS) are based on the concept of "content," providing functionalities such as:

- CRUD (Create, Read, Update, Delete) operations for content
- Content permission management
- Associated user and organization management, and more.

Interaqt also offers a specialized utility for creating "content" to enable developers to quickly implement content management capabilities. 
Systems developed with Interaqt are often more flexible than traditional CMS.

## Basic Usage of the cms utility
With `@interaqt/utility/cms`, developers can swiftly create a content-type entity and its corresponding CRUD interactions.

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

const { contentEntity, ownerRelation, interactions } = createContent(
    'Post',
    [titleProp, bodyProp],
    userEntity
)

```

This code results in a content type named `Post`, with `title` and `body` fields. It automatically creates an `ownerRelation` with the user. 
This allows for accessing all posts created by a user via `User.posts` or the creator of a post through `Post.owner`.

The code also yields several interactions accessible via interactions:

- `create` for creating posts
- `update` for updating posts
- `delete` for deleting posts
- `list` for listing posts
- `readOne` for fetching a single post

These interactions can be registered in a controller for use:

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

For apps created with `npx create-interaqt-app`, you can directly export these configurations in `/app/index.ts` for immediate use.

```typescript
// app/index.ts
export const entities = [contentEntity, userEntity]
export const relations = [ownerRelation]
export const interactions = [interactions.create, interactions.update, interactions.delete, interactions.list, interactions.readOne]
```

## Implementing RBAC
Role-Based Access Control (RBAC) is a prevalent permission control in CMS. 
In Interaqt, RBAC can be quickly implemented through Attributive. 
For instance, add a roles field to UserEntity for storing user roles:

```typescript
const rolesProp = Property.create({
    name: 'roles',
    type: PropertyTypes.String,
    collection: true,
})
userEntity.properties.push(rolesProp)
```

Then, define the roles:

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

Next, apply these roles to restrict interaction permissions. For example, only editors can create posts:
```typescript
interactions.create.userAttributives = editorRole
```

For more complex scenarios, refer to [guide/interaction](../guide/interaction).

## Advanced Permission Control
Sometimes, we require more flexible control over permissions, and simple RBAC (Role-Based Access Control) isn't sufficient. 
For instance, we might need to restrict post modifications exclusively to the post's "creator". 
The "creator" isn't a specific role that can be listed in the roles attribute but rather a dynamic concept, 
relative to the post being modified. 
In Interaqt, this can be done in seconds, but Interaqt can do more than that.
Let's utilize `Conditions` within Interactions to implement a complex scenario: only the creator of a post can modify it, and the creator's supervisor is allowed to modify the title.

First, let's define the supervisor relation:
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

Then, define conditions like whether the user is the owner or the owner's supervisor and combine them using `BoolExp`:
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
        // Interaqt supports the retrieval of tree-structured data through recursive-like syntax.
        const ownerWithSupervisors = await this.system.storage.findOne(
            'User',
            BoolExp.atom({key: 'id', value: ['=', content.owner.id]}),
            undefined,
            ['*', ['supervisor', {
                label: 'supervisorQuery',
                attributeQuery: ['*', ['supervisor', { goto: 'supervisorQuery'}]]
            }]]
        )

        // walk throuth the whole data to get all supervisors
        const allSupervisors = []
        let root = ownerWithSupervisors
        while(root.supervisor) {
            allSupervisors.push(root.supervisor)
            root = root.supervisor
        }
        // is any of the supervisor is current user
        const isSupervisor = allSupervisors.some((supervisor: any) => supervisor.id === event.user.id)
        const allowKeys = ['id', 'title']
        // is all update keys allowed
        const isAllUpdateKeysAllowed = Object.keys(event.payload.content).every(key => allowKeys.includes(key))
        return isSupervisor && isAllUpdateKeysAllowed
    }
})

// Connect two conditions using `BoolExp`
interactions.update.conditions = boolExpToConditions(BooleanExp.and(isOwnerCondition, supervisorUpdateCondition))
```

In Interaqt, you have access to all interaction data, allowing for any complex permission control.

## Utilizing Proper Abstractions for Interactions and Activities
A common challenge faced by traditional Content Management Systems (CMS) is their struggle to adapt when applications grow in complexity beyond simple content management. 
Present-day CMSs either encapsulate a wide range of functionalities to cover diverse user scenarios or offer concepts like custom controllers,
allowing users to treat the CMS as an entity system, 
similar to using an Object-Relational Mapping (ORM) system. 
Interaqt, however, provides a more accurate set of abstractions to describe the entire application.


Consider the implementation of a "like" feature. Some CMSs have this feature built-in, 
while others require you to define a custom 'like' field and manipulate data through custom api. 
Interaqt's approach is more aligned with business semantics:

Firstly, define a "like" interaction:

```typescript
// Define like Interaction
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

Fundamentally, liking is about establishing a relationship between a "user" and content. 
This relationship is facilitated by likeInteraction, 
leading to the following definition of the relationship between "user" and "content":

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

Further restrictions can be added to the like Interaction, such as preventing duplicate likes or disallowing users from liking their own content.

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

const shouldNotLikeOwnContentCondition = Condition.create({
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

Consider a scenario where a user can like content from the same user a maximum of ten times within 24 hours. 
This is challenging to implement in traditional CMSs, which often lack abstractions for "relationships" and "events." 
Even if manually implemented, it involves cumbersome operations like manual counting. 
Interaqt, however, records the "like" timestamp in relationships and utilizes an Event entity for querying.

```typescript
// First, add a createdAt property in likeRelation
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

// Then, add a Condition
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

In essence, the primary distinction between Interaqt and traditional CMS is their focal point. 
Traditional CMS centralizes around the concept of "content," building applications through various auxiliary means. 
In contrast, Interaqt revolves around the concepts inherent to the application itself, 
providing tools for content-type scenarios for rapid implementation. 
This approach grants Interaqt a more accurate and flexible use of abstractions.

To ensure product completeness, CMS often includes management systems for users and organizations. 
However, in complex applications, users typically have their own user systems. 
The user system provided by the CMS can result in the need for additional synchronization work. 
Interaqt does not have any such preset constraints, allowing you the freedom to choose your preferred user system, such as Auth0. 
For more information, refer to [advanced/use-logto-as-authentication-system](../advanced/use-logto-as-authentication-system).