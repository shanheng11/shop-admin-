// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import http from './utils/http'
import qs from 'qs'
import API from './API'
import mytable from './components/mytable'
import echarts from 'echarts'
import store from "./store"
// 引入插件
import ElementUI from 'element-ui';
// 引入插件
import 'element-ui/lib/theme-chalk/index.css';
import date from "date-php"
// 安装插件
Vue.use(ElementUI);
// Vue.prototype.$store = store
Vue.prototype.$http = http;
Vue.prototype.$api = API
Vue.prototype.$qs = qs
Vue.prototype.$echarts = echarts
Vue.prototype.$domain = "http://localhost:3000";
Vue.prototype.$date = date;

Vue.config.productionTip = false
Vue.component('mytable', mytable)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
