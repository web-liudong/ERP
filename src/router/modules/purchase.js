﻿﻿export default [
  {
    path: '/purchase/purchaseOrder',
    name: 'PurchaseOrder',
    hidden: true,
    meta: { title: '采购单管理', auth: 'PurchaseOrderManage' },
    component: () => import('@/components/purchase/PurchaseList'),
  },
  {
    path: '/purchase/purchaseOrder/incomef',
    name: 'Factoryincome',
    hidden: true,
    meta: { title: '损益确认', auth: 'PurchseManagelost' },
    component: () => import('@/components/purchase/PurchaseIncome/warehousing'),
  },
  {
    path: '/purchase/purchaseOrder/detail',
    name: 'PurchaseDetail',
    hidden: false,
    meta: { title: '采购单详情', auth: 'PurchseManageDetail' },
    component: () => import('@/components/purchase/PurchaseDetail'),
  },
  {
    path: '/purchase/purchaseOrder/confirm',
    name: 'PurchaseConfirm',
    hidden: false,
    meta: { title: '采购单到货确认', auth: 'PurchseManageConfirm' },
    component: () => import('@/components/purchase/PurchaseConfirm'),
  },
  {
    path: '/purchase/purchaseOrder/addPurchaseOrder',
    name: 'addPurchaseOrder',
    hidden: false,
    meta: { title: '新建采购单' },
    component: () => import('@/components/purchase/PurchaseOrderManage/addPurchaseOrder'),
  },
  {
    path: '/purchase/purchaseDraftEditing',
    name: 'PurchaseDraftEditing',
    hidden: false,
    meta: { title: '采购草稿单编辑' },
    component: () => import('@/components/purchase/purchaseDemandManage/PurchaseDraftEditing'),
  },
  {
    path: '/purchase/PurchaseOrderManage/PurchaseApprovalList',
    name: 'PurchaseApprovalList',
    hidden: false,
    meta: { title: '采购审批列表', auth: 'PurchaseApprovalList' },
    component: () => import('@/components/purchase/PurchaseOrderManage/PurchaseApprovalList'),
  },
  {
    path: '/purchase/PurchaseOrderManage/PurchaseOrderApproval',
    name: 'PurchaseOrderApproval',
    hidden: false,
    meta: { title: '采购单审批' },
    component: () => import('@/components/purchase/PurchaseOrderManage/PurchaseOrderApproval'),
  },
  {
    path: '/purchase/purchaseOrder/PurchaseOrderEdit',
    name: 'PurchaseOrderEdit',
    hidden: false,
    meta: { title: '采购单编辑' },
    component: () => import('@/components/purchase/PurchaseOrderManage/PurchaseOrderEdit'),
  },
  {
    path: '/purchase/purchaseDemand',
    name: 'PurchaseDemand',
    hidden: false,
    meta: { title: '入仓采购需求管理', auth: 'PurchaseDemandManage' },
    component: () => import('@/components/purchase/purchaseDemand/PurchaseDemand'),
  },
  {
    path: '/purchase/purchaseDemandFactory',
    name: 'PurchaseDemandFactory',
    hidden: false,
    meta: { title: '厂直采购需求管理', auth: 'PurchaseDemandManage' },
    component: () => import('@/components/purchase/purchaseDemand/PurchaseDemandFactory'),
  },
  {
    path: '/purchase/purchaseDemandDetail',
    name: 'PurchaseDemandDetail',
    hidden: false,
    meta: { title: '采购需求详情' },
    component: () => import('@/components/purchase/purchaseDemand/PurchaseDemandDetail'),
  },
  {
    path: '/purchase/createpurchasedemand',
    name: 'CreatePurchaseDemand',
    hidden: false,
    meta: { title: '添加', auth: 'PurchaseDemandCreate' },
    component: () => import('@/components/purchase/purchaseDemandManage/CreatePurchaseDemand'),
  },
  {
    path: '/purchase/editerpurchasedemand',
    name: 'EditerPurchaseDemand',
    hidden: false,
    meta: { title: '编辑' },
    component: () => import('@/components/purchase/purchaseDemandManage/EditerPurchaseDemand'),
  },
  {
    path: '/purchase/creatPurchaseOrder',
    name: 'CreatPurchaseOrder',
    hidden: false,
    meta: { title: '生成采购单', auth: ['PurchaseOrderCreate', 'PurchaseCollectionOrderCreate'] },
    component: () => import('@/components/purchase/CreatPurchaseOrder'),
  },
  {
    path: '/purchase/creatPurchasePreview',
    name: 'CreatPurchasePreview',
    hidden: false,
    meta: { title: '采购单预览' },
    component: () => import('@/components/purchase/CreatPurchasePreview'),
  },
  {
    path: '/purchase/purchaseReturnOrder',
    name: 'PurchaseReturnOrder',
    hidden: false,
    meta: {
      title: '退货单管理',
      auth: 'PurchaseReturnsManage'
    },
    component: () => import('@/components/purchase/PurchaseReturnOrder/PurchaseReturnsManage'),
  },
  {
    path: '/purchase/purchaseReturnOrder/DetailsofReturnBill',
    name: 'DetailsofReturnBill',
    hidden: false,
    meta: {
      title: '退货单详情',
      auth: 'DetailsofReturnBill'
    },
    component: () => import('@/components/purchase/PurchaseReturnOrder/DetailsofReturnBill'),
  },
  {
    path: '/purchase/purchaseReturnOrder/NewPurchaseReturnBill',
    name: 'NewPurchaseReturnBill',
    hidden: false,
    meta: {
      title: '创建退货单',
      auth: 'NewPurchaseReturnBill'
    },
    component: () => import('@/components/purchase/PurchaseReturnOrder/NewPurchaseReturnBill'),
  },
  {
    path: '/purchase/purchaseConfig/attributeSetup',
    name: 'AttributeSetup',
    hidden: false,
    meta: { title: '采购属性设置', auth: 'PurchaseAttributeConfig' },
    component: () => import('@/components/purchase/purchaseConfig/attributeSetup'),
  },
  {
    path: '/purchase/purchaseStaffConfig',
    name: 'PurchaseStaffConfig',
    hidden: false,
    meta: { title: '采购人员设置', auth: 'PurchaseStaffConfig' },
    component: () => import('@/components/purchase/purchaseConfig/PurchaseStaffConfig'),
  },
  {
    path: '/purchase/purchaseCollectionOrder',
    name: 'PurchaseCollectionOrder',
    hidden: false,
    meta: { title: '集采订单管理', auth: 'PurchaseCollectionManage' },
    component: () => import('@/components/purchase/purchaseCollectionOrder/PurchaseCollectionOrder'),
  },
  {
    path: '/purchase/purchaseCollectionOrderDetail',
    name: 'PurchaseCollectionOrderDetail',
    hidden: false,
    meta: { title: '集采订单详情', auth: 'PurchaseCollectionDetail' },
    component: () => import('@/components/purchase/purchaseCollectionOrder/PurchaseCollectionOrderDetail'),
  },
  {
    path: '/purchase/purchaseBalancedLibrary',
    name: 'PurchaseBalancedLibrary',
    hidden: false,
    meta: { title: '平衡利库', auth: "PurchaseCollectionBalancedTreasury" },
    component: () => import('@/components/purchase/purchaseCollectionOrder/PurchaseBalancedLibrary'),
  },
  {
    path: '/purchase/purchaseCollectingPool',
    name: 'purchaseCollectingPool',
    hidden: false,
    meta: { title: '集采商品池', auth: 'PurchaseGoodsManage' },
    component: () => import('@/components/purchase/purchaseCollectingPool/purchaseCollectingPool'),
  },
  {
    path: '/purchase/purchaseCollectingPool/skuPoolImportRecord',
    name: 'skuPoolImportRecord',
    hidden: false,
    meta: { title: '集采商品池导入记录'},
    component: () => import('@/components/purchase/purchaseCollectingPool/child/skuPoolImportRecord'),
  }

  
  // {
  //   path: '/purchase/purchaseBillList',
  //   name: 'PurchaseBillList',
  //   hidden: false,
  //   meta: { title: '结算单列表' },
  //   component: () => import('@/components/purchase/purchaseBillList/PurchaseBillList'),
  // },
  // {
  //   path: '/purchase/purchaseBillListDetail',
  //   name: 'PurchaseBillListDetail',
  //   hidden: false,
  //   meta: {title: '结算单详情'},
  //   component: () => import('@/components/purchase/purchaseBillList/PurchaseBillListDetail'),
  // },
  // {
  //   path: '/purchase/purchaseCreateBillList',
  //   name: 'PurchaseCreateBillList',
  //   hidden: false,
  //   meta: {title: '新建结算单',auth:'PurchaseBillCreate'},
  //   component: () => import('@/components/purchase/purchaseBillList/PurchaseCreateBillList'),
  // },
  // {
  //   path: '/purchase/Purchase/invoiceedit',
  //   name: 'InvoiceEdit',
  //   hidden: false,
  //   meta: { title: '发票编辑' },
  //   component: () => import('@/components/purchase/PurchaseInvoice/InvoiceEdit'),
  // },
  // {
  //   path: '/purchase/editerPurchaseBillList',
  //   name: 'editerPurchaseBillList',
  //   hidden: false,
  //   meta: {title: '编辑结算单'},
  //   component: () => import('@/components/purchase/purchaseBillList/editerPurchaseBillList'),
  // },
  // {
  //   path: '/purchase/AuditePurchaseBillList',
  //   name: 'AuditePurchaseBillList',
  //   hidden: false,
  //   meta: { title: '审核结算单', auth: 'PurchaseBillApproval' },
  //   component: () => import('@/components/purchase/purchaseBillList/AuditePurchaseBillList')
  // }
]
