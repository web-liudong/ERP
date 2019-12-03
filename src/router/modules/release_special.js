export default [
  {
    path: '/release/specialcountermanage/specialcountermanage',
    name: 'ShoppeProjectManage',
    hidden: false,
    meta: {
      title: '专柜项目管理',
      auth: 'ShoppeProjectManage'
    },
    component:
      () => import('@/components/release/specialReleaseManage/ShoppeProjectManage')
  },
  {
    path: '/release/specialcountermanage/addnav',
    name: 'ShoppeAddNav',
    hidden: true,
    meta: {
      title: '新建导航',
      auth: 'ShoppeNavAdd'
    },
    component:
      () => import('@/components/release/specialReleaseManage/AddNav')
  },
  {
    path: '/release/specialcountermanage/editernav',
    name: 'ShoppeEditerNav',
    hidden: true,
    meta: {
      title: '编辑导航',
      auth: 'ShoppeNavEdit'
    },
    component:
      () => import('@/components/release/specialReleaseManage/EditerNav')
  },
  {
    path: '/release/specialcountermanage/navdetail',
    name: 'ShoppeNavDetail',
    hidden: true,
    meta: {
      title: '导航详情',
      auth: 'ShoppeNavDetail'
    },
    component:
      () => import('@/components/release/specialReleaseManage/NavDetail')
  },
  {
    path: '/release/specialcountermanage/relevantgoodsmanage',
    name: 'ShoppeRelevantGoodsManage',
    hidden: true,
    meta: {
      title: '相关商品管理',
      auth: 'ShoppeNavRelevantGoods'
    },
    component:
      () => import('@/components/release/specialReleaseManage/RelevantGoodsManage')
  },
  {
    path: '/release/specialcountermanage/shoppeaddgoods',
    name: 'ShoppeAddGoods',
    hidden: true,
    meta: {
      title: '专柜添加商品',
      auth: 'ShoppeGoodsAdd'
    },
    component:
      () => import('@/components/release/specialReleaseManage/ShoppeAddGoods')
  },
  {
    path: '/release/specialcountermanage/shoppegoodsmanage',
    name: 'ShoppeGoodsManage',
    hidden: true,
    meta: {
      title: '专柜商品管理',
      auth: 'ShoppeGoodsManage'
    },
    component:
      () => import('@/components/release/specialReleaseManage/ShoppeGoodsManage')
  },
  {
    path: '/release/specialcountermanage/shoppeGoodsDetail',
    name: 'ShoppeGoodsDetail',
    hidden: true,
    meta: {
      title: '专柜商品详情',
      auth: 'ShoppeGoodsDetail'
    },
    component:
      () => import('@/components/release/specialReleaseManage/ShoppeGoodsDetail')
  },
  {
    path: '/release/specialcountermanage/shoppenav',
    name: 'ShoppeNav',
    hidden: true,
    meta: {
      title: '专柜导航',
      auth: 'ShoppeNavManage'
    },
    component:
      () => import('@/components/release/specialReleaseManage/ShoppeNav')
  },
  {
    path: '/release/specialcountermanage/shoppenavlv2',
    name: 'ShoppeNavLv2',
    hidden: true,
    meta: {
      title: '专柜二级导航',
      auth: 'ShoppeNavManage'
    },
    component:
      () => import('@/components/release/specialReleaseManage/ShoppeNavLv2')
  },
  {
    path: '/release/specialcountermanage/shoppenavlv3',
    name: 'ShoppeNavLv3',
    hidden: true,
    meta: {
      title: '专柜三级导航',
      auth: 'ShoppeNavManage'
    },
    component:
      () => import('@/components/release/specialReleaseManage/ShoppeNavLv3')
  },
  {
    path: '/release/specialcountermanage/shoppeprojectdetail',
    name: 'ShoppeProjectDetail',
    hidden: true,
    meta: {
      title: '专柜项目详情',
      auth: 'ShoppeProjectDetail'
    },
    component:
      () => import('@/components/release/specialReleaseManage/ShoppeProjectDetail')
  },
]