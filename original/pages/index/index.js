function t(t, a, e) {
    return a in t ? Object.defineProperty(t, a, {
        value: e,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[a] = e, t;
}

var a = getApp(), e = require("../../utils/util.js"), s = require("../../utils/storage.js");

Page({
    ygShowedDatas: [],
    bossShowedDatas: [],
    eggShowedDatas: [],
    data: {
        selectedItem: 1,
        showMenuItem: !1,
        yaoguais: [],
        bosses: [],
        eggs: [],
        selectAll: [ 0, !0, !0 ],
        type: 1
    },
    onLoad: function(t) {
        var i = this;
        setTimeout(function() {
            wx.showLoading({
                title: "请稍候...",
                mask: !0
            }), i.data.yaoguais = a.globalData.yaojingList;
            var h = isNaN(parseInt(t.type)) ? 2 : parseInt(t.type);
            i.setData({
                type: h
            }), 1 !== h && i.initShowDatas("ygShowedDatas", "yaoguais"), i.setData({
                yaoguais: i.data.yaoguais
            }, function() {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            }), i.data.bosses = e.bosses.slice(e.getMinLevel() - 1, e.getMaxLevel()), 1 !== h && i.initShowDatas("bossShowedDatas", "bosses"), 
            i.setData({
                bosses: i.data.bosses
            }), i.data.eggs = e.bossEggs.slice(e.getMinLevel() - 1, e.getMaxLevel()), 1 !== h && i.initShowDatas("eggShowedDatas", "eggs"), 
            i.setData({
                eggs: i.data.eggs
            });
            var d = wx.getStorageSync(s.lgShowType);
            Array.isArray(d) ? (d[0] = isNaN(parseInt(d[0])) ? 0 : parseInt(d[0]), d[1] = !0 === d[1] || "true" === d[1], 
            d[2] = !0 === d[2] || "true" === d[2]) : d = [ 0, !0, !0 ], i.setData({
                selectAll: d
            });
        }, 100);
    },
    initShowDatas: function(t, a) {
        if (this[t] = wx.getStorageSync(t), "" === this[t] || void 0 === this[t]) {
            this[t] = [];
            for (var s = 0; s < this.data[a].length; s++) this.data[a][s].selected = !0, this[t][s] = !0;
            e.changeSetting(t, this[t]);
        } else for (var i = 0; i < this.data[a].length; i++) null == this[t][i] && (this[t][i] = !0), 
        this.data[a][i].selected = this[t][i];
    },
    selectItem: function(t) {
        wx.showLoading({
            mask: !0
        });
        var a = t.currentTarget.dataset.idx;
        this.setData({
            selectedItem: a
        }, function() {
            wx.hideLoading();
        });
    },
    clickItem: function(e) {
        var s = e.currentTarget.dataset.idx;
        if (1 === this.data.type) 1 === this.data.selectedItem ? a.globalData.quickSearchYaoguai = this.data.yaoguais[s] : 2 === this.data.selectedItem ? a.globalData.quickSearchYaoguai = this.data.bosses[s] : 3 === this.data.selectedItem && (a.globalData.quickSearchYaoguai = this.data.eggs[s]), 
        wx.navigateBack(); else if (1 === this.data.selectedItem) {
            this.data.yaoguais[s].selected = !this.data.yaoguais[s].selected;
            var i = "yaoguais[" + s + "].selected";
            this.setData(t({}, i, this.data.yaoguais[s].selected));
        } else 2 === this.data.selectedItem ? (this.data.bosses[s].selected = !this.data.bosses[s].selected, 
        this.setData({
            bosses: this.data.bosses
        })) : 3 === this.data.selectedItem && (this.data.eggs[s].selected = !this.data.eggs[s].selected, 
        this.setData({
            eggs: this.data.eggs
        }));
    },
    search: function(t) {
        var a = t.detail.value;
        this.data.yaoguais.forEach(function(t) {
            t.hidden = t.Name.indexOf(a) < 0 && (t.Id + "").indexOf(a) < 0;
        }), this.setData({
            yaoguais: this.data.yaoguais
        });
    },
    onTapContainer: function() {
        this.setData({
            showMenuItem: !1
        });
    },
    showMenuItems: function() {
        this.setData({
            showMenuItem: !this.data.showMenuItem
        });
    },
    onTapAll: function() {
        a.globalData.quickSearchYaoguai = {}, wx.navigateBack();
    },
    onTapMenuItem: function(t) {
        var a = parseInt(t.currentTarget.dataset.type);
        if (!isNaN(a)) {
            if (this.data.selectAll[0] = a, this.setData({
                showMenuItem: !1,
                selectAll: this.data.selectAll
            }), wx.showLoading({
                title: "请稍候...",
                mask: !0
            }), -1 === a || 0 === a) for (var e = 0; e < this.data.yaoguais.length; e++) this.data.yaoguais[e].selected = 0 === a, 
            this.ygShowedDatas[e] = 0 === a; else if (1 === a || 2 === a || 3 === a) for (var s = 0; s < this.data.yaoguais.length; s++) this.data.yaoguais[s].selected = this.data.yaoguais[s].Level === a, 
            this.ygShowedDatas[s] = this.data.yaoguais[s].Level === a;
            this.setData({
                yaoguais: this.data.yaoguais,
                selectAll: this.data.selectAll
            }, function() {
                setTimeout(function() {
                    wx.hideLoading();
                }, 1e3);
            });
        }
    },
    selectAll: function() {
        if (this.data.selectAll[this.data.selectedItem - 1] = !this.data.selectAll[this.data.selectedItem - 1], 
        2 === this.data.selectedItem) {
            for (var t = 0; t < this.data.bosses.length; t++) this.data.bosses[t].selected = this.data.selectAll[this.data.selectedItem - 1], 
            this.bossShowedDatas[t] = this.data.selectAll[this.data.selectedItem - 1];
            this.setData({
                bosses: this.data.bosses,
                selectAll: this.data.selectAll
            });
        } else if (3 === this.data.selectedItem) {
            for (var a = 0; a < this.data.eggs.length; a++) this.data.eggs[a].selected = this.data.selectAll[this.data.selectedItem - 1], 
            this.eggShowedDatas[a] = this.data.selectAll[this.data.selectedItem - 1];
            this.setData({
                eggs: this.data.eggs,
                selectAll: this.data.selectAll
            });
        }
    },
    confirm: function() {
        var t = [];
        a.globalData.quickSearchYaoguai = {};
        for (var i = 0; i < this.data.yaoguais.length; i++) this.ygShowedDatas[i] = this.data.yaoguais[i].selected, 
        this.data.yaoguais[i].selected && t.push(this.data.yaoguais[i].Id);
        e.changeSetting(s.lgShowType, this.data.selectAll), e.changeSetting("ygShowedDatas", this.ygShowedDatas), 
        e.changeSetting(s.showedYaojingIds, t);
        for (var h = [], d = 0; d < this.data.bosses.length; d++) this.bossShowedDatas[d] = this.data.bosses[d].selected, 
        this.data.bosses[d].selected && h.push(this.data.bosses[d].level);
        e.changeSetting("bossShowedDatas", this.bossShowedDatas), e.changeSetting(s.showedBossLevels, h);
        for (var o = [], l = 0; l < this.data.eggs.length; l++) this.eggShowedDatas[l] = this.data.eggs[l].selected, 
        this.data.eggs[l].selected && o.push(this.data.eggs[l].level);
        e.changeSetting("eggShowedDatas", this.eggShowedDatas), e.changeSetting(s.showedBossEggLevels, o), 
        e.changeSetting(s.hasSetted, !0), wx.navigateBack();
    }
});