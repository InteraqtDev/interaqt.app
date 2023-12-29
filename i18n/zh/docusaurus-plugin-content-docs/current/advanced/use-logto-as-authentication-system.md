# Use Logto As Authentication System


# 0. 安装
logto 提供了用户登录注册的界面、api 权限验证的能力。
建议使用 docker 安装 logto。参看 [https://docs.logto.io/docs/tutorials/get-started/#local](https://docs.logto.io/docs/tutorials/get-started/#local)

在 logto 中创建一个应用，选择 vanilla js。获得 app_id 和 app_secret。
图1

接下来我们要做的是：
- 对未登录用户自动跳转 logto 的登录注册
- 并通过配置 logto webhook，让它自动把新用户信息同步给 Interaqt
- 配置 logto 的 api resource，为登录用户生成用于鉴权的 access token
- 让用户的 api 请求中都带上 access token， Interaqt 接到请求后先拿 token 去 logto 验证，验证通过后再继续处理请求。



# 1. 跳转到登录界面

在前端中使用 logto 提供的 sdk 来判断用户的登录情况
```jsx
const client = new LogtoClient({
    endpoint: 'http://localhost:3001/',
    appId: 'wfbifcrhmz1o7q4mvekdm',
    resources:[API_ADDR]
});

if (await logtoClient.isAuthenticated()) {
    window.location.href = 'http://localhost:5173/app.html'
} else {
    logtoClient.signIn('http://localhost:5173/app.html') // 这是登录成功的回调
}
```

## 2. 保护 api

在 logto 中先注册要保护的 api 地址。
图2


Interaqt 已经在 `@interaqt/utility` 中为你封装好了自动附加 access token 的 `post` 函数，你只需要调用就可以了。
```typescript
import { post } from '@interaqt/utility'
const result = await post('/interaction/xxx', {})
```

在前端发的请求中带上获取api 地址的 access token。


4. 在 interaqt 中写 parseUserId，验证 token，得到用户的 id

在 server.ts 中同样使用 @interaqt/utility 即可

```typescript
startServer(controller, {
    port: 3000,
    parseUserId: async (headers: IncomingHttpHeaders) => {
        return (await client.verifyJWTForAPI(headers)).sub
    }
})
```

