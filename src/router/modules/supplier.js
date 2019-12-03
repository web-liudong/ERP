export default [
  {
    path: '/supplier/basic/supplierindex/supplierList',
    name: 'SupplierList',
    hidden: false,
    meta: {
      title: '供应商基本信息管理',
      auth: 'SupplierList'
    },
    component:
      () => import('@/components/supplier/supplierManage/SupplierList')
  },
  {
    path: '/supplier/basic/supplierindex/ImportRecord',
    name: 'SupplierListImportRecord',
    hidden: false,
    meta: {
      title: '供应商基本信息导入记录',
      auth: 'SupplierList'
    },
    component:
      () => import('@/components/supplier/supplierManage/ImportRecord')
  },
  {
    path: '/supplier/business/supplierindex/SupplierService',
    name: 'SupplierService',
    hidden: false,
    meta: {
      title: '供应商业务信息管理',
      auth: 'SupplierService'
    },
    component:
      () => import('@/components/supplier/supplierService/supplierService')
  },
  {
    path: '/supplier/business/supplierindex/ImportRecord',
    name: 'SupplierServiceImportRecord',
    hidden: false,
    meta: {
      title: '供应商业务信息导入记录',
      auth: 'SupplierService'
    },
    component:
      () => import('@/components/supplier/supplierService/ImportRecord')
  },
  {
    path: '/supplier/basic/supplierindex/addSupplier',
    name: 'AddSupplier',
    hidden: true,
    meta: {
      auth: 'SupplierBasicCreateRelevant',
      title: '添加供应商'
    },
    component:
      () => import('@/components/supplier/addSupplier/addSupplier')
  },
  {
    path: '/supplier/basic/supplierindex/editSupplier',
    name: 'EditSupplier',
    hidden: true,
    meta: {
      auth: 'SupplierBasicUpdateRelevant',
      title: '编辑供应商基本信息'
    },
    component:
      () => import('@/components/supplier/editSupplier/editSupplier')
  },
  {
    path: '/supplier/basic/supplierindex/basicDetail',
    name: 'BasicDetail',
    hidden: true,
    meta: {
      auth: 'SupplierBasicDetailRelevant',
      title: '供应商基本信息详细'
    },
    component:
      () => import('@/components/supplier/basicDetail/basicDetail')
  },
  {
    path: '/supplier/basic/supplierindex/basicUpdata',
    name: 'BasicUpdata',
    hidden: true,
    meta: {
      title: '供应商基本信息更新详情'
    },
    component:
      () => import('@/components/supplier/basicUpdata/basicUpdata')
  },
  {
    path: '/supplier/basic/supplierindex/basicExamine',
    name: 'BasicExamine',
    hidden: true,
    meta: {
      auth: 'SupplierBasicReview',
      title: '供应商基本信息审核'
    },
    component:
      () => import('@/components/supplier/basicExamine/basicExamine')
  },
  {
    path: '/supplier/business/supplierindex/addBusiness',
    name: 'AddBusiness',
    hidden: true,
    meta: {
      auth: 'SupplierBusinessRelevant',
      title: '添加供应商业务信息'
    },
    component:
      () => import('@/components/supplier/addBusiness/addBusiness')
  },
  {
    path: '/supplier/business/supplierindex/editBusiness',
    name: 'EditBusiness',
    hidden: true,
    meta: {
      auth: 'SupplierBusinessUpdateRelevant',
      title: '编辑供应商业务'
    },
    component:
      () => import('@/components/supplier/editBusiness/editBusiness')
  },
  {
    path: '/supplier/business/supplierindex/businessDetail',
    name: 'BusinessDetail',
    hidden: true,
    meta: {
      auth: 'SupplierBusinessDetailRelevant',
      title: '供应商业务详情'
    },
    component:
      () => import('@/components/supplier/businessDetail/businessDetail')
  },
  {
    path: '/supplier/business/supplierindex/businessUpdata',
    name: 'BusinessUpdata',
    hidden: true,
    meta: {
      title: '供应商业务更新详情'
    },
    component:
      () => import('@/components/supplier/businessUpdata/businessUpdata')
  },
  {
    path: '/supplier/business/supplierindex/businessExamine',
    name: 'BusinessExamine',
    hidden: true,
    meta: {
      auth: 'SupplierBusinessReview',
      title: '供应商业务审核'
    },
    component:
      () => import('@/components/supplier/businessExamine/businessExamine')
  },
]