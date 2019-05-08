var e = require("../../utils/util.js"), a = require("../../utils/storage.js");

Page({
    data: {
        yaojingShowed: !0,
        bossShowed: !0,
        bossEggShowed: !0
    },
    onLoad: function() {
        this.setData({
            yaojingShowed: e.getStorageValue(a.yaojingTimeShowed)
        }), this.setData({
            bossShowed: e.getStorageValue(a.bossTimeShowed)
        }), this.setData({
            bossEggShowed: e.getStorageValue(a.bossEggTimeShowed)
        });
    },
    yaojingChange: function(t) {
        this.setData({
            yaojingShowed: t.detail.value
        }), e.changeSetting(a.yaojingTimeShowed, t.detail.value);
    },
    bossChange: function(t) {
        this.setData({
            bossShowed: t.detail.value
        }), e.changeSetting(a.bossTimeShowed, t.detail.value);
    },
    bossEggChange: function(t) {
        this.setData({
            bossEggShowed: t.detail.value
        }), e.changeSetting(a.bossEggTimeShowed, t.detail.value);
    }
});