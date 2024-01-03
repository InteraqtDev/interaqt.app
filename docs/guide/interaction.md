# Interaction

## Creating Interactions

An Interaction represents an action a user can perform, similar to a post API.
Unlike other web frameworks, we don't need to declare how data should be handled when an interaction occurs.
Instead, we reference Interactions backward in data definitions, as detailed in [Use Computed Data](./computed-data).

A simple friendship interaction is as follows:

```typescript
const sendInteraction = Interaction.create({
  name: 'sendRequest',
  action: Action.create({name: 'sendRequest'}),
  payload: Payload.create({
    items: [
      PayloadItem.create({
        name: 'to',
        base: UserEntity,
        itemRef: userRefB
      })
    ]
  })
})

```

## Using Condition
Condition is used to restrict the current user's execution of Interaction. 
Within the Condition's evaluation, you can access information about the current user, payload, and more, enabling complex judgments. 
For example, we might restrict users under the age of 20 from sending requests to users over the age of 50:

```typescript
const shouldNotSendCondition = Condition.create({
    name: 'shouldNotSend',
    content: async function (this: Controller, event: InteractionEventArgs) {
        const BoolExp = this.global.BoolExp
        const match = BoolExp.atom({key: 'id', value: ['=', event.payload.to.id]})
        const toUser = await this.system.storage.get('User', match)
        return !(event.user.age < 20 && toUser.age > 50)
    }
})

const sendInteraction = Interaction.create({
    name: 'sendRequest',
    action: Action.create({name: 'sendRequest'}),
    conditions: shouldNotSendCondition,
    payload: Payload.create({
        items: [
            PayloadItem.create({
                name: 'to',
                base: UserEntity,
                itemRef: userRefB
            })
        ]
    }),
})

```

In Condition, `Controller.system.storage` is often used to fetch data. For specific APIs, refer to [reference/storage](../reference/storage).

### Using BoolExp to Link Conditions
When conditions are complex, `BoolExp` can be used to link multiple conditions to form logical combinations. 
These are then transformed into Condition using `boolExpToConditions`. 
For instance, adding to our previous example, let’s say users cannot send to users with a different role. We can connect these two conditions using `BoolExp`:
```typescript
import {bool} from "prop-types";

const shouldNotSendCondition2 = Condition.create({
    name: 'shouldNotSend2',
    content: async function (this: Controller, event: InteractionEventArgs) {
        const BoolExp = this.global.BoolExp
        const match = BoolExp.atom({key: 'id', value: ['=', event.payload.to.id]})
        const toUser = await this.system.storage.get('User', match)

        return event.user.role === toUser.role
    }
})

const sendInteraction = Interaction.create({
    // Use boolExpToConditions to convert BoolExp into Conditions
    conditions: boolExpToConditions(
        // Connect two conditions using and
        BoolExp.and(shouldNotSendCondition, shouldNotSendCondition2)
    ),
    //...
})
```


## Using Attributes

Attributive can restrict the users who can perform the current Interaction and can also be used to limit Payload.

### Creating Attributive

Avoid using external variables in Attributive; it should remain a pure function. Otherwise, it may become invalid during serialization and deserialization.

An Attributive declaring "Mine" looks like this:

```typescript
const Mine = Attributive.create({
    name: 'Mine',
    content:  function(this: Controller, request, { user }){
      return request.owner === user.id
    }
})
```

For the `Controller.system.storage` API used in the computations, please refer to [reference/storage](../reference/storage).

### Creating Generic Attributives

You can define certain attributives based on business rules, such as "Mine": it checks if the owner field on the entity points to the user making the current interaction request. You can have multiple differently named fields; it's recommended to inject field information through controller.globals into the attributive for evaluation rather than hardcoding it within Attributive

#### Using BoolExp to Combine Attributives

```typescript
boolExpToAttributives(
    BoolExp.atom(Mine).and(
        Attributive.create({
            name: 'Pending',
            content: async function(this: Controller, request, { user }){
             return request.result === 'pending'
            }
        })
    )
)
```


## Creating GET Interaction for Data Retrieval
To retrieve data, we can create a GET Interaction. For example, to fetch all my pending requests:

```typescript
import {GetAction} from "@interaqt/runtime";

const getMyPendingRequestsInteraction = Interaction.create({
    name: 'getMyPendingRequests',
    action: GetAction,
    dataAttributive: boolExpToAttributives(
        BoolExp.atom(Mine).and(
            Attributive.create({
                name: 'Pending',
                content: async function (this: Controller, request, {user}) {
                    return request.result === 'pending'
                }
            })
        )),
    data: RequestEntity,
})

```

Note that its action must be the imported GetAction. 
The `data` field indicates the type of data the user is retrieving. 
The `dataAttributive` is used to restrict the range of data accessible to the user.

### Retrieving Complex Data Computations/Combinations
When the content to be retrieved is not a simple entity but a computed/combined result, this can be achieved by defining a Computation:

For example, to get the average number of Requests created by users in the system:

```typescript
const average = Computation.create({
    content: async function () {
        const totalUsers = await this.system.storage.find('User').length
        const totalRequests = await this.system.storage.find('Request').length
        return totalRequests / totalUsers
    }
})

const getMyPendingRequestsInteraction = Interaction.create({
    name: 'getAverage',
    action: GetAction,
    data: averageRequestsCount,
})
```

For the `Controller.system.storage` API used in the computations, please refer to [reference/storage](../reference/storage).