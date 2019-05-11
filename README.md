# 捉妖雷达 web版

欢迎PR，捉妖雷达q群：1025673494    

### 为什么要做web版

因为实在忍受不了小程序雷达的不稳定，socket动不动502错误还没法重连，所以偷偷把雷达源码搞下来，改写了个web版。    
目前前端还在WIP。可能随时会被封，感谢@ZachXia提供的思路。   

### QQ机器人配置

#### 步骤

1.安装 [酷Q Air](https://cqp.cc/t/23253) 机器人，用小号配置成功；   
2.安装 [Newbe.Mahua](http://www.newbe.pro/2019/01/25/Newbe.Mahua/Start-With-Mahua-In-V2.0/) 框架，并根据教程打开插件；   
3.在本地运行php开发环境（如xampp,lnmp)等，并将项目目录设为根目录；  
4.浏览器运行127.0.0.1(或localhost)，F12 控制台执行以下配置即可开启；
```
app.botSetup({
    qqGroup:群号,
    welcome:"机器人开启欢迎信息", //留空则不发送
    location:{
        longitude:经度,
        latitude:纬度,
    },
});
```

注意：需要保持酷Q、插件、网页三者都开启！  

### 更新日志

#### v0.7    
第一次进入默认打开菜单   
更新bot机器人实时监控功能

#### v0.6    
更新筛选库    
界面优化    
Cookie存储设定    

#### v0.5 
界面优化，侧边栏筛选    
点击地图自动筛选功能    

