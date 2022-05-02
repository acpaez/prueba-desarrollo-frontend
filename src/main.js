import Vue from 'vue';
import App from './App.vue';
import {
  BootstrapVue,
  IconsPlugin
} from 'bootstrap-vue';
import router from './router';
import store from './store';
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(VueAxios, axios);
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
Vue.use(ElementUI);

/**
 * define url base of axios and headers 
 */
axios.defaults.baseURL = 'http://localhost:8100/api';
axios.defaults.headers.common['Accept'] = 'application/json';
let user = JSON.parse(localStorage.getItem('user'));
if (user && user.access_token) {
  axios.defaults.headers.common["Authorization"] =
    `Bearer ${user.access_token}`;
}


Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
  })
  .$mount('#app');