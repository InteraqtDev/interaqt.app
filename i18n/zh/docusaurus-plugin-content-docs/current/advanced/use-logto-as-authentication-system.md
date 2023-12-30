# 使用 Logto 作为权限和用户系统

## 0. 安装与准备
logto 提供了用户登录注册的界面、api 权限验证的能力。
建议使用 docker 安装 logto。参看 [https://docs.logto.io/docs/tutorials/get-started/#local](https://docs.logto.io/docs/tutorials/get-started/#local)
安装成功后，一般通过 `http:127.0.0.1:3002`可以访问到 logto admin console。
logto 应用运行在 `http://127.0.0.1:3001`。这个地址在下面也被称为 `LOGTO_ENDPOINT`。

Interaqt 应用与 logto 的关系如下图所示。    
注册与登录:

<p align="left">
<img src="/img/logto-signin.png" style={{maxWidth:540,width:"100%"}} />
</p>

API 调用:
<p align="left">
<img src="/img/logto-api-call.png" style={{maxWidth:540,width:"100%"}} />
</p>


## 1. 在 logto 中创建 vanilla js 应用。

在 logto 中创建一个应用，选择 vanilla js，获得 app_id。该应用用于前端处理用户的登录和注册。
在下面的代码中，由前端来处理的登录跳转等逻辑，使用的都是这个 Vanilla JS 应用的 app_id。

<p align="left">
<img src="/img/logto-vanilla-app.png" style={{maxWidth:640,width:"100%"}} />
</p>

## 2. 在 logto 中创建 Machine to Machine 应用

该应用用于 Interaqt 从 logto 同步用户数据和调用  api 时的鉴权。
在下面的代码中，由后端来处理的鉴权等逻辑，使用的都是这个Machine to Machine应用的 app_id 的 app_secret

<p align="left">
<img src="/img/logto-m2m-app.png" style={{maxWidth:640,width:"100%"}} />
</p>

## 3. 在 logto 中创建 api resource

用于对 api 调用的进行保护。
<p align="left">
<img src="/img/logto-api-resource.png" style={{maxWidth:640,width:"100%"}} />
</p>

## 4. 配置 logto new account webhook
让 logto 在新用户注册时自动把新用户信息同步给 Interaqt。

<p align="left">
<img src="/img/logto-webhook.png" style={{maxWidth:640,width:"100%"}} />
</p>

注意，如果你是在 docker 中启动的 logto，那么你需要把 `localhost` 改成 `host.docker.internal`，例如：
```bash
http://host.docker.internal:4000/api/syncUser
```

至此，所有的 logto 配置都已结束。

## 5. 在 `server.ts` 中创建 `/api/syncUser` 接口
利用 Interaqt 的 custom api 来创建`/api/syncUser` 接口，该接口用于接受 webhook 的请，将 logto 的信息用户信息同步到 Interaqt。
Webhook 中的字段信息请参看 [https://docs.logto.io/docs/recipes/webhooks/webhook-request/](https://docs.logto.io/docs/recipes/webhooks/webhook-request/)

```typescript
const apis = {
    syncUser: createDataAPI(function syncUser(this: Controller, context: DataAPIContext, body: any) {
        return this.system.storage.create('User', {id: body.user.id, name: body.user.username})
    }, {allowAnonymous:true, useNamedParams: true})
}

startServer(controller, {
    port: 3000,
    parseUserId: async (headers: IncomingHttpHeaders) => {
        // ...
    }
}, apis)
```

## 6. 在前端使用 @interaqt/utility 判断用户是否登录

在前端中使用 `@interaqt/utility` 封装的 sdk 来判断用户的登录情况。
注意这里使用的 APP_ID 是上面创建的 Vanilla JS 应用的。

```jsx
import {Client} from '@interaqt/utility/browser.js'
export const client = new Client(LOGTO_ENDPOINT, VANILLA_JS_APP_ID, INTERAQT_ENDPOINT)

if (await client.client.isAuthenticated()) {
    window.location.href = 'http://localhost:5173/app.html' // 你自己的前端应用地址
} else {
    client.client.signIn('http://localhost:5173/app.html') // 登录成功的回调
}
```

## 7. 使用 @interaqt/utility 提供的 api 的函数来发起 interaqt api 请求。

Interaqt 已经在 `@interaqt/utility` 中为你封装好了自动附加 access token 的 `post` 函数，在前端你只需要调用就可以了。
注意这里使用的 APP_ID 是上面创建的 Vanilla JS 应用的。

```typescript
import {Client} from '@interaqt/utility/browser.js'
export const client = new Client(LOGTO_ENDPOINT, VANILLA_JS_APP_ID, INTERAQT_ENDPOINT)

const result = await client.post('/interaction/sendFriendRequest', {})
```


## 8. 在 Interaqt server.ts 调用 @interaqt/utility 提供的 api，用于对 api 访问进行鉴权。
在 `server.ts` 中同样使用 @interaqt/utility 即可。
注意这里使用的 APP_ID 和 APP_SECRET 是上面创建的 Machine to Machine 应用的。

```typescript
import { Client } from '@interaqt/utility/server.js'
const client = new Client(LOGTO_ENDPOINT, MACHINE_TO_MACHINE_APP_ID, MACHINE_TO_MACHINE_APP_SECRET, INTERAQT_ADDR)

startServer(controller, {
    port: 3000,
    parseUserId: async (headers: IncomingHttpHeaders) => {
        return (await client.verifyJWTForAPI(headers)).sub
    }
})
```

