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
  {
    path: '/tree',
    meta: {
      title: 'tree'
    },
    component: (resolve) => require(['./component/designer/designer_data/designer_data_directory/Tree.vue'], resolve)
  },
];
export default routers;
