import {Message} from 'element-ui'

const newRoutes = {
	"Goods":[
		{auth:"GoodsManage", path:"/goods/goodsmanage/goodsManage",title:'商品管理',name:'GoodsManage'},
		{auth:"AddGoods", path:"/goods/addgoods/addGoods",title:'添加商品',name:'AddGoods'},
		{auth:"Accredit", path:"/goods/accreditstor/accredit",title:'授权库',name:'Accredit'},
		{auth:"Brand", path:"/goods/brandmanage/brand",title:'品牌管理',name:'Brand'},
		{auth:"TemplateAdmin", path:"/goods/parameter/parameterTemplate/navEnt",title:'参数模板管理',name:'TemplateAdmin'},
		{auth:"Category1", path:"/goods/classmanage/classify",title:'一级分类管理',name:'Category1'},
		{auth:"Category2", path:"/goods/classsecond/classify",title:'二级分类管理',name:'Category2'},
		{auth:"Category3", path:"/goods/classthree/classify",title:'三级分类管理',name:'Category3'},
		{auth:"ProductCorrespondManage", path:"/goods/goodsCorrespondManage",title:'商品数据对应管理',name:'GoodsCorrespondManage'},
		{auth:"ProjectCorrespondManage", path:"/goods/projectCorrespondManage",title:'项目数据对应管理',name:'ProjectCorrespondManage'},
		{auth:"CustomCorrespondManage", path:"/goods/customCorrespondManage",title:'客户数据对应管理',name:'CustomCorrespondManage'},
		{auth:"SectionCorrespondManage", path:"/goods/sectionCorrespondManage",title:'部门数据对应管理',name:'SectionCorrespondManage'},
		{auth:"PurchaserCorrespondManage", path:"/goods/purchaseCorrespondManage",title:'客户采购人数据对应管理',name:'PurchaseCorrespondManage'},
	],
	"Finance":[
		{auth:"EntryTicketManage", path:"/finance/entryTicket/entryTicket",title:'进项票确认管理',name:'EntryTicket'},
		{auth:"InvoiceApplyManage", path:"/finance/invoiceapply/invoiceapply",title:'发票申请管理',name:'InvoiceApply'},
		{auth:"InvoiceRecord", path:"/finance/invoice/invoiceRecord",title:'发票记录',name:'InvoiceRecord'},
		{auth:"PurchaseInvoiceManage", path:"/finance/invoicepur/invoicelist",title:'采购收票管理',name:'InvoiceList'},
		{auth:"GroupInvoiceManage", path:"/finance/invoicegroup/invoicelist",title:'集采发票申请管理',name:'InvoiceGroup'},
		{auth:"AccountsReceivableManage", path:"/finance/receivable/Receivable",title:'开票方应收账款',name:'Receivable'},
		{auth:"AccountsPayableManage", path:"/finance/accountspayablelist",title:'开票方应付账款',name:'AccountsPayableList'},
		{auth:"ServerAccountsReceivable", path:"/finance/serverReceivable/ServerReceivable",title:'服务方应收账款',name:'ServerReceivable'},
		{auth:"ReturnMoney", path:"/finance/PaymentInformation/PaymentInformation",title:'回款信息',name:'PaymentInformation'},
		{auth:"PurchasePaymentsList", path:"/finance/PurchasePaymentsList",title:'采购付款单管理',name:'PurchasePaymentsList'},
		{auth:"GroupReceivableManage", path:"/finance/purchasegroup/manage",title:'集采应收管理',name:'PurchaseGroup'},
		{auth:"GroupPaymentApplyManage", path:"/finance/moneycheck/manage",title:'集采回款审核',name:'PayCheck'},
		{auth:"FinanceStatsTplus", path:"/finance/export/tplusrecord",title:'T+数据导出',name:'ExportTPlusRecord'},
		{auth:"FinanceCode", path:"/finance/code/code",title:'税收编码（金税）',name:'FinanceCode'},
		{auth:"FinanceClassCode", path:"/finance/classcode/classcode",title:'分类税收编码确认',name:'FinanceClassCode'},
		{auth:"GroupInvoiceRecord", path:"/finance/collectionInvoice",title:'集采发票记录',name:'CollectionInvoice'},
	],
	"Supplier":[
		{auth:"SupplierList", path:"/supplier/basic/supplierindex/supplierList",title:'供应商基本信息管理',name:'SupplierList'},
		{auth:"SupplierService", path:"/supplier/business/supplierindex/SupplierService",title:'供应商业务信息管理',name:'SupplierService'}
	],
	"Warehouse":[
		{auth:"WarehouseAdmin", path:"/warehouse/admin/admin",title:'仓库管理',name:'WarehouseAdmin'},
		{auth:"VirtualWarehouseAdmin", path:"/warehouse/virtualwarehouse/virtualwarehouseadmin",title:'虚拟仓管理',name:'VirtualWarehouseAdmin'},
		{auth:"InventoryAdmin", path:"/warehouse/inventory/inventoryadmin",title:'仓库商品库存信息管理',name:'InventoryAdmin'},
	],
	"Customer":[
		{auth:"ProjectManage", path:"/customer/projectManage",title:'项目管理',name:'ProjectManage'},
		{auth:"CustomerManage", path:"/customer/information/customermanage",title:'客户管理',name:'customermanage'},
		{auth:"CustomerServiceSetManage", path:"/customer/serverset",title:'客户指定服务商设置',name:'ServerSet'},
	],
	"Release":[
		{auth:"WebGoodsManage", path:"/release/releaseindex/releaselist",title:'商品管理',name:'ReleaseGoodsManage'},
		{auth:"WebNavManage", path:"/release/navigation/navmanage",title:'导航管理',name:'NavManage'},
		{auth:"WebFloorManage", path:"/release/floormanage/floormanage",title:'楼层管理',name:'FloorManage'},
		{auth:"ShoppeProjectManage", path:"/release/specialcountermanage/specialcountermanage",title:'专柜项目发布管理',name:'ShoppeProjectManage'},
		{auth:"ReleaseMallManage", path:"/release/releasemallmanage/releasemallmanage",title:'商城项目管理',name:'ReleaseMallManage'},
	],
	"System":[
		{auth:"OrganizationManage", path:"/system/organization/organizationmanage",title:'组织机构管理',name:'OrganizationManage'},
		{auth:"SystemList", path:"/system/systemindex/systemList",title:'用户管理',name:'SystemList'},
		{auth:"RoleAdmin", path:"/system/rolepermissionadmin/roleadmin",title:'角色权限管理',name:'RoleAdmin'},
		{auth:"AdvertiseMessageList", path:"/system/advertiseMessage/list",title:'公告信息管理',name:'advertiseMessagelist'},
	],
	"Marketing":[
		{auth:"TargetCustomer", path:"/marketing/targetCustomer/index",title:'目标客户管理',name:'TargetCustomer'},
		{auth:"ProjectTender", path:"/marketing/projectTender/index",title:'项目招投标管理',name:'ProjectTender'},
		{auth:"ProjectTenderWorkTask", path:"/marketing/projectTenderWorkTask",title:'项目招投标工作任务管理',name:'ProjectTenderWorkTask'},
	],
	"Order":[
		{auth:"OrderManage", path:"/order/orderManage",title:'订单管理',name:'OrderManage'},
		{auth:"OrderDeliverManage", path:"/order/invoiceManage",title:'发货单管理',name:'InvoiceManage'},
		{auth:"OrderMySelf", path:"/order/myOrder",title:'我的订单',name:'MyOrder'},
		{auth:"saleDown", path:"/order/saleDown",title:'销售下单',name:'saleDown'},
		{auth:"OrderAnomalyManage", path:"/order/orderAnomalyManage",title:'异常订单管理',name:'OrderAnomalyManage'},
		{auth:"ReturnOrderMange", path:"/order/returnordermange/returnordermange",title:'退货单管理',name:'returnOrderMange'},
		{auth:"outSideReturnOrder", path:"/order/outsideReturnOrder/outsideReturnOrderMange",title:'外部退货单管理',name:'outsideReturnOrderMange'},
		{auth:"OrderChangeOrderManage", path:"/order/editerOrderManage",title:'改单审核管理',name:'EditerOrderManage'},
		{auth:"OrderCancelOrderManage", path:"/order/orderNoAuditeManage",title:'订单取消审核管理',name:'OrderNoAuditeManage'},
		{auth:"OrderServiceRateExamineManage", path:"/order/servicerateauditemanage",title:'服务费率更改审核',name:'ServiceRateAuditeManage'},
		{auth:"CustomerReceiptConfirm", path:"/order/customerReceiptConfirmation",title:'客户签收凭证确认',name:'customerReceiptConfirmation'},
		{auth:"OrderDelivererConfig", path:"/order/orderManManage/orderManManage",title:'订单派单员配置',name:'orderManManage'},
		{auth:"OrderQueryorder", path:"/order/orderQueryorder",title:'订单查询',name:'OrderQuery'},
		{auth:"OrderQuerygoods", path:"/order/orderQuerygoods",title:'销售商品查询',name:'OrderQueryGoods'},
	],
	"Payment":[
		{auth:"PaymentManageList", path:"/payment/customerStatementList",title:'客户结算单列表',name:'customerStatementList'},
		{auth:"ClaimList", path:"/payment/claimlist/claimlist",title:'认款列表',name:'ClaimList'},
		{auth:"PaymentStatusManage", path:"/payment/paymentstatus",title:'订单结算状态',name:'PaymentStatus'},
		{auth:"invoiceApplication", path:"/payment/invoiceapplication/invoiceapplication",title:'我的开票申请',name:'InvoiceApplication'},
		{auth:"PurchaseBillList", path:"/payment/purchase/PurchaseBillList",title:'采购结算单管理',name:'PurchaseManage'},
		{auth:"CollectionBillManage", path:"/payment/collect/collectPurchase",title:'集采结算单管理',name:'CollectPurchaseManage'},
		{auth:"GroupPayManage", path:"/payment/groupbuy/manage",title:'集采应付管理',name:'GroupBuy'},
		{auth:"GroupPayManage", path:"/payment/payrecord/manage",title:'集采付款管理',name:'PayRecord'},
	],
	"Purchase":[
		{auth:"PurchaseDemandManage", path:"/purchase/purchaseDemand",title:'采购需求管理',name:'PurchaseDemand'},
		{auth:"PurchaseCollectionManage", path:"/purchase/purchaseCollectionOrder",title:'集采订单管理',name:'PurchaseCollectionOrder'},
		{auth:"PurchaseOrderManage", path:"/purchase/purchaseOrder",title:'采购单管理',name:'PurchaseOrder'},
		{auth:"PurchaseApprovalList", path:"/purchase/PurchaseOrderManage/PurchaseApprovalList",title:'采购审批列表',name:'PurchaseApprovalList'},
		{auth:"PurchaseReturnsManage", path:"/purchase/purchaseReturnOrder",title:'退货单管理',name:'PurchaseReturnOrder'},
		{auth:"PurchaseAttributeConfig", path:"/purchase/purchaseConfig/attributeSetup",title:'采购属性设置',name:'AttributeSetup'},
    {auth:"PurchaseStaffConfig", path:"/purchase/purchaseStaffConfig",title:'采购人员设置',name:'PurchaseStaffConfig'},
    {auth:"PurchaseGoodsManage", path:"/purchase/purchaseCollectingPool",title:'集采商品池',name:'purchaseCollectingPool'},
	],
  "Bidding": [
    { auth: "biddingPriceMessageList", path: "/biddingPrice/biddingPriceMessageList/list", title: '竞价信息列表', name: 'biddingPriceMessageList' },
    { auth: "presentationPriceList", path: "/biddingPrice/PresentationPriceList/list", title: '报价列表', name: 'PresentationPriceList' },
    { auth: "ProjectByTimeSetList", path: "/biddingPrice/projectByTimeSet/list", title: '项目报价截止时间设置', name: 'ProjectByTimeSetList' },
    { auth: "biddingBackups", path: "/biddingPrice/biddingBackups/list", title: '竞价报备', name: 'biddingBackupsList' },
    { auth: "myBackupsList", path: "/biddingPrice/myBackups/list", title: '我的报备', name: 'myBackupsList' },
  ],
  "statistics": [
    { path: "/statistics/taskTable", title: '下载中心', name: 'statisticsTaskTable'},
    { path: "/statistics/detailed", title: '销售毛利明细表', name: 'statisticsDetailed'},
    { path: "/statistics/analysis", title: '销售毛利分析表', name: 'statisticsAnalysis'},
    { path: "/statistics/frequency", title: '销售频次分析表', name: 'statisticsFrequency'},
  ],
	
}

export function resetRouter(type){
	if(type && newRoutes[type]){
		let arr = newRoutes[type].filter(router => {
			return router.auth ? vm.$authorities[router.auth] : true
		});
		if(arr.length){
			return arr[0].name;
		}else{
			Message.error('当前用户未授权不能访问');
			return '/homepage/home/homeindex';
		}		
	}else{
		Message.error('当前用户未授权不能访问');
		return '/homepage/home/homeindex';
	}
}