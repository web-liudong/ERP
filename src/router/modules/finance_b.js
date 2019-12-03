export default [
  {
    path: '/finance/receivable/Receivable',
    name: 'Receivable',
    hidden: false,
    meta: {
      title: '开票方应收账款'
    },
    component:
      () => import('@/components/finance/receivable/Receivable'),
  },
  {
    path: '/finance/receivable/ReceivableDetail',
    name: 'ReceivableDetail',
    hidden: true,
    component:
      () => import('@/components/finance/receivable/ReceivableDetail'),
    meta: {
      title: '开票方账款详情',
      auth: 'AccountsReceivableDetail'
    }
  },
  {
    path: '/finance/serverReceivable/ServerReceivable',
    name: 'ServerReceivable',
    hidden: false,
    meta: {
      title: '服务方应收账款'
    },
    component:
      () => import('@/components/finance/serverReceivable/ServerReceivable'),
  },
  {
    path: '/finance/serverReceivable/ServerReceivableDetail',
    name: 'ServerReceivableDetail',
    hidden: true,
    component:
      () => import('@/components/finance/serverReceivable/ServerReceivableDetail'),
    meta: {
      title: '服务方账款详情',
      auth: 'ServerReceivableDetails'
    }
  },
  {
    path: '/finance/PaymentInformation/PaymentInformation',
    name: 'PaymentInformation',
    hidden: false,
    meta: {
      title: '回款信息'
    },
    component:
      () => import('@/components/finance/PaymentInformation/PaymentInformation'),
  },
  {
    path: '/finance/PaymentInformation/PaymentInformationAdd',
    name: 'PaymentInformationAdd',
    hidden: true,
    meta: {
      title: '添加回款信息'
    },
    component:
      () => import('@/components/finance/PaymentInformation/PaymentInformationAdd'),
  },
  {
    path: '/finance/PaymentInformation/PaymentInformationEdit',
    name: 'PaymentInformationEdit',
    hidden: true,
    meta: {
      title: '编辑回款信息'
    },
    component:
      () => import('@/components/finance/PaymentInformation/PaymentInformationEdit'),
  },
  {
    path: '/finance/PaymentInformation/commodityimportrecord',
    name: 'CommodityImportRecord',
    hidden: true,
    meta: {
      title: '回款信息导入记录'
    },
    component:
      () => import('@/components/system/public/ImportRecord'),
  },
  {
    path: '/finance/PaymentInformation/FinancialRecognitionOperation',
    name: 'FinancialRecognitionOperation',
    hidden: true,
    meta: {
      title: '认款操作'
    },
    component:
      () => import('@/components/finance/PaymentInformation/FinancialRecognitionOperation'),
  },
  {
    path: '/finance/PaymentInformation/PaymentInformationDetails',
    name: 'PaymentInformationDetails',
    hidden: true,
    meta: {
      title: '回款信息详情'
    },
    component:
      () => import('@/components/finance/PaymentInformation/PaymentInformationDetails'),
  },
  {
    path: '/finance/accountspayablelist/accountspayabledetail',
    name: 'AccountsPayableDetail',
    hidden: true,
    meta: {
      title: '应付账款详情',
      auth: 'AccountsPayableDetail'
    },
    component:
      () => import('@/components/finance/accountsPayable/AccountsPayableDetail'),
  },
  {
    path: '/finance/AccountsPayableRecord',
    name: 'AccountsPayableRecord',
    hidden: true,
    component:
      () => import('@/components/finance/accountsPayable/AccountsPayableRecord'),
    meta: {
      title: '应付账款记录',
      auth: 'AccountsPayablePayRecord'
    }
  },
  {
    path: '/finance/accountspayablelist',
    name: 'AccountsPayableList',
    hidden: false,
    component:
      () => import('@/components/finance/accountsPayable/AccountsPayableList'),
    meta: {
      title: '开票方应付账款'
    }
  },
  {
    path: '/finance/PurchasePaymentsList',
    name: 'PurchasePaymentsList',
    hidden: false,
    meta: {
      title: '付款单列表',
      auth: 'PurchasePaymentsList'
    },
    component: () => import('@/components/purchase/purchaseBillList/PurchasePaymentsList'),
  },
  {
    path: '/finance/PurchasePaymentDetails',
    name: 'PurchasePaymentDetails',
    hidden: false,
    meta: {
      title: '付款单详情',
      auth: 'PurchasePaymentDetails'
    },
    component: () => import('@/components/purchase/purchaseBillList/PurchasePaymentDetails'),
  },
  {
    path: '/finance/PurchasePaymentRecord',
    name: 'PurchasePaymentRecord',
    hidden: false,
    meta: {
      title: '付款记录',
      auth: 'PurchasePaymentRecord'
    },
    component: () => import('@/components/purchase/purchaseBillList/PurchasePaymentRecord'),
  },
  {
    path: '/finance/PurchasePaymentImport',
    name: 'PurchasePaymentImport',
    hidden: false,
    meta: {
      title: '导入记录',
      auth: ''
    },
    component: () => import('@/components/purchase/purchaseBillList/PurchasePaymentImport'),
  },
  {
    path: '/finance/purchasegroup/manage',
    name: 'PurchaseGroup',
    hidden: false,
    meta: { title: '集采应收管理' },
    component: () => import('@/components/finance/PurchaseGroup/PayManage')
  },
  {
    path: '/finance/moneycheck/manage',
    name: 'PayCheck',
    hidden: false,
    meta: { title: '集采回款审核' },
    component: () => import('@/components/finance/PurchaseGroup/PayCheck')
  }
]
