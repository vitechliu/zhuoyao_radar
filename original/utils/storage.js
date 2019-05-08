module.exports = {
    hasSetted: "hasSetted",
    showedBossEggLevels: "showedBossEggLevels",
    showedBossLevels: "showedBossLevels",
    showedYaojingIds: "showedYaojingIds",
    lgShowType: "lgShowType",
    yaojingTimeShowed: "yaojingTimeShowed",
    bossTimeShowed: "bossTimeShowed",
    bossEggTimeShowed: "bossEggTimeShowed",
    getVersion: function() {
        var e = wx.getStorageSync("Version");
        return "" !== e ? e : "";
    },
    saveVersion: function(e) {
        wx.setStorage({
            key: "Version",
            data: e
        });
    },
    checkBossStartAndEndLevel: function() {
        var e = wx.getStorageSync("startlevel"), s = wx.getStorageSync("endlevel");
        return "" !== e && "" !== s ? {
            start: e,
            end: s
        } : {
            start: 1,
            end: 5
        };
    },
    saveBossStartAndEndLevel: function(e, s) {
        wx.setStorage({
            key: "startlevel",
            data: e
        }), wx.setStorage({
            key: "endlevel",
            data: s
        });
    }
};