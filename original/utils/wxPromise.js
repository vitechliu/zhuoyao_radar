var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, e = "function" == typeof Symbol && "symbol" == t(Symbol.iterator) ? function(e) {
    return void 0 === e ? "undefined" : t(e);
} : function(e) {
    return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : void 0 === e ? "undefined" : t(e);
}, n = function(t) {
    return function(e) {
        for (var n = arguments.length, r = Array(1 < n ? n - 1 : 0), o = 1; o < n; o++) r[o - 1] = arguments[o];
        return new Promise(function(n, o) {
            t.apply(void 0, [ Object.assign({}, e, {
                success: n,
                fail: o
            }) ].concat(r)), Promise.prototype.finally = function(t) {
                var e = this.constructor;
                return this.then(function(n) {
                    return e.resolve(t()).then(function() {
                        return n;
                    });
                }, function(n) {
                    return e.resolve(t()).then(function() {
                        throw n;
                    });
                });
            };
        });
    };
};

wx.pro = {};

(function() {
    for (var t in wx) wx.hasOwnProperty(t) && (wx.pro[t] = /^on|^create|Sync$|Manager$|^pause/.test(t) && "createBLEConnection" != t || "stopRecord" == t || "stopVoice" == t || "stopBackgroundAudio" == t || "stopPullDownRefresh" == t || "hideKeyboard" == t || "hideToast" == t || "hideLoading" == t || "showNavigationBarLoading" == t || "hideNavigationBarLoading" == t || "canIUse" == t || "navigateBack" == t || "closeSocket" == t || "closeSocket" == t || "pageScrollTo" == t || "drawCanvas" == t ? wx[t] : n(wx[t]));
    wx.pro.match = function(t, e) {
        var n = "";
        return "chinese" === t ? n = /[\u4e00-\u9fa5]/gm : "email" === t ? n = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/ : "url" === t ? n = /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i : "phoneNumber" === t ? n = /^(0|86|17951)?(13[0-9]|14[579]|15[012356789]|16[56]|17[1235678]|18[0-9]|19[89])\s{0,1}[0-9]{4}\s{0,1}[0-9]{4}$/ : "cardid" === t ? n = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/ : "mail" === t && (n = /^[1-9]\d{5}(?!\d)$/), 
        !!n.test(e);
    }, wx.pro.showTopTips = function(t, e) {
        return new Promise(function(n, r) {
            t || r("缺少配置项！"), t.content || r("option.content属性是必须的");
            var o = e.data.topTips || {};
            o.timeout && (clearTimeout(o.timeout), o.timeout = 0), void 0 === t.duration && (t.duration = 3e3);
            var i = setTimeout(function() {
                e.setData({
                    "topTips.show": !1,
                    "topTips.timeout": 0
                }, function() {
                    n();
                });
            }, t.duration);
            e.setData({
                topTips: {
                    show: !0,
                    content: t.content,
                    timeout: i
                }
            });
        });
    }, wx.pro.initChart = function(t, e) {
        return function(n, r, o) {
            var i = e.init(n, null, {
                width: r,
                height: o
            });
            return n.setChart(i), i.setOption(t), i;
        };
    }, wx.pro.lazyInitChart = function(t, e, n, r) {
        return new Promise(function(o) {
            r.selectComponent(n).init(function(n, i, a) {
                var c = e.init(n, null, {
                    width: i,
                    height: a
                });
                c.setOption(t), r.chart = c, o(c);
            });
        });
    }, wx.pro.updateChart = function(t, e) {
        t.clear(), t.setOption(e);
    }, wx.pro.saveImageToPhotosAlbum = function(t) {
        return new Promise(function(e, n) {
            wx.getSetting({
                success: function(r) {
                    r.authSetting["scope.writePhotosAlbum"] ? wx.saveImageToPhotosAlbum({
                        filePath: t,
                        success: function(t) {
                            e(t);
                        },
                        fail: function(t) {
                            n(t);
                        }
                    }) : wx.authorize({
                        scope: "scope.writePhotosAlbum",
                        success: function() {
                            wx.saveImageToPhotosAlbum({
                                filePath: t,
                                success: function(t) {
                                    e(t);
                                },
                                fail: function(t) {
                                    n(t);
                                }
                            });
                        },
                        fail: function() {
                            wx.hideLoading(), wx.pro.showModal({
                                title: "温馨提示",
                                content: "请授权系统使用保存图片接口",
                                confirmText: "知道了",
                                showCancel: !1
                            }).then(function() {
                                wx.openSetting();
                            });
                        }
                    });
                },
                fail: function(t) {
                    n(t);
                }
            });
        });
    }, wx.pro.canvasToTempFilePath = function(t) {
        return new Promise(function(e, n) {
            t.draw(!0, function() {
                wx.canvasToTempFilePath({
                    canvasId: "card",
                    success: function(t) {
                        e(t);
                    },
                    fail: function(t) {
                        n(t);
                    }
                });
            });
        });
    };
})(), function(t) {
    function n(t, e, n, r) {
        var i = e && e.prototype instanceof o ? e : o, a = Object.create(i.prototype), c = new p(r || []);
        return a._invoke = s(t, n, c), a;
    }
    function r(t, e, n) {
        try {
            return {
                type: "normal",
                arg: t.call(e, n)
            };
        } catch (t) {
            return {
                type: "throw",
                arg: t
            };
        }
    }
    function o() {}
    function i() {}
    function a() {}
    function c(t) {
        [ "next", "throw", "return" ].forEach(function(e) {
            t[e] = function(t) {
                return this._invoke(e, t);
            };
        });
    }
    function u(t) {
        function n(o, i, a, c) {
            var u = r(t[o], t, i);
            if ("throw" !== u.type) {
                var s = u.arg, f = s.value;
                return f && "object" === (void 0 === f ? "undefined" : e(f)) && w.call(f, "__await") ? Promise.resolve(f.__await).then(function(t) {
                    n("next", t, a, c);
                }, function(t) {
                    n("throw", t, a, c);
                }) : Promise.resolve(f).then(function(t) {
                    s.value = t, a(s);
                }, c);
            }
            c(u.arg);
        }
        var o;
        this._invoke = function(t, e) {
            function r() {
                return new Promise(function(r, o) {
                    n(t, e, r, o);
                });
            }
            return o = o ? o.then(r, r) : r();
        };
    }
    function s(t, e, n) {
        var o = S;
        return function(i, a) {
            if (o == _) throw new Error("Generator is already running");
            if (o == O) {
                if ("throw" === i) throw a;
                return y();
            }
            for (n.method = i, n.arg = a; ;) {
                var c = n.delegate;
                if (c) {
                    var u = f(c, n);
                    if (u) {
                        if (u === j) continue;
                        return u;
                    }
                }
                if ("next" === n.method) n.sent = n._sent = n.arg; else if ("throw" === n.method) {
                    if (o == S) throw o = O, n.arg;
                    n.dispatchException(n.arg);
                } else "return" === n.method && n.abrupt("return", n.arg);
                o = _;
                var s = r(t, e, n);
                if ("normal" === s.type) {
                    if (o = n.done ? O : T, s.arg === j) continue;
                    return {
                        value: s.arg,
                        done: n.done
                    };
                }
                "throw" === s.type && (o = O, n.method = "throw", n.arg = s.arg);
            }
        };
    }
    function f(t, e) {
        var n = t.iterator[e.method];
        if (n === m) {
            if (e.delegate = null, "throw" === e.method) {
                if (t.iterator.return && (e.method = "return", e.arg = m, f(t, e), "throw" === e.method)) return j;
                e.method = "throw", e.arg = new TypeError("The iterator does not provide a 'throw' method");
            }
            return j;
        }
        var o = r(n, t.iterator, e.arg);
        if ("throw" === o.type) return e.method = "throw", e.arg = o.arg, e.delegate = null, 
        j;
        var i = o.arg;
        return i ? i.done ? (e[t.resultName] = i.value, e.next = t.nextLoc, "return" !== e.method && (e.method = "next", 
        e.arg = m), e.delegate = null, j) : i : (e.method = "throw", e.arg = new TypeError("iterator result is not an object"), 
        e.delegate = null, j);
    }
    function h(t) {
        var e = {
            tryLoc: t[0]
        };
        1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), 
        this.tryEntries.push(e);
    }
    function l(t) {
        var e = t.completion || {};
        e.type = "normal", delete e.arg, t.completion = e;
    }
    function p(t) {
        this.tryEntries = [ {
            tryLoc: "root"
        } ], t.forEach(h, this), this.reset(!0);
    }
    function d(t) {
        if (t) {
            var e = t[x];
            if (e) return e.call(t);
            if ("function" == typeof t.next) return t;
            if (!isNaN(t.length)) {
                var n = -1, r = function e() {
                    for (;++n < t.length; ) if (w.call(t, n)) return e.value = t[n], e.done = !1, e;
                    return e.value = m, e.done = !0, e;
                };
                return r.next = r;
            }
        }
        return {
            next: y
        };
    }
    function y() {
        return {
            value: m,
            done: !0
        };
    }
    var m, v = Object.prototype, w = v.hasOwnProperty, g = "function" == typeof Symbol ? Symbol : {}, x = g.iterator || "@@iterator", b = g.asyncIterator || "@@asyncIterator", L = g.toStringTag || "@@toStringTag", P = "object" === ("undefined" == typeof module ? "undefined" : e(module)), E = t.regeneratorRuntime;
    if (E) P && (module.exports = E); else {
        (E = t.regeneratorRuntime = P ? module.exports : {}).wrap = n;
        var S = "suspendedStart", T = "suspendedYield", _ = "executing", O = "completed", j = {}, k = {};
        k[x] = function() {
            return this;
        };
        var A = Object.getPrototypeOf, N = A && A(A(d([])));
        N && N !== v && w.call(N, x) && (k = N);
        var I = a.prototype = o.prototype = Object.create(k);
        i.prototype = I.constructor = a, a.constructor = i, a[L] = i.displayName = "GeneratorFunction", 
        E.isGeneratorFunction = function(t) {
            var e = "function" == typeof t && t.constructor;
            return !!e && (e === i || "GeneratorFunction" === (e.displayName || e.name));
        }, E.mark = function(t) {
            return Object.setPrototypeOf ? Object.setPrototypeOf(t, a) : (t.__proto__ = a, !(L in t) && (t[L] = "GeneratorFunction")), 
            t.prototype = Object.create(I), t;
        }, E.awrap = function(t) {
            return {
                __await: t
            };
        }, c(u.prototype), u.prototype[b] = function() {
            return this;
        }, E.AsyncIterator = u, E.async = function(t, e, r, o) {
            var i = new u(n(t, e, r, o));
            return E.isGeneratorFunction(e) ? i : i.next().then(function(t) {
                return t.done ? t.value : i.next();
            });
        }, c(I), I[L] = "Generator", I[x] = function() {
            return this;
        }, I.toString = function() {
            return "[object Generator]";
        }, E.keys = function(t) {
            var e = [];
            for (var n in t) e.push(n);
            return e.reverse(), function n() {
                for (;e.length; ) {
                    var r = e.pop();
                    if (r in t) return n.value = r, n.done = !1, n;
                }
                return n.done = !0, n;
            };
        }, E.values = d, p.prototype = {
            constructor: p,
            reset: function(t) {
                if (this.prev = 0, this.next = 0, this.sent = this._sent = m, this.done = !1, this.delegate = null, 
                this.method = "next", this.arg = m, this.tryEntries.forEach(l), !t) for (var e in this) "t" === e.charAt(0) && w.call(this, e) && !isNaN(+e.slice(1)) && (this[e] = m);
            },
            stop: function() {
                this.done = !0;
                var t = this.tryEntries[0].completion;
                if ("throw" === t.type) throw t.arg;
                return this.rval;
            },
            dispatchException: function(t) {
                function e(e, r) {
                    return i.type = "throw", i.arg = t, n.next = e, r && (n.method = "next", n.arg = m), 
                    !!r;
                }
                if (this.done) throw t;
                for (var n = this, r = this.tryEntries.length - 1; 0 <= r; --r) {
                    var o = this.tryEntries[r], i = o.completion;
                    if ("root" === o.tryLoc) return e("end");
                    if (o.tryLoc <= this.prev) {
                        var a = w.call(o, "catchLoc"), c = w.call(o, "finallyLoc");
                        if (a && c) {
                            if (this.prev < o.catchLoc) return e(o.catchLoc, !0);
                            if (this.prev < o.finallyLoc) return e(o.finallyLoc);
                        } else if (a) {
                            if (this.prev < o.catchLoc) return e(o.catchLoc, !0);
                        } else {
                            if (!c) throw new Error("try statement without catch or finally");
                            if (this.prev < o.finallyLoc) return e(o.finallyLoc);
                        }
                    }
                }
            },
            abrupt: function(t, e) {
                for (var n, r = this.tryEntries.length - 1; 0 <= r; --r) if ((n = this.tryEntries[r]).tryLoc <= this.prev && w.call(n, "finallyLoc") && this.prev < n.finallyLoc) {
                    var o = n;
                    break;
                }
                o && ("break" === t || "continue" === t) && o.tryLoc <= e && e <= o.finallyLoc && (o = null);
                var i = o ? o.completion : {};
                return i.type = t, i.arg = e, o ? (this.method = "next", this.next = o.finallyLoc, 
                j) : this.complete(i);
            },
            complete: function(t, e) {
                if ("throw" === t.type) throw t.arg;
                return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, 
                this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), 
                j;
            },
            finish: function(t) {
                for (var e, n = this.tryEntries.length - 1; 0 <= n; --n) if ((e = this.tryEntries[n]).finallyLoc === t) return this.complete(e.completion, e.afterLoc), 
                l(e), j;
            },
            catch: function(t) {
                for (var e, n = this.tryEntries.length - 1; 0 <= n; --n) if ((e = this.tryEntries[n]).tryLoc === t) {
                    var r = e.completion;
                    if ("throw" === r.type) {
                        var o = r.arg;
                        l(e);
                    }
                    return o;
                }
                throw new Error("illegal catch attempt");
            },
            delegateYield: function(t, e, n) {
                return this.delegate = {
                    iterator: d(t),
                    resultName: e,
                    nextLoc: n
                }, "next" === this.method && (this.arg = m), j;
            }
        };
    }
}(function() {
    return this;
}() || Function("return this")());