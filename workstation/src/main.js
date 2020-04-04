import Vue from 'vue'
import VueRouter from 'vue-router';
import routers from './router'
import init from './init'
import request from './request'

Vue.config.productionTip = false

Vue.use(VueRouter);


const RouterConfig = {
  mode: 'history',
  routes: routers
};
const router = new VueRouter(RouterConfig);

init.init();
Vue.prototype.request = request;

new Vue({
  router,
}).$mount('#app')
