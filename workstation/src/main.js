import Vue from 'vue'
import ViewUI from 'view-design';
import VueRouter from 'vue-router';
import routers from './router'
import init from './init'
import App from './app.vue';
import 'view-design/dist/styles/iview.css';


Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(ViewUI);

const RouterConfig = {
  mode: 'history',
  routes: routers
};
const router = new VueRouter(RouterConfig);

init.init();

new Vue({
  el: '#app',
  router: router,
  render: h => h(App)
});
