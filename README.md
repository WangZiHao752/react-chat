## 介绍
`简易聊天页面`
## 技术栈
前端：react + socket.io-client + antd
后端：express + socket.io

### 使用步骤

1. 打包项目
    npm run build
2. 启动项目
    npm run serve



登陆以后 id加网名 绑定 然后保存

```js
let userList = [ //在线用户列表
  {
    username:"123456",
    avatar1:'',  //头像
    id:"asdaffasfasf",
    isInputting:true,
  }
]; 
```


### 待完成  退出登陆 更新在线用户列表