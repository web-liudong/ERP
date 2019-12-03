﻿export default [
  {
    path: '/order/orderManage',
    name: 'OrderManage',
    meta: {
      title: '订单管理',
      auth: 'OrderManage'
    },
    component: () => import('@/components/order/orderManage/OrderManage')
  },
  {
    path: "/order/LogisticsDetails/LogisticsDetails",
    name: "LogisticsDetails",
    hidden: false,
    meta: {
      title: "物流详情"
    },
    component: () => import('@/components/order/LogisticsDetails/LogisticsDetails'),
  },
  {
    path: '/order/saleDown',
    name: 'saleDown',
    meta: {
      title: '销售下单',
      auth: 'OrderCreat'
    },
    component: () => import('@/components/order/saleDown')
  },
  {
    path: '/order/orderManage/editOrder',
    name: 'EditOrder',
    meta: {
      title: '编辑订单',
      auth: 'OrderEdit'
    },
    component: () => import('@/components/order/orderManage/editOrder')
  },
  {
    path: '/order/myOrder/editOrder',
    name: 'EditMyOrder',
    meta: {
      title: '编辑订单',
      auth: 'OrderEdit'
    },
    component: () => import('@/components/order/orderManage/editOrder')
  },
  {
    path: '/order/myOrder',
    name: 'MyOrder',
    meta: {
      title: '我的订单',
      auth: 'OrderMySelf'
    },
    component: () => import('@/components/order/myOrder/index')
  },
  {
    path: '/order/orderAnomalyManage',
    name: 'OrderAnomalyManage',
    meta: {
      title: '异常订单管理',
      auth: 'OrderAnomalyManage'
    },
    component: () => import('@/components/order/orderManage/OrderAnomalyManage')
  },
  {
    path: '/order/orderSolve',
    name: 'OrderSolve',
    meta: {
      title: '异常订单处理',
      auth: ['AnomalySolveForBase','AnomalySolveForGoods']
    },
    component: () => import('@/components/order/orderManage/OrderSolve')
  },
  {
    path: '/order/orderAnomalyDetail',
    name: 'OrderAnomalyDetail',
    meta: {
      title: '异常订单详情',
      auth: 'OrderAnomalyManage'
    },
    component: () => import('@/components/order/orderManage/OrderAnomalyDetail')
  },
  {
    path: '/order/invoiceManage',
    name: 'InvoiceManage',
    meta: {
      title: '发货单管理',
      auth: 'OrderDeliverManage'
    },
    component: () => import('@/components/order/invoiceManage/InvoiceManage')
  },
  {
    path: '/order/invoiceDetail',
    name: 'InvoiceDetail',
    meta: {
      title: '发货单详情',
      auth: 'OrderDeliverDetail'
    },
    component: () => import('@/components/order/invoiceManage/InvoiceDetail')
  },
  {
    path: '/order/creatInvoiceForOrder',
    name: 'CreatInvoiceForOrder',
    meta: {
      title: '生成发货单',
      auth: 'OrderCreatDeliver'
    },
    component: () => import('@/components/order/invoiceManage/CreatInvoiceForOrder')
  },
  {
    path: '/order/creatInvoice',
    name: 'CreatInvoice',
    meta: {
      title: '创建发货单',
      auth: 'OrderCreatDeliverOrder'
    },
    component: () => import('@/components/order/invoiceManage/CreatInvoice')
  },
  // {
  //   path: '/order/orderTaking',
  //   name: 'orderTaking',
  //   meta: {
  //     title: '服务方接单'
  //   },
  //   component: () => import('@/components/order/orderManage/OrderTaking')
  // },
  // {
  //   path: '/order/orderTakingSecond',
  //   name: 'orderTakingSecond',
  //   meta: {
  //     title: '第二服务方接单'
  //   },
  //   component: () => import('@/components/order/orderManage/OrderTaking')
  // },
  {
    path: '/order/orderDetail',
    name: 'OrderDetail',
    meta: {
      title: '订单详情',
      auth:'OrderDetails'
    },
    component: () => import('@/components/order/orderManage/OrderDetail')
  },
  {
    path: '/order/modifyRecord',
    name: 'OrderModifyRecord',
    meta: {
      title: '订单修改记录'
    },
    component: () => import('@/components/order/orderManage/ModifyRecord')
  },
  {
    path: '/order/changeDetail',
    name: 'OrderChangeDetail',
    meta: {
      title: '订单修改记录详情'
    },
    component: () => import('@/components/order/orderManage/OrderChangeDetail')
  },
  {
    path: '/order/orderNoAuditeManage',
    name: 'OrderNoAuditeManage',
    meta: {
      title: '订单取消审核管理',
      auth: 'OrderCancelOrderManage'
    },
    component: () => import('@/components/order/orderNoAuditeManage/OrderNoAuditeManage')
  },
  {
    path: '/order/auditenomanage',
    name: 'AuditeNoManage',
    meta: {
      title: '取消订单审核',
      auth: "OrderCancelOrderExamine"
    },
    component: () => import('@/components/order/orderNoAuditeManage/AuditeNoManage')
  },
  {
    path: '/order/cancelorderdetail',
    name: 'CancelOrderDetail',
    meta: {
      title: '取消订单详情'
    },
    component: () => import('@/components/order/orderNoAuditeManage/CancelOrderDetail')
  },
  {
    path: '/order/returnordermange/returnorderdetaills',
    name: 'returnOrderDetaills',
    meta: {
      title: '退货单详情',
      auth: 'ReturnOrderDetaills'
    },
    component: () => import('@/components/order/returnOrderMange/ReturnOrderDetaills')
  },
  {
    path: '/order/returnordermange/returnordermange',
    name: 'returnOrderMange',
    meta: {
      title: '退货单管理',
      auth: 'ReturnOrderMange'
    },
    component: () => import('@/components/order/returnOrderMange/ReturnOrderMange')
  },
  {
    path: '/order/outsideReturnOrder/outsideReturnOrderDetails',
    name: 'outsideReturnOrderDetaills',
    meta: {
      title: '外部退货单详情',
      auth: 'outSideReturnOrderDetails'
    },
    component: () => import('@/components/order/outsideReturnOrderMange/OutsideReturnOrderDetaills')
  },
  {
    path: '/order/outsideReturnOrder/outsideReturnOrderMange',
    name: 'outsideReturnOrderMange',
    meta: {
      title: '外部退货单管理',
      auth: 'outSideReturnOrder'
    },
    component: () => import('@/components/order/outsideReturnOrderMange/OutsideReturnOrderMange')
  },
  {
    path: '/order/servicerateauditemanage',
    name: 'ServiceRateAuditeManage',
    meta: {
      title: '【服务费率】更改审核',
      auth: 'OrderServiceRateExamineManage'
    },
    component: () => import('@/components/order/serviceRateAuditeManage/ServiceRateAuditeManage')
  },
  {
    path: '/order/customerReceiptConfirmation',
    name: 'customerReceiptConfirmation',
    meta: {
      title: '客户签收凭证确认',
      auth: 'CustomerReceiptConfirm'
    },
    component: () => import('@/components/order/customerReceiptConfirmation/customerReceiptConfirmation')
  },
  {
    path: '/order/editerOrderManage/editerorderdetail',
    name: 'EditerOrderDetail',
    meta: {
      title: '改单详情'
    },
    component: () => import('@/components/order/editerOrderAudite/EditerOrderDetail')
  },
  {
    path: '/order/editerOrderManage',
    name: 'EditerOrderManage',
    meta: {
      title: '改单审核管理',
      auth: 'OrderChangeOrderManage'
    },
    component: () => import('@/components/order/editerOrderAudite/EditerOrderManage')
  },
  {
    path: '/order/auditeediterorder',
    name: 'AuditeEditerOrder',
    meta: {
      title: '改单审核',
      auth: 'OrderChangeOrderExamine'
    },
    component: () => import('@/components/order/editerOrderAudite/AuditeEditerOrder')
  },
  {
    path: "/order/orderManManage/orderManManage",
    name: "orderManManage",
    hidden: false,
    meta: {
      title: "订单派单员配置",
      auth: 'OrderDelivererConfig'
    },
    component: () => import('@/components/order/orderManManage/orderManManage'),
  },
  {
    path: "/order/orderQueryorder",
    name: 'OrderQuery',
    meta: {
      title: '订单查询',
      auth: 'OrderQueryorder'
    },
    component: () => import('@/components/order/orderQuery/OrderQuery')
  },
  {
    path: '/order/orderQuerygoods',
    name: 'OrderQueryGoods',
    meta: {
      title: '订单明细表查询',
      auth: 'OrderQuerygoods'
    },
    component: () => import('@/components/order/orderQuery/GoodsQuery')
  }
]
