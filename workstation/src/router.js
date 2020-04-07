const routers = [
  {
    path: '/',
    meta: {
      title: 'Workstation'
    },
    component: (resolve) => require(['./service/Workstation.vue'], resolve)
  },
  {
    path: '/designer',
    meta: {
      title: 'Designer'
    },
    component: (resolve) => require(['./service/designer/Designer'], resolve)
  },
  {
    path: '/dashboard',
    meta: {
      title: 'Dashboard'
    },
    component: (resolve) => require(['./service/dashboard/Dashboard'], resolve)
  },
  // component
  {
    path: '/directory',
    meta: {
      title: 'Directory'
    },
    component: (resolve) => require(['./component/directory/Directory.vue'], resolve)
  },
];
export default routers;
