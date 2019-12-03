const navData = {
  "homepage": [
    {
      path: '/homepage/home',
      name: 'homeindex',
      meta: {
        title: '系统首页'
      },
      redirect: '/homepage/home/homeindex',
      children: [{
        path: '/homepage/home/homeindex',
        name: 'home',
        meta: {
          title: '系统首页'
        },
      }]
    }
  ],
  "goods": [
    {
      path: "/goods/goodshome",
      name: "GoodsHome",
      redirect: "/goods/goodsmanage/goodsManage",
      meta: {
        title: "商品管理",
        // auth: "GoodsHome"
      },
      children: [
        {
          path: "/goods/goodsmanage/goodsManage",
          name: "GoodsManage",
          hidden: false,
          meta: {
            title: "商品管理",
            auth: "GoodsManage"
          }
        },
        {
          path: "/goods/addgoods/addgoods",
          name: "AddGoods",
          hidden: false,
          meta: {
            title: "添加商品",
            auth: "AddGoods"
          }
        }
      ]
    },
    {
      path: "/goods/goodshome",
      name: "GoodConfig",
      redirect: "/goods/goodshome/classify",
      meta: {
        title: "商品配置",
        auth: "GoodConfig"
      },
      children: [
        {
          path: "/goods/classmanage/classify",
          name: "Category1",
          hidden: false,
          meta: { title: "一级分类管理", auth: 'Category' }
        },
        {
          path: "/goods/classsecond/classify",
          name: "Category2",
          hidden: false,
          meta: { title: "二级分类管理", auth: 'Category' }
        },
        {
          path: "/goods/classthree/classify",
          name: "Category3",
          hidden: false,
          meta: { title: "三级分类管理", auth: 'Category' }
        },
        {
          path: "/goods/parameter/parameterTemplate/navEnt",
          name: "TemplateAdmin",
          hidden: false,
          meta: {
            title: "参数模板管理",
            auth: 'TemplateAdmin'
          }
        },
        {
          path: "/goods/brandmanage/brand",
          name: "Brand",
          hidden: false,
          meta: {
            title: "品牌管理",
            auth: 'Brand'
          }
        },
        {
          path: "/goods/accreditstor/accredit",
          name: "Accredit",
          hidden: false,
          meta: { title: "授权库", auth: 'Accredit' }
        },
      ]
    },
    {
      path: "/goods/goodshome",
      name: "GoodsCorrespond",
      redirect: "/goods/goodsCorrespondManage",
      meta: {
        title: "新老系统数据对应管理",
        auth:"NewOldCorrespond"
      },
      children: [
        {
          path: "/goods/goodsCorrespondManage",
          name: "GoodsCorrespond",
          hidden: false,
          meta: {
            title: "商品数据对应管理",
            auth:'ProductCorrespondManage'
          }
        },
        {
          path: "/goods/projectCorrespondManage",
          name: "ProjectCorrespondManage",
          hidden: false,
          meta: {
            title: "项目数据对应管理",
            auth:'ProjectCorrespondManage'
          }
        },
        {
          path: "/goods/customCorrespondManage",
          name: "CustomCorrespondManage",
          hidden: false,
          meta: {
            title: "客户数据对应管理",
            auth:'CustomCorrespondManage'
          }
        },
        {
          path: "/goods/sectionCorrespondManage",
          name: "SectionCorrespondManage",
          hidden: false,
          meta: {
            title: "部门数据对应管理",
            auth:'SectionCorrespondManage'
          }
        },
        {
          path: "/goods/purchaseCorrespondManage",
          name: "PurchaseCorrespondManage",
          hidden: false,
          meta: {
            title: "客户采购人数据对应管理",
            auth:'PurchaserCorrespondManage'
          }
        }
      ]
    },
  ],
  "order": [
    {
      path: "/order/orderIndex",
      meta: {
        title: "订单管理中心",
        auth: 'OrderManageCenter'
      },
      redirect: "/order/orderManage",
      children: [
        {
          path: "/order/saleDown",
          name: "saleDown",
          hidden: false,
          meta: {
            title: "销售下单",
            auth: 'OrderCreat'
          }
        },
        {
          path: "/order/myOrder",
          name: "MyOrder",
          hidden: false,
          meta: {
            title: "我的订单",
            auth: 'OrderManage'
          }
        },
        {
          path: "/order/orderManage",
          name: "OrderManage",
          hidden: false,
          meta: {
            title: "订单管理",
            auth: 'OrderManage'
          }
        },
        {
          path: "/order/invoiceManage",
          name: "InvoiceManage",
          hidden: false,
          meta: {
            title: "发货单管理",
            auth: 'OrderDeliverManage'
          }
        },
        {
          path: '/order/returnordermange/returnordermange',
          name: 'returnOrderMange',
          meta: {
            title: '退货单管理',
            auth: 'ReturnOrderMange'
          },
        },
        {
          path: "/order/outsideReturnOrder/outsideReturnOrderMange",
          name: "outsideReturnOrderMange",
          meta: {
            title: "外部退货单管理",
            auth: 'outSideReturnOrder'
          }
        },
        {
          path: "/order/orderAnomalyManage",
          name: "OrderAnomalyManage",
          hidden: false,
          meta: {
            title: "异常订单管理",
            auth: 'OrderAnomalyManage'
          }
        },
      ]
    },
    {
      path: "/order/orderIndex",
      meta: {
        title: "订单审核管理",
        auth: 'OrderExamineCenter'
      },
      redirect: "/order/orderManage",
      children: [
        {
          path: "/order/editerOrderManage",
          name: "EditerOrderManage",
          hidden: false,
          meta: {
            title: "【改单】审核",
            auth: 'OrderChangeOrderManage'
          }
        },
        {
          path: "/order/orderNoAuditeManage",
          name: "OrderNoAuditeManage",
          hidden: false,
          meta: {
            title: "【取消订单】审核",
            auth: 'OrderCancelOrderManage'
          }
        },
        {
          path: "/order/servicerateauditemanage",
          name: "ServiceRateAuditeManage",
          hidden: false,
          meta: {
            title: "【服务费率】更改审核",
            auth: 'OrderServiceRateExamineManage'
          }
        },
        {
          path: "/order/customerReceiptConfirmation",
          name: "customerReceiptConfirmation",
          hidden: false,
          meta: {
            title: "客户签收凭证确认",
            auth: 'CustomerReceiptConfirm'
          }
        },

      ]
    },
    {
      path: "/order/orderMan",
      meta: {
        title: "订单配置中心",
        auth: 'OrderConfigCenter'
      },
      children: [
        {
          path: "/order/orderManManage/orderManManage",
          name: "orderManManage",
          hidden: false,
          meta: {
            title: "订单派单员配置",
            auth: 'OrderDelivererConfig'
          }
        },
      ]
    },
    {
      path: "/order/orderQuery",
      meta: {
        title: "订单查询中心",
        auth: 'OrderQueryCenter'
      },
      children: [
        {
          path: "/order/orderQueryorder",
          name: "OrderQuery",
          hidden: false,
          meta: {
            title: "订单查询",
            auth: 'OrderQueryorder'
          }
        },
        {
          path: "/order/orderQuerygoods",
          name: "OrderQueryGoods",
          hidden: false,
          meta: {
            title: "订单明细表查询",
            auth: 'OrderQuerygoods'
          }
        },
      ]
    },
  ],
  "biddingPrice": [
    {
      path: '/biddingPrice/biddingPriceMessage',
      name: 'BiddingPriceindex',
      meta: {
        title: '竞价信息'
      },
      redirect: '/biddingPrice/biddingPriceMessageList/list',
      children: [{
        path: '/biddingPrice/biddingPriceMessageList/list',
        name: 'biddingPriceMessageList',
        hidden: false,
        meta: {
          title: '竞价信息列表',
          auth: 'biddingPriceMessageList'
        },
      },
      {
        path: '/biddingPrice/PresentationPriceList/list',
        name: 'PresentationPriceList',
        hidden: false,
        meta: {
          title: '报价列表',
          auth: 'presentationPriceList'
        },
      },
      {
        path: '/biddingPrice/projectByTimeSet/list',
        name: 'ProjectByTimeSetList',
        hidden: false,
        meta: {
          title: '项目报价截止时间设置',
          auth: 'ProjectByTimeSetList'
        },
      },
      ]
    },
    {
      path: '/biddingPrice/backupsMessage',
      name: 'backupsMessageindex',
      meta: {
        title: '报备信息'
      },
      redirect: '/biddingPrice/biddingBackups/list',
      children: [{
        path: '/biddingPrice/biddingBackups/list',
        name: 'biddingBackupsList',
        meta: {
          title: '竞价报备',
          auth: 'biddingBackups'
        },
      },
      {
        path: '/biddingPrice/myBackups/list',
        name: 'myBackupsList',
        meta: {
          title: '我的报备',
          auth: 'myBackupsList'
        },
      }
      ]
    }],
  "purchase": [
    {
      path: '/purchase/PurchaseIndex',
      meta: { title: '采购管理', auth: 'PurchaseManage' },
      redirect: "/purchase/purchaseDemand",
      children: [
        {
          path: '/purchase/purchaseDemand',
          name: 'PurchaseDemand',
          hidden: false,
          meta: { title: '采购需求管理', auth: 'PurchaseDemandManage' },
        },
        {
          path: '/purchase/purchaseCollectionOrder',
          name: 'PurchaseCollectionOrder',
          hidden: false,
          meta: { title: '集采订单管理', auth: 'PurchaseCollectionManage' },
        },
        {
          path: '/purchase/purchaseCollectingPool',
          name: 'purchaseCollectingPool',
          hidden: false,
          meta: { title: '集采商品池', auth: 'PurchaseGoodsManage'},
        },
        {
          path: '/purchase/purchaseOrder',
          name: 'PurchaseOrder',
          hidden: false,
          meta: { title: '采购单管理', auth: 'PurchaseOrderManage' },
        }
      ]
    },
    {
      meta: { title: '采购审批管理', auth: 'PurchaseApprovalMange' },
      children: [
        {
          path: '/purchase/PurchaseOrderManage/PurchaseApprovalList',
          name: 'PurchaseApprovalList',
          hidden: false,
          meta: { title: '采购审批列表', auth: 'PurchaseApprovalList' },
        }
      ]
    },
    {
      meta: { title: '退货管理', auth: 'PurchaseReturnsManage' },
      children: [
        {
          path: '/purchase/purchaseReturnOrder',
          name: 'PurchaseReturnOrder',
          hidden: false,
          meta: { title: '退货单管理', auth: 'PurchaseReturnsManage' },
        }
      ]
    },
    {
      meta: { title: '采购设置', auth: 'PurchaseConfig' },
      children: [
        {
          path: '/purchase/purchaseConfig/attributeSetup',
          name: 'AttributeSetup',
          hidden: false,
          meta: { title: '采购属性设置', auth: 'PurchaseAttributeConfig' },
        },
        {
          path: '/purchase/purchaseStaffConfig',
          name: 'PurchaseStaffConfig',
          hidden: false,
          meta: { title: '采购人员设置', auth: 'PurchaseStaffConfig' },
        }
      ]
    },
  ],
  "payment": [
    {
      path: '/payment/paymentadmin',
      name: 'PaymentIndex',
      meta: { title: '结算管理', auth: 'PaymentManage' },
      redirect: '/payment/customerStatementList',
      children: [
        {
          path: '/payment/customerStatementList',
          name: 'customerStatementList',
          hidden: false,
          meta: { title: '客户结算单列表', auth: 'PaymentManageList' },
        },
        {
          path: '/payment/claimlist/claimlist',
          name: 'ClaimList',
          hidden: false,
          meta: { title: '认款列表', auth: 'ClaimList' },
        },
        {
          path: '/payment/paymentstatus',
          name: 'PaymentStatus',
          hidden: false,
          meta: { title: '订单结算状态', auth: 'PaymentStatusManage' },
        },
        {
          path: '/payment/invoiceapplication/invoiceapplication',
          name: 'InvoiceApplication',
          hidden: false,
          meta: { title: '我的开票申请', auth: 'invoiceApplication' },
        }
      ]
    },
    {
      path: '/payment/purchase',
      name: 'PaymentPurchase',
      meta: { title: '采购结算管理', auth: 'PurchaseBillManage' },
      redirect: '/payment/purchase/PurchaseBillList',
      children: [
        {
          path: '/payment/purchase/PurchaseBillList',
          name: 'PurchaseManage',
          hidden: false,
          meta: { title: '采购结算单管理', auth: 'PurchaseBillList' }
        },
        {
          path: '/payment/collect/collectPurchase',
          name: 'CollectPurchaseManage',
          hidden: false,
          meta: { title: '集采结算单管理', auth: 'CollectionBillManage' }
        },
        {
          path: '/payment/groupbuy/manage',
          name: 'GroupBuy',
          hidden: false,
          meta: { title: '集采应付管理', auth: 'GroupPayManageList' }
        },
        {
          path: '/payment/payrecord/manage',
          name: 'PayRecord',
          hidden: false,
          meta: { title: '集采付款管理', auth: 'GroupPayManageList' }
        }
      ]
    }
  ],
  "finance": [
    {
      path: "/finance/invoice",
      name: "invoiceIndex",
      meta: {
        title: "发票管理",
        auth: 'InvoiceManage'
      },
      redirect: '/finance/entryTicket/entryTicket',
      children: [
        {
          path: "/finance/entryTicket/entryTicket",
          name: "EntryTicket",
          hidden: "false",
          meta: {
            title: "进项票确认管理",
            auth: 'EntryTicketManage'
          }
        },
        {
          path: "/finance/invoiceapply/invoiceapply",
          name: "InvoiceApply",
          hidden: "false",
          meta: {
            title: "发票申请管理",
            auth: 'InvoiceApplyManage'
          }
        },
        {
          path: '/finance/invoice/invoiceRecord',
          name: "InvoiceRecord",
          hidden: "false",
          meta: {
            title: "发票记录",
            auth: 'InvoiceRecord'
          }
        },
        {
          path: '/finance/InvalidApplication',
          name: "Invalidapplication",
          hidden: "false",
          meta: {
            title: "发票作废申请",
            auth: 'InvoiceDiscard'
          }
        },
        {
          path: '/finance/invoicepur/invoicelist',
          name: "InvoiceList",
          hidden: "false",
          meta: {
            title: "采购收票管理",
            auth: 'PurchaseInvoiceManage'
          }
        },
        {
          path: '/finance/invoicegroup/invoicelist',
          name: "InvoiceGroup",
          hidden: "false",
          meta: {
            title: "集采发票申请管理",
            auth: 'GroupInvoiceManage'
          }
        },
        {
          path: '/finance/collectionInvoice',
          name: 'CollectionInvoice',
          hidden: false,
          meta: { title: '集采发票记录', auth: 'GroupInvoiceRecord'},
        },
        {
          path: '/finance/invoiceObsolete',
          name: 'InvoiceObsolete',
          hidden: false,
          meta: { title: '集采发票作废申请', auth: 'GroupInvoiceDiscard'},
        },
      ]
    },
    {
      path: "/finance/payable",
      name: "ReceivableIndex",
      meta: {
        title: "应收应付管理",
        auth: 'ReceivablePayableManage'
      },
      redirect: '/finance/receivable/Receivable',
      children: [
        {
          path: "/finance/receivable/Receivable",
          name: "Receivable",
          hidden: false,
          meta: {
            title: "开票方应收账款",
            auth: 'AccountsReceivableManage'
          }
        },
        {
          path: "/finance/accountspayablelist",
          name: "AccountsPayableList",
          hidden: false,
          meta: {
            title: "开票方应付账款",
            auth: 'AccountsPayableManage'
          }
        },
        {
          path: "/finance/serverReceivable/ServerReceivable",
          name: "ServerReceivable",
          hidden: false,
          meta: {
            title: "服务方应收账款",
            auth: 'ServerAccountsReceivable'
          }
        },
        {
          path: "/finance/PaymentInformation/PaymentInformation",
          name: "PaymentInformation",
          hidden: false,
          meta: {
            title: "回款信息",
            auth: 'ReturnMoney'
          }
        },
        {
          path: '/finance/PurchasePaymentsList',
          name: 'PurchasePaymentsList',
          hidden: false,
          meta: { title: '采购付款单管理', auth: 'PurchasePaymentsList' },
        },
        {
          path: '/finance/purchasegroup/manage',
          name: 'PurchaseGroup',
          hidden: false,
          meta: { title: '集采应收管理', auth: 'GroupReceivableManage' },
        },
        {
          path: '/finance/moneycheck/manage',
          name: 'MoneyCheck',
          hidden: false,
          meta: { title: '集采回款审核', auth: 'GroupPaymentApplyManage' }
        }
      ]
    },
    {
      meta: {
        title: "数据统计",
        auth: 'FinanceStats'
      },
      children: [
        {
          path: '/finance/export/tplusrecord',
          name: "ExportTPlusRecord",
          hidden: "false",
          meta: {
            title: "T+数据导出"
          }
        }
      ]
    },
    {
      path: "/finance/code",
      name: "FinanceIndex",
      meta: {
        title: "税收配置",
        auth: 'FinanceIndex'
      },
      redirect: "/finance/code/code",
      children: [
        {
          path: "/finance/code/code",
          name: "FinanceCode",
          hidden: false,
          meta: {
            title: "税收编码（金税）",
            auth: 'FinanceCode'
          }
        },
        {
          path: "/finance/classcode/classcode",
          name: "FinanceClassCode",
          hidden: false,
          meta: {
            title: "分类税收编码确认",
            auth: 'FinanceClassCode'
          }
        }
      ]
    }
  ],
  "marketing": [
    {
      path: '/marketing/marketingindex',
      name: 'Marketingindex',
      meta: {
        title: '市场开发',
        auth: 'MarketBD'
      },
      redirect: '/marketing/targetCustomer/index',
      children: [{
        path: '/marketing/targetCustomer/index',
        name: 'TargetCustomer',
        hidden: false,
        meta: {
          title: '目标客户管理',
          auth: 'TargetCustomer'
        },
      },
      {
        path: '/marketing/projectTender/index',
        name: 'ProjectTender',
        hidden: false,
        meta: {
          title: '项目招投标管理',
          auth: 'ProjectTender'
        },

      },
      {
        path: '/marketing/projectTenderWorkTask',
        name: 'ProjectTenderWorkTask',
        hidden: false,
        meta: {
          title: '项目招投标工作任务管理',
          auth: 'ProjectTenderWorkTask'
        },
      },
      ]
    }
  ],
  "supplier": [
    {
      path: '/supplier/supplierindex',
      name: 'SupplierIndex',
      meta: {
        title: '供应商管理',
        auth: 'SupplierIndex'
      },
      redirect: '/supplier/supplierindex/supplierList',
      children: [{
        path: '/supplier/basic/supplierindex/supplierList',
        name: 'SupplierList',
        hidden: false,
        meta: {
          title: '供应商基本信息管理',
          auth: 'SupplierList'
        }
      },
      {
        path: '/supplier/business/supplierindex/SupplierService',
        name: 'SupplierService',
        hidden: false,
        meta: {
          title: '供应商业务信息管理',
          auth: 'SupplierService'
        },
      }
      ]
    }],
  "customer": [
    {
      path: "/customer/information",
      name: "InfoRation",
      meta: { title: "客户配置", auth: 'InfoRation' },
      redirect: "/customer/information/customermanage",
      children: [
        {
          path: "/customer/projectManage",
          name: "ProjectManage",
          hidden: false,
          meta: {
            title: "项目管理",
            auth: 'ProjectManage'
          }
        },
        {
          path: "/customer/information/customermanage",
          name: "CustomerManage",
          hidden: false,
          meta: { title: "客户管理", auth: 'CustomerManage' }
        },
        {
          path: "/customer/serverset",
          name: "ServerSet",
          hidden: false,
          meta: {
            title: "客户指定服务商设置",
            auth: 'CustomerServiceSetManage'
          }
        }
      ]
    }
  ],
  "warehouse": [
    {
      path: "/warehouse/admin",
      name: "WarehouseIndex",
      meta: { title: "仓库设置", auth: "WarehouseIndex" },
      redirect: "/warehouse/admin/admin",
      children: [
        {
          path: "/warehouse/admin/admin",
          name: "WarehouseAdmin",
          hidden: false,
          meta: { title: "仓库管理", auth: "WarehouseAdmin" }
        },
        {
          path: "/warehouse/virtualwarehouse/virtualwarehouseadmin",
          name: "VirtualWarehouseAdmin",
          hidden: false,
          meta: { title: "虚拟仓管理", auth: "VirtualWarehouseAdmin" }
        }
      ]
    },
    {
      path: "/warehouse/inventory",
      name: "Inventory",
      meta: { title: "仓库库存管理", auth: "InventoryAdmin" },
      redirect: "/warehouse/inventory/inventoryadmin",
      children: [
        {
          path: "/warehouse/inventory/inventoryadmin",
          name: "InventoryAdmin",
          hidden: false,
          meta: { title: "仓库商品库存信息管理", auth: "InventoryAdmin" }
        }
      ]
    }
  ],
  "release": [
    {
      path: "/release/releaseindex",
      meta: {
        title: "官网发布管理",
        auth: 'ReleaseWebManage'
      },
      redirect: "/release/releaseindex/releaselist",
      children: [
        {
          path: "/release/releaseindex/releaselist",
          name: "ReleaseGoodsManage",
          hidden: false,
          meta: {
            title: "商品管理",
            auth: 'WebGoodsManage'
          }
        },
        {
          path: "/release/navigation/navmanage",
          name: "NavigationManage",
          hidden: false,
          meta: {
            title: "导航管理",
            auth: 'WebNavManage'
          }
        },
        {
          path: "/release/floormanage/floormanage",
          name: "FloorManage",
          hidden: false,
          meta: {
            title: "楼层管理",
            auth: 'WebFloorManage'
          }
        }
      ]
    },
    {
      path: "/release/releaseindex",
      name: "SpecialReleaseManage",
      meta: {
        title: "专柜项目发布管理",
        auth: 'ReleaseShoppeManage'
      },
      redirect: "/release/specialcountermanage/specialcountermanage",
      children: [
        {
          path: "/release/specialcountermanage/specialcountermanage",
          name: "ShoppeProjectManage",
          hidden: false,
          meta: {
            title: "专柜项目发布管理",
            auth: 'ShoppeProjectManage'
          }
        }
      ]
    },
    {
      path: "/release/releaseindex",
      name: "ReleaseMallManage",
      meta: {
        title: "商城项目管理",
        auth: 'ReleaseMallManage'
      },
      redirect: "/release/releasemallmanage/releasemallmanage",
      children: [
        {
          path: "/release/releasemallmanage/releasemallmanage",
          name: "ReleaseMallManage",
          hidden: false,
          meta: {
            title: "商城项目管理",
            auth: 'ShoppingMallManage'
          }
        }
      ]
    }
  ],
  "system": [
    {
      path: '/system/systemindex',
      name: 'Systemindex',
      meta: {
        title: '权限管理',
        auth: 'Systemindex'
      },
      redirect: '/system/organization/organizationmanage',
      children: [
        {
          path: '/system/organization/organizationmanage',
          name: 'OrganizationManage',
          hidden: false,
          meta: {
            title: '组织机构管理',
            auth: 'OrganizationManage'
          },
        },
        {
          path: '/system/systemindex/systemList',
          name: 'SupplierList',
          hidden: false,
          meta: {
            title: '用户管理',
            auth: 'SystemList'
          }
        },
        {
          path: '/system/rolepermissionadmin/roleadmin',
          name: 'RoleAdmin',
          hidden: false,
          meta: {
            title: '角色权限管理',
            auth: 'RoleAdmin'
          },
        },
        {
          path: '/system/advertiseMessage/list',
          name: 'advertiseMessagelist',
          hidden: false,
          meta: {
            title: '公告信息管理',
            auth: ''
          },
        },
      ]
    }],
  "statistics": [
    {
      path: '/statistics/download',
      name: 'Bidding',
      meta: {
        title: '下载中心',
        auth: 'StatsDownloadCenter'
      },
      redirect: '/statistics/taskTable',
      children: [{
        path: '/statistics/taskTable',
        name: 'statisticsTaskTable',
        hidden: false,
        meta: {
          title: '任务列表',
          auth: 'StatsDownloadTask'
        },
      }
      ]
    },
    {
      path: '/statistics/stockTable',
      name: 'statisticsStockTable',
      meta: {
        title: '库存报表',
        auth: 'StatsStockReport'
      },
      redirect: '/statistics/commodityDetails',
      children: [{
        path: '/statistics/commodityDetails',
        name: 'statisticsCommodityDetails',
        meta: {
          title: '商品成本明细表',
          auth: 'StatsGoodsCost'
        },
      },
      {
        path: '/statistics/inventoryFlow',
        name: 'statisticsInventoryFlow',
        meta: {
          title: '库存出入库流水表',
          auth: 'StatsStockContinual'
        },
      },
      ]
    },
    {
      path: '/statistics/salesTable',
      name: 'statisticsSalesTable',
      meta: {
        title: '销售报表',
        auth: 'StatsSalesReport'
      },
      redirect: '/statistics/detailed',
      children: [{
        path: '/statistics/detailed',
        name: 'statisticsDetailed',
        meta: {
          title: '销售毛利明细表',
          auth: 'StatsSalesGrossProfit'
        },
      },
      // {
      //   path: '/statistics/analysis',
      //   name: 'statisticsAnalysis',
      //   meta: {
      //     title: '销售毛利分析表',
      //     auth: 'biddingPriceMessageList'
      //   },
      // },
      {
        path: '/statistics/frequency',
        name: 'statisticsFrequency',
        meta: {
          title: '销售频次分析表',
          auth: 'StatsSalesAnalysis'
        },
      }
      ]
    }
  ]
}

export default navData;