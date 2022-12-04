//設定地圖中心座標和縮放比例
var map = L.map("map", {
  center: [22.7317117, 120.28759],
  zoom: 12
});

//載入 OpenStreetMap 地圖資訊
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var redIcon = new L.Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//在中心座標，放上紅色定位圖標
L.marker([22.7317117, 120.28759], { icon: redIcon }).addTo(map);

var xhr = new XMLHttpRequest();
xhr.open(
  "get",
  "https://raw.githubusercontent.com/SiongSng/Rapid-Antigen-Test-Taiwan-Map/data/data/antigen_open_street_map.json"
);
xhr.send();
xhr.onload = function () {
  var data = JSON.parse(xhr.responseText).features;

  for (var i = 0; i < data.length; i++) {
    //將藥局標記不同顏色的圖標
    var imageIcon = new L.Icon({
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    var markers = new L.MarkerClusterGroup({
      iconCreateFunction: function (cluster) {
        var list = cluster.getAllChildMarkers();
        var level = 0;

        for (var i = 0; i < list.length; i++) {
          if (
            level < 3 &&
            list[i].options.icon.options.iconUrl === image3Icon.options.iconUrl
          )
            level = 3;
          else if (
            level < 2 &&
            list[i].options.icon.options.iconUrl === image2Icon.options.iconUrl
          )
            level = 2;
          else if (
            level < 1 &&
            list[i].options.icon.options.iconUrl === image1Icon.options.iconUrl
          )
            level = 1;
        }
        return L.divIcon({
          html: "<div><span>" + cluster.getChildCount() + "</span></div>",
          className: "icon-cluster " + imageClass[level],
          iconSize: [50, 50]
        });
      },
      removeOutsideVisibleBounds: true,
      animate: true
    }).addTo(map);
    //設定藥局經緯度和 Popup 內容
    var mark = L.marker(
      [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]],
      { icon: imageIcon }
    ).bindPopup(
      '<p class="popup-name">' +
        data[i].properties.name +
        "<p/>" +
        '<p class="popup-phone">[電話] ' +
        data[i].properties.phone +
        "<p/>" +
        '<p class="popup-address">[地址] ' +
        data[i].properties.address +
        "<p/>" +
        '<p class="popup-brands">[品牌] ' +
        data[i].properties.brands +
        "<p/>" +
        '<p class="popup-count">[數量] ' +
        data[i].properties.count +
        "<p/>" +
        '<p class="popup-updated_at">[最後更新時間] ' +
        data[i].properties.updated_at +
        "<p/>" +
        '<input type="button" value="打開Google地圖" onclick="location.href="https://www.youtube.com/watch?v=xaOWXjuE6DI">'
    );

    //將圖標加入圖層
    markers.addLayer(mark);
  }
  map.addLayer(markers);
};
