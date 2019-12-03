export default [
  {
    path: '/marketing/targetCustomer/index',
    name: 'TargetCustomer',
    hidden: false,
    meta: {
      title: '目标客户管理',
      auth: 'TargetCustomer'
    },
    component:
      () => import('@/components/marketing/targetCustomer')
  },
  {
    path: '/marketing/targetCustomer/addTargetCustomer',
    name: 'AddTargetCustomer',
    hidden: true,
    meta: {
      auth: 'TargetCustomerCreate',
      title: '添加目标客户'
    },
    component:
      () => import('@/components/marketing/targetCustomer/addTargetCustomer')
  },
  {
    path: '/marketing/targetCustomer/editTargetCustomer',
    name: 'EditTargetCustomer',
    hidden: true,
    meta: {
      auth: 'TargetCustomerUpdate',
      title: '编辑目标客户'
    },
    component:
      () => import('@/components/marketing/targetCustomer/editTargetCustomer')
  },
  {
    path: '/marketing/targetCustomer/targetCustomerDetail',
    name: 'TargetCustomerDetail',
    hidden: true,
    meta: {
      auth: 'TargetCustomerDetail',
      title: '目标客户详情'
    },
    component:
      () => import('@/components/marketing/targetCustomer/targetCustomerDetail')
  },
  {
    path: '/marketing/targetCustomer/customerVisit',
    name: 'CustomerVisit',
    hidden: true,
    meta: {
      auth: 'TargetCustomerVisitRecord',
      title: '客户拜访记录'
    },
    component:
      () => import('@/components/marketing/targetCustomer/customerVisit')
  },
  {
    path: '/marketing/projectTender/index',
    name: 'ProjectTender',
    hidden: false,
    meta: {
      title: '项目招投标管理',
      auth: 'ProjectTender'
    },
    component:
      () => import('@/components/marketing/projectTender')
  },
  {
    path: '/marketing/projectTender/addProjectTender',
    name: 'AddProjectTender',
    hidden: true,
    meta: {
      auth: 'ProjectTenderCreate',
      title: '添加投标项目'
    },
    component:
      () => import('@/components/marketing/projectTender/addProjectTender')
  },
  {
    path: '/marketing/projectTender/editProjectTender',
    name: 'EditProjectTender',
    hidden: true,
    meta: {
      auth: 'ProjectTenderUpdate',
      title: '编辑投标项目'
    },
    component:
      () => import('@/components/marketing/projectTender/editProjectTender')
  },
  {
    path: '/marketing/projectTender/projectTenderDetail',
    name: 'ProjectTenderDetail',
    hidden: true,
    meta: {
      auth: 'ProjectTenderDetail',
      title: '投标项目详情'
    },
    component:
      () => import('@/components/marketing/projectTender/projectTenderDetail')
  },
  {
    path: '/marketing/projectTenderWorkTask',
    name: 'ProjectTenderWorkTask',
    hidden: false,
    meta: {
      auth: 'ProjectTenderWorkTask',
      title: '项目招投标工作任务管理'
    },
    component:
      () => import('@/components/marketing/projectTenderWorkTask')
  },
]