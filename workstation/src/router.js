const routers = [
  // service
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
  {
    path: '/data_struct',
    meta: {
      title: 'Datastruct'
    },
    component: (resolve) => require(['./service/designer/designer_data/designer_data_struct/DesignerDataStruct'], resolve)
  },
];
export default routers;
