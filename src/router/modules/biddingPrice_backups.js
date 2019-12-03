export default [
  {
    path: '/biddingPrice/biddingBackups/list',
    name: 'biddingBackupsList',
    meta: {
      title: '竞价报备',
      auth: 'biddingBackups'
    },
    component:
      () => import('@/components/biddingPrice/backupsMessage/biddingBackups/list')
  },
  {
    path: '/biddingPrice/biddingBackups/create',
    name: 'biddingBackupsCreate',
    meta: {
      title: '添加竞价报备',
      auth: 'biddingBackupsCreate'
    },
    component:
      () => import('@/components/biddingPrice/backupsMessage/biddingBackups/create')
  },
  {
    path: '/biddingPrice/biddingBackups/edit',
    name: 'biddingBackupsEdit',
    meta: {
      title: '编辑竞价报备',
      auth: 'biddingBackupsEdit'
    },
    component:
      () => import('@/components/biddingPrice/backupsMessage/biddingBackups/edit')
  },
  {
    path: '/biddingPrice/biddingBackups/detail',
    name: 'biddingBackupsDetail',
    meta: {
      title: '竞价报备详情',
      auth: 'biddingBackupsDetail'
    },
    component:
      () => import('@/components/biddingPrice/backupsMessage/biddingBackups/detail')
  },
  {
    path: '/biddingPrice/myBackups/list',
    name: 'myBackupsList',
    meta: {
      title: '我的报备',
      auth: 'myBackupsList'
    },
    component:
      () => import('@/components/biddingPrice/backupsMessage/myBackups/list')
  },
  {
    path: '/biddingPrice/myBackups/create',
    name: 'myBackupsCreate',
    meta: {
      title: '添加报备信息',
      auth: 'myBackupsCreate'
    },
    component:
      () => import('@/components/biddingPrice/backupsMessage/myBackups/create')
  },
  {
    path: '/biddingPrice/myBackups/edit',
    name: 'myBackupsEdit',
    meta: {
      title: '编辑报备信息',
      auth: 'myBackupsEdit'
    },
    component:
      () => import('@/components/biddingPrice/backupsMessage/myBackups/edit')
  },
  {
    path: '/biddingPrice/myBackups/detail',
    name: 'myBackupsDetail',
    meta: {
      title: '报备信息详情',
      auth: 'myBackupsDetail'
    },
    component:
      () => import('@/components/biddingPrice/backupsMessage/myBackups/detail')
  },
]