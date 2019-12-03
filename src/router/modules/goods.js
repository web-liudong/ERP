export default [
  {
    path: '/goods/goodsmanage/goodsManage',
    name: 'GoodsManage',
    hidden: false,
    component:
      () => import('@/components/goods/goodsManage/goodsManage'),
    meta: {
      title: '商品管理',
      auth: 'GoodsManage'
    },

  }, {
    path: '/goods/addgoods/addGoods',
    name: 'AddGoods',
    hidden: false,
    component:
      () => import('@/components/goods/addGoods/AddGoods'),
    meta: {
      title: '添加商品',
      auth: 'GoodsManageCreateRelevant'
    },
  },
  {
    path: '/goods/goodsmanage/editergoods',
    name: 'EditerGoods',
    hidden: true,
    component:
      () => import('@/components/goods/editerGoods/EditerGoods'),
    meta: {
      title: '编辑商品',
      auth: 'GoodsManageUpdateRelevant'
    }
  }, {
    path: '/goods/addgoods/fillparams',
    name: 'FillParams',
    hidden: true,
    component:
      () => import('@/components/goods/addGoods/FillParams'),
    meta: {
      title: '填写参数信息'
    }
  }, {
    path: '/goods/goodsmanage/goodsdetail',
    name: 'GoodsDetail',
    hidden: true,
    component:
      () => import('@/components/goods/goodsManage/GoodsDetail'),
    meta: {
      title: '商品详情',
      auth: 'GoodsManageDetailRelevant'
    }
  }, {
    path: '/goods/addgoods/goodspicture',
    name: 'GoodsPicture',
    hidden: true,
    component: () => import('@/components/goods/addGoods/GoodsPicture'),
    meta: { title: '商品图片' }
  },
  {
    path: '/goods/goodsmanage/editergoodspicture',
    name: 'EditerGoodsPicture',
    hidden: true,
    component: () => import('@/components/goods/editerGoods/EditerGoodsPicture'),
    meta: { title: '编辑商品图片' }
  },
  {
    path: '/goods/goodsmanage/copygoodspicture',
    name: 'CopyGoodsPicture',
    hidden: true,
    component: () => import('@/components/goods/copyGoods/CopyGoodsPicture'),
    meta: { title: '复制商品图片' }
  },
  {
    path: '/goods/goodsmanage/goodsauditer',
    name: 'GoodsAuditer',
    hidden: true,
    component: () => import('@/components/goods/goodsManage/GoodsAuditer'),
    meta: { title: '商品审核', auth: 'GoodsManageReview' }
  },
  {
    path: '/goods/goodsmanage/goodsupdatedetail',
    name: 'GoodsUpdateDetail',
    hidden: true,
    component: () => import('@/components/goods/goodsManage/GoodsUpdateDetail'),
    meta: { title: '商品更新详情' }
  },
  {
    path: '/goods/goodsmanage/goodsimportrecord',
    name: 'GoodsImportRecord',
    hidden: true,
    component: () => import('@/components/goods/goodsManage/GoodsImportRecord'),
    meta: {
      title: '商品导入记录',
      auth: 'GoodsManageImportRelevant'
    },
  },

  {
    path: '/goods/goodsmanage/editerparams',
    name: 'EditerParams',
    hidden: true,
    component: () => import('@/components/goods/editerGoods/EditerParams'),
    meta: { title: '编辑参数' }
  },
  {
    path: '/goods/goodsmanage/copyfillparams',
    name: 'CopyFillParams',
    hidden: true,
    component: () => import('@/components/goods/copyGoods/CopyFillParams'),
    meta: { title: '复制参数' }
  },
  {
    path: '/goods/goodsmanage/copypicture',
    name: 'copyGoods',
    hidden: true,
    component: () => import('@/components/goods/copyGoods/copyGoods'),
    meta: { title: '复制商品', auth: 'GoodsManageCreateRelevant' }
  },
  {
    path: '/goods/goodsmanage/goodsransfer',
    name: 'goodsTransfer',
    hidden: true,
    component: () => import('@/components/goods/goodsTransfer/goodsTransfer'),
    meta: {
      title: '商品迁移',
      auth: 'GoodsManageMigration'
    }
  },
  {
    path: '/goods/accreditstor/accredit',
    name: 'Accredit',
    hidden: false,
    component: () => import('@/components/goods/accreditStor/Accredit'),
    meta: {
      title: '授权库',
      auth: 'Accredit'
    },
  },
  {
    path: '/goods/accreditstor/add',
    name: 'AccreditAdd',
    hidden: true,
    component: () => import('@/components/goods/accreditStor/Add'),
    meta: { title: '添加授权', auth: 'AccreditCreate' }
  },
  {
    path: '/goods/accreditstor/redact',
    name: 'AccreditRedact',
    hidden: true,
    component: () => import('@/components/goods/accreditStor/Redact'),
    meta: { title: '编辑授权', auth: 'AccreditUpdate' }
  },
  {
    path: '/goods/accreditstor/detaills',
    name: 'AccreditDetaills',
    hidden: true,
    component: () => import('@/components/goods/accreditStor/Detaills'),
    meta: { title: '授权详情', auth: 'AccreditDetail' }
  },
  {
    path: '/goods/accreditstor/AccreditImportRecord',
    name: 'AccreditImportRecord',
    hidden: true,
    component: () => import('@/components/goods/accreditStor/AccreditImportRecord'),
    meta: { title: '导入记录', auth: 'AccreditImportRelevant' }
  },
  {
    path: '/goods/brandmanage/brand',
    name: 'Brand',
    hidden: false,
    component:
      () => import('@/components/goods/brandManage/Brand'),
    meta: {
      title: '品牌管理'
    },
  },
  {
    path: '/goods/classmanage/classify',
    name: 'Category1',
    hidden: false,
    component: () => import('@/components/goods/classifyManage/Classify'),
    meta: {
      title: '一级分类管理'
    },
  },
  {
    path: '/goods/classmanage/classify/addclass',
    name: 'CategoryCreate',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/addClass'),
    meta: {
      title: '添加一级分类',
      auth: 'CategoryCreateRelevant'
    }
  },
  {
    path: '/goods/classsecond/classify/addnextclass',
    name: 'CategoryCreateNext',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/addNextClass'),
    meta: {
      title: '添加二级分类',
      auth: 'CategoryCreateRelevant'
    }
  },
  {
    path: '/goods/classthree/classify/addthird',
    name: 'CategoryCreateThird',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/addThird'),
    meta: {
      title: '添加三级分类',
      auth: 'CategoryCreateRelevant'
    }
  },
  {
    path: '/goods/classmanage/classify/classdetail1',
    name: 'CategoryDetail1',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/ClassDetail1'),
    meta: {
      title: '一级分类详情',
      auth: 'CategoryDetailRelevant'
    }
  },
  {
    path: '/goods/classsecond/classify/classdetail2',
    name: 'CategoryDetail2',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/ClassDetail2'),
    meta: {
      title: '二级分类详情',
      auth: 'CategoryDetailRelevant'
    }
  },
  {
    path: '/goods/classthree/classify/classdetail3',
    name: 'CategoryDetail3',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/ClassDetail3'),
    meta: {
      title: '三级分类详情',
      auth: 'CategoryDetailRelevant'
    }
  },
  {
    path: '/goods/classmanage/classify/classcheck1',
    name: 'CategoryCheck1',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/ClassCheck1'),
    meta: {
      title: '一级分类审核',
      auth: 'CategoryReview'
    }
  },
  {
    path: '/goods/classsecond/classify/classcheck2',
    name: 'CategoryCheck2',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/ClassCheck2'),
    meta: {
      title: '二级分类审核',
      auth: 'CategoryReview'
    }
  },
  {
    path: '/goods/classthree/classify/classcheck3',
    name: 'CategoryCheck3',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/ClassCheck3'),
    meta: {
      title: '三级分类审核',
      auth: 'CategoryReview'
    }
  },
  {
    path: '/goods/classmanage/classify/importrecords',
    name: 'CategoryImportRecords',
    hidden: true,
    component:
      () => import('@/components/system/public/ImportRecord'),
    meta: {
      title: '分类导入记录',
      auth: 'CategoryImportRelevant'
    }
  },
  {
    path: '/goods/classmanage/classify/editer',
    name: 'CategoryUpdate1',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/Editer'),
    meta: {
      title: '编辑一级分类',
      auth: 'CategoryUpdateRelevant'
    }
  },
  {
    path: '/goods/classsecond/classify/editorsecond',
    name: 'CategoryUpdate2',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/EditorSecond'),
    meta: {
      title: '编辑二级分类',
      auth: 'CategoryUpdateRelevant'
    }
  },
  {
    path: '/goods/classthree/classify/editorthree',
    name: 'CategoryUpdate3',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/EditorThree'),
    meta: {
      title: '编辑三级分类',
      auth: 'CategoryUpdateRelevant'
    }
  },
  {
    path: '/goods/brandmanage/brandupdate',
    name: 'BrandUpdate',
    hidden: true,
    component:
      () => import('@/components/goods/brandManage/BrandUpdate'),
    meta: {
      title: '品牌更新详情'
    }
  },
  {
    path: '/goods/brandmanage/crosssellproduct',
    name: 'CrosssellProduct',
    hidden: true,
    component:
      () => import('@/components/goods/brandManage/CrosssellProduct'),
    meta: {
      title: '品牌详情',
      auth: 'BrandDetailRelevant'
    }
  },
  {
    path: '/goods/brandmanage/editorbrand',
    name: 'EditorBrand',
    hidden: true,
    component:
      () => import('@/components/goods/brandManage/EditorBrand'),
    meta: {
      title: '编辑品牌',
      auth: 'BrandUpdateRelevant'
    }
  },
  {
    path: '/goods/classsecond/classify',
    name: 'Category2',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/Second'),
    meta: {
      title: '二级分类管理'
    }
  },
  {
    path: '/goods/classthree/classify',
    name: 'Category3',
    hidden: true,
    component:
      () => import('@/components/goods/classifyManage/Three'),
    meta: {
      title: '三级分类管理'
    }
  },
  {
    path: '/goods/brandmanage/branddetail',
    name: 'BrandDetail',
    hidden: true,
    component:
      () => import('@/components/goods/brandManage/BrandDetail'),
    meta: {
      title: '品牌详情',
      auth: 'BrandDetailRelevant'
    }
  },
  {
    path: '/goods/brandmanage/addbrand',
    name: 'AddBrand',
    hidden: true,
    component:
      () => import('@/components/goods/brandManage/AddBrand'),
    meta: {
      title: '添加品牌',
      auth: 'BrandCreateRelevant'
    }
  },
  {
    path: '/goods/brandmanage/importrecord',
    name: 'ImportRecord',
    hidden: true,
    component:
      () => import('@/components/goods/brandManage/ImportRecord'),
    meta: {
      title: '导入记录',
      auth: 'BrandImportRelevant'
    }
  },
  {
    path: '/goods/brandmanage/brandaudit',
    name: 'BrandAudit',
    hidden: true,
    component:
      () => import('@/components/goods/brandManage/BrandAudit'),
    meta: {
      title: '品牌审核',
      auth: 'BrandReview'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/navEnt',
    name: 'TemplateAdmin',
    hidden: false,
    component:
      () => import('@/components/goods/parameterTemplate/navEnt'),
    meta: {
      title: '参数模板管理',
      auth: 'TemplateAdmin'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/addTemplate',
    name: 'AddTemplate',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/addTemplate/addTemplate'),
    meta: {
      title: '添加参数模板',
      auth: 'TemplateCreateRelevant'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/secondstep',
    name: 'SecondStep',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/addTemplate/secondStep'),
    meta: {
      title: '继续添加参数'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/nextAddTemplate',
    name: 'NextAddTemplate',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/nextAddTemplate/nextAddTemplate'),
    meta: {
      title: '继续添加参数'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/templateDetail',
    name: 'TemplateDetail',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/templateDetail/templateInitDetail'),
    meta: {
      title: '参数模板详情',
      auth: 'TemplateDetail'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/templateinitdetail',
    name: 'TemplateInitDetail',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/templateDetail/templateInitDetail'),
    meta: {
      title: '原数据详情',
      auth: 'TemplateUpdatedDetail'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/templateExamine',
    name: 'TemplateExamine',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/templateExamine/templateExamine'),
    meta: {
      title: '参数模板审核',
      auth: 'TemplateReview'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/parameterList',
    name: 'ParameterList',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/parameterList/parameterList'),
    meta: {
      title: '参数列表'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/addParameter',
    name: 'AddParameter',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/parameterList/addParameter/addParameter'),
    meta: {
      title: '添加参数'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/editParameter',
    name: 'EditParameter',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/parameterList/editParameter/editParameter'),
    meta: {
      title: '编辑参数'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/detailParameter',
    name: 'DetailParameter',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/parameterList/detailParameter/detailParameter'),
    meta: {
      title: '参数详情'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/paramGroupList',
    name: 'ParamGroupList',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/paramGroupList/paramGroupList'),
    meta: {
      title: '参数组列表',
      auth: 'TemplateSubmitReviewRelevant'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/addParamgroup',
    name: 'AddParamgroup',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/paramGroupList/addParamgroup/addParamgroup'),
    meta: {
      title: '添加参数组',
      auth: 'TemplateSubmitReviewRelevant'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/editParamgroup',
    name: 'EditParamgroup',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/paramGroupList/editParamgroup/editParamgroup'),
    meta: {
      title: '编辑参数组',
      auth: 'TemplateSubmitReviewRelevant'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/detailParamgroup',
    name: 'DetailParamgroup',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/paramGroupList/detailParamgroup/detailParamgroup'),
    meta: {
      title: '参数组详情',
      auth: 'TemplateSubmitReviewRelevant'
    }
  },
  {
    path: '/goods/parameter/parameterTemplate/parameterTemplateRecording',
    name: 'parameterTemplateRecording',
    hidden: true,
    component:
      () => import('@/components/goods/parameterTemplate/parameterTemplateRecording'),
    meta: {
      title: '导入记录',
      auth: 'TemplateImportRelevant'
    }
  },
]