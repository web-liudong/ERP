export default [
  {
    path: '/release/releasemallmanage/releasemallmanage',
    name: 'ReleaseMallManage',
    hidden: false,
    meta: {
      title: '商城项目列表'
    },
    component: () => import('@/components/release/releaseMallManage/ReleaseMallManage')
  }, {
    path: '/release/releasemallmanage/brandimportrecord',
    name: 'BrandImportRecord',
    hidden: true,
    meta: {
      title: '品牌导入记录'
    },
    component: () => import('@/components/release/releaseMallManage/BrandImportRecord')
  },
  {
    path: '/release/releasemallmanage/correspondbrand',
    name: 'CorrespondBrand',
    hidden: true,
    meta: {
      title: '品牌对应',
      auth: 'ShoppingMallBrandCorrespond'
    },
    component: () => import('@/components/release/releaseMallManage/CorrespondBrand')
  },
  {
    path: '/release/releasemallmanage/createitemcorrespond',
    name: 'CreateItemCorrespond',
    hidden: true,
    meta: {
      title: '添加品目对应 '
    },
    component: () => import('@/components/release/releaseMallManage/CreateItemCorrespond')
  },
  {
    path: '/release/releasemallmanage/editeritemcorrespond',
    name: 'EditerItemCorrespond',
    hidden: true,
    meta: {
      title: '编辑品目对应 '
    },
    component: () => import('@/components/release/releaseMallManage/EditerItemCorrespond')
  },
  {
    path: '/release/releasemallmanage/itemcorrespond',
    name: 'ItemCorrespond',
    hidden: true,
    meta: {
      title: '品目对应 ',
      auth: 'ShoppingMallItemCorrespond'
    },
    component: () => import('@/components/release/releaseMallManage/ItemCorrespond')
  },
  {
    path: '/release/releasemallmanage/itemimportrecord',
    name: 'ItemImportRecord',
    hidden: true,
    meta: {
      title: '品目导入记录'
    },
    component: () => import('@/components/release/releaseMallManage/ItemImportRecord')
  },
  {
    path: '/release/releasemallmanage/mallprojectdetail',
    name: 'MallProjectDetail',
    hidden: true,
    meta: {
      title: '商城商品详情',
      auth: 'ShoppingGoodsPondDetail'
    },
    component: () => import('@/components/release/releaseMallManage/MallProjectDetail')
  },
  {
    path: '/release/releasemallmanage/paramscorrespond',
    name: 'ParamsCorrespond',
    hidden: true,
    meta: {
      title: '参数对应'
    },
    component: () => import('@/components/release/releaseMallManage/ParamsCorrespond')
  },
  {
    path: '/release/releasemallmanage/paramsimportrecord',
    name: 'ParamsImportRecord',
    hidden: true,
    meta: {
      title: '参数导入记录'
    },
    component: () => import('@/components/release/releaseMallManage/ParamsImportRecord')
  },
  {
    path: '/release/releasemallmanage/productimportrecord',
    name: 'ProductImportRecord',
    hidden: true,
    meta: {
      title: '商城商品导入记录',
      auth: 'ShoppingGoodsImportRelevant'
    },
    component: () => import('@/components/release/releaseMallManage/ProductImportRecord')
  },
  {
    path: '/release/releasemallmanage/productpondmanage',
    name: 'ProductPondManage',
    hidden: true,
    meta: {
      title: '商城商品池管理',
      auth: 'ShoppingGoodsManage'
    },
    component: () => import('@/components/release/releaseMallManage/ProductPondManage')
  },
  {
    path: '/release/releasemallmanage/productpushrecord',
    name: 'ProductPushRecord',
    hidden: true,
    meta: {
      title: '商城商品推送记录',
      auth: 'ShoppingGoodsPushRelevant'
    },
    component: () => import('@/components/release/releaseMallManage/ProductPushRecord')
  },
  {
    path: '/release/releasemallmanage/productpondcreate',
    name: 'ProductPondCreate',
    hidden: true,
    meta: {
      title: '商城池添加商品',
      auth: 'ShoppingGoodsCreateGoods'
    },
    component:
      () => import('@/components/release/releaseMallManage/ProductPondCreate')
  },
  {
    path: '/release/releasemallmanage/createprojectrelease',
    name: 'CreateProjectRelease',
    hidden: true,
    meta: {
      title: '新建商城项目',
      auth: 'ShoppingMallCreate'
    },
    component: () => import('@/components/release/releaseMallManage/CreateProjectRelease')
  },
  {
    path: '/release/releasemallmanage/brandreleaserecord',
    name: 'BrandReleaseRecord',
    hidden: true,
    meta: {
      title: '品牌对应操作记录'
    },
    component: () => import('@/components/release/releaseMallManage/BrandReleaseRecord')
  },
  {
    path: '/release/releasemallmanage/itemreleaseoperationrecord',
    name: 'ItemReleaseOperationRecord',
    hidden: true,
    meta: {
      title: '品目对应操作记录'
    },
    component: () => import('@/components/release/releaseMallManage/ItemReleaseOperationRecord')
  },
  {
    path: '/release/releasemallmanage/paramsreleaseoperationrecord',
    name: 'ParamsReleaseOperationRecord',
    hidden: true,
    meta: {
      title: '参数对应操作记录'
    },
    component:
      () => import('@/components/release/releaseMallManage/ParamsReleaseOperationRecord')
  },
  {
    path: '/release/releasemallmanage/createmallitem',
    name: 'CreateMallItem',
    hidden: true,
    meta: {
      title: '新建商城项目',
      auth: 'ShoppingMallCreate'
    },
    component:
      () => import('@/components/release/releaseMallManage/CreateMallItem')
  },
  {
    path: '/release/releasemallmanage/editermallitem',
    name: 'EditerMallItem',
    hidden: true,
    meta: {
      title: '编辑商城项目',
      auth: "ShoppingMallEditer"
    },
    component:
      () => import('@/components/release/releaseMallManage/EditerMallItem')
  },
  {
    path: '/release/releasemallmanage/optionconfig',
    name: 'OptionConfig',
    hidden: true,
    meta: {
      title: '选项配置',
      auth: 'ShoppingMallOption'
    },
    component:
      () => import('@/components/release/releaseMallManage/OptionConfig')
  },
  {
    path: '/release/releasemallmanage/itemdetail',
    name: 'ItemDetail',
    hidden: true,
    meta: {
      title: '商城项目详情',
      auth: 'ShoppingMallDetail'
    },
    component:
      () => import('@/components/release/releaseMallManage/ItemDetail')
  },
  {
    path: '/release/releasemallmanage/bindgoods',
    name: 'BindGoods',
    hidden: true,
    meta: {
      title: '绑定商品',
    },
    component:
      () => import('@/components/release/releaseMallManage/BindGoods')
  },
  {
    path: '/release/releasemallmanage/addbindgoods',
    name: 'AddBindGoods',
    hidden: true,
    meta: {
      title: '添加绑定商品'
    },
    component:
      () => import('@/components/release/releaseMallManage/AddBindGoods')
  },
]
