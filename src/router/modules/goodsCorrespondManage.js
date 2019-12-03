
////////////////2019 10 29 wangjiang 内含商品数据对应，项目数据对应，客户数据对应，采购人数据对应，部门数据对应 

export default [
    {
      path: '/goods/goodsCorrespondManage',
      name: 'GoodsCorrespondManage',
      hidden: true,
      meta: { title: '商品数据对应管理',auth:'ProductCorrespondManage' },
      component: () => import('@/components/goods/goodsCorrespond/GoodsCorrespondManage'),
    },
    {
        path: '/goods/goodsCorrespondDetail',
        name: 'GoodsCorrespondDetail',
        hidden: true,
        meta: { title: '商品数据对应管理详情',auth:'ProductCorrespondDetail' },
        component: () => import('@/components/goods/goodsCorrespond/GoodsCorrespondDetail'),
      },
      {
        path: '/goods/projectCorrespondManage',
        name: 'ProjectCorrespondManage',
        hidden: true,
        meta: { title: '项目数据对应管理' ,auth:'ProjectCorrespondManage'},
        component: () => import('@/components/goods/projectCorrespond/ProjectCorrespondManage'),
      },
      {
        path: '/goods/projectCorrespondDetail',
        name: 'ProjectCorrespondDetail',
        hidden: true,
        meta: { title: '项目数据对应管理详情' ,auth:'ProjectCorrespondDetail'},
        component: () => import('@/components/goods/projectCorrespond/ProjectCorrespondDetail'),
      },
      {
        path: '/goods/customCorrespondManage',
        name: 'CustomCorrespondManage',
        hidden: true,
        meta: { title: '客户数据对应管理',auth:'CustomCorrespondManage' },
        component: () => import('@/components/goods/customCorrespond/CustomCorrespondManage'),
      },
      {
        path: '/goods/customCorrespondDetail',
        name: 'CustomCorrespondDetail',
        hidden: true,
        meta: { title: '客户数据对应管理详情',auth:'CustomCorrespondDetail' },
        component: () => import('@/components/goods/customCorrespond/CustomCorrespondDetail'),
      },
      {
        path: '/goods/sectionCorrespondManage',
        name: 'SectionCorrespondManage',
        hidden: true,
        meta: { title: '部门数据对应管理',auth:'SectionCorrespondManage' },
        component: () => import('@/components/goods/sectionCorrespond/SectionCorrespondManage'),
      },
      {
        path: '/goods/sectionCorrespondDetail',
        name: 'SectionCorrespondDetail',
        hidden: true,
        meta: { title: '部门数据对应管理详情' ,auth:'SectionCorrespondDetail'},
        component: () => import('@/components/goods/sectionCorrespond/SectionCorrespondDetail'),
      },
      {
        path: '/goods/purchaseCorrespondManage',
        name: 'PurchaseCorrespondManage',
        hidden: true,
        meta: { title: '客户采购人数据对应管理' ,auth:'PurchaserCorrespondManage'},
        component: () => import('@/components/goods/purchaseCorrespond/PurchaseCorrespondManage'),
      },
      {
        path: '/goods/purchaseCorrespondDetail',
        name: 'PurchaseCorrespondDetail',
        hidden: true,
        meta: { title: '客户采购人数据对应管理详情',auth:'PurchaserCorrespondDetail' },
        component: () => import('@/components/goods/purchaseCorrespond/PurchaseCorrespondDetail'),
      },
  ]
  