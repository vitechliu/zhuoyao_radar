<template>
  <div id="app">
    <div class="burger-wrap">
      <div :class="['nav-burger', showNav ? 'active' : '']">
        <button class="menu-toggle" @click.prevent="openMenu">
          Menu
        </button>
      </div>
    </div>
    <transition name="black">
      <div
        class="black-screen"
        v-show="showBlackCover"
        @click.prevent="openMenu"
      ></div>
    </transition>
    <transition name="side">
      <div class="side-nav" v-show="showMenu">
        <div class="side-header">
          <h2>捉妖雷达 - Web</h2>
          <p>Version: {{ version }}</p>
          <p>捉妖雷达高玩交流群：1025673494</p>
        </div>
        <div class="side-content">
          <div
            class="header"
            style="font-size:18px;padding-left:10px;padding-top:5px;"
          >
            筛选
          </div>
          <ul>
            <li>
              <span class="tag">稀有</span>
              <el-switch v-model="settings.fit.rare"> </el-switch>
            </li>
            <li>
              <span class="tag">1觉</span>
              <el-switch v-model="settings.fit.t1"> </el-switch>
            </li>
            <li>
              <span class="tag">2觉</span>
              <el-switch v-model="settings.fit.t2"> </el-switch>
            </li>
            <li>
              <span class="tag">巢穴</span>
              <el-switch v-model="settings.fit.nest"> </el-switch>
            </li>
            <li>
              <span class="tag">地域</span>
              <el-switch v-model="settings.fit.feature"> </el-switch>
            </li>
            <li>
              <span class="tag">鲲鲲</span>
              <el-switch v-model="settings.fit.fish"> </el-switch>
            </li>
            <li>
              <span class="tag">元素</span>
              <el-switch v-model="settings.fit.element"> </el-switch>
            </li>
            <li>
              <span class="tag">其他所有（慎选）</span>
              <el-switch v-model="settings.fit.all"> </el-switch>
            </li>
          </ul>
          <div class="hr"></div>
          <div
            class="header"
            style="font-size:18px;padding-left:10px;padding-top:5px;"
          >
            设置
          </div>
          <ul>
            <li>
              <span class="tag">点击地图自动搜索</span>
              <el-switch v-model="settings.auto_search"> </el-switch>
            </li>
          </ul>
        </div>
        <div class="side-footer">
          <iframe
            src="https://ghbtns.com/github-btn.html?user=liuzirui1122&repo=zhuoyao_radar&type=star&count=true&size=large"
            frameborder="0"
            scrolling="0"
            width="160px"
            height="30px"
          ></iframe>
        </div>
      </div>
    </transition>
    <div id="status">
      <div id="info"><br /><span v-html="status"></span></div>
    </div>
    <div id="buttons">
      <el-button size="mini" @click="getYaolingInfo">妖灵</el-button>
      <el-button size="mini" @click="getLeitaiInfo"
        >擂台(未开发)</el-button
      >
      <el-button size="mini" type="warning" @click="debug"
        >Debug</el-button
      >
    </div>
    <div id="qmap"></div>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
import tempdata from './cmps/tempdata';
import _ from 'lodash';

export default {
  name: 'zhuoyao-radar',
  data() {
    return {
      showNav: false,
      unknownKey: [],
      status: '',
      socket: {},
      apikey: '2LWBZ-FEQK6-KKYS2-M6WR4-PFGS5-RZBP3', // 地图api key
      map: {},
      clickMarker: null,
      userMarker: null,
      firstTime: true,
      url:
        'wss://publicld.gwgo.qq.com?account_value=0&account_type=0&appid=0&token=0', // 获取妖灵接口
      reconnectTimeout: 1000,
      currVersion: 'sprite_0e4ebf1344bf35582f7504ee265f32eb.json', //190508版本的json 如果有变动手动更新
      version: 'v0.6.509.1450',
      location: {
        longitude: 116.3579177856,
        latitude: 39.9610780334
      },
      statusOK: false,
      yaolings: {},
      markers: [],
      settings: {
        fit: {
          t1: false,
          t2: true,
          all: false,
          nest: false,
          rare: true,
          fish: false,
          feature: false,
          element: false
        },
        auto_search: false
      },
      filter_rare: [
        2000106,
        2000313,
        2000327,
        2000265,
        2000238,
        2000109,
        2000078,
        2000191,
        2000242,
        2000147,
        2000188
      ], // 稀有
      filter_t2: [], // 2觉
      filter_t1: [], // 1觉
      filter_nest: [2000321, 2000324, 2000112], // 巢穴怪
      filter_feature: [2004013, 2004016, 2004010, 2004007, 2004004, 2000206], // 地域
      filter_fish: [2000501, 2000502, 2000504, 2000519], // 蔡徐坤
      filter_element: [2000511, 2000512, 2000513, 2000514, 2000515], // 元素
      current_filter: [],
      filter_bot: [2000313, 2000238, 2000265, 2000327, 2000106],
      botMode: false,
      botInterval: null,
      botTime: 0,
      botURL: 'http://127.0.0.1:36524/api/v1/Cqp/CQ_sendGroupMsg',
      botGroup: '799576270',
      botChecked: [],
      showMenu: false,
      showBlackCover: false
    };
  },
  created() {
    this.getCookies();
  },
  mounted() {
    this.getLocation();

    this.current_filter = this.filter_none;

    this.addStatus('捉妖雷达Web版');
    this.addStatus('版本:' + this.version);
    this.addStatus('更新日志:');
    this.addStatus('丰富筛选库，优化界面');
    this.addStatus('点击地图自动筛选功能');
    this.addStatus('');
    //this.addStatus("开发者:ZachXia,Vitech");

    setTimeout(() => {
      this.notify('提示:点击右下角菜单开始筛选！');
    }, 2000);
  },
  methods: {
    openMenu() {
      this.showNav = !this.showNav;
      this.showMenu = !this.showMenu;
      this.showBlackCover = !this.showBlackCover;
    },

    bot_open: function() {
      this.location = {
        longitude: 116.3579177856,
        latitude: 39.9610780334
      };
      this.botMode = true;
      this.botInterval = setInterval(() => {
        this.botCheck();
      }, 30000);
    },

    botCheck: function() {
      this.getYaolingBot();
      console.log(this.botTime);
      if (this.botTime == 1) {
        //this.ajaxGroupMessage("北邮捉妖扫描系统启动");
      }
    },
    botAnalyze: function(yaolings) {
      for (var i = 0; i < yaolings.length; i++) {
        var ti = yaolings[i];

        if (this.filter_bot.indexOf(ti.sprite_id) === -1) {
          continue;
        }

        var time = new Date() - new Date(ti.gentime * 1000);
        var second = time / 1000;
        var minute = Math.floor(second / 60);
        var second = Math.floor(second % 60);

        var fintime = minute + '分' + second + '秒';

        var yaoling_hash = ti.gentime.toString() + ti.latitude.toString();

        if (this.botChecked.indexOf(yaoling_hash) === -1) {
          continue;
        }

        this.botChecked.push(yaoling_hash);
        var yl = this.getYaoling(ti.sprite_id);

        geocoder = new qq.maps.Geocoder({
          complete: result => {
            var msg =
              '发现一只' +
              yl.Name +
              ',位于' +
              result.detail.address +
              ',剩余时间:' +
              fintime;
            this.ajaxGroupMessage(msg);
          }
        });

        var coord = new qq.maps.LatLng(ti.latitude / 1e6, ti.longtitude / 1e6);

        geocoder.getAddress(coord);

        continue;
      }
    },
    // botMessage:function(monsters) {
    //     for (var i=0;i<monsters.length;i++){
    //         var mi = monsters[i];

    //         var generateMessage = "123123";
    //         this.ajaxGroupMessage(generateMessage);
    //     }
    // },

    ajaxGroupMessage: function(mes) {
      // console.log(mes);
      // return;
      $.post(
        'request.php',
        {
          qq: this.botGroup,
          msg: mes
        },
        function(data) {
          console.log(data);
        }
      );
    },

    getCookies: function() {
      console.log(Cookies.get('radar_settings'));
      if (typeof Cookies.get('radar_settings') != 'undefined')
        this.settings = Cookies.getJSON('radar_settings');
    },
    flashCookies: function() {
      Cookies.set('radar_settings', this.settings);
    },
    debug: function() {
      // $('#status').toggle();
    },
    init: function() {
      var location = this.location;

      this.map = new qq.maps.Map(document.getElementById('qmap'), {
        center: new qq.maps.LatLng(
          this.location.latitude,
          this.location.longitude
        ),
        zoom: 16 // 地图的中心地理坐标。
      });

      var listener = qq.maps.event.addListener(
        this.map,
        'click',
        this.clickMap
      );
      this.connectSocket();
    },

    clickMap: function(e) {
      this.messageWarning('位置已重置,请重新筛选');
      this.location.longitude = e.latLng.lng;
      this.location.latitude = e.latLng.lat;
      var icon = new qq.maps.MarkerImage(
        'original/image/icon/notify-arrow.png',
        null,
        null,
        null,
        new qq.maps.Size(40, 40)
      );
      if (this.clickMarker != null)
        this.clickMarker.setPosition(
          new qq.maps.LatLng(e.latLng.lat, e.latLng.lng)
        );
      else {
        this.clickMarker = new qq.maps.Marker({
          position: new qq.maps.LatLng(e.latLng.lat, e.latLng.lng),
          map: this.map
        });
        this.clickMarker.setIcon(icon);
      }

      if (this.settings.auto_search) {
        this.getYaolingInfo();
      }
    },
    getYaolings: function() {
      var url = 'https://hy.gwgo.qq.com/sync/pet/config/' + this.currVersion;
      // try {
      //     $.getJSON(url,result => {
      //         console.log(result);
      //         this.statusOK = true;
      //     });
      //     console.log("1");
      // } catch(e) {
      //     console.log(e);
      //     console.log("3");
      // }
      // console.log("2");

      this.yaolings = tempdata.Data;

      this.generateFilters();
      this.statusOK = true;
    },

    generateFilters: function() {
      for (var i = 0; i < this.yaolings.length; i++) {
        var yi = this.yaolings[i];
        if (yi.Level == 3) this.filter_t2.push(yi.Id);
        if (yi.Level == 2) this.filter_t1.push(yi.Id);
      }
    },
    //Util
    getRequestIndex: function(n) {
      switch (n) {
        case '1001':
          return 0;

        case '1002':
          return 1;

        case '1003':
          return 2;

        case '10040':
          return 3;

        case '10041':
          return 4;
      }
    },
    genRequestId: function(n) {
      var g = new Date().getTime() % 1234567;
      switch (n) {
        case '1001':
          this.unknownKey[0] = g;
          break;

        case '1002':
          this.unknownKey[1] = g;
          break;

        case '1003':
          this.unknownKey[2] = g;
          break;

        case '10040':
          this.unknownKey[3] = g;
          break;

        case '10041':
          this.unknownKey[4] = g;
      }
      return g;
    },
    getRequestTypeFromId: function(n) {
      return this.unknownKey[0] == n
        ? '1001'
        : this.unknownKey[1] == n
          ? '1002'
          : this.unknownKey[2] == n
            ? '1003'
            : this.unknownKey[3] == n
              ? '10040'
              : this.unknownKey[4] == n ? '10041' : 0;
    },
    convertLocation: function(n) {
      var g = n.toFixed(6);
      return parseInt(1e6 * g);
    },
    utf8ByteToUnicodeStr: function(n) {
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
    },

    connectSocket: function() {
      this.socket = new WebSocket(this.url);
      this.socket.onclose = this.onSocketClose;

      this.socket.onerror = this.onSocketError;

      this.socket.onopen = this.onSocketOpen;

      this.socket.onmessage = this.onSocketMessage;
    },
    reconnectSocket: function() {},
    onSocketOpen: function() {
      this.addStatus('WSS连接开启');
      if (this.firstTime) {
        this.firstTime = false;
        this.getSettingFileName();
        this.getBossLevelConfig();
      }
    },
    onSocketMessage: function(event) {
      var blob = event.data;

      var arrayBuffer;
      var ans;

      if (typeof blob === 'string') {
        //ans = blob;
        //this.addStatusWithoutNewline("WSS连接信息：");
        //this.addStatus(ans);
      } else {
        var fileReader = new FileReader();
        fileReader.onload = e => {
          arrayBuffer = e.target.result;
          var n = this.utf8ByteToUnicodeStr(
            new Uint8Array(arrayBuffer).slice(4)
          );
          //this.addStatusWithoutNewline("WSS连接信息：");
          //this.addStatus(n);

          var data = JSON.parse(n);

          this.handleMessage(data);
        };
        fileReader.readAsArrayBuffer(blob);
      }
    },
    onSocketClose: function() {
      this.addStatus('WSS连接关闭');
      setTimeout(() => {
        this.addStatus('重连中');
        this.connectSocket();
      }, this.reconnectTimeout);
    },
    onSocketError: function() {
      this.addStatus('WSS连接错误');
      setTimeout(() => {
        this.addStatus('重连中');
        this.connectSocket();
      }, this.reconnectTimeout);
    },

    handleMessage: function(data) {
      console.log(data);

      var c = this.getRequestTypeFromId(data.requestid);

      switch (c) {
        case '10041':
          //console.log(1);
          this.getVersionFileName(data.filename);
          break;

        case '10040':
          //console.log("妖灵等级", n), a.saveBossStartAndEndLevel(n.startlevel, n.endlevel);
          break;

        case '1001':
          console.log('获取到妖灵数量', data.sprite_list.length);
          if (this.botMode) this.botAnalyze(data.sprite_list);
          else this.buildMarkersByData(data.sprite_list, 1);
          break;

        case '1002':
        //this.getLeitaiNearby(data);
      }
    },
    getVersionFileName: function(name) {
      if (name != this.currVersion) {
        this.getYaolings(name);
        console.info('有新版本的icon!');
        this.messageWarning('有新版本的妖灵库，请通知作者更新！！');
      } else {
        this.getYaolings(this.currVersion);
      }
    },

    buildMarkersByData: function(t, i) {
      this.clearAllMarkers();
      //console.log(t);

      for (var i = 0; i < t.length; i++) {
        var ti = t[i];

        if (this.fit.length == 1 && this.fit[0] == 'special') {
        } else {
          if (this.fit.indexOf(ti.sprite_id) === -1) {
            continue;
          }
        }

        var m = this.buildSpiteMarker(m, ti);
        var icon = new qq.maps.MarkerImage(
          m.iconPath,
          null,
          null,
          null,
          new qq.maps.Size(40, 40)
        );
        var marker = new qq.maps.Marker({
          position: new qq.maps.LatLng(m.latitude, m.longitude),
          map: this.map
        });
        marker.setIcon(icon);

        this.markers.push(marker);
      }
      this.notify('筛选成功!');
    },

    clearAllMarkers: function() {
      for (var i = 0; i < this.markers.length; i++) {
        this.markers[i].setMap(null);
      }
      this.markers = [];
    },

    buildSpiteMarker: function(id, ti) {
      var icon = this.getHeadImagePath(ti);
      return {
        id: id,
        latitude: ti.latitude / 1e6,
        longitude: ti.longtitude / 1e6,
        iconPath: icon,
        width: 40,
        height: 40
      };
    },
    //根据妖灵信息获取其icon地址
    getHeadImagePath: function(e) {
      var webpath = 'https://hy.gwgo.qq.com/sync/pet/';
      var a = this.getYaoling(e.sprite_id);
      if (null == a) return 'original/image/default-head.png';
      var r = 'original/image/head/' + a.ImgName + '.png';
      return pngs.indexOf(a.ImgName + '.png') >= 0
        ? r
        : webpath + a.SmallImgPath;
    },

    setFilter: function(str, f) {
      this.current_filter = f;
      this.addStatus('已修改筛选规则：' + str);
    },
    //
    // buildMarkersByData: function(t, i) {
    //     console.log(t);
    //     this.data.markers = [];
    //     var o = wx.getStorageSync(a.hasSetted);
    //     if (t) if ("1" == i) {
    //         var s = [];
    //         o && (s = wx.getStorageSync(a.showedYaojingIds));
    //         for (var n = 0; n < t.length; n++) o && s.indexOf(t[n].sprite_id) < 0 || e.globalData.quickSearchYaoguai.Id > 0 && e.globalData.quickSearchYaoguai.Id != t[n].sprite_id || this.data.markers.push(this.buildSpriteMarker(n, t[n], 1));
    //     } else if ("2" == i) if (-1 == e.globalData.quickSearchYaoguai.Id) for (var r = 0; r < t.length; r++) e.globalData.quickSearchYaoguai.level == t[r].starlevel && 2 == t[r].state && this.data.markers.push(this.buildSpriteMarker(r, t[r], 4)); else if (-2 == e.globalData.quickSearchYaoguai.Id) for (var l = 0; l < t.length; l++) e.globalData.quickSearchYaoguai.level == t[l].starlevel && 1 == t[l].state && this.data.markers.push(this.buildSpriteMarker(l, t[l], 3)); else if (e.globalData.quickSearchYaoguai.Id > 0) for (var c = 0; c < t.length; c++) e.globalData.quickSearchYaoguai.Id == t[c].sprite_id && this.data.markers.push(this.buildSpriteMarker(c, t[c], 1)); else if ("3" == f) {
    //         d = [];
    //         o && (d = wx.getStorageSync(a.showedBossEggLevels));
    //         for (var g = 0; g < t.length; g++) 1 == t[g].state && (o && d.indexOf(t[g].starlevel) < 0 || this.data.markers.push(this.buildSpriteMarker(g, t[g], 3)));
    //     } else if ("4" == f) {
    //         var h = [];
    //         o && (h = wx.getStorageSync(a.showedBossLevels));
    //         var d = [];
    //         o && (d = wx.getStorageSync(a.showedBossEggLevels));
    //         for (var m = 0; m < t.length; m++) 2 != t[m].state && 1 != t[m].state || o && h.indexOf(t[m].starlevel) < 0 && 2 == t[m].state || o && d.indexOf(t[m].starlevel) < 0 && 1 == t[m].state || (2 == t[m].state ? this.data.markers.push(this.buildSpriteMarker(m, t[m], 4)) : 1 == t[m].state && this.data.markers.push(this.buildSpriteMarker(m, t[m], 3)));
    //     } else if ("2" == f) for (var p = 0; p < t.length; p++) {
    //         var w = 2;
    //         1 == t[p].state && (w = 3), 2 == t[p].state && (w = 4), this.data.markers.push(this.buildSpriteMarker(p, t[p], w));
    //     }
    //     (u != t || e.globalData.quickSearchYaoguai.Id) && (wx.showLoading({
    //         title: "雷达正在探测...",
    //         mask: !0
    //     }), this.setData({
    //         markers: this.data.markers
    //     }, function() {
    //         setTimeout(function() {
    //             wx.hideLoading();
    //         }, 1e3);
    //     }), u = t);
    // },

    // buildSpriteMarker: function(e, i, o) {
    //     var s = {}, n = "";
    //     if ("1" == o && (n = t.getHeadImagePath(i.sprite_id)), "2" == o && (n = "/image/icon/leitai.png"),
    //     "3" == o && (n = t.getBossEggImage(i.starlevel), t.getStorageValue(a.bossEggTimeShowed))) {
    //         var r = t.formatDateTime(i.freshtime) + "孵化";
    //         s = {
    //             content: r,
    //             color: "#FFFFFF",
    //             fontSize: 9,
    //             padding: 1,
    //             borderWidth: 1,
    //             borderRadius: 10,
    //             bgColor: "#F15F1D",
    //             anchorX: -13 * r.length * .5 / 2
    //         };
    //     }
    //     if ("4" == o && (n = t.getHeadImagePath(i.bossid), t.getStorageValue(a.bossTimeShowed))) {
    //         var l = t.formatDateTime(i.freshtime) + "消失";
    //         s = {
    //             content: l,
    //             color: "#FFFFFF",
    //             fontSize: 9,
    //             padding: 1,
    //             borderWidth: 1,
    //             borderRadius: 10,
    //             bgColor: "#F15F1D",
    //             anchorX: -13 * l.length * .5 / 2
    //         };
    //     }
    //     if ("5" == o) {
    //         var c = "";
    //         n = t.cdnAddr + "small/" + i.ImgName + ".png", 0 == i.state || 4 == i.state || 3 == i.state ? n = "/image/head/leitai.png" : (c = i.starttime ? t.formatDateTime(i.lifetime + i.starttime) : t.formatDateTime(i.lifetime),
    //         -2 == i.Id ? (n = "/image/head/" + i.ImgName + ".png", c += "孵化") : c += "消失", s = {
    //             content: c,
    //             color: "#FFFFFF",
    //             fontSize: 9,
    //             padding: 1,
    //             borderWidth: 1,
    //             borderRadius: 10,
    //             bgColor: "#F15F1D",
    //             anchorX: -13 * c.length * .5 / 2
    //         });
    //     }
    //     return s.content ? {
    //         id: e,
    //         latitude: i.latitude / 1e6,
    //         longitude: i.longtitude / 1e6,
    //         iconPath: n,
    //         width: 40,
    //         height: 40,
    //         label: s
    //     } : {
    //         id: e,
    //         latitude: i.latitude / 1e6,
    //         longitude: i.longtitude / 1e6,
    //         iconPath: n,
    //         width: 40,
    //         height: 40
    //     };
    // },

    //消息通知
    messageWarning: function(message) {
      this.notify(message);
      return;

      this.$message({
        message: message,
        type: 'warning'
      });
    },
    arrayBufferToBase64: function(buffer) {
      var binary = '';
      var bytes = new Uint8Array(buffer);
      var len = bytes.byteLength;
      for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return window.btoa(binary);
    },
    abc1: function(e) {
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
    json2buffer: function(n) {
      var r = this.abc1(JSON.stringify(n)),
        t = r.length,
        o = new ArrayBuffer(4);
      new DataView(o).setUint32(0, t);
      var s = new Uint8Array(4 + t);
      return s.set(new Uint8Array(o), 0), s.set(r, 4), s.buffer;
    },
    addStatusWithoutNewline: function(str) {
      this.status += str;
    },
    addStatus: function(str) {
      this.status += str + '<br>';
    },
    sendMessage: function(message, requestIndex) {
      if (message.request_type != '1004') {
        this.addStatusWithoutNewline('WSS发送消息：');
        this.addStatus(JSON.stringify(message));
      }
      this.socket.send(this.json2buffer(message));
    },
    getLocation: function() {
      var that = this;
      that.init();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            console.log(position);
            that.location.longitude = position.coords.longitude;
            that.location.latitude = position.coords.latitude;

            var pos = new qq.maps.LatLng(
              that.location.latitude,
              that.location.longitude
            );
            that.map.panTo(pos);
            that.userMarker = new qq.maps.Marker({
              position: pos,
              map: that.map
            });

            //that.init();
          },
          function(e) {
            throw e.message;
            //that.init();
          }
        );
      } else {
        that.init();
      }
    },
    getYaolingInfo: function() {
      if (!this.statusOK || this.botMode) return;
      var e = {
        request_type: '1001',
        longtitude: this.convertLocation(this.location.longitude),
        latitude: this.convertLocation(this.location.latitude),
        requestid: this.genRequestId('1001'),
        platform: 0
      };
      this.sendMessage(e, '1001');
    },

    getLeitaiInfo: function() {
      this.addStatus('功能开发中!');
      this.messageWarning('功能开发中!');
      return;
      if (!this.statusOK || this.botMode) return;
      var e = {
        request_type: '1002',
        longtitude: this.convertLocation(this.location.longitude),
        latitude: this.convertLocation(this.location.latitude),
        requestid: this.genRequestId('1002'),
        platform: 0
      };
      this.sendMessage(e, '1002');
    },

    getYaolingBot: function() {
      this.botTime++;
      var e = {
        request_type: '1001',
        longtitude: this.convertLocation(this.location.longitude),
        latitude: this.convertLocation(this.location.latitude),
        requestid: this.genRequestId('1001'),
        platform: 0
      };
      this.sendMessage(e, '1001');
    },
    getYaoling: function(n) {
      for (var g = this.yaolings, p = 0; p < g.length; p++)
        if (g[p].Id == n) return g[p];
      return null;
    },

    getSettingFileName: function() {
      var e = {
        request_type: '1004',
        cfg_type: 1,
        requestid: this.genRequestId('10041'),
        platform: 0
      };
      this.sendMessage(e, '10041');
    },
    getBossLevelConfig: function() {
      return;
      var e = {
        request_type: '1004',
        cfg_type: 0,
        requestid: this.genRequestId('10040'),
        platform: 0
      };
      this.sendMessage(e, '10040');
    },

    notify: function(message) {
      this.$notify({
        message: message,
        showClose: false,
        duration: 2000
      });
    }
  },
  computed: {
    fit: function() {
      var ans = [];
      if (this.settings.fit.all) {
        ans = ['special'];
        return ans;
      }

      if (this.settings.fit.t1) ans = _.union(ans, this.filter_t1);
      if (this.settings.fit.t2) ans = _.union(ans, this.filter_t2);
      if (this.settings.fit.nest) ans = _.union(ans, this.filter_nest);
      if (this.settings.fit.fish) ans = _.union(ans, this.filter_fish);
      if (this.settings.fit.rare) ans = _.union(ans, this.filter_rare);
      if (this.settings.fit.feature) ans = _.union(ans, this.filter_feature);
      if (this.settings.fit.element) ans = _.union(ans, this.filter_element);

      return ans;
    }
  },
  watch: {
    settings: {
      handler: function(newV, oldV) {
        console.log(111);
        this.flashCookies();
      },
      deep: true
    }
  }
};
</script>
<style lang='less'>
</style>

