<template>
  <div id="map" ref="mapContainer" class="h-screen w-screen"></div>
  <div
    id="popup"
    class="bg-white h-[50px] flex items-center justify-center rounded text-base"
  ></div>
</template>

<script setup>
import mapUrls from '@/GIS/mapUrls.js'
import TileLayer from 'ol/layer/Tile'
import TileWMS from 'ol/source/TileWMS'
import { Feature } from 'ol'
import { Point } from 'ol/geom'
import { Vector as VectorSource } from 'ol/source.js'
import { Vector as VectorLayer } from 'ol/layer.js'
import { Fill, Stroke, Style, Text, Icon } from 'ol/style.js'
import { Modify } from 'ol/interaction.js'
import { XYZ } from 'ol/source'
import { Map, View } from 'ol'
import Overlay from 'ol/Overlay'
import coordtransform from 'coordtransform'
import { ScaleLine, defaults as defaultControls } from 'ol/control'

let map,
  baseLayers = [],
  vecLayer,
  imgLayer,
  layerLp,
  markerSource,
  markerLayer

const mapContainer = ref(null)
// 创建影像底图
const createdBaseLayer = () => {
  imgLayer = new TileLayer({
    source: new XYZ({
      url: mapUrls['tian-img']
    }),
    title: '影像底图'
  })
  baseLayers.push(imgLayer)
}

createdBaseLayer()

// 创建临平遥感影像地图
const createdLPLayer = () => {
  layerLp = new TileLayer({
    source: new TileWMS({
      url: 'http://121.40.45.178:8090/geoserver/wms/',
      params: {
        VERSION: '1.1.0',
        REQUEST: 'GetMap',
        layers: 'LYN:LPQ3857' // LYN:linping_16db,(地名标记)  LYN:LPQ3857,LYN:lp_water,LYN:osm_lp,LYN:lp_vegetatin
      },
      zIndex: 1000,
      crossOrigin: 'anonymous',
      serverType: 'geoserver'
    })
  })
  map.addLayer(layerLp)
}

// 创建marker
const createMarker = () => {
  const gcj02Coords = [
    [120.299222, 30.419154],
    [120.32479, 30.43975],
    [120.283362, 30.44069],
    [120.297505, 30.415185],
    [120.30785, 30.43201],
    [120.319282, 30.436628],
    [120.280904, 30.437433],
    [120.287059, 30.432297],
    [120.227656, 30.459619],
    [120.267272, 30.43654]
  ]
  const wgs84Coords = gcj02Coords.map((item) =>
    coordtransform.gcj02towgs84(item[0], item[1])
  )
  let iconFeature1,
    iconFeature2,
    iconFeature3,
    iconFeature4,
    iconFeature5,
    iconFeature6,
    iconFeature7,
    iconFeature8,
    iconFeature9,
    iconFeature10

  const iconFeatures = [
    iconFeature1,
    iconFeature2,
    iconFeature3,
    iconFeature4,
    iconFeature5,
    iconFeature6,
    iconFeature7,
    iconFeature8,
    iconFeature9,
    iconFeature10
  ]
  //创建图标特性
  for (let i = 0; i < wgs84Coords.length; i++) {
    iconFeatures[i] = new Feature({
      geometry: new Point(wgs84Coords[i]),
      name: `marker${i}`
    })
    //创建图标样式
    iconFeatures[i].setStyle(
      new Style({
        image: new Icon({
          opacity: 1,
          src: '/src/assets/icons/marker.svg',
          scale: 0.2,
          // color: 'red',
          anchor: [0.5, 200],
          anchorXUnits: 'fraction',
          anchorYUnits: 'pixels'
        })
      })
    )
  }

  markerSource = new VectorSource()
  markerSource.addFeatures(iconFeatures)
  markerLayer = new VectorLayer({
    source: markerSource
  })
  map.addLayer(markerLayer)

  // 在map实例中创建一个dom，它的位置需要通过popup.setPosition([long,lat])来确定
  const popup = new Overlay({
    element: document.getElementById('popup'),
    positioning: 'bottom-center',
    stopEvent: false,
    offset: [0, -40]
  })
  map.addOverlay(popup)

  // 点击markerFeature时就弹出对应信息
  map.on('click', function (e) {
    const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
      return feature
    })

    if (feature) {
      const coordinates = feature.getGeometry().getCoordinates()
      console.log(coordinates)
      popup.setPosition(coordinates)

      const content = `<div>${feature.get('name')}</div>`
      // 获取popup的dom
      popup.getElement().innerHTML = content
    } else {
      popup.setPosition([0, 0])
    }
  })

  // 当鼠标移入markerFeature时就设置为cursor：pointer
  map.on('pointermove', function (e) {
    const feature = map.forEachFeatureAtPixel(e.pixel, function (feature) {
      return feature
    })
    if (feature) {
      mapContainer.value.style.cursor = 'pointer'
    } else {
      mapContainer.value.style.cursor = ''
    }
  })
}

onMounted(() => {
  // 加载天地图底图
  map = new Map({
    target: 'map',
    layers: baseLayers,
    view: new View({
      projection: 'EPSG:4326',
      center: [120.25, 30.4],
      zoom: 12,
      maxZoom: 20,
      minZoom: 5
    }),
    controls: defaultControls({
      zoom: false,
      rotate: false,
      attribution: false
    })
  })
  // 获取临平遥感影像地图
  createdLPLayer()
  // 添加markerLayer
  createMarker()
})
</script>
