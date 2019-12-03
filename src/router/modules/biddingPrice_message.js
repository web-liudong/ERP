export default [
  {
    path: '/biddingPrice/biddingPriceMessageList/list',
    name: 'biddingPriceMessageList',
    hidden: false,
    meta: {
      title: '竞价信息列表',
      auth: 'biddingPriceMessageList'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/biddingPriceMessageList/list')
  },
  {
    path: '/biddingPrice/biddingPriceMessageList/create',
    name: 'biddingPriceMessageCreate',
    hidden: false,
    meta: {
      title: '添加竞价信息',
      auth: 'biddingPriceMessageCreate'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/biddingPriceMessageList/create')
  },
  {
    path: '/biddingPrice/biddingPriceMessageList/edit',
    name: 'biddingPriceMessageEdit',
    hidden: false,
    meta: {
      title: '编辑竞价信息',
      auth: 'biddingPriceMessageEdit'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/biddingPriceMessageList/edit')
  },
  {
    path: '/biddingPrice/biddingPriceMessageList/editAbnormalAddress',
    name: 'biddingPriceMessageEditAbnormalAddress',
    hidden: false,
    meta: {
      title: '地址异常编辑',
      auth: 'biddingPriceMessageEdit'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/biddingPriceMessageList/editAbnormalAddress')
  },
  {
    path: '/biddingPrice/biddingPriceMessageList/detail',
    name: 'biddingPriceMessageDetail',
    hidden: false,
    meta: {
      title: '竞价信息详情',
      auth: 'biddingPriceMessageDetail'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/biddingPriceMessageList/detail')
  },
  {
    path: '/biddingPrice/PresentationPriceList/list',
    name: 'PresentationPriceList',
    hidden: false,
    meta: {
      title: '报价列表',
      auth: 'presentationPriceList'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/PresentationPriceList/list')
  },
  {
    path: '/biddingPrice/PresentationPriceList/create',
    name: 'PresentationPriceCreate',
    hidden: false,
    meta: {
      title: '生成订单',
      auth: 'presentationPriceCreateOrder'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/PresentationPriceList/create')
  },
  {
    path: '/biddingPrice/PresentationPriceList/offer',
    name: 'PresentationPriceOffer',
    hidden: false,
    meta: {
      title: '报价页面',
      auth: 'presentationPriceIng'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/PresentationPriceList/offer')
  },
  {
    path: '/biddingPrice/PresentationPriceList/detail',
    name: 'PresentationPriceDetail',
    hidden: false,
    meta: {
      title: '报价信息详情',
      auth: 'presentationPriceDetail'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/PresentationPriceList/detail')
  },
  {
    path: '/biddingPrice/PresentationPriceList/biddingImportRecord',
    name: 'BiddingPriceImportRecord',
    hidden: false,
    meta: {
      title: '竞价信息导入记录',
      auth: 'biddingPriceMessageImportRecord'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/biddingPriceMessageList/biddingImportRecord')
  },
  {
    path: '/biddingPrice/projectByTimeSet/list',
    name: 'ProjectByTimeSetList',
    hidden: false,
    meta: {
      title: '项目报价截止时间设置',
      auth: 'ProjectByTimeSetList'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/projectByTimeSet/list')
  },
  {
    path: '/biddingPrice/projectByTimeSet/log',
    name: 'ProjectByTimeSetLog',
    hidden: false,
    meta: {
      title: '报价截止时间操作日志',
      auth: 'ProjectByTimeSetOperationJournal'
    },
    component:
      () => import('@/components/biddingPrice/biddingPriceMessage/projectByTimeSet/log')
  },
]