---
sidebar_position: 2
---

# Attributive


## 使用 Attribute

Attributive 可以限制可以执行当前 Interaction 的用户，也可以用来限制 Payload。

### 创建 Attributive

不要在 Attributive 中使用外部变量，应该保持 Attributive 是个纯函数。不然会在序列化和反序列化时失效。

一个声明 “我的” 的 Attributive 如下：

```typescript
const Mine = Attributive.create({
    name: 'Mine',
    content:  function(this: Controller, request, { user }){
      return request.owner === user.id
    }
})
```

在 Interaqt/runtime 中我们为你内置了一个 `createUserRoleAttributive` 函数帮助你快速创建角色定语：
```typescript
const adminRole = createUserRoleAttributive({name: 'admin'})
```
注意，它假定了你的 User Entity 中含有一个 `string[]` 类型的 `roles` 字段。

### 创建通用的 Attributive

可以在业务上规定一些固定的定语，例如上面例子中 “我的”：它会检查实体上的 owner 字段是不是指向当前 interaction 请求的用户。那么只有有 `owner`
字段，并且确实是 UserEntity 类型，就可以使用这个定语。
当然，如果你不想固定用 `owner` 这个名字，但又想使用通用的定语，我们可以把字段信息和相应的实体细心通过 controller.globals 注入到 attributive 中让它动态判断。

### 使用 BoolExp 来连接 Attributive

当定语限制条件比较复杂时，我们可以通过 `BoolExp` 来连接多个定语建立逻辑组合，然后再通过 `boolExpToAttributives` 转化成定语。

```typescript
const MyPending = boolExpToAttributives(
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
