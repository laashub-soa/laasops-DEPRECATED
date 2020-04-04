import Vue from 'vue'
import VueRouter from 'vue-router';
import Workstation from '../Workstation'
import Designer from '../components/designer/Designer'
import Dashboard from '../components/dashboard/Dashboard'

Vue.config.productionTip = false

Vue.use(VueRouter)


export default new VueRouter({
  routes: [
    {
      path: '/', component: Workstation
    },
    {
      path: '/designer', component: Designer
    },
    {
      path: '/dashboard', component: Dashboard
    },
  ],
  mode: 'history',
})
