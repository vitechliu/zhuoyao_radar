# 捉妖雷达 web版

[![GPL Licence](https://badges.frapsoft.com/os/gpl/gpl.svg?v=103)](https://opensource.org/licenses/GPL-3.0/)  [![Gitter](https://badges.gitter.im/zhuoyao_radar/community.svg)](https://gitter.im/zhuoyao_radar/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)

欢迎PR，声明：本项目永远不会提供虚拟定位、经纬度坐标、自动化脚本相关服务。   
如果有需求可以搜索其他全站zhuoyao开源项目。 

**因工作室滥用接口 现在雷达获取数据不稳定 请见谅 开源不易**

### 为什么要做web版

因为实在忍受不了小程序雷达的不稳定，socket动不动502错误还没法重连，所以改写了一个web版。    
目前前端还在开发当中。可能随时会被封，感谢@ZachXia提供的思路。   


### QQ机器人配置

#### 步骤

警告，以下步骤特别复杂，不建议小白独自尝试！   

1.安装 [酷Q Air](https://cqp.cc/t/23253) 机器人，用小号配置成功；   
2.安装 [Newbe.Mahua](http://www.newbe.pro/2019/01/25/Newbe.Mahua/Start-With-Mahua-In-V2.0/) 框架，并根据教程打开插件；   
3.在本地运行php开发环境（如[xampp](https://www.apachefriends.org/index.html),phpstudy)等，并将项目目录设为根目录；  
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

#### v1.5.0   
加入搜索范围显示选项   

#### v1.4   
加入活动up标识    
加入人生赢家套系妖灵  

#### v1.3 
加入自定义筛选   
更新妖灵数据到 736ccf     

#### v1.2
（感谢@galleonsZcc 大佬）
大范围搜索加入任务队列和超时重连机制  

#### v1.1   
优化项目结构，删除旧文件和测试页    
更新妖灵数据到 520b92   

#### v1.0      
大范围搜索改动    
提示优化      


