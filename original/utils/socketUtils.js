var e = function(e) {
    for (var n = new ArrayBuffer(2 * e.length), r = new Uint16Array(n), t = 0, o = e.length; t < o; t++) r[t] = e.charCodeAt(t);
    return r;
}, n = function(n) {
    var r = e(JSON.stringify(n)), t = r.length, o = new ArrayBuffer(4);
    new DataView(o).setUint32(0, t);
    var s = new Uint8Array(4 + t);
    return s.set(new Uint8Array(o), 0), s.set(r, 4), console.log(s, s.buffer, t), s.buffer;
};

module.exports = {
    sendSocketMessage: function(e, r) {
        wx.sendSocketMessage({
            data: n(e),
            success: function(n) {
                console.log("发送服务器成功", e);
            },
            fail: function(n) {
                console.log("发送服务器失败", e), r && r();
            }
        });
    }
};