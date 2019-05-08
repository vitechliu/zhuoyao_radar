var e = getApp(), 
t = require("../../utils/util.js"), 
a = require("../../utils/storage.js"), 
i = require("../../utils/socketUtils.js"), 
o = 0, s = "", n = !1, r = !1, l = [], c = "", g = !0, h = !1, d = !1, u = [], f = "1", m = {}, p = 0, w = -1, S = !0, v = {
    MESSAGE_YAOJINGS: [],
    MESSAGE_LEITAI: [],
    MESSAGE_SETTING: [],
    MESSAGE_BOSS_LEVLE: [],
    MESSAGE_VERSION: []
}, I = [ -1, -1, -1, -1, -1 ];

Page({
    data: {
        showInfo: !1,
        showLoading: !1,
        showButtons: !0,
        showNavigation: !1,
        showNavigationButtons: !1,
        latitude: 22.5412,
        longitude: 113.9502,
        scale: 19,
        showLeitai: !1,
        showReConfirmModal: !1,
        markers: [],
        selectedYaojing: {},
        showNotify: !1
    },
    getSocketUrl: function() {
        return "wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0";
    },
    clearRecMessageList: function(e) {
        e ? v[e] = [] : v = {
            MESSAGE_YAOJINGS: [],
            MESSAGE_LEITAI: [],
            MESSAGE_SETTING: [],
            MESSAGE_BOSS_LEVLE: [],
            MESSAGE_VERSION: []
        };
    },
    setIntervalForRequest: function(e, a) {
        var i = this, n = t.getRequestIndex(e);
        -1 == I[n] && (I[n] = setInterval(function() {
            if (clearInterval(I[n]), I[n] = -1, s = t.isAllRequestReceive()) o = 0; else switch (o += 1) {
              case 1:
                setTimeout(function() {
                    i.sendMessage(a, e);
                }, 1e3);
                break;

              case 2:
              case 3:
                setTimeout(function() {
                    i.sendMessage(a, e);
                }, 2e3);
                break;

              case 4:
              case 5:
                setTimeout(function() {
                    i.sendMessage(a, e);
                }, 3e3);
                break;

              case 6:
                o = 0, wx.hideLoading(), wx.showToast({
                    title: "雷达无法获得周围信息，请再探测一次",
                    icon: "none"
                });
            }
        }, 3e3));
    },
    sendMessage: function(e, t) {
        var a = this;
        console.log("发送消息！", n), n ? (this.clearRecMessageList(t), i.sendSocketMessage(e, function() {
            wx.hideLoading(), wx.showToast({
                title: "网络错误！",
                icon: "none"
            }), a.pushMsgQueue(e);
        }), this.setIntervalForRequest(t, e)) : (this.pushMsgQueue(e), wx.hideLoading(), 
        wx.showToast({
            title: "网络错误！",
            icon: "none"
        }));
    },
    getSettingFileName: function() {
        var e = {
            request_type: "1004",
            cfg_type: 1,
            requestid: t.genRequestId("10041"),
            platform: 0
        };
        this.sendMessage(e, "10041");
    },
    getBossLevelConfig: function() {
        var e = {
            request_type: "1004",
            cfg_type: 0,
            requestid: t.genRequestId("10040"),
            platform: 0
        };
        this.sendMessage(e, "10040");
    },
    getYaojingInfo: function() {
        var e = {
            request_type: "1001",
            longtitude: t.convertLocation(this.data.longitude),
            latitude: t.convertLocation(this.data.latitude),
            requestid: t.genRequestId("1001"),
            platform: 0
        };
        this.sendMessage(e, "1001");
    },
    getLeitaiInfo: function() {
        var e = {
            request_type: "1002",
            longtitude: t.convertLocation(this.data.longitude),
            latitude: t.convertLocation(this.data.latitude),
            requestid: t.genRequestId("1002"),
            platform: 0
        };
        this.sendMessage(e, "1002");
    },
    pushMsgQueue: function(e) {
        for (var t = 0; t < l.length; t++) if (l[t].request_type == e.request_type) return void (l[t] = e);
        l.push(e);
    },
    connectSocket: function() {
        wx.connectSocket({
            url: this.getSocketUrl()
        });
    },
    socketConnectedCallback: function(t) {
        if (n = !0, console.log("WebSocket连接已打开！", n), this.clearRecMessageList(), l.length > 0) {
            for (var a = 0; a < l.length; a++) i.sendSocketMessage(l[a]);
            l = [];
        }
        r || (console.log("首次拉取配置文件！"), this.getSettingFileName(), this.getBossLevelConfig()), 
        console.log("currentVersion is ", c), "" != c && (e.globalData.yaojingList = wx.getStorageSync("YaojingList"), 
        e.globalData.iconList = wx.getStorageSync("iconList"), d = !0);
    },
    getVersionFileName: function(e) {
        console.log("fileName", e), e != c ? this.downloadFile(e) : (console.log("版本一致，无需更新！"), 
        r = !0);
    },
    getIconConfig: function() {
        var t = {
            Switch: [ {
                Id: 1,
                mapIconName: "快速追踪",
                mapIconSwitch: !0
            }, {
                Id: 2,
                mapIconName: "妖灵",
                mapIconSwitch: !0
            }, {
                Id: 3,
                mapIconName: "擂台",
                mapIconSwitch: !0
            }, {
                Id: 4,
                mapIconName: "神石",
                mapIconSwitch: !0
            }, {
                Id: 5,
                mapIconName: "神灵",
                mapIconSwitch: !0
            }, {
                Id: 6,
                mapIconName: "图鉴",
                mapIconSwitch: !0
            }, {
                Id: 7,
                mapIconName: "筛选",
                mapIconSwitch: !0
            }, {
                Id: 8,
                mapIconName: "设置",
                mapIconSwitch: !0
            } ]
        };
        e.globalData.iconList;
        this.setData({
            iconInfo: t.Switch
        });
    },
    checkMessage: function(e, t) {
        var a = !1;
        if (0 != e) {
            v[e].length > 0 && t.requestid != v[e][0].requestid && (v[e] = []), v[e].push(t);
            for (var i = 0; i < v[e].length; i++) v[e][i].end && v[e].length == v[e][i].packageNO && (a = !0);
        }
        return a;
    },
    mergeMessage: function(e) {
        var t = [];
        if (console.log("收到消息", e), v[e].length > 0) switch (e) {
          case "1004":
            break;

          case "1001":
            for (var a = 0; a < v[e].length; a++) if (v[e][a].sprite_list) for (var i = 0; i < v[e][a].sprite_list.length; i++) t.push(v[e][a].sprite_list[i]);
            break;

          case "1002":
            for (var o = 0; o < v[e].length; o++) if (v[e][o].dojo_list) for (var s = 0; s < v[e][o].dojo_list.length; s++) t.push(v[e][o].dojo_list[s]);
        }
        return t;
    },
    recMessage: function(e) {
        var i = this, n = t.utf8ByteToUnicodeStr(new Uint8Array(e.data).slice(4));
        if (n.length > 0 && (console.log("收到服务器消息", n), n = JSON.parse(n)), 0 != n.retcode) wx.hideLoading(); else {
            var r = "" + (c = t.getRequestTypeFromId(n.requestid));
            if (this.checkMessage(r, n)) {
                n.needreqagain ? setTimeout(function() {
                    switch (c) {
                      case "1001":
                        i.getYaojingInfo();
                        break;

                      case "1002":
                        i.getLeitaiInfo();
                    }
                }, 1e3) : setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
                var l = this.mergeMessage(c);
                switch (c) {
                  case "10041":
                    this.getVersionFileName(n.filename);
                    break;

                  case "10040":
                    console.log("妖灵等级", n), a.saveBossStartAndEndLevel(n.startlevel, n.endlevel);
                    break;

                  case "1001":
                    console.log("获取到妖灵数量", l.length), this.getIconConfig(), this.getYaojingsNearby(l);
                    break;

                  case "1002":
                    this.getLeitaiNearby(l);
                }
            }
        }
        var c = t.getRequestTypeFromId(n.requestid);
        clearInterval(I[t.getRequestIndex(c)]), o = 0, I[t.getRequestIndex(c)] = -1, t.clearRequestId(n.requestid);
        var g = t.isAllRequestReceive();
        s = g;
    },
    initSocket: function() {
        var e = this, t = this;
        this.connectSocket(), wx.onSocketOpen(function(t) {
            e.socketConnectedCallback(t);
        }), wx.onSocketError(function(e) {
            console.log("WebSocket连接打开失败，请检查！"), n = !1;
        }), wx.onSocketClose(function(e) {
            console.log("WebSocket 已关闭！"), n = !1, setTimeout(function() {
                t.connectSocket();
            }, 500);
        }), wx.onSocketMessage(function(t) {
            e.recMessage(t);
        });
    },
    getYaojingsNearby: function(t) {
        ("1" == f || e.globalData.quickSearchYaoguai.Id > 0) && this.buildMarkersByData(t, "1");
    },
    getLeitaiNearby: function(t) {
        ("1" != f || e.globalData.quickSearchYaoguai.Id < 0) && this.buildMarkersByData(t, "2");
    },
    buildSpriteMarker: function(e, i, o) {
        var s = {}, n = "";
        if ("1" == o && (n = t.getHeadImagePath(i.sprite_id)), "2" == o && (n = "/image/icon/leitai.png"), 
        "3" == o && (n = t.getBossEggImage(i.starlevel), t.getStorageValue(a.bossEggTimeShowed))) {
            var r = t.formatDateTime(i.freshtime) + "孵化";
            s = {
                content: r,
                color: "#FFFFFF",
                fontSize: 9,
                padding: 1,
                borderWidth: 1,
                borderRadius: 10,
                bgColor: "#F15F1D",
                anchorX: -13 * r.length * .5 / 2
            };
        }
        if ("4" == o && (n = t.getHeadImagePath(i.bossid), t.getStorageValue(a.bossTimeShowed))) {
            var l = t.formatDateTime(i.freshtime) + "消失";
            s = {
                content: l,
                color: "#FFFFFF",
                fontSize: 9,
                padding: 1,
                borderWidth: 1,
                borderRadius: 10,
                bgColor: "#F15F1D",
                anchorX: -13 * l.length * .5 / 2
            };
        }
        if ("5" == o) {
            var c = "";
            n = t.cdnAddr + "small/" + i.ImgName + ".png", 0 == i.state || 4 == i.state || 3 == i.state ? n = "/image/head/leitai.png" : (c = i.starttime ? t.formatDateTime(i.lifetime + i.starttime) : t.formatDateTime(i.lifetime), 
            -2 == i.Id ? (n = "/image/head/" + i.ImgName + ".png", c += "孵化") : c += "消失", s = {
                content: c,
                color: "#FFFFFF",
                fontSize: 9,
                padding: 1,
                borderWidth: 1,
                borderRadius: 10,
                bgColor: "#F15F1D",
                anchorX: -13 * c.length * .5 / 2
            });
        }
        return s.content ? {
            id: e,
            latitude: i.latitude / 1e6,
            longitude: i.longtitude / 1e6,
            iconPath: n,
            width: 40,
            height: 40,
            label: s
        } : {
            id: e,
            latitude: i.latitude / 1e6,
            longitude: i.longtitude / 1e6,
            iconPath: n,
            width: 40,
            height: 40
        };
    },
    buildMarkersByData: function(t, i) {
        this.data.markers = [];
        var o = wx.getStorageSync(a.hasSetted);
        if (t) if ("1" == i) {
            var s = [];
            o && (s = wx.getStorageSync(a.showedYaojingIds));
            for (var n = 0; n < t.length; n++) o && s.indexOf(t[n].sprite_id) < 0 || e.globalData.quickSearchYaoguai.Id > 0 && e.globalData.quickSearchYaoguai.Id != t[n].sprite_id || this.data.markers.push(this.buildSpriteMarker(n, t[n], 1));
        } else if ("2" == i) if (-1 == e.globalData.quickSearchYaoguai.Id) for (var r = 0; r < t.length; r++) e.globalData.quickSearchYaoguai.level == t[r].starlevel && 2 == t[r].state && this.data.markers.push(this.buildSpriteMarker(r, t[r], 4)); else if (-2 == e.globalData.quickSearchYaoguai.Id) for (var l = 0; l < t.length; l++) e.globalData.quickSearchYaoguai.level == t[l].starlevel && 1 == t[l].state && this.data.markers.push(this.buildSpriteMarker(l, t[l], 3)); else if (e.globalData.quickSearchYaoguai.Id > 0) for (var c = 0; c < t.length; c++) e.globalData.quickSearchYaoguai.Id == t[c].sprite_id && this.data.markers.push(this.buildSpriteMarker(c, t[c], 1)); else if ("3" == f) {
            d = [];
            o && (d = wx.getStorageSync(a.showedBossEggLevels));
            for (var g = 0; g < t.length; g++) 1 == t[g].state && (o && d.indexOf(t[g].starlevel) < 0 || this.data.markers.push(this.buildSpriteMarker(g, t[g], 3)));
        } else if ("4" == f) {
            var h = [];
            o && (h = wx.getStorageSync(a.showedBossLevels));
            var d = [];
            o && (d = wx.getStorageSync(a.showedBossEggLevels));
            for (var m = 0; m < t.length; m++) 2 != t[m].state && 1 != t[m].state || o && h.indexOf(t[m].starlevel) < 0 && 2 == t[m].state || o && d.indexOf(t[m].starlevel) < 0 && 1 == t[m].state || (2 == t[m].state ? this.data.markers.push(this.buildSpriteMarker(m, t[m], 4)) : 1 == t[m].state && this.data.markers.push(this.buildSpriteMarker(m, t[m], 3)));
        } else if ("2" == f) for (var p = 0; p < t.length; p++) {
            var w = 2;
            1 == t[p].state && (w = 3), 2 == t[p].state && (w = 4), this.data.markers.push(this.buildSpriteMarker(p, t[p], w));
        }
        (u != t || e.globalData.quickSearchYaoguai.Id) && (wx.showLoading({
            title: "雷达正在探测...",
            mask: !0
        }), this.setData({
            markers: this.data.markers
        }, function() {
            setTimeout(function() {
                wx.hideLoading();
            }, 1e3);
        }), u = t);
    },
    downloadFile: function(i) {
        var o = this;
        console.log("存在新版，下载成功" + i), wx.downloadFile({
            url: "https://hy.gwgo.qq.com/sync/pet/config/" + i,
            success: function(s) {
                if (200 === s.statusCode) {
                    var n = wx.getFileSystemManager().readFileSync(s.tempFilePath, "utf8"), l = JSON.parse(n);
                    e.globalData.yaojingList = l.Data, e.globalData.iconList = l.Switch, t.changeSetting("YaojingList", e.globalData.yaojingList), 
                    t.changeSetting("iconList", e.globalData.iconList), a.saveVersion(i), r = !0, d = !0, 
                    g = !0;
                } else o.downloadFailed(i);
            },
            fail: function() {
                o.downloadFailed(i);
            }
        });
    },
    downloadFailed: function(e) {
        var t = this;
        wx.showToast({
            title: "网络异常!",
            icon: "none"
        }), setTimeout(function() {
            t.downloadFile(e);
        }, 3e3);
    },
    getLocation: function() {
        var e = this;
        wx.pro.getLocation({
            type: "gcj02"
        }).then(function(t) {
            console.log("getLocation", t), e.data.showNavigation || e.setPos(t.latitude, t.longitude, !0), 
            m = t, e.setData({
                showReConfirmModal: !1
            }), h = !0;
        }).catch(function(t) {
            console.log(t), wx.showToast({
                title: "您拒绝给予位置权限,无法使用本程序,请重新授权",
                icon: "none"
            }), e.setData({
                showReConfirmModal: !0
            });
        }).finally(function() {});
    },
    onShow: function() {
        this.setData({
            showReConfirmModal: !1
        }), g = !0, e.globalData.quickSearchYaoguai.Id && wx.showToast({
            title: "地图只显示：" + e.globalData.quickSearchYaoguai.Name,
            icon: "none"
        }), g && h && d && !this.data.showNavigation && this.getServerData();
    },
    getServerData: function() {
        "1" == f ? this.getYaojingInfo() : this.getLeitaiInfo(), g = !1;
    },
    onLoad: function(e) {
        var t = this;
        if (e.item) {
            f = e.type;
            var i = JSON.parse(e.item);
            this.setPos(i.latitude / 1e6, i.longtitude / 1e6, !0), this.data.markers.push(this.buildSpriteMarker(0, i, 5)), 
            this.setData({
                showNavigation: !0,
                showNavigationButtons: !0,
                showButtons: !1,
                markers: this.data.markers,
                selectedYaojing: i
            });
        }
        c = a.getVersion(), this.initSocket(), this.getLocation(), a.checkBossStartAndEndLevel(), 
        setInterval(function() {
            wx.getLocation({
                type: "gcj02",
                success: function(e) {
                    m = e;
                }
            });
        }, 3e4), setInterval(function() {
            g && h && d && !t.data.showNavigation && (g = !1, S ? (t.getServerData(), S = !1) : p < 5 && !t.data.showNotify && (p++, 
            t.setData({
                showNotify: !0
            }), setTimeout(function() {
                t.setData({
                    showNotify: !1
                });
            }, 5e3)));
        }, 2e3), setInterval(function() {
            t.data.selectedYaojing.Id && ("1" == f ? t.setData({
                "selectedYaojing.lefttime": t.calcTime(t.data.selectedYaojing.lifetime + t.data.selectedYaojing.starttime)
            }) : t.setData({
                "selectedYaojing.lefttime": t.calcTime(t.data.selectedYaojing.lifetime)
            }));
        }, 1e3);
    },
    calcTime: function(e) {
        var a = e - new Date().getTime() / 1e3;
        if (a < 0) return "已经过期";
        var i = "剩余 ";
        return "3" == f && (i = "距离孵化"), i + t.formatTime(a.toFixed(0));
    },
    cancelNavigation: function() {
        this.setData({
            showNavigation: !1,
            showNavigationButtons: !1,
            showButtons: !0,
            markers: [],
            selectedYaojing: {}
        }), g = !0;
    },
    markertap: function(e) {
        var a = this;
        if (this.data.showNavigation) 0 == this.data.selectedYaojing.state ? this.setData({
            showInfo: !0,
            showButtons: !1,
            showNavigationButtons: !1,
            showLeitai: !0
        }) : this.setData({
            showInfo: !0,
            showButtons: !1,
            showNavigationButtons: !1
        }); else {
            var i = u[e.markerId], o = {}, s = !1;
            switch (console.log("点击", i, o), f) {
              case "1":
                (o = t.findYaojing(i.sprite_id)).lifetime = i.lifetime, o.starttime = i.gentime, 
                o.lefttime = this.calcTime(o.lifetime + o.starttime);
                break;

              case "2":
                if (o = i, o.ImgName = "leitai", 0 == i.state) {
                    s = !0, o.Name = "擂主占领", o.list = [];
                    for (var n = 0; n < o.sprite_list.length; n++) {
                        var r = t.findYaojing(o.sprite_list[n].spriteid);
                        r.level = o.sprite_list[n].level, r.fightpower = o.sprite_list[n].fightpower, o.list.push(r);
                    }
                    console.log("擂主占领", o);
                } else if (1 == i.state) (o = t.findBossEgg(i.starlevel)).lifetime = i.freshtime, 
                o.lefttime = this.calcTime(o.lifetime); else if (2 == i.state) (o = t.findYaojing(i.bossid)).lifetime = i.freshtime, 
                o.lefttime = this.calcTime(o.lifetime); else if (3 == i.state) {
                    var l = t.findYaojing(i.spriteid);
                    o.Name = l.Name + "驻守", o.ImgName = l.ImgName;
                } else 4 == i.state && (o.Name = "擂台无人驻守");
                break;

              case "3":
                (o = t.findBossEgg(i.starlevel)).lifetime = i.freshtime, o.lefttime = this.calcTime(o.lifetime);
                break;

              case "4":
                (o = 1 == i.state ? t.findBossEgg(i.starlevel) : t.findYaojing(i.bossid)).lifetime = i.freshtime, 
                o.lefttime = this.calcTime(o.lifetime);
            }
            o.latitude = i.latitude, o.longtitude = i.longtitude, this.setData({
                showInfo: !0,
                showButtons: !1,
                showLeitai: s,
                selectedYaojing: o
            }), wx.pro.request({
                url: t.getQqMapUrl(i)
            }).then(function(e) {
                o.address = e.data.result.formatted_addresses.recommend, a.setData({
                    selectedYaojing: o
                });
            }).catch(function(e) {
                console.log(e);
            }).finally(function() {});
        }
    },
    openSearch: function(e) {
        wx.navigateTo({
            url: "/pages/index/index?type=" + e.currentTarget.dataset.type
        });
    },
    openSetting: function() {
        wx.navigateTo({
            url: "/pages/setting/setting"
        });
    },
    tapMap: function(e) {
        this.data.showNavigation ? this.setData({
            showInfo: !1,
            showNavigationButtons: !0
        }) : this.setData({
            showInfo: !1,
            showButtons: !0,
            selectedYaojing: {}
        });
    },
    zoomIn: function(e) {
        var t = this.data.scale + 1;
        t > 19 || this.setData({
            scale: t
        });
    },
    zoomOut: function(e) {
        var t = this.data.scale - 1;
        t < 14 || this.setData({
            scale: t
        });
    },
    onShareAppMessage: function() {
        var e = "https://sharewebres.gwgo.qq.com/", t = [ e + "share/1.png", e + "share/1.png", e + "share/1.png", e + "share/1.png", e + "share/2.png", e + "share/2.png", e + "share/3.png", e + "share/4.png", e + "share/5.png" ];
        return this.data.selectedYaojing.Id ? {
            title: [ "这个" + this.data.selectedYaojing.Name + "太磨人了，谁来帮我收了它！！", "肥水不流外人田，这里有" + this.data.selectedYaojing.Name + "出没，我第一个就告诉你了！", "每次遇到这个小妖灵，我都能看她半个小时！", "该不该去提醒她呢？她的背后……" ][Math.floor(4 * Math.random())],
            desc: "捉妖雷达",
            path: "/pages/map/map?item=" + JSON.stringify(this.data.selectedYaojing) + "&type=" + f,
            imageUrl: t[Math.floor(9 * Math.random())]
        } : 0 == this.data.selectedYaojing.state ? {
            title: [ "女神深夜突然约我见面，地点竟然是这里！", "这地方居然被这种人霸占？网友：喊上兄弟抢回来！" ][Math.floor(2 * Math.random())],
            desc: "捉妖雷达",
            path: "/pages/map/map?item=" + JSON.stringify(this.data.selectedYaojing) + "&type=" + f,
            imageUrl: t[Math.floor(9 * Math.random())]
        } : 1 == this.data.selectedYaojing.state ? {
            title: [ "游戏里最厉害的妖灵，马上就要从这里孵出来！", "昨晚那些勾人的小妖灵，原来是从这儿来的！", "玩了三个月才知道，这游戏里最赚的原来是它！" ][Math.floor(3 * Math.random())],
            desc: "捉妖雷达",
            path: "/pages/map/map?item=" + JSON.stringify(this.data.selectedYaojing) + "&type=" + f,
            imageUrl: t[Math.floor(9 * Math.random())]
        } : 2 == this.data.selectedYaojing.state ? {
            title: [ "实力太强，御灵师只能集结挑战神灵！再不来就错过了！", "还记得那个神级BOSS吗？现在变成这样了", "每天玩游戏但就是赶不上别人？因为他忘记抓这个妖灵" ][Math.floor(3 * Math.random())],
            desc: "捉妖雷达",
            path: "/pages/map/map?item=" + JSON.stringify(this.data.selectedYaojing) + "&type=" + f,
            imageUrl: t[Math.floor(9 * Math.random())]
        } : {
            title: [ "城市里妖灵到底多密集？这个工具不小心暴露！", "最强黑科技！点我立即查看附近的妖灵和擂台！", "不花钱就能变强的方法，原来是……", "学会这件事，你比别人成功的概率高5倍！", "都说这小妖灵不粘人，原来它一直躲在这个地方！" ][Math.floor(5 * Math.random())],
            desc: "捉妖雷达",
            path: "/pages/map/map",
            imageUrl: t[Math.floor(9 * Math.random())]
        };
    },
    yaojingChange: function() {},
    setPos: function(e, t, a) {
        var i = this.getDistance(e, t, this.data.latitude, this.data.longitude);
        !a && (e == this.data.latitude && t == this.data.longitude || i <= 200) || (g = !0, 
        this.setData({
            latitude: e,
            longitude: t
        }));
    },
    getDistance: function(e, t, a, i) {
        e = e || 0, t = t || 0, a = a || 0, i = i || 0;
        var o = e * Math.PI / 180, s = a * Math.PI / 180, n = o - s, r = t * Math.PI / 180 - i * Math.PI / 180;
        return (12756274 * Math.asin(Math.sqrt(Math.pow(Math.sin(n / 2), 2) + Math.cos(o) * Math.cos(s) * Math.pow(Math.sin(r / 2), 2)))).toFixed(0);
    },
    search: function() {
        var e = this;
        wx.chooseLocation({
            success: function(t) {
                e.setData({
                    scale: 18
                }), e.setPos(t.latitude, t.longitude);
            },
            fail: function() {},
            complete: function() {}
        });
    },
    navigation: function() {
        var e = {
            name: this.data.selectedYaojing.Name,
            location: {
                lat: this.data.selectedYaojing.latitude / 1e6,
                lng: this.data.selectedYaojing.longtitude / 1e6
            }
        }, t = "pages/multiScheme/multiScheme?endLoc=" + JSON.stringify(e) + "&qbMode=2&channel=?";
        wx.navigateToMiniProgram({
            appId: "wx7643d5f831302ab0",
            path: t
        });
    },
    gotoMyPos: function() {
        this.setPos(m.latitude, m.longitude);
    },
    clearMarker: function() {
        this.setData({
            markers: []
        });
    },
    showLoading: function() {
        w >= 0 && clearTimeout(w), wx.showLoading({
            title: "雷达正在探测...",
            mask: !0
        }), w = setTimeout(function() {
            wx.hideLoading();
        }, 4e4);
    },
    changeShowType: function(a) {
        var i = a.currentTarget.dataset.type;
        wx.showToast({
            title: "只显示" + t.getTypeName(i),
            icon: "none"
        }), this.showLoading(), f != i && this.clearMarker(), f = i, e.globalData.quickSearchYaoguai = {}, 
        g = !0, this.getServerData();
    },
    regionchange: function(e) {
        if ("end" == e.type) {
            var t = this;
            this.mapCtx = wx.createMapContext("zyMap"), this.mapCtx.getCenterLocation({
                success: function(e) {
                    t.setPos(e.latitude, e.longitude);
                }
            });
        }
    },
    launchApp: function(e) {
        wx.navigateTo({
            url: "/pages/web/web"
        });
    },
    launchAppError: function(e) {}
});