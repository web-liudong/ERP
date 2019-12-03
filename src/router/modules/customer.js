export default [
  {
    path: '/customer/information/customermanage',
    name: 'customermanage',
    hidden: false,
    meta: { title: '客户管理', auth: 'CustomerManage' },
    component: () => import('@/components/customer/customerManage/customerList'),
  },
  {
    path: '/customer/information/customermanage/customeradd',
    name: 'customeradd',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerAdd'),
    meta: {
      title: '客户添加',
      auth: 'CustomerReleateAdd'
    }
  },
  {
    path: '/customer/information/customermanage/customeredit',
    name: 'customeredit',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerAdd'),
    meta: {
      title: '客户编辑',
      auth: 'CustomerReleateEdit'
    }
  },
  {
    path: '/customer/information/customermanage/customerrecord',
    name: 'customerrecord',
    hidden: true,
    component:
      () => import('@/components/system/public/ImportRecord'),
    meta: {
      title: '客户导入记录',
      auth: 'CustomerImportRelevant'
    }
  },
  {
    path: '/customer/information/customermanage/customercheck',
    name: 'customerCheck',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerCheck'),
    meta: {
      title: '客户审核',
      auth: 'CustomerInvoiceSubmit'
    }
  },
  {
    path: '/customer/information/customermanage/approvalprocess',
    name: 'ApprovalProcess',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/approvalProcess'),
    meta: {
      title: '审批流管理',
      auth: 'CustomerApprove'
    }
  },
  {
    path: '/customer/serverset',
    name: 'ServerSet',
    hidden: false,
    component:
      () => import('@/components/customer/serverSet/serverSet'),
    meta: {
      title: '客户指定服务商设置',
      auth: 'CustomerServiceSetManage'
    }
  },
  {
    path: '/customer/serverset/serverlog',
    name: 'ServerLog',
    hidden: true,
    component:
      () => import('@/components/customer/serverSet/serverLog'),
    meta: {
      title: '客户服务方设置操作日志'
    }
  },
  {
    path: '/customer/projectManage',
    name: 'ProjectManage',
    hidden: false,
    component:
      () => import('@/components/customer/projectManage'),
    meta: {
      title: '项目管理',
      auth: 'ProjectManage'
    }
  },
  {
    path: '/customer/projectManage/importrecord',
    name: 'projectImportRecord',
    hidden: true,
    component:
      () => import('@/components/customer/projectManage/ImportRecord'),
    meta: {
      title: '导入记录'
    }
  },
  {
    path: '/customer/projectManage/addProject',
    name: 'AddProject',
    hidden: true,
    component:
      () => import('@/components/customer/projectManage/addProject'),
    meta: {
      title: '项目添加'
    }
  },
  {
    path: '/customer/projectManage/editProject',
    name: 'EditProject',
    hidden: true,
    component:
      () => import('@/components/customer/projectManage/editProject'),
    meta: {
      title: '项目编辑'
    }
  },
  {
    path: '/customer/projectManage/detailProject',
    name: 'DetailProject',
    hidden: true,
    component:
      () => import('@/components/customer/projectManage/detailProject'),
    meta: {
      title: '项目详情'
    }
  },
  {
    path: '/customer/projectManage/examineProject',
    name: 'ExamineProject',
    hidden: true,
    component:
      () => import('@/components/customer/projectManage/examineProject'),
    meta: {
      title: '项目审核'
    }
  },
  {
    path: '/customer/projectManage/partnerInformation',
    name: 'PartnerInformation',
    hidden: true,
    component:
      () => import('@/components/customer/projectManage/partnerInformation'),
    meta: {
      title: '项目服务费用率设置'
    }
  },
  {
    path: '/customer/projectManage/partnerInformation/operationJournal',
    name: 'OperationJournal',
    hidden: true,
    component:
      () => import('@/components/customer/projectManage/partnerInformation/operationJournal'),
    meta: {
      title: '项目服务费用率信息操作日志'
    }
  },
  {
    path: '/customer/information/customermanage/customerdetail',
    name: 'customerdetail',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerDetail'),
    meta: {
      title: '客户详情',
      auth: 'CustomerRelateDetail'
    }
  },
  {
    path: '/customer/information/customermanage/invoicelist',
    name: 'invoicelist',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/invoiceList'),
    meta: {
      title: '开票信息管理',
      auth: 'CustomerInvoiceInfo'
    }
  },
  {
    path: '/customer/information/customermanage/invoicedetail',
    name: 'invoicedetail',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/invoiceDetail'),
    meta: {
      title: '开票信息详情',
      auth: 'CustomerInvoiceInfo'
    }
  },
  {
    path: '/customer/information/customermanage/peoplemanage',
    name: 'peoplemanage',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/peopleManage'),
    meta: {
      title: '人员管理',
      auth: 'CustomerCreatePurchasing'
    }
  },
  {
    path: '/customer/information/customermanage/peopledetail',
    name: 'peopledetail',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/peopleDetail'),
    meta: {
      title: '人员详情',
      auth: 'CustomerPersonelDetail'
    }
  },
  {
    path: '/customer/information/customermanage/customerroleadmin',
    name: 'CustomerRoleAdmin',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerRolePermissionAdmin/CustomerRoleAdmin'),
    meta: {
      title: '客户角色权限管理',
      auth: 'CustomerRoleFunctionAdmin'
    }
  },
  {
    path: '/customer/information/customermanage/customercreaterole',
    name: 'CustomerCreateRole',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerRolePermissionAdmin/CustomerCreateRole'),
    meta: {
      title: '添加客户角色',
      auth: 'CustomerRoleFunctionAdmin'
    }
  },
  {
    path: '/customer/information/customermanage/customerupdaterole',
    name: 'CustomerUpdateRole',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerRolePermissionAdmin/CustomerUpdateRole'),
    meta: {
      title: '编辑客户角色',
      auth: 'CustomerRoleFunctionAdmin'
    }
  },
  {
    path: '/customer/information/customermanage/customerrolefunctionadmin',
    name: 'CustomerRoleFunctionAdmin',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerRolePermissionAdmin/CustomerRoleFunctionAdmin'),
    meta: {
      title: '客户角色功能权限管理',
      auth: 'CustomerRoleFunctionAdmin'
    }
  },
  {
    path: '/customer/information/customermanage/customerroledetail',
    name: 'CustomerRoleDetail',
    hidden: true,
    component:
      () => import('@/components/customer/customerManage/customerRolePermissionAdmin/CustomerRoleDetail'),
    meta: {
      title: '客户角色详情',
      auth: 'CustomerRoleFunctionAdmin'
    }
  },
]
