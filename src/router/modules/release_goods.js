export default [
  {
    path: '/release/releaseindex/releaselist',
    name: 'ReleaseGoodsManage',
    hidden: false,
    meta: {
      title: '商品管理',
      auth: 'WebGoodsManage'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/GoodsManage/ReleaseGoodsManage')
  },
  {
    path: '/release/navigation/navmanage',
    name: 'NavManage',
    hidden: false,
    meta: {
      title: '导航管理',
      auth: 'WebNavManage'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/Nav')
  },
  {
    path: '/release/navigation/navmanage2',
    name: 'NavManage2',
    hidden: false,
    meta: {
      title: '二级导航',
      auth: 'WebNavManage'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/Nav2')
  },
  {
    path: '/release/navigation/navmanage3',
    name: 'NavManage3',
    hidden: false,
    meta: {
      title: '三级导航',
      auth: 'WebNavManage'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/Nav3')
  },
  {
    path: '/release/navigation/relativegoodsmanage',
    name: 'relativegoodsmanage',
    hidden: false,
    meta: {
      title: '相关商品管理',
      auth: 'ReleaseGoodsManage'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/RelativeGoodsManage')
  },
  {
    path: '/release/navigation/addgoods',
    name: 'addgoods',
    hidden: false,
    meta: {
      title: '官网添加商品',
      auth: 'ReleaseGoodsManage'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/AddGoods')
  },
  {
    path: '/release/navigation/navmanage/addfirst',
    name: 'AddFirstNav',
    hidden: true,
    meta: {
      title: '新建一级导航',
      auth: 'ReleaseNavAdd'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/AddNav')
  },
  {
    path: '/release/navigation/navmanage/addnextnav',
    name: 'AddNextNav',
    hidden: true,
    meta: {
      title: '新建二级导航',
      auth: 'ReleaseNavAdd'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/AddNextNav')
  },
  {
    path: '/release/navigation/navmanage/addthird',
    name: 'AddThird',
    hidden: true,
    meta: {
      title: '新建三级导航',
      auth: 'ReleaseNavAdd'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/AddThird')
  },
  {
    path: '/release/navigation/navmanage/releaselog',
    name: 'ReleaseLog',
    hidden: true,
    meta: {
      title: '发布记录',
      auth: 'ReleaseRelate'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/ReleaseLog')
  },
  {
    path: '/release/navigation/navmanage/importlog',
    name: 'ImportLog',
    hidden: true,
    meta: {
      title: '导入记录',
      auth: 'ReleaseImportRelate'
    },
    component:
      () => import('@/components/system/public/ImportRecord')
  },
  {
    path: '/release/navigation/navmanage/navdetail',
    name: 'NavDetail',
    hidden: true,
    meta: {
      title: '导航详情',
      auth: 'ReleaseGoodsDetail'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/NavDetail')
  },
  {
    path: '/release/navigation/navmanage/edite1',
    name: 'Edite1',
    hidden: true,
    meta: {
      title: '编辑一级导航',
      auth: 'ReleaseGoodsEdit'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/Edite1')
  },
  {
    path: '/release/navigation/navmanage/edite2',
    name: 'Edite2',
    hidden: true,
    meta: {
      title: '编辑二级导航',
      auth: 'ReleaseGoodsEdit'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/Edite2')
  },
  {
    path: '/release/navigation/navmanage/edite3',
    name: 'Edite3',
    hidden: true,
    meta: {
      title: '编辑三级导航',
      auth: 'ReleaseGoodsEdit'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/NavManage/Edite3')
  },
  {
    path: '/release/floormanage/floormanage',
    name: 'FloorManage',
    hidden: true,
    meta: {
      title: '楼层管理',
      auth: 'WebFloorManage'
    },
    component: () => import('@/components/release/releaseGoodsManage/FloorManage/FloorList')
  },
  {
    path: '/release/floormanage/addfloor',
    name: 'AddFloor',
    hidden: true,
    meta: {
      title: '添加楼层',
      auth: 'ReleaseFloorAdd'
    },
    component: () => import('@/components/release/releaseGoodsManage/FloorManage/AddFloor1')
  },
  {
    path: '/release/floormanage/editfloor',
    name: 'EditFloor',
    hidden: true,
    meta: {
      title: '编辑楼层',
      auth: 'ReleaseFloorEdit'
    },
    component: () => import('@/components/release/releaseGoodsManage/FloorManage/AddFloor1')
  },
  {
    path: '/release/floormanage/recommendfloor',
    name: 'RecommendFloor',
    hidden: true,
    meta: {
      title: '推荐导航',
      auth: 'ReleaseFloorRecommand'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/FloorManage/Recommend')
  },
  {
    path: '/release/floormanage/recommendgoods',
    name: 'RecommendGoods',
    hidden: true,
    meta: {
      title: '推荐商品',
      auth: 'ReleaseFloorRecommand'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/FloorManage/RecommendGoods')
  },
  {
    path: '/release/floormanage/flooraddgoods',
    name: 'FloorAddGoods',
    hidden: true,
    meta: {
      title: '楼层添加商品'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/FloorManage/FloorAddGoods')
  },
  {
    path: '/release/floormanage/recommendbrand',
    name: 'RecommendBrand',
    hidden: true,
    meta: {
      title: '推荐位品牌',
      auth: 'ReleaseFloorBrand'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/FloorManage/RecommendBrand')
  },
  {
    path: '/release/floormanage/floordetail',
    name: 'floordetail',
    hidden: true,
    meta: {
      title: '楼层详情',
      auth: 'ReleaseFloorDetail'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/FloorManage/FloorDetail')
  },
  {
    path: '/release/floormanage/releaselog',
    name: 'releaselog',
    hidden: true,
    meta: {
      title: '发布记录',
      auth: 'ReleaseFloorRecord'
    },
    component:
      () => import('@/components/release/releaseGoodsManage/FloorManage/ReleaseLog')
  },
]

