/* eslint-disable */
var e = function(e) {
    for (
      var n = new ArrayBuffer(2 * e.length),
        r = new Uint16Array(n),
        t = 0,
        o = e.length;
      t < o;
      t++
    )
      r[t] = e.charCodeAt(t);
    return r;
  },
  n = function(n) {
    // eslint-disable-next-line no-var
    var r = e(JSON.stringify(n)),
      t = r.length,
      o = new ArrayBuffer(4);
    new DataView(o).setUint32(0, t);
    // eslint-disable-next-line no-var
    var s = new Uint8Array(4 + t);
    return s.set(new Uint8Array(o), 0), s.set(r, 4), null, s.buffer;
  };

module.exports = n;
