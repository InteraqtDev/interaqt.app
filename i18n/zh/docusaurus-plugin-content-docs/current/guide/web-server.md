# Web Server

Interaqt 导出了一个 `startServer` 函数，你可以用它来快速创建 server。它默认使用的是 `fastify` 作为底层。
使用 `npx create-interaqt-app` 创建的应用可以在 `/server.ts` 中找到相关配置。

## 初始化数据
除了 `server.ts`，你还可以在 `/install.ts` 中找到初始化数据库的脚本。
通过 `npm run install` 可以执行该脚本。
默认情况下它只会创建数据库和表。如果你需要添加初始化数据，可以直接修改脚本。
通过 `controller.system.storage.create` 函数来插入初始数据。

## 鉴权

`startServer` 的第二参数 config 中有个 `parseUserId` 配置，你在这里可能获取到每个请求的信息（标准的 fastify Request 对象），
你可以在这里实现对每个请求的权限控制。
在 create-interaqt-app 默认生成的代码中，直接读取 x-user-id 作为 userId，是为了让开发者在开发/测试环境下，能快速通过传入的参数来
模拟当前用户的。

我们建议使用完整的注册登录及及安全系统，例如 logto/auth0 等。
请参考 [use logto as authentication system](../advanced/use-logto-as-authentication-system)。


## 自定义 api
Interaqt 会默认为所有的  Interaction 创建同名的路由，例如 `createRequest` 会创建 `POST /interaction/createRequest` 的路由。
如果你有需要手动创建路由，可以通过第三参数传入。
我们可以使用 `createDataAPI` 直接将函数暴露成 api，其中传入的参数如果实现了 fromValue 和 toValue 方法，会自动进行序列化和反序列化。
一个直接暴露  record 查询接口的例子。其中的 BoolExp 类实现了 fromValue 和 toValue 方法。
在 client 端调用的时候可以通过 BoolExp 来构建参数，在真正调用时在使用它的 toValue 方法来序列化。

```typescript
const apis = {
    getRecords: createDataAPI(
        function getRecords(
            this: Controller, 
            context: DataAPIContext, 
            recordName:string, 
            match: BoolExp<any>, 
            attributes = ['*']
        ) {
            return this.system.storage.find(recordName, match, undefined, attributes)
        }, 
        { allowAnonymous: true, params: ['string', BoolExp, 'object'] }
    ),
}

startServer(controller, {
    port: PORT,
    parseUserId: async (headers: IncomingHttpHeaders) => {
        return headers['x-user-id'] as string
    }
}, apis)

```

在 Custom API 中常常会使用到 `Controller.system.storage` 来处理数据，具体的 API 参考 [reference/storage](../reference/storage.md)。

