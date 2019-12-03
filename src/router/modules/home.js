export default [{
  path: '/homepage/home/homeindex',
  name: 'home',
  meta: {
    title: '系统首页'
  },
  hidden: false,
  component: () => import('@/components/home/home'),
},
{
  path: '/homepage/home/moreMessage',
  name: 'moreMessage',
  meta: {
    title: '更多公告信息'
  },
  hidden: false,
  component: () => import('@/components/home/moreMessage'),
},
{
  path: '/homepage/home/messageDetail',
  name: 'messageDetail',
  meta: {
    title: '公告信息详细'
  },
  hidden: false,
  component: () => import('@/components/home/messageDetail'),
},
{
  path: '/homepage/home/moreAffair',
  name: 'moreAffair',
  meta: {
    title: '更多待处理事务'
  },
  hidden: false,
  component: () => import('@/components/home/moreAffair'),
}]