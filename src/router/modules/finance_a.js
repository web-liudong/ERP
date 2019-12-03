export default [
  {
    path: '/finance/entryTicket/entryTicket',
    name: 'EntryTicket',
    hidden: 'false',
    meta: {
      title: '进项票确认管理'
    },
    component:
      () => import('@/components/finance/entryTicket/EntryTicket'),
  },
  {
    path: '/finance/invoice/invoiceRecord',
    name: 'InvoiceRecord',
    hidden: 'false',
    meta: {
      title: '发票记录',
      auth: 'InvoiceRecord'
    },
    component:
      () => import('@/components/finance/invoice/InvoiceRecord'),
  },
  {
    path: '/finance/invoiceapply/record',
    name: 'Record',
    hidden: 'false',
    meta: {
      title: '开票记录'
    },
    component:
      () => import('@/components/finance/invoice/records'),
  },
  {
    path: '/finance/invoice/invoiceRecordDetail',
    name: 'InvoiceRecordDetail',
    hidden: 'false',
    meta: {
      title: '发票记录详情',
      auth: 'InvoiceRecordDetail'
    },
    component:
      () => import('@/components/finance/invoice/InvoiceRecordDetail'),
  },
  {
    path: "/finance/invoiceapply/invoiceapply",
    name: "InvoiceApply",
    hidden: "false",
    meta: {
      title: "发票申请管理",
      auth: 'InvoiceApplyManage'
    },
    component:
      () => import('@/components/finance/invoice/InvoiceApply')
  },
  {
    path: "/finance/invoiceapply/invoiceapplydetail",
    name: "Invoiceapplydetail",
    hidden: "true",
    meta: {
      title: "发票申请详情"
    },
    component:
      () => import('@/components/finance/invoice/InvoiceApplyDetail')
  },
  {
    path: '/finance/invoicepur/invoicelist',
    name: "InvoiceList",
    hidden: "false",
    meta: {
      title: "采购收票管理",
      auth: 'PurchaseInvoiceManage'
    },
    component: () => import('@/components/finance/invoice/InvoiceList')
  },
  {
    path: '/finance/invoicegroup/invoicelist',
    name: "InvoiceGroup",
    hidden: "false",
    meta: {
      title: "集采发票申请管理",
      auth: 'GroupInvoiceManage'
    },
    component: () => import('@/components/finance/invoice/InvoiceGroup')
  },
  {
    path: '/finance/invoicepur/invoicepurdetail',
    name: "InvoicePurDetail",
    hidden: "true",
    meta: {
      title: "发票详情"
    },
    component: () => import('@/components/finance/invoice/InvoiceDetail')
  },
  {
    path: '/finance/invoicepur/invoicepurcheck',
    name: "InvoicePurCheck",
    hidden: "true",
    meta: {
      title: "发票审核"
    },
    component: () => import('@/components/finance/invoice/InvoiceCheck')
  },
  {
    path: '/finance/collectionInvoice',
    name: 'CollectionInvoice',
    hidden: false,
    meta: { title: '集采发票记录', auth: 'GroupInvoiceRecord' },
    component: () => import('@/components/finance/collectionInvoice/CollectionInvoice'),
  },
  {
    path: '/finance/collectionInvoice/collectionInvoiceDetail',
    name: 'CollectionInvoiceDetail',
    hidden: false,
    meta: { title: '集采发票详情' },
    component: () => import('@/components/finance/collectionInvoice/CollectionInvoiceDetail'),
  },
  {
    path: '/finance/invoiceObsolete',
    name: 'InvoiceObsolete',
    hidden: false,
    meta: { title: '集采发票作废申请', auth: 'GroupInvoiceDiscardList' },
    component: () => import('@/components/finance/invoiceObsolete/InvoiceObsolete'),
  },
  {
    path: '/finance/invoiceObsolete/invoiceObsoleteDetail',
    name: 'InvoiceObsoleteDetail',
    hidden: false,
    meta: { title: '发票作废详情' ,auth: 'GroupInvoiceDiscardDetails' },
    component: () => import('@/components/finance/invoiceObsolete/InvoiceObsoleteDetail'),
  },
  {
    path: '/finance/invoiceObsolete/operationRecord',
    name: 'OperationRecord',
    hidden: false,
    meta: { title: '发票操作记录', auth: 'GroupInvoiceDiscardOpaRecord' },
    component: () => import('@/components/finance/invoiceObsolete/OperationRecord'),
  },
  {
    path: "/finance/InvalidApplication",
    name: "Invalidapplication",
    hidden: false,
    meta: {
      title: "发票作废申请" ,auth:'InvoiceDiscardList'
    },
    component:
      () => import('@/components/finance/invoiceInvalids/InvalidApplication')
  },
  {
    path: "/finance/InvalidApplication/InvoiceInvalidDetail",
    name: "InvoiceInvalidDetail",
    hidden: false,
    meta: {
      title: "作废详情",auth:'InvoiceDiscardDetails'
    },
    component:
      () => import('@/components/finance/invoiceInvalids/InvoiceInvalidDetail')
  },
  {
    path: "/finance/InvalidApplication/InvoiceInvalidRecord",
    name: "InvoiceInvalidRecord",
    hidden: false,
    meta: {
      title: "操作记录",auth:'InvoiceDiscardOpaRecord'
    },
    component:
      () => import('@/components/finance/invoiceInvalids/InvoiceInvalidRecord')
  },
]