export default [
  {
    path: '/system/systemindex/systemList',
    name: 'SystemList',
    hidden: false,
    meta: {
      title: '用户管理',
      auth: 'SystemList'
    },
    component:
      () => import('@/components/system/userAdmin')
  },
  {
    path: '/system/systemindex/adduser',
    name: 'Adduser',
    hidden: true,
    meta: {
      auth: 'UserCreate',
      title: '添加用户'
    },
    component:
      () => import('@/components/system/userAdmin/addUser')
  },
  {
    path: '/system/systemindex/edituser',
    name: 'Edituser',
    hidden: true,
    meta: {
      auth: 'UserUpdate',
      title: '编辑用户'
    },
    component:
      () => import('@/components/system/userAdmin/editUser')
  },
  {
    path: '/system/systemindex/userdetail',
    name: 'UserDetail',
    hidden: true,
    meta: {
      auth: 'UserDetail',
      title: '用户详情'
    },
    component:
      () => import('@/components/system/userAdmin/userDetail')
  },
  {
    path: '/system/systemindex/movereaord',
    name: 'MoveReaord',
    hidden: true,
    meta: {
      title: '移交记录'
    },
    component:
      () => import('@/components/system/userAdmin/moveReaord')
  },
  {
    path: '/system/rolepermissionadmin/roleadmin',
    name: 'RoleAdmin',
    hidden: false,
    meta: {
      title: '角色权限管理',
      auth: 'RoleAdmin'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/RoleAdmin')
  },
  {
    path: '/system/rolepermissionadmin/createrole',
    name: 'CreateRole',
    hidden: true,
    meta: {
      title: '添加角色',
      auth: 'RoleCreate'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/CreateRole')
  },
  {
    path: '/system/rolepermissionadmin/updaterole',
    name: 'UpdateRole',
    hidden: true,
    meta: {
      title: '编辑角色',
      auth: 'RoleUpdate'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/UpdateRole')
  },
  {
    path: '/system/rolepermissionadmin/rolefunctionadmin',
    name: 'RoleFunctionAdmin',
    hidden: true,
    meta: {
      title: '角色功能权限管理',
      auth: 'RolePermissionAdmin'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/RoleFunctionAdmin')
  },
  {
    path: '/system/rolepermissionadmin/PermissionAdmin',
    name: 'PermissionAdmin',
    hidden: true,
    meta: {
      title: '设置查看权限',
      auth: 'RolePermissionData'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/PermissionAdmin')
  },
  {
    path: '/system/rolepermissionadmin/roledetail',
    name: 'RoleDetail',
    hidden: true,
    meta: {
      title: '角色详情',
      auth: 'RoleDetail'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/RoleDetail')
  },
  {
    path: '/system/rolepermissionadmin/rolegroupadmin',
    name: 'RoleGroupAdmin',
    hidden: true,
    meta: {
      title: '角色分组管理',
      auth: 'RoleGroup'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/roleGroupAdmin/RoleGroupAdmin')
  },
  {
    path: '/system/rolepermissionadmin/createrolegroup',
    name: 'CreateRoleGroup',
    hidden: true,
    meta: {
      title: '添加角色分组',
      auth: 'RoleGroup'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/roleGroupAdmin/CreateRoleGroup')
  },
  {
    path: '/system/rolepermissionadmin/updaterolegroup',
    name: 'UpdateRoleGroup',
    hidden: true,
    meta: {
      title: '编辑角色分组',
      auth: 'RoleGroup'
    },
    component:
      () => import('@/components/system/rolePermissionAdmin/roleGroupAdmin/UpdateRoleGroup')
  },
  {
    path: '/system/organization/organizationmanage',
    name: 'OrganizationManage',
    hidden: false,
    meta: {
      title: '组织机构管理',
      auth: 'OrganizationManage'
    },
    component:
      () => import('@/components/system/organization/OrganizationManage')
  },
  {
    path: '/system/organization/addorganization',
    name: 'AddOrganization',
    hidden: true,
    meta: {
      title: '添加组织机构',
      auth: 'OrganizationCreateRelevant'
    },
    component:
      () => import('@/components/system/organization/AddOrganization')
  },
  {
    path: '/system/organization/editerorganization',
    name: 'EditerOrganization',
    hidden: true,
    meta: {
      title: '编辑组织机构',
      auth: 'OrganizationUpdateRelevant'
    },
    component:
      () => import('@/components/system/organization/EditerOrganization')
  },
  {
    path: '/system/organization/aduiterorganization',
    name: 'AduiterOrganization',
    hidden: true,
    meta: {
      title: '审核组织机构',
      auth: 'OrganizationReview'
    },
    component:
      () => import('@/components/system/organization/AduiterOrganization')
  },
  {
    path: '/system/organization/editersection',
    name: 'EditerSection',
    hidden: true,
    meta: {
      title: '编辑部门'
    },
    component:
      () => import('@/components/system/organization/EditerSection')
  },
  {
    path: '/system/organization/sectionmanage',
    name: 'SectionManage',
    hidden: true,
    meta: {
      title: '部门管理'
    },
    component:
      () => import('@/components/system/organization/SectionManage')
  },
  {
    path: '/system/organization/sectiondetail',
    name: 'SectionDetail',
    hidden: true,
    meta: {
      title: '部门详情'
    },
    component:
      () => import('@/components/system/organization/SectionDetail')
  },
  {
    path: '/system/organization/organizationupdatedetail',
    name: 'OrganizationUpdateDetail',
    hidden: true,
    meta: {
      title: '组织更新详情'
    },
    component:
      () => import('@/components/system/organization/OrganizationUpdateDetail')
  },
  {
    path: '/system/organization/userlist',
    name: 'UserList',
    hidden: true,
    meta: {
      title: '相关用户列表'
    },
    component:
      () => import('@/components/system/organization/UserList')
  },
  {
    path: '/system/organization/organizationdetail',
    name: 'OrganizationDetail',
    hidden: true,
    meta: {
      title: '组织机构详情',
      auth: 'OrganizationDetailRelevant'
    },
    component:
      () => import('@/components/system/organization/OrganizationDetail')
  },
  {
    path: '/system/organization/addsection',
    name: 'AddSection',
    hidden: true,
    meta: {
      title: '添加部门'
    },
    component:
      () => import('@/components/system/organization/AddSection')
  },
  {
    path: '/system/advertiseMessage/list',
    name: 'advertiseMessagelist',
    hidden: false,
    meta: {
      title: '公告信息管理',
      auth: 'AdvertiseMessageList'
    },
    component:
      () => import('@/components/system/advertiseMessage/list')
  },
  {
    path: '/system/advertiseMessage/create',
    name: 'advertiseMessagecreate',
    hidden: false,
    meta: {
      title: '创建公告信息',
      auth: 'AdvertiseMessageCreate'
    },
    component:
      () => import('@/components/system/advertiseMessage/create')
  },
  {
    path: '/system/advertiseMessage/edit',
    name: 'advertiseMessageedit',
    hidden: false,
    meta: {
      title: '编辑公告信息',
      auth: 'AdvertiseMessageEdit'
    },
    component:
      () => import('@/components/system/advertiseMessage/edit')
  },
  {
    path: '/system/advertiseMessage/push',
    name: 'advertiseMessagepush',
    hidden: false,
    meta: {
      title: '推送公告信息',
      auth: 'AdvertiseMessagePush'
    },
    component:
      () => import('@/components/system/advertiseMessage/push')
  },
  {
    path: '/system/advertiseMessage/affairDetail',
    name: 'affairDetail',
    hidden: false,
    meta: {
      title: '公告信息详情'
    },
    component:
      () => import('@/components/system/advertiseMessage/affairDetail')
  },
]
