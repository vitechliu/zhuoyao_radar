/*
 * @Date: 2018-12-04 11:06:24
 * @Last Modified time: 2018-12-04 11:06:24
 * @Desc: fetch 封装
 */
import { fetch as fetchPolyfill } from 'whatwg-fetch';

const errorMessages = res => `${res.status} ${res.statusText}`;

function check404(res) {
  if (res.status === 404) {
    return Promise.reject(errorMessages(res));
  }
  return res;
}

function checkStatus(response) {
  const res = response.json();
  if (response.status >= 200 && response.status < 300) {
    return res;
  }
  return res.then(() =>
    Promise.reject({
      statusCode: response.status,
      msg: response.statusText
    })
  );
}

function setUrlParam(keys, value, keyPostfix) {
  let keyStr = keys[0];

  keys.slice(1).forEach(key => {
    keyStr += `[${key}]`;
  });

  if (keyPostfix) {
    keyStr += keyPostfix;
  }

  return `${encodeURIComponent(keyStr)}=${encodeURIComponent(value)}`;
}

function getUrlParam(keys, object) {
  const array = [];

  if (object instanceof Array) {
    object.forEach(value => {
      array.push(setUrlParam(keys, value, '[]'));
    });
  } else if (object instanceof Object) {
    for (const key in object) {
      if (object.hasOwnProperty(key)) {
        const value = object[key];

        array.push(getUrlParam(keys.concat(key), value));
      }
    }
  } else {
    if (object !== undefined) {
      array.push(setUrlParam(keys, object));
    }
  }

  return array.join('&');
}

function toQueryString(object) {
  const array = [];

  for (const key in object) {
    if (object.hasOwnProperty(key)) {
      const str = getUrlParam([key], object[key]);

      if (str !== '') {
        array.push(str);
      }
    }
  }
  return array.join('&');
}

function process(url, options = {}) {
  let mergeUrl = url.indexOf('?') > -1 ? `${url}&_=${+new Date()}` : `${url}?_=${+new Date()}`;

  const defaultOptions = {
    method: 'post',
    credentials: 'include'
  };

  const opts = Object.assign({}, defaultOptions, { ...options });

  opts.method = opts.method.toLocaleLowerCase();

  if (opts.method === 'get') {
    mergeUrl = mergeUrl + '&' + toQueryString(opts['params']);
  } else {
    if (opts.json) {
      opts.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...opts.headers
      };
    } else {
      opts.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        ...opts.headers
      };
    }
    // 如果是application/json，就要序列化
    if (opts.headers['Content-Type'] === 'application/json') {
      opts.body = JSON.stringify(opts.body);
    } else if (opts.headers['Content-Type'] === 'application/x-www-form-urlencoded') {
      opts.body = toQueryString(opts.body);
    }
  }

  return { mergeUrl, opts };
}

function cFetch(url, options) {
  const { mergeUrl, opts } = process(url, options);
  return fetchPolyfill(mergeUrl, opts)
    .then(check404)
    .then(checkStatus)
    .then(res => {
      return res;
    })
    .catch(err => {
      return err;
    });
}

export default cFetch;
