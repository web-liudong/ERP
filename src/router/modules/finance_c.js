export default [
  {
    path: '/finance/code/code',
    name: 'FinanceCode',
    hidden: false,
    meta: {
      title: '税收编码（金税）',
      auth: 'FinanceCode'
    },
    component:
      () => import('@/components/finance/code/Code'),
  },
  {
    path: '/finance/code/codeimportrecord',
    name: 'FinanceCodeImportRecord',
    hidden: true,
    meta: {
      title: '税收编码导入记录',
      auth: 'CodeBulkImportRelevant'
    },
    component:
      () => import('@/components/finance/code/CodeImportRecord'),
  },
  {
    path: '/finance/classcode/classcode',
    name: 'FinanceClassCode',
    hidden: false,
    meta: {
      title: '分类税收编码确认',
      auth: 'FinanceClassCode'
    },
    component:
      () => import('@/components/finance/classCode/ClassCode'),
  },
  {
    path: '/finance/export/tplusrecord',
    name: 'ExportTPlusRecord',
    hidden: false,
    meta: {
      title: 'T+数据导出',
      auth: 'FinanceStatsTplus'
    },
    component:
      () => import('@/components/finance/export/TPlusRecord'),
  }
]
