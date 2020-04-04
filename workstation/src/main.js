import Vue from 'vue'
import ViewUI from 'view-design';
import VueRouter from 'vue-router';
import routers from './router'
import init from './init'
import request from './request'

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(ViewUI);



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
