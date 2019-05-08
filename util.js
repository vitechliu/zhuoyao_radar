var pngs = ["1.png", "10.png", "100.png", "101.png", "102.png", "103.png", "104.png", "105.png", "106.png",
        "107.png", "108.png", "109.png", "11.png", "110.png", "111.png", "112.png", "113.png", "114.png",
        "115.png", "116.png", "117.png", "118.png", "119.png", "12.png", "120.png", "121.png", "122.png",
        "123.png", "124.png", "125.png", "1255.png", "126.png", "127.png", "128.png", "129.png", "13.png",
        "130.png", "131.png", "132.png", "133.png", "134.png", "135.png", "136.png", "137.png", "138.png",
        "139.png", "14.png", "140.png", "141.png", "142.png", "143.png", "144.png", "145.png", "146.png",
        "147.png", "148.png", "149.png", "15.png", "150.png", "151.png", "152.png", "153.png", "154.png",
        "155.png", "156.png", "157.png", "158.png", "159.png", "16.png", "160.png", "161.png", "162.png",
        "163.png", "164.png", "165.png", "166.png", "167.png", "168.png", "169.png", "17.png", "170.png",
        "171.png", "172.png", "173.png", "174.png", "175.png", "176.png", "177.png", "178.png", "179.png",
        "18.png", "180.png", "181.png", "182.png", "183.png", "184.png", "185.png", "186.png", "187.png",
        "188.png", "189.png", "19.png", "190.png", "191.png", "192.png", "193.png", "194.png", "195.png",
        "196.png", "197.png", "198.png", "199.png", "2.png", "20.png", "200.png", "20001.png", "20002.png",
        "200106.png", "200107.png", "200108.png", "200234.png", "200237.png", "200240.png", "200243.png",
        "200267.png", "200270.png", "201.png", "202.png", "203.png", "204.png", "205.png", "206.png", "207.png",
        "208.png", "209.png", "21.png", "210.png", "211.png", "212.png", "213.png", "214.png", "215.png",
        "216.png", "217.png", "218.png", "219.png", "22.png", "220.png", "2200001.png", "2200002.png",
        "2200003.png", "2200004.png", "2200005.png", "2200006.png", "2200007.png", "2200008.png", "2200009.png",
        "2200010.png", "221.png", "222.png", "223.png", "224.png", "225.png", "226.png", "227.png", "228.png",
        "229.png", "23.png", "232.png", "233.png", "234.png", "235.png", "236.png", "237.png", "238.png",
        "239.png", "24.png", "240.png", "240001.png", "240002.png", "241.png", "242.png", "243.png", "246.png",
        "247.png", "248.png", "249.png", "25.png", "250.png", "252.png", "255.png", "258.png", "26.png",
        "261.png", "264.png", "265.png", "266.png", "267.png", "268.png", "269.png", "27.png", "270.png",
        "271.png", "272.png", "273.png", "275.png", "276.png", "277.png", "279.png", "28.png", "280.png",
        "281.png", "29.png", "3.png", "30.png", "301.png", "302.png", "303.png", "304.png", "305.png",
        "306.png", "307.png", "308.png", "309.png", "31.png", "310.png", "311.png", "312.png", "313.png",
        "314.png", "315.png", "317.png", "318.png", "319.png", "32.png", "321.png", "327.png", "328.png",
        "329.png", "33.png", "34.png", "35.png", "36.png", "37.png", "38.png", "39.png", "4.png", "40.png",
        "40001.png", "40002.png", "4001.png", "4002.png", "4003.png", "4004.png", "4005.png", "4006.png",
        "4007.png", "4008.png", "4009.png", "401.png", "4010.png", "4011.png", "4012.png", "4013.png",
        "4014.png", "4015.png", "4016.png", "4017.png", "4018.png", "4019.png", "402.png", "4020.png",
        "4021.png", "4022.png", "4023.png", "4024.png", "4025.png", "4026.png", "4027.png", "4028.png",
        "4029.png", "403.png", "404.png", "406.png", "407.png", "41.png", "413.png", "414.png", "415.png",
        "416.png", "417.png", "418.png", "42.png", "422.png", "423.png", "424.png", "43.png", "44.png",
        "45.png", "46.png", "47.png", "48.png", "49.png", "5.png", "50.png", "5001.png", "5002.png", "5003.png",
        "5004.png", "5005.png", "5006.png", "5007.png", "5008.png", "5009.png", "501.png", "5010.png",
        "5011.png", "5012.png", "5013.png", "5014.png", "5015.png", "5019.png", "502.png", "5020.png",
        "5021.png", "5022.png", "5023.png", "5024.png", "5028.png", "5029.png", "503.png", "5030.png",
        "5031.png", "5032.png", "5033.png", "5037.png", "5038.png", "5039.png", "504.png", "5040.png",
        "5041.png", "5042.png", "5043.png", "5044.png", "5045.png", "5046.png", "5047.png", "5048.png",
        "505.png", "5052.png", "5053.png", "5054.png", "506.png", "5061.png", "5062.png", "5063.png",
        "5067.png", "5068.png", "5069.png", "507.png", "5070.png", "5071.png", "5072.png", "5073.png",
        "5074.png", "5075.png", "508.png", "5082.png", "5083.png", "5084.png", "5085.png", "5086.png",
        "5087.png", "5088.png", "5089.png", "509.png", "5090.png", "51.png", "510.png", "5106.png", "5107.png",
        "5108.png", "5109.png", "511.png", "5110.png", "5111.png", "5112.png", "5113.png", "5114.png",
        "512.png", "513.png", "5130.png", "5131.png", "5132.png", "514.png", "5145.png", "5146.png", "5147.png",
        "515.png", "5151.png", "5152.png", "5153.png", "5154.png", "5155.png", "5156.png", "516.png", "517.png",
        "52.png", "53.png", "54.png", "55.png", "56.png", "57.png", "58.png", "59.png", "6.png", "60.png",
        "6007.png", "61.png", "62.png", "63.png", "64.png", "65.png", "66.png", "67.png", "68.png", "69.png",
        "7.png", "70.png", "71.png", "72.png", "73.png", "74.png", "75.png", "76.png", "77.png", "78.png",
        "79.png", "8.png", "80.png", "81.png", "82.png", "83.png", "84.png", "85.png", "87.png", "88.png",
        "89.png", "9.png", "90.png", "91.png", "92.png", "93.png", "94.png", "95.png", "96.png", "97.png",
        "98.png", "99.png", "Dan_1-2Star.png", "Dan_3-4Star.png", "Dan_5-6Star.png", "all.png", "boss1.png",
        "boss2.png", "boss3.png", "boss4.png", "boss5.png", "egg1.png", "egg2.png", "egg3.png", "egg4.png",
        "egg5.png", "leitai.png", "undefined.png"
    ],
    iconSet = [{
        Id: "-2",
        level: 1,
        Name: "1星 神石",
        ImgName: "egg1"
    }, {
        Id: "-2",
        level: 2,
        Name: "2星 神石",
        ImgName: "egg2"
    }, {
        Id: "-2",
        level: 3,
        Name: "3星 神石",
        ImgName: "egg3"
    }, {
        Id: "-2",
        level: 4,
        Name: "4星 神石",
        ImgName: "egg4"
    }, {
        Id: "-2",
        level: 5,
        Name: "5星 神石",
        ImgName: "egg5"
    }, {
        Id: "-2",
        level: 6,
        Name: "6星 神石",
        ImgName: "egg5"
    }, {
        Id: "-2",
        level: 7,
        Name: "7星 神石",
        ImgName: "egg5"
    }, {
        Id: "-2",
        level: 8,
        Name: "8星 神石",
        ImgName: "egg5"
    }, {
        Id: "-2",
        level: 9,
        Name: "9星 神石",
        ImgName: "egg5"
    }],
    a = [{
        Id: "-1",
        level: 1,
        Name: "1星 神灵",
        ImgName: "boss1"
    }, {
        Id: "-1",
        level: 2,
        Name: "2星 神灵",
        ImgName: "boss2"
    }, {
        Id: "-1",
        level: 3,
        Name: "3星 神灵",
        ImgName: "boss3"
    }, {
        Id: "-1",
        level: 4,
        Name: "4星 神灵",
        ImgName: "boss4"
    }, {
        Id: "-1",
        level: 5,
        Name: "5星 神灵",
        ImgName: "boss5"
    }, {
        Id: "-1",
        level: 6,
        Name: "6星 神灵",
        ImgName: "boss5"
    }, {
        Id: "-1",
        level: 7,
        Name: "7星 神灵",
        ImgName: "boss5"
    }, {
        Id: "-1",
        level: 8,
        Name: "8星 神灵",
        ImgName: "boss5"
    }, {
        Id: "-1",
        level: 9,
        Name: "9星 神灵",
        ImgName: "boss5"
    }],
    unknownKey = [-1, -1, -1, -1, -1];