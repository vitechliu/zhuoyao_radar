/*
 * @Date: 2019-05-11 10:38:18
 * @Last Modified time: 2019-05-11 10:38:18
 * @Desc: 工具
 */

const getSetting = () => {
  if (localStorage && localStorage['radar_settings']) {
    return JSON.parse(localStorage['radar_settings']);
  } else {
    return null;
  }
};
const setSetting = setting => {
  if (localStorage) {
    localStorage['radar_settings'] = JSON.stringify(setting);
  }
};

const utf8ByteToUnicodeStr = n => {
  for (var g = '', p = 0; p < n.length; ) {
    var e = n[p],
      a = 0;
    e >>> 7 == 0
      ? ((g += String.fromCharCode(n[p])), (p += 1))
      : 252 == (252 & e)
      ? ((a = (3 & n[p]) << 30),
        (a |= (63 & n[p + 1]) << 24),
        (a |= (63 & n[p + 2]) << 18),
        (a |= (63 & n[p + 3]) << 12),
        (a |= (63 & n[p + 4]) << 6),
        (a |= 63 & n[p + 5]),
        (g += String.fromCharCode(a)),
        (p += 6))
      : 248 == (248 & e)
      ? ((a = (7 & n[p]) << 24),
        (a |= (63 & n[p + 1]) << 18),
        (a |= (63 & n[p + 2]) << 12),
        (a |= (63 & n[p + 3]) << 6),
        (a |= 63 & n[p + 4]),
        (g += String.fromCharCode(a)),
        (p += 5))
      : 240 == (240 & e)
      ? ((a = (15 & n[p]) << 18),
        (a |= (63 & n[p + 1]) << 12),
        (a |= (63 & n[p + 2]) << 6),
        (a |= 63 & n[p + 3]),
        (g += String.fromCharCode(a)),
        (p += 4))
      : 224 == (224 & e)
      ? ((a = (31 & n[p]) << 12),
        (a |= (63 & n[p + 1]) << 6),
        (a |= 63 & n[p + 2]),
        (g += String.fromCharCode(a)),
        (p += 3))
      : 192 == (192 & e)
      ? ((a = (63 & n[p]) << 6),
        (a |= 63 & n[p + 1]),
        (g += String.fromCharCode(a)),
        (p += 2))
      : ((g += String.fromCharCode(n[p])), (p += 1));
  }
  return g;
};
const convertLocation = n => parseInt(1e6 * n.toFixed(6));

const json2buffer = n => {
  var r = abc1(JSON.stringify(n)),
    t = r.length,
    o = new ArrayBuffer(4);
  new DataView(o).setUint32(0, t);
  var s = new Uint8Array(4 + t);
  return s.set(new Uint8Array(o), 0), s.set(r, 4), s.buffer;
};

const abc1 = e => {
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
};
module.exports = {
  getSetting,
  setSetting,
  utf8ByteToUnicodeStr,
  convertLocation,
  json2buffer
};
