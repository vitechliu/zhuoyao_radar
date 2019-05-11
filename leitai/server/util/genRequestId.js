'use strict';
const r = [ -1, -1, -1, -1, -1 ];
module.exports = function(n) {
  const id = new Date().getTime() % 1234567;
  switch (n) {
    case '1001':
      r[0] = id;
      break;

    case '1002':
      r[1] = id;
      break;

    case '1003':
      r[2] = id;
      break;

    case '10040':
      r[3] = id;
      break;

    default:
      r[4] = id;
  }
  return id;
};
