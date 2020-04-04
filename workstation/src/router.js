import Workstation from './Workstation.vue'
import Designer from './components/designer/Designer.vue'
import Dashboard from './components/dashboard/Dashboard.vue'


const routers = [
  {
    path: '/', component: Workstation
  },
  {
    path: '/designer', component: Designer
  },
  {
    path: '/dashboard', component: Dashboard
  },
]

export default routers;
