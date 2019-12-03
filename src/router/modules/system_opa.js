export default [
  {
    path: '/system/systemopa/operationRecord',
    name: 'SysOperationRecord',
    hidden: false,
    meta: {
      title: '操作记录'
    },
    component: () => import('@/components/system/public/OperationRecord')
  },
  {
    path: '/system/systemopa/importRecord',
    name: 'SysImportRecord',
    hidden: true,
    meta: {
      title: '导入记录'
    },
    component:
      () => import('@/components/system/public/ImportRecord')
  },
  {
    path: '/system/systemopa/pushRecord',
    name: 'SysPushRecord',
    hidden: true,
    meta: {
      title: '推送记录'
    },
    component:
      () => import('@/components/system/public/PushRecord')
  },
  {
    path: '/system/systemopa/releaseRecord',
    name: 'SysReleaseRecord',
    hidden: true,
    meta: {
      title: '发布记录'
    },
    component:
      () => import('@/components/system/public/ReleaseRecord')
  },
  {
    path: '/system/systemopa/PaymentRecord',
    name: 'SysPaymentRecord',
    hidden: true,
    meta: {
      title: '付款信息记录'
    },
    component:
      () => import('@/components/system/public/PaymentRecord')
  }
]