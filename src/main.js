import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import axios from 'axios'
import TreeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

axios.defaults.baseURL = "http://localhost:8090"
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem("token");
  return config;
})
Vue.prototype.$http = axios


Vue.config.productionTip = false


Vue.component('tree-table', TreeTable)
Vue.use(VueQuillEditor)
// 时间过滤器
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)
  const year = dt.getFullYear()
  const month = (dt.getMonth() + 1 + '').padStart(2, '0')
  const day = (dt.getDate() + '').padStart(2, '0')
  const hour = (dt.getHours() + '').padStart(2, '0')
  const minutes = (dt.getMinutes() + '').padStart(2, '0')
  const second = (dt.getSeconds() + '').padStart(2, '0')
  return `${year}-${month}-${day} ${hour}:${minutes}:${second}`
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
