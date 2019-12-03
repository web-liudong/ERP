export default [
  {
    path: '/statistics/taskTable',
    name: 'statisticsTaskTable',
    hidden: false,
    meta: {
      title: '任务列表',
      auth: 'StatsDownloadTask'
    },
    component:
      () => import('@/components/statistics/download/taskTable/index')
  },
  {
    path: '/statistics/detailed',
    name: 'statisticsDetailed',
    hidden: false,
    meta: {
      title: '销售毛利明细表',
      auth: 'StatsSalesGrossProfit'
    },
    component:
      () => import('@/components/statistics/salesTable/detailed/index')
  },
  {
    path: '/statistics/analysis',
    name: 'statisticsAnalysis',
    hidden: false,
    meta: {
      title: '销售毛利分析表',
      // auth: 'StatsSalesAnalysis'
    },
    component:
      () => import('@/components/statistics/salesTable/analysis/index')
  },
  {
    path: '/statistics/frequency',
    name: 'statisticsFrequency',
    hidden: false,
    meta: {
      title: '销售频次分析表',
      auth: 'StatsSalesAnalysis'
    },
    component:
      () => import('@/components/statistics/salesTable/frequency/index')
  },
  {
    path: '/statistics/commodityDetails',
    name: 'statisticsCommodityDetails',
    hidden: false,
    meta: {
      title: '商品成本明细表',
      auth: 'StatsGoodsCost'
    },
    component:
      () => import('@/components/statistics/stockTable/commodityDetails/index')
  },
  {
    path: '/statistics/inventoryFlow',
    name: 'statisticsInventoryFlow',
    hidden: false,
    meta: {
      title: '库存出入库流水表',
      auth: 'StatsStockContinual'
    },
    component:
      () => import('@/components/statistics/stockTable/inventoryFlow/index')
  },
]