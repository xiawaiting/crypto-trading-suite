## 使用
教程1:
https://juejin.cn/post/7184701797506744375

教程2:
https://console.firebase.google.com/project/code-platform-389300/overview?hl=zh-cn
```
npm install firebase
yarn add firebase
```

然后，针对要使用的产品来初始化 Firebase 并开始使用相应 SDK。
```js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase product