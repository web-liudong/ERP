export default [
  {
    path: '/warehouse/admin/DeliveryRouteList',
    name: 'DeliveryRouteList',
    hidden: false,
    meta: { title: '线路管理', auth: 'WarehouseCircuit' },
    component: () => import('@/components/warehouse/admin/DeliveryRouteList')
  },
  {
    path: '/warehouse/admin/DeliveryRouteDetails',
    name: 'DeliveryRouteDetails',
    hidden: false,
    meta: { title: '线路详情', auth: 'WarehouseCircuit' },
    component: () => import('@/components/warehouse/admin/DeliveryRouteDetails')
  },
  {
    path: '/warehouse/admin/DeliveryDistributionRoute',
    name: 'DeliveryDistributionRoute',
    hidden: false,
    meta: { title: '线路分配管理', auth: 'WarehouseCircuitAssign' },
    component: () => import('@/components/warehouse/admin/DeliveryDistributionRoute')
  },
  {
    path: '/warehouse/admin/DeliveryRouteRecord',
    name: 'DeliveryRouteRecord',
    hidden: false,
    meta: { title: '地址街道导入记录', auth: 'WarehouseCircuit' },
    component: () => import('@/components/warehouse/admin/DeliveryRouteRecord')
  },
  {
    path: '/warehouse/admin/admin',
    name: 'WarehouseAdmin',
    hidden: false,
    meta: { title: '仓库管理', auth: 'WarehouseAdmin' },
    component: () => import('@/components/warehouse/admin/Admin')
  },
  {
    path: '/warehouse/admin/Redact',
    name: 'WarehouseRedact',
    hidden: true,
    meta: { title: '编辑仓库', auth: 'WarehouseAdminUpdateRelevant' },
    component: () => import('@/components/warehouse/admin/Redact')
  },
  {
    path: '/warehouse/admin/detaills',
    name: 'WarehouseDetaills',
    hidden: true,
    meta: { title: '仓库详情', auth: 'WarehouseAdminDetailRelevant' },
    component: () => import('@/components/warehouse/admin/Detaills')
  },
  {
    path: '/warehouse/admin/add',
    name: 'WarehouseAdd',
    hidden: true,
    meta: { title: '添加仓库', auth: 'WarehouseAdminCreateRelevant' },
    component: () => import('@/components/warehouse/admin/Add')
  },
  {
    path: '/warehouse/admin/updateddetails',
    name: 'WarehouseUpdatedDetails',
    hidden: true,
    meta: { title: '仓库更新详情', auth: 'WarehouseAdminDetailRelevant' },
    component: () => import('@/components/warehouse/admin/UpdatedDetails')
  },
  {
    path: '/warehouse/admin/audit',
    name: 'WarehouseAudit',
    hidden: true,
    meta: { title: '仓库审核', auth: 'WarehouseAdminReview' },
    component: () => import('@/components/warehouse/admin/Audit')
  },
  {
    path: '/warehouse/admin/locationadmin',
    name: 'WarehouseLocationAdmin',
    hidden: true,
    meta: { title: '库位管理', auth: 'WarehouseLocationAdmin' },
    component: () => import('@/components/warehouse/admin/LocationAdmin')
  },
  {
    path: '/warehouse/virtualwarehouse/virtualwarehouseadmin',
    name: 'VirtualWarehouseAdmin',
    hidden: false,
    meta: { title: '虚拟仓管理', auth: 'VirtualWarehouseAdmin' },
    component: () => import('@/components/warehouse/virtualWarehouse/VirtualWarehouseAdmin')
  },
  {
    path: '/warehouse/virtualwarehouse/createvirtualwarehouse',
    name: 'CreateVirtualWarehouse',
    hidden: true,
    meta: { title: '添加虚拟仓库', auth: 'CreateVirtualWarehouse' },
    component: () => import('@/components/warehouse/virtualWarehouse/CreateVirtualWarehouse')
  },
  {
    path: '/warehouse/virtualwarehouse/updatedvirtualwarehouse',
    name: 'UpdatedVirtualWarehouse',
    hidden: true,
    meta: { title: '编辑虚拟仓库', auth: 'UpdatedVirtualWarehouse' },
    component: () => import('@/components/warehouse/virtualWarehouse/UpdatedVirtualWarehouse')
  },
  {
    path: '/warehouse/virtualwarehouse/virtualwarehousedetaills',
    name: 'VirtualWarehouseDetaills',
    hidden: true,
    meta: { title: '虚拟仓库详情', auth: 'VirtualWarehouseDetaills' },
    component: () => import('@/components/warehouse/virtualWarehouse/VirtualWarehouseDetaills')
  },
  {
    path: '/warehouse/virtualwarehouse/relevancewarehousedata',
    name: 'RelevanceWarehouseData',
    hidden: true,
    meta: { title: '关联仓库数据信息' },
    component: () => import('@/components/warehouse/virtualWarehouse/RelevanceWarehouseData')
  },
  {
    path: '/warehouse/virtualwarehouse/categorywarehousedata',
    name: 'CategoryWarehouseData',
    hidden: true,
    meta: { title: '相关分类数据信息' },
    component: () => import('@/components/warehouse/virtualWarehouse/CategoryWarehouseData')
  },
  {
    path: '/warehouse/virtualwarehouse/skuwarehousedata',
    name: 'SKUWarehouseData',
    hidden: true,
    meta: { title: 'SKU库存信息（实体仓库进入）' },
    component: () => import('@/components/warehouse/virtualWarehouse/SKUWarehouseData')
  },
  {
    path: '/warehouse/virtualwarehouse/skuvirtualwarehousedata',
    name: 'SKUVirtualWarehouseData',
    hidden: true,
    meta: { title: 'SKU库存信息（虚拟仓库进入）' },
    component: () => import('@/components/warehouse/virtualWarehouse/SKUVirtualWarehouseData')
  },
  {
    path: '/warehouse/inventory/inventoryadmin',
    name: 'InventoryAdmin',
    hidden: false,
    meta: { title: ' 商品库存查询', auth: 'InventoryAdmin' },
    component: () => import('@/components/warehouse/inventory/InventoryAdmin')
  }
]