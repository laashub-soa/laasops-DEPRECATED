const routers = [
  {
    path: '/',
    meta: {
      title: 'Workstation'
    },
    component: (resolve) => require(['./component/Workstation.vue'], resolve)
  },
  {
    path: '/designer',
    meta: {
      title: 'Designer'
    },
    component: (resolve) => require(['./component/designer/Designer'], resolve)
  },
  {
    path: '/dashboard',
    meta: {
      title: 'Dashboard'
    },
    component: (resolve) => require(['./component/dashboard/Dashboard'], resolve)
  },
];
export default routers;
