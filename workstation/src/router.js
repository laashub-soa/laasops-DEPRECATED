const routers = [
  {
    path: '/',
    meta: {
      title: 'Workstation'
    },
    component: (resolve) => require(['./component/Workstation.vue'], resolve)
  }
];
export default routers;
