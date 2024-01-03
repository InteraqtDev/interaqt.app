---
sidebar_position: 2
---

# Interaction

## 创建 Interaction

Interaction 是用户可以执行的交互动作，近似等于一个 post api。
和其他 Web 框架不同的是，我们不需要声明当 interaction 发生时，应该如何处理数据。
而是在数据定义中反向引用 Interaction，具体见 [Use Computed Data](./computed-data)

一个简单的交友 interaction 如下:

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

## 使用 Condition

Condition 用于限制当前用户执行 Interaction。在 Condition 的条件判断中可以获取到当前用户、 payload 等所有信息，可以用来做复杂的判断。
例如，我们限制年龄小于 20 的用户不能 sendRequest 给年龄大于 50 的用户：

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

在 Condition 中常常会使用到 `Controller.system.storage` 来获取数据，具体的 API 参考 [reference/storage](../reference/storage)。

### 使用 BoolExp 来连接 Conditions

当 Condition 条件比较复杂时，我们可以通过 `BoolExp` 来连接多个 Condition 建立逻辑组合，然后再通过 `boolExpToConditions` 转化成 Condition。
例如，我们在刚才的例子中加上，用户不能发送给和自己  role 不相同的用户。然后使用 `BoolExp` 来连接两个条件：

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
    // 使用 boolExpToConditions 将 boolExp 转换成 Conditions
    conditions: boolExpToConditions(
        // 使用 and 连接两个条件
        BoolExp.and(shouldNotSendCondition, shouldNotSendCondition2)
    ),
    //...
})
```

## 使用 Attribute

Attributive 可以限制可以执行当前 Interaction 的用户，也可以用来限制 Payload。
它可以看做是 Condition 的更具体的用法。

### 创建 Attributive

不要在 Attributive 中使用外部变量，应该保持 Attributive 是个纯函数。不然会在序列化和反序列化时失效。

一个声明 “我的” 的 Attributive 如下：

```typescript
const Mine = Attributive.create({
    name: 'Mine',
    content: function (this: Controller, request, {user}) {
        return request.owner === user.id
    }
})
```

在 Interaqt/runtime 中我们为你内置了一个 `createUserRoleAttributive` 函数帮助你快速创建角色定语：

```typescript
const adminRole = createUserRoleAttributive({name: 'admin'})
```

注意，它假定了你的 User Entity 中含有一个 `string[]` 类型的 `roles` 字段。
在 Attributive 中使用到的 `Controller.system.storage` API 请参考 [reference/storage](../reference/storage)。


### 创建通用的 Attributive

可以在业务上规定一些固定的定语，例如上面例子中 “我的”：它会检查实体上的 owner 字段是不是指向当前 interaction
请求的用户。那么只有有 `owner`
字段，并且确实是 UserEntity 类型，就可以使用这个定语。
当然，如果你不想固定用 `owner` 这个名字，但又想使用通用的定语，我们可以把字段信息和相应的实体细心通过 controller.globals
注入到 attributive 中让它动态判断。

### 使用 BoolExp 来连接 Attributive

当定语限制条件比较复杂时，我们可以通过 `BoolExp` 来连接多个定语建立逻辑组合，然后再通过 `boolExpToAttributives` 转化成定语。

```typescript
const MyPending = boolExpToAttributives(
    BoolExp.atom(Mine).and(
        Attributive.create({
            name: 'Pending',
            content: async function (this: Controller, request, {user}) {
                return request.result === 'pending'
            }
        })
    )
)
```

## 创建 GET Interaction 获取数据

当我们要获取数据时，可以通过创建 GET Interaction 来实现。例如，获取我的所有等待中的请求：

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

注意，它的 action 必须是 import 进来的 GetAction。
它的 data 字段，表示用户获取的数据类型。
它的 dataAttributive，使用来限制用户能获取的数据范围的。

### 获取复杂的数据计算/组合结果

当我们要获取的内容不是一个简单的实体，而是一种计算/组合结果时，我们可以通过定义一个 Computation 来实现：

例如，获取系统中用户平均创建的 Request 数量：

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

在计算中使用到的 `Controller.system.storage` API 请参考 [reference/storage](../reference/storage)。

