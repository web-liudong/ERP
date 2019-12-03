export default [
  {
    path: '/payment/customerStatementList',
    name: 'customerStatementList',
    hidden: false,
    meta: { title: '客户结算单列表', auth: 'PaymentManageList' },
    component: () => import('@/components/payment/customerStatementList'),
  },
  {
    path: '/payment/customerStatementList/addStatement',
    name: 'addStatement',
    hidden: true,
    meta: { auth: 'PaymentCustomerCreate', title: '新建结算单' },
    component: () => import('@/components/payment/customerStatementList/addStatement'),
  },

  // bug4652搬路由
  {
    path: '/payment/purchase/purchaseCreateBillList',
    name: 'PurchaseCreateBillList',
    hidden: false,
    meta: { title: '新建结算单', auth: 'PurchaseBillCreate' },
    component: () => import('@/components/purchase/purchaseBillList/PurchaseCreateBillList'),
  },
  {
    path: '/payment/purchase/editerPurchaseBillList',
    name: 'editerPurchaseBillList',
    hidden: false,
    meta: { title: '编辑结算单', auth: "PurchaseBillEditer" },
    component: () => import('@/components/purchase/purchaseBillList/editerPurchaseBillList'),
  },
  {
    path: '/payment/purchase/purchaseBillListDetail',
    name: 'PurchaseBillListDetail',
    hidden: false,
    meta: { title: '结算单详情', auth: "PurchaseBillDetail" },
    component: () => import('@/components/purchase/purchaseBillList/PurchaseBillListDetail'),
  },
  ////
  {
    path: '/payment/customerStatementList/editStatement',
    name: 'editStatement',
    hidden: true,
    meta: { auth: 'PaymentCustomerUpdate', title: '编辑结算单' },
    component: () => import('@/components/payment/customerStatementList/editStatement'),
  },
  {
    path: '/payment/invoicerecord',
    name: 'paymentInvoiceRecord',
    hidden: false,
    meta: { title: '开票记录' },
    component: () => import('@/components/payment/invoiceRecord/paymentInvoiceRecord')
  },
  {
    path: '/payment/paymentstatus',
    name: 'PaymentStatus',
    hidden: false,
    meta: { title: '订单结算状态', auth: 'PaymentStatusManage' },
    component: () => import('@/components/payment/paymentStatus/index')
  },
  {
    path: '/payment/customerStatementList/chooseOrder',
    name: 'ChooseOrder',
    meta: { title: '选择订单' },
    component:
      () => import('@/components/payment/customerStatementList/chooseOrder/index')
  },
  {
    path: '/payment/customerStatementList/paymentDetail',
    name: 'PaymentDetail',
    meta: { title: '对结算详情', auth: 'PaymentCustomerDetail' },
    component: () => import('@/components/payment/customerStatementList/addStatement/PaymentDetail'),
  },
  {
    path: '/payment/claimlist/claimlist',
    name: 'ClaimList',
    hidden: false,
    meta: { title: '认款列表', auth: 'ClaimList' },
    component: () => import('@/components/payment/claimList/ClaimList'),
  },
  {
    path: '/payment/claimlist/claim',
    name: 'Claim',
    hidden: false,
    meta: { title: '认款操作', auth: 'Claim' },
    component: () => import('@/components/payment/claimList/Claim'),
  },
  {
    path: '/payment/claimlist/claimdetaills',
    name: 'ClaimDetaills',
    hidden: false,
    meta: { title: '认款详情', auth: 'ClaimDetaills' },
    component: () => import('@/components/payment/claimList/ClaimDetaills'),
  },
  {
    path: '/payment/invoiceapplication/invoiceapplication',
    name: 'InvoiceApplication',
    hidden: false,
    meta: { title: '我的开票申请', auth: 'invoiceApplication' },
    component: () => import('@/components/payment/invoiceApplication/InvoiceApplication'),
  },
  {
    path: '/payment/invoiceapplication/invoiceapplicationdetaills',
    name: 'InvoiceApplicationDetaills',
    hidden: false,
    meta: { title: '开票申请详情', auth: 'InvoiceApplicationDetaills' },
    component: () => import('@/components/payment/invoiceApplication/InvoiceApplicationDetaills'),
  },
  {
    path: '/payment/purchase/PurchaseBillList',
    name: 'PurchaseManage',
    hidden: false,
    meta: { title: '采购结算单管理', auth: 'PurchaseBillList' },
    component: () => import('@/components/purchase/purchaseBillList/PurchaseBillList'),
  },
  {
    path: '/payment/groupbuy/manage',
    name: 'GroupBuy',
    hidden: false,
    meta: { title: '集采应付管理', auth: 'GroupPayManage' },
    component: () => import('@/components/payment/InvoiceGroup/InvoiceList'),
  },
  {
    path: '/payment/payrecord/manage',
    name: 'PayRecord',
    hidden: false,
    meta: { title: '集采付款管理', auth: 'GroupPayManage' },
    component: () => import('@/components/payment/InvoiceGroup/PayRecordManage')
  },
  {
    path: '/payment/purchase/invoiceedit',
    name: 'EditInvoicePur',
    hidden: false,
    meta: { title: '发票编辑' },
    component: () => import('@/components/purchase/PurchaseInvoice/InvoiceEdit'),
  },
  {
    path: '/payment/purchase/AuditePurchaseBillList',
    name: 'AuditePurchaseBillList',
    hidden: false,
    meta: { title: '审核结算单', auth: 'PurchaseBillApproval' },
    component: () => import('@/components/purchase/purchaseBillList/AuditePurchaseBillList')
  },
  {
    path: '/payment/collect/collectPurchase',
    name: 'CollectPurchaseManage',
    hidden: false,
    meta: { title: '集采结算单管理', auth: 'CollectionBillManage' },
    component: () => import('@/components/payment/collectPurchase/CollectPurchaseManage'),
  },
  {
    path: '/payment/collect/createCollectPurchase',
    name: 'CreateCollectPurchase',
    hidden: false,
    meta: { title: '新建集采结算单', auth: 'CollectionBillCreate' },
    component: () => import('@/components/payment/collectPurchase/CreateCollectPurchase'),
  },
  {
    path: '/payment/collect/EditerCollectPurchase',
    name: 'EditerCollectPurchase',
    hidden: false,
    meta: { title: '编辑集采结算单', auth: 'CollectionBillEditer' },
    component: () => import('@/components/payment/collectPurchase/EditerCollectPurchase'),
  },
  {
    path: '/payment/collect/CollectPurchaseDetail',
    name: 'CollectPurchaseDetail',
    hidden: false,
    meta: { title: '集采结算单详情', auth: 'CollectionBillDetail' },
    component: () => import('@/components/payment/collectPurchase/CollectPurchaseDetail'),
  },
  {
    path: '/payment/collect/MyInvoiceApply',
    name: 'MyInvoiceApply',
    hidden: false,
    meta: { title: '我的开票申请', auth: "CollectionBillInvoiceInfo" },
    component: () => import('@/components/payment/collectPurchase/MyInvoiceApply'),
  },
  {
    path: '/payment/collect/paymentAudite',
    name: 'CollectPaymentAudite',
    hidden: false,
    meta: { title: '付款审批' },
    component: () => import('@/components/payment/collectPayment/CollectPaymentAudite'),
  },
  {
    path: '/payment/collect/collectReceivableManage',
    name: 'CollectReceivableManage',
    hidden: false,
    meta: { title: '集采应收管理' },
    component: () => import('@/components/payment/collectPayment/CollectReceivableManage'),
  },
]
