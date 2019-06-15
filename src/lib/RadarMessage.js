/*
 * @Author: Vitech
 * @Desc: socket消息 用于处理
 */
class RadarMessage {
    constructor(opts) {
        let defaults = {
            type: "yaoling", //搜索内容
            wide: false, //是否为大范围查询
            groupId:null, //群组搜索id
            id:null, //message id
            maxTimeout: 3000, //超时无回应时间
            lng:null,
            lat:null,
        };

        this.opts = Object.assign({}, defaults, opts);

        this.status = "seaching"; 
        //searching 搜索中 
        //success 已得到结果 
        //timeout 超时
        return this;
    }

    initMessage() {
        


    }

    
}