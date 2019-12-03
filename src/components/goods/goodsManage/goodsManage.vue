<template>
  <div class="goodsBox">
    <div class="buttonBox">
      <el-button
        size="small"
        v-for="(item,index) in headers"
        :key="index"
        v-show="brandId?(!brandId||index!=2&&index!=3&&index!=4):(firstLevelCategoryId||secondLevelCategoryId||thirdLevelCategoryId)?((!firstLevelCategoryId&&!secondLevelCategoryId&&!thirdLevelCategoryId)||index!=2&&index!=3&&index!=4&&index!=6):findGoodsParam.taxCodeId?findGoodsParam.taxCodeId&&(index==0||index==1):true"
        :class="{active:index==isActive}"
        @click="changeTab(index,'tab')"
      >{{item.skuStatusName}}（{{item.count}}）</el-button>
    </div>

    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo" style="font-size: 14px"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="iconfont icon-top" v-show="isShow"></i>
            <i :class="isShow? 'el-icon-arrow-up':'el-icon-arrow-down'"></i>
            {{isShow?'收起':'展开'}}筛选
          </span>
          <el-button size="small" class="w80 h40" @click="queryData()">查询结果</el-button>
          <el-button size="small" @click="reset()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox clear" v-if="isShow">
          <div class="inputBox" v-if="isActive!=2&&isActive!=3&&isActive!=4&&isActive!=5">
            <span>商品编号：</span>
            <el-input
              placeholder="商品编号"
              v-model="findGoodsParam.no"
              @input="findGoodsParam.no=findGoodsParam.no.replace(/[^\d]/g,'')"
              clearable
            ></el-input>
          </div>
          <div class="inputBox">
            <!-- <span>商品名称：</span>
        <el-input
          placeholder="商品名称"
          v-model="findGoodsParam.name"
          clearable>
            </el-input>-->
            <span>商品名称：</span>
            <el-select
              v-model="findGoodsParam.name"
              filterable
              remote
              clearable
              placeholder="商品名称"
              :remote-method="skuNameMethod"
            >
              <el-option
                v-for="item in searchskuNames"
                :key="item.value"
                :lable="item.skuName"
                :value="item.skuName"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>规格型号：</span>
            <el-input
              placeholder="请输入规格型号"
              v-model="findGoodsParam.primaryAttributeValue"
              clearable
            ></el-input>
          </div>
          <div class="inputBox">
            <span v-if="isActive==0">上下柜状态：</span>
            <el-select
              v-model="findGoodsParam.websiteAvailable"
              clearable
              placeholder="上下柜状态"
              v-if="isActive==0"
            >
              <el-option
                v-for="item in options7"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>品牌：</span>
            <el-select
              v-model="findGoodsParam.brandId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="品牌名称"
              :remote-method="remoteMethodBrand"
              :loading="loadingClassify"
            >
              <el-option
                v-for="item in optionsBrand"
                :key="item.id"
                :label="item.brandName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>一级分类：</span>
            <el-select
              v-model="findGoodsParam.firstLevelCategoryId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="一级分类"
              :remote-method="remoteMethodClassify1"
              :loading="loadingClassify"
            >
              <el-option
                v-for="item in optionsClassify1"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>二级分类：</span>
            <el-select
              v-model="findGoodsParam.secondLevelCategoryId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="二级分类"
              :remote-method="remoteMethodClassify2"
              :loading="loadingClassify"
            >
              <el-option
                v-for="item in optionsClassify2"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>三级分类：</span>
            <el-select
              v-model="findGoodsParam.thirdLevelCategoryId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="三级分类"
              :remote-method="remoteMethodClassify3"
              :loading="loadingClassify"
            >
              <el-option
                v-for="item in optionsClassify3"
                :key="item.name"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox" v-if="isActive==0||isActive==1||isActive==5||isActive==6">
            <span>旧系统商品编号：</span>
            <el-input
              placeholder="输入旧系统商品编号"
              v-model="findGoodsParam.oldErpSkuId"
              clearable
            ></el-input>
          </div>
          <div class="inputBox" >
            <span>管理员：</span>
            <el-select
              v-model="findGoodsParam.adminId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="管理员"
              :remote-method="(query) => {
                querySelect(query, 'getAdmin', 'adminList')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in adminList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox" v-if="isActive==0||isActive==1||isActive==3||isActive==5||isActive==6">
            <span>创建者：</span>
            <el-select
              v-model="findGoodsParam.creatorId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="创建者"
              :remote-method="(query) => {
                querySelect(query, 'getCreator', 'creatorList')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in creatorList"
                :key="item.id"
                :label="item.userName+'-'+item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox" v-if="isActive==0||isActive==1||isActive==3||isActive==5||isActive==6">
            <span>创建者组织机构：</span>
            <el-select
              v-model="findGoodsParam.organizationId"
              filterable
              remote
              reserve-keyword
              clearable
              placeholder="创建者组织机构"
              :remote-method="(query) => {
                 querySelect(query, 'getOrganization', 'organizationList')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in organizationList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i> 数据列表
        </span>
        <div class="listBoxRight">
          <div
            class="white-btn fun-btn"
            @click="addGoods()"
            v-if="$authorities.GoodsManageCreateRelevant"
          >
            <i class="iconfont icontianjiashangpin"></i>添加
          </div>
          <div
            class="white-btn fun-btn"
            @click="transfer()"
            v-if="$authorities.GoodsManageMigration&&(isActive==0||isActive==1||isActive==6)"
          >
            <i class="iconfont iconqianyi"></i>迁移
          </div>
          <div
            class="white-btn fun-btn"
            @click="showDialog('importBigFile')"
            v-if="$authorities.GoodsManageImportRelevant"
          >
            <i class="iconfont icondaoru"></i>导入
          </div>
          <div
            class="white-btn fun-btn"
            @click="importdetail()"
            v-if="$authorities.GoodsManageImportRelevant"
          >
            <i class="iconfont icondingdanguanli"></i>导入记录
          </div>
        </div>
        <el-table
          :data="SkuBasicInfoDTO"
          :max-height="dataListHeight"
          border
          style="width: 100%"
          size="small"
          @selection-change="handleSelectionChange"
          stripe
        >
          <el-table-column type="selection"></el-table-column>
          <el-table-column prop="skuNo" label="商品编号" align="center"></el-table-column>
          <el-table-column prop="name" label="名称" align="center" show-overflow-tooltip :formatter="formName" min-width="240"></el-table-column>
          <el-table-column prop="brandName" label="品牌" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="categoryName" label="所属分类" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="buyingPrice" label="进价" align="center">
            <template slot-scope="scope">￥{{scope.row.buyingPrice}}</template>
          </el-table-column>
          <el-table-column prop="competingSkuPrice" label="友商售价" align="center">
            <template slot-scope="scope">
              <p v-if="!scope.row.competingSkuUrl"> <i v-if="scope.row.competingSkuPrice!=0">￥{{scope.row.competingSkuPrice}}</i></p>
              <el-button type="text" v-if="scope.row.competingSkuUrl">
                <a
                  :href="scope.row.competingSkuUrl"
                  target="_blank"
                  style="color: #339999"
                >￥{{scope.row.competingSkuPrice}}</a>
              </el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="competingSkuUrl"
            label="友商链接"
            align="center">
            <template slot-scope="scope">
              <a :href="scope.row.competingSkuUrl" target="_blank" style="color: #339999">{{scope.row.competingSkuUrl}}</a>
            </template>
          </el-table-column>-->
          <el-table-column prop="sellingPrice" label="建议零售价" align="center">
            <template slot-scope="scope">￥{{scope.row.sellingPrice}}</template>
          </el-table-column>
          <el-table-column prop="websitePrice" label="官网售价(含税)" align="center">
            <template slot-scope="scope">￥{{scope.row.websitePrice}}</template>
          </el-table-column>
          <!--<el-table-column
            prop="statusName"
            label="状态"
            align="center">
          </el-table-column>-->
          <el-table-column prop="statusName" label="状态" align="center">
            <template slot-scope="scope">
              {{scope.row.statusName}}
              <br />
              <!--  <el-button type="text" v-if="scope.row.updatedStatusName!=='-&#45;&#45;'" @click="gotoUpdateDetail(scope.row)">更新详情</el-button>-->
              <span
                v-if="scope.row.completionRate!=null&&isActive==2"
              >({{scope.row.completionRate}})</span>
            </template>
          </el-table-column>
          <el-table-column prop="websiteAvailableName" label="上下柜状态" align="center"></el-table-column>
          <el-table-column prop="address" label="相关信息" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="getInvoice(scope.row)"
                v-if="(isActive==0||isActive==1||isActive==5||isActive==6)&&$authorities.GoodsManageInvoiceInfo"
              >开票信息</el-button>
              <br />
              <el-button
                type="text"
                @click="getTreeData(scope.row)"
                v-if="(isActive==0||isActive==1||isActive==5||isActive==6)&&$authorities.GoodsManageNoSell&&scope.row.hasAuthority"
              >非销售区域</el-button>
            </template>
          </el-table-column>
          <!--  <el-table-column
              prop="address"
              label="相关数据" align="center">
              <template slot-scope="scope">
           &lt;!&ndash;     <el-button type="text">供应商：0</el-button>&ndash;&gt;
              </template>
          </el-table-column>-->
          <el-table-column label="操作" align="center" width="240">
            <template slot-scope="scope">
              <el-button
                @click="gotoEditer(scope.row)"
                type="text"
                size="small"
                v-if="((isActive==0||isActive==1||isActive==5)&&$authorities.GoodsManageUpdateRelevant&&scope.row.hasAuthority)||(isActive==2||isActive==4)&&$authorities.GoodsManageUpdateRelevant"
                :disabled="scope.row.oldId!=0&&isActive==4"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="gotoDetail(scope.row)"
                v-if="$authorities.GoodsManageDetailRelevant"
              >详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="gotoCopy(scope.row)"
                v-if="$authorities.GoodsManageCreateRelevant"
              >复制</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==2||isActive==4"
                v-show="$authorities.GoodsManageCreateRelevant||$authorities.GoodsManageUpdateRelevant"
                @click="deleteGoodsId(scope.row)"
              >删除</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==3&&$authorities.GoodsManageReview&&scope.row.hasAuthority"
                @click="toExamine(scope.row)"
              >审核</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==1&&$authorities.GoodsManageForbiddenRelevant&&scope.row.hasAuthority"
                @click="prohibitGoods(scope.row)"
              >禁用</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==2"
                v-show="$authorities.GoodsManageUpdateRelevant||$authorities.GoodsManageCreateRelevant"
                :disabled="scope.row.completionRate!='3/3'"
                @click="ArraignGoods(scope.row)"
              >提审</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==1&&$authorities.GoodsManageAvailableRelevant&&scope.row.hasAuthority"
                @click="enableGoods(scope.row)"
              >启用</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==0&&$authorities.GoodsManageAvailableRelevant&&scope.row.hasAuthority&&scope.row.websiteAvailableName=='下柜'"
                @click="noEnableGoods(scope.row)"
              >撤销启用</el-button>
              <el-button
                type="text"
                size="small"
                v-if="(isActive==6||isActive==0)&&scope.row.websiteAvailableName=='上柜'&&scope.row.hasAuthority"
                v-show="$authorities.GoodsManageOutOfStock"
                @click="cabinetGoods(scope.row)"
              >下柜</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==0&&scope.row.websiteAvailableName=='下柜'&&$authorities.GoodsManagePutaway&&scope.row.hasAuthority"
                @click="upperCabinetGoods(scope.row)"
              >上柜</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive==5&&$authorities.GoodsManageForbiddenRelevant"
                @click="noProhibitGoods(scope.row)"
              >撤销禁用</el-button>
              <el-button
                type="text"
                size="small"
                v-if="isActive!=2&&isActive!=3&&isActive!=4&&isActive!=5&&$authorities.GoodsManagePriceSet&&scope.row.hasAuthority"
                @click="openDia('priceSetting',scope.row)"
              >价格设置</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.oldId!=0&&$authorities.GoodsManageDetailRelevant"
                @click="oldGoodsDetail(scope.row)"
              >原数据详情</el-button>
              <el-button
                type="text"
                size="small"
                @click="cancelAudit(scope.row)"
                v-if="isActive==3&&$authorities.WithdrawReview"
              >撤回审核</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="findGoodsParam.pageNum"
          :page-size="findGoodsParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout=" total,sizes, prev, pager, next, jumper"
          :total="paginations.total"
        ></el-pagination>
      </div>
      <importBigFile
        ref="importBigFile"
        :title="'商品信息导入'"
        :type="importType"
        @callback="dialogCallback"
      ></importBigFile>
      <el-dialog title="开票信息" :visible.sync="dialogFormVisible" v-el-drag-dialog>
        <el-form :model="SkuInvoiceDTO" :rules="rules" ref="SkuInvoiceDTO" class="demo-ruleForm" label-width="160px">
          <el-form-item label="商品名称：" prop="skuName">
            <el-input v-model="SkuInvoiceDTO.skuName" autocomplete="off" disabled></el-input>
          </el-form-item>
          <el-form-item label="开票名称：" prop="nameOnInvoice">
            <el-input v-model="SkuInvoiceDTO.nameOnInvoice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="开票型号规格："  prop="modelOnInvoice">
            <el-input v-model="SkuInvoiceDTO.modelOnInvoice" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="税收分类名称："  prop="invoiceName">
            <el-select
              v-model="SkuInvoiceDTO.invoiceName"
              filterable
              remote
              reserve-keyword
              placeholder="请选择税收分类"
              :remote-method="remoteMethod"
              :loading="loading1"
              clearable
              style="width: 400px"
              @change="getDataInvoiceName"
            >
              <el-option v-for="item in options16" :key="item.id" :value="item.name"></el-option>
            </el-select>
            <el-input v-if="false" v-model="SkuInvoiceDTO.taxCodeId"></el-input>
          </el-form-item>
          <el-form-item label="税收分类编码："  prop="taxCodeId">
            <el-input v-model="SkuInvoiceDTO.taxCode" disabled></el-input>
          </el-form-item>
          <el-form-item label="税率："  prop="taxRate">
            <el-input v-model="SkuInvoiceDTO.taxRate" autocomplete="off" disabled>
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm('SkuInvoiceDTO')">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="删除提示" :visible.sync="dialogVisible" width="30%">
        <span>删除之后，列表将不再展示该条数据，确定要删除吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="isDeleteGoodsId()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="撤销启用提示" :visible.sync="dialogVisible1" width="30%">
        <span>撤销启用后，商品的采购与销售将被限制是否确定撤销启用</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible1 = false">取 消</el-button>
          <el-button type="primary" @click="isNoEnableGoods()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="撤销禁用提示" :visible.sync="dialogVisible2" width="30%">
        <span>撤销禁用后，商品将进入待启用状态是否确定撤销禁用</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible2 = false">取 消</el-button>
          <el-button type="primary" @click="isNoProhibitGoods()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="下柜提示" :visible.sync="dialogVisible3" width="30%">
        <span>下柜后，商品将从官网以及第三方平台下架是否确定下柜</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible3 = false">取 消</el-button>
          <el-button type="primary" @click="isCabinetGoods()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="上柜提示" :visible.sync="dialogVisible4" width="30%">
        <span>上柜后，商品在官网可见，是否确定上柜</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible4 = false">取 消</el-button>
          <el-button type="primary" @click="isUpperCabinetGoods()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="设置非销售区域" :visible.sync="dialogNoSaleVisible" width="700px" v-el-drag-dialog>
        <el-form :model="formTree" label-width="120px">
          <el-form-item label="商品名称:" class="listDialogBox">
            <el-input v-model="formTree.skuName" autocomplete="off" style="width: 420px"></el-input>
          </el-form-item>
          <el-form-item label="选择非销售区域:" prop="classify" class="listDialogBox clear">
            <div class="listLeftBox left">
              <div class="headerDialogBox">区域选项列表</div>
              <div>
                <el-tree
                  ref="tree"
                  :data="data2"
                  show-checkbox
                  node-key="id"
                  @check="getnode()"
                  :default-checked-keys="data3"
                  :props="defaultProps"
                ></el-tree>
              </div>
            </div>
            <div class="listRightBox left">
              <div class="headerDialogBox">已选非销售区域预览</div>
              <div>
                <el-tree
                  :data="data2"
                  ref="tree2"
                  node-key="id"
                  :filter-node-method="filterNode"
                  :props="defaultProps"
                ></el-tree>
              </div>
            </div>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogNoSaleVisible = false">取 消</el-button>
          <el-button type="primary" @click="setGoodsArea()">确 定</el-button>
        </span>
      </el-dialog>
      <el-dialog title="数据锁定提示" :visible.sync="dialogVisible6" width="30%">
        <span>用户[ {{infoMessage}} - {{infoRealName}} ]正在编辑该条数据，数据已锁定。</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible6 = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible6 = false">确 定</el-button>
        </span>
      </el-dialog>

      <el-dialog title="下柜提示" :visible.sync="dialogVisible7" width="30%">
        <span>下柜后，商品将不在官网展示，是否确定下柜？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible7 = false">取 消</el-button>
          <el-button type="primary" @click="lowerCabinet()">确 定</el-button>
        </span>
      </el-dialog>
      <div class="transferBox">
        <el-dialog
          title="目标分类设置"
          :visible.sync="dialogForm1Visible"
          @closed="clearSelect()"
          width="60%"
        >
          <el-form :model="form">
            <div class="inputBox">
              <el-form-item label=" 原分类:" :label-width="formLabelWidth">
                <el-input v-model="form.categoryName1" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-input v-model="form.categoryName2" autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-input v-model="form.categoryName3" autocomplete="off"></el-input>
              </el-form-item>
            </div>
            <div class="selectBox">
              <el-form-item label="目标分类:" :label-width="formLabelWidth">
                <el-select v-model="firmID.value1" placeholder="请选择一级分类" @change="getsecond()">
                  <el-option
                    :label="item1.name"
                    :value="item1.id"
                    v-for="(item1) in form.region1"
                    :key="item1.id"
                  >{{item1.name}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-select v-model="firmID.value2" placeholder="请选择二级分类" @change="getthree()">
                  <el-option
                    :label="item2.name"
                    :value="item2.id"
                    v-for="(item2) in form.region2"
                    :key="item2.id"
                  >{{item2.name}}</el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label-width="formLabelWidth">
                <el-select v-model="firmID.value3" placeholder="请选择三级分类">
                  <el-option
                    :label="item3.name"
                    :value="item3.id"
                    v-for="(item3) in form.region3"
                    :key="item3.id"
                  >{{item3.name}}</el-option>
                </el-select>
              </el-form-item>
            </div>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogForm1Visible = false">取 消</el-button>
            <el-button type="primary" @click="gotoTransfer()">确 定</el-button>
          </div>
        </el-dialog>
        <priceSetting ref="priceSetting"></priceSetting>
        <goodsTips ref="goodsTips" @Tipcallback="goodsTipCallback()"></goodsTips>
      </div>
    </div>
  </div>
</template>

<script>
import store from "@/store/store";
import elDragDialog from "@/directive/el-dragDialog";
import importFile from "@/components/common/module/ImportFile";
import importBigFile from "@/components/common/module/ImportBigFile";
import priceSetting from "../child/price_setting.vue";
import goodsTips from "../child/goods_tips.vue";
import {
  selectProduct,
  getSkuBasicInfo,
  deleteGoods,
  getState,
  getUsed,
  getDraft,
  getProhibit,
  getToEnable,
  getToDraft,
  getReject,
  getCounted,
  toEnable,
  prohibit,
  noEnable,
  noProhibit,
  cabinet,
  Arraign,
  upperCabinet,
  getGoodsNoArea,
  setGoodsNoArea,
  getGoodsInvoice,
  setGoodsInvoice,
  checkEditerGoodsId,
  selectGoods,
  getTransferInfo,
  getGoodsDetail,
  getTaxCode,
  findTaxCode,
  remoteBrandName,
  findClassify,
  getGoodsCheck,
  cancelGoodsAudit,
  getUsername,
  selectOrganization
} from "@/api/goodsManage";

import { downloadFile } from "@/api/fileGoods";
import { log } from 'util';
export default {
  inject: ["reload",'close'],
  brandName: "brand",
  name:'GoodsManage',
  data() {
    return {
      //模糊查詢
      searchskuNames: [],
      adminList: [],
      creatorList: [],
      organizationList: [],
      loading: false,
      loading1: false,
      //树结构
      data2: [],
      //对话框的输入框
      formTree: {
        skuName: null,
        id: null
      },
      brandId: null,
      loadingBrand: false,
      loadingClassify: false,
      importType: "goods-manage-import",
      //迁移分类的对话框
      dialogForm1Visible: false,
      //迁移分类的对话框
      form: {
        region1: "",
        region2: "",
        region3: "",
        categoryName1: "",
        categoryName2: "",
        categoryName3: ""
      },
      //选中商品的id集合
      skuIDs: [],
      //选中商品的状态所属分类集合（'>'状态）
      categoryNames: [],
      //选中商品的状态数组（拆分好的）
      categoryNames2: [],
      //选中id
      multipleSelection: [],
      //下拉框的选中值
      firmID: {
        value1: "",
        value2: "",
        value3: ""
      },
      //右侧树结构
      options10: [],
      defaultProps: {
        children: "childrenDTOs",
        label: "name"
      },
      //已选中节点
      skuArr: [],
      //是否删除的对话框
      dialogVisible: false,
      //删除商品的id
      delGoodsId: "",
      dialogVisible1: false,
      dialogVisible6: false,
      dialogVisible7: false,
      //撤销启用的id
      noEnableGoodsID: "",
      //撤销禁用的id
      noProhibitID: "",
      dialogVisible2: false,
      dialogVisible3: false,
      infoMessage: "",
      infoRealName: "",
      //下柜的id
      cabinetGoodsID: "",
      //上柜的id
      upperCabinetGoodsID: "",
      dialogVisible4: false,
      //非销售区域
      dialogNoSaleVisible: false,
      dialogFormVisible10: false,
      isShow: true,
      //分页属性
      paginations: {
        total: 0
      },
      SkuBasicInfoDTO: null,
      headers: null,
      isActive: 0,
      currentPage1: 5,
      currentPage2: 5,
      currentPage3: 5,
      currentPage4: 4,
      tableData: null,
      dialogTableVisible: false,
      dialogFormVisible: false,
      oldDetailID: "",
      options: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "PENDING_REVIEW",
          label: "待审核"
        },
        {
          value: "REJECTED",
          label: "已驳回"
        },
        {
          value: "DRAFT",
          label: "草稿"
        }
      ],
      options1: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "AVAILABLE",
          label: "已启用"
        },
        {
          value: "PENDING_REVIEW",
          label: "待审核"
        },
        {
          value: "REJECTED",
          label: "已驳回"
        },
        {
          value: "DRAFT",
          label: "草稿"
        }
      ],
      options2: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "AVAILABLE",
          label: "已启用"
        },
        {
          value: "PENDING_AVAILABLE",
          label: "待启用"
        },
        {
          value: "FORBIDDEN",
          label: "禁用"
        },
        {
          value: "DRAFT",
          label: "草稿"
        }
      ],
      options3: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "AVAILABLE",
          label: "已启用"
        },
        {
          value: "PENDING_AVAILABLE",
          label: "待启用"
        },
        {
          value: "PENDING_REVIEW",
          label: "待审核"
        },
        {
          value: "FORBIDDEN",
          label: "已禁用"
        }
      ],
      options4: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "AVAILABLE",
          label: "已启用"
        },
        {
          value: "PENDING_AVAILABLE",
          label: "待启用"
        },
        {
          value: "REJECTED",
          label: "已驳回"
        },
        {
          value: "FORBIDDEN",
          label: "禁用"
        }
      ],
      options5: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "PENDING_REVIEW",
          label: "待审核"
        },
        {
          value: "REJECTED",
          label: "已驳回"
        },
        {
          value: "DRAFT",
          label: "草稿"
        }
      ],
      options6: [
        {
          value: null,
          label: "全部"
        },
        {
          value: "PENDING_REVIEW",
          label: "待审核"
        },
        {
          value: "REJECTED",
          label: "已驳回"
        },
        {
          value: "DRAFT",
          label: "草稿"
        }
      ],
      optionsBrand: [],
      optionsClassify1: [],
      optionsClassify2: [],
      optionsClassify3: [],
      options7: [
        { value: null, label: "全部" },
        { value: true, label: "已上柜" },
        { value: false, label: "待上柜" }
      ],
      options16: [],
      data3: null,
      value4: "",
      value5: "",
      formLabelWidth: "100px",
      findGoodsParam: {
        adminId: null,
        creatorId: null,
        organizationId: null,
        brandName: this.$route.query.brandNameCN+(this.$route.query.brandNameEN ? "-"+this.$route.query.brandNameEN : ""), //品牌名称
        brandNameCN: this.$route.query.brandNameCN, //品牌名称
        brandNameEN: this.$route.query.brandNameEN, //品牌名称
        firstLevelCategoryId: null, //一级分类
        id: null, //商品id
        no:null,//商品编号`1
        brandId: null,
        secondLevelCategoryId: null, //二级分类
        // skuStatusTab: null,
        thirdLevelCategoryId: null, //三级分类
        thirdLevelCategoryIdTran:null,
        // updatedSkuStatusTab: null,//更新状态
        websiteAvailable: null, //上下柜状态
        pageSize: 10,
        pageNum: 1,
        name: "",
        taxCodeId: null, //税收分类id
        primaryAttributeValue: "", //规格
        oldErpSkuId:null,//旧系统商品编号
      },
      //开票信息
      SkuInvoiceDTO: {
        skuName: null,
        taxCodeId: null,
        nameOnInvoice: null,
        modelOnInvoice: null,
        invoiceName: null,
        //税率
        taxRate: null,
        taxCode: null
      },
      url:'',//存储之前的路劲
      //设置开票信息的参数
      SkuInvoiceParam: {
        modelOnInvoice: null,
        nameOnInvoice: null,
        taxCodeId: null
      },
      firstLevelCategoryId:null,
      secondLevelCategoryId:null,
      thirdLevelCategoryId:null,
      isTiac:false,
      taxCodeID: "",
      //开票id
      invoiceID: "",
      rules: {
        nameOnInvoice: [
          { required: true, message: "请输入开票名称", trigger: "blur" },
          { min: 1, max: 60, message: "长度在60个字以内", trigger: "blur" }
        ],
        modelOnInvoice: [
          { required: false, message: "", trigger: "change" },
          { min: 0, max: 24, message: "24个字以内", trigger: "blur" }
        ],
        skuName: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        taxCodeId: [
          { required: true, message: "请输入税收编码", trigger: "blur" }
        ],
        invoiceName: [
          { required: true, message: "请选择税收分类", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    importFile,
    importBigFile,
    priceSetting,
    goodsTips
  },
  directives: {
    elDragDialog
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  created() {
    this.url=window.location.href.split('?')[1]
    this.$route.query.status == undefined?this.isActive = 0 :this.isActive = this.$route.query.status;
    this.brandId=this.$route.query.idBrand;
    this.findGoodsParam.brandId=this.$route.query.idBrand;
    this.findGoodsParam.firstLevelCategoryId = this.$route.query.id1;
    this.firstLevelCategoryId = this.$route.query.id1;
    this.findGoodsParam.secondLevelCategoryId = this.$route.query.id2;
    this.secondLevelCategoryId = this.$route.query.id2;
    this.findGoodsParam.thirdLevelCategoryId = this.$route.query.id3;
    this.thirdLevelCategoryId = this.$route.query.id3;
    this.findGoodsParam.taxCodeId = this.$route.query.taxId;
    //获取tab页的状态
    // this.getData();
    if(this.findGoodsParam.brandId){
      this.optionsBrand=[{id:this.findGoodsParam.brandId,brandName:this.findGoodsParam.brandName}]
    }else{
      this.optionsBrand = [];
      this.findGoodsParam.brandName = "";
    }
    //获取表格数据
    this.changeTab(this.isActive)
  },
  activated(){
      this.$route.query.status === undefined?undefined:this.isActive = this.$route.query.status;
      if(this.url!=window.location.href.split('?')[1]){
        this.url=window.location.href.split('?')[1];
        this.brandId=this.$route.query.idBrand;
        this.findGoodsParam.brandId=this.$route.query.idBrand;
        this.findGoodsParam.firstLevelCategoryId = this.$route.query.id1;
        this.firstLevelCategoryId = this.$route.query.id1;
        this.findGoodsParam.secondLevelCategoryId = this.$route.query.id2;
        this.secondLevelCategoryId = this.$route.query.id2;
        this.findGoodsParam.thirdLevelCategoryId = this.$route.query.id3;
        this.thirdLevelCategoryId = this.$route.query.id3;
        this.findGoodsParam.taxCodeId = this.$route.query.taxId;
        this.changePage()
        this.optionsBrand=[{id:this.findGoodsParam.brandId,brandName:this.findGoodsParam.brandName}]
        //获取表格数据
        this.changeTab(this.isActive)
      }else if(this.$route.params.isUpdate){ 
        this.changeTab(this.isActive)
      }
         
  },
  mounted() {
    console.log(this.$route.query,5555555)
  },
  watch: {
    defaultProps(a, b) {
      console.log(a);
    }
  },
  methods: {
    formName(val){
      return val.name.replace(/\s/g,"\u00a0")
    },
    changePage(){
     if(this.$route.query.idBrand){
        this.findGoodsParam.organizationId = null;
        this.findGoodsParam.adminId = null;
        this.findGoodsParam.creatorId = null;
        this.findGoodsParam.id = null; //商品id
        this.findGoodsParam.no =null;//商品编号
        this.firstLevelCategoryId = null;
        this.secondLevelCategoryId = null;
        this.thirdLevelCategoryId = null;
        this.findGoodsParam.firstLevelCategoryId = null ; //一级分类
        this.findGoodsParam.secondLevelCategoryId = null; //二级分类
        this.findGoodsParam.thirdLevelCategoryId = null ; //三级分类
        this.findGoodsParam.brandName = null; //品牌名称
        this.findGoodsParam.websiteAvailable = null; //上下柜状态
        this.findGoodsParam.pageSize = 10;
        this.findGoodsParam.pageNum = 1;
        this.findGoodsParam.name = null;
        this.findGoodsParam.taxCodeId = null; //税收分类id
        this.findGoodsParam.primaryAttributeValue = null; //规格
        this.findGoodsParam.taxCodeId=null;
        this.findGoodsParam.oldErpSkuId=null;
        }
        if(this.$route.query.id1){
        this.findGoodsParam.organizationId = null;
        this.findGoodsParam.adminId = null;
        this.findGoodsParam.creatorId = null;
        this.findGoodsParam.id = null; //商品id
        this.findGoodsParam.no =null;//商品编号
        this.findGoodsParam.brandId = null;
        this.brandId = null;
        this.firstLevelCategoryId = null;
        this.secondLevelCategoryId = null;
        this.thirdLevelCategoryId = null;
        // this.findGoodsParam.firstLevelCategoryId = null ; //一级分类
        this.optionsClassify1=[{id:this.$route.query.id1,name:this.$route.query.name1}]
        this.findGoodsParam.secondLevelCategoryId = null; //二级分类
        this.findGoodsParam.thirdLevelCategoryId = null ; //三级分类
        this.findGoodsParam.brandName = null; //品牌名称 
        this.findGoodsParam.websiteAvailable = null; //上下柜状态
        this.findGoodsParam.pageSize = 10;
        this.findGoodsParam.pageNum = 1;
        this.findGoodsParam.name = null;
        this.findGoodsParam.taxCodeId = null; //税收分类id
        this.findGoodsParam.primaryAttributeValue = null; //规格
        this.findGoodsParam.taxCodeId=null;
        this.findGoodsParam.oldErpSkuId=null; 
        }
        if(this.$route.query.id2){
        this.findGoodsParam.organizationId = null;
        this.findGoodsParam.adminId = null;
        this.findGoodsParam.creatorId = null;
        this.findGoodsParam.id = null; //商品id
        this.findGoodsParam.no =null;//商品编号
        this.findGoodsParam.brandId = null;
        this.brandId = null;
        this.firstLevelCategoryId = null;
        this.secondLevelCategoryId = null;
        this.thirdLevelCategoryId = null;
        this.optionsClassify2=[{id:this.$route.query.id2,name:this.$route.query.name2}]
        this.findGoodsParam.firstLevelCategoryId = null ; //一级分类
        // this.findGoodsParam.secondLevelCategoryId = null; //二级分类
        this.findGoodsParam.thirdLevelCategoryId = null ; //三级分类
        this.findGoodsParam.brandName = null; //品牌名称
        this.findGoodsParam.websiteAvailable = null; //上下柜状态
        this.findGoodsParam.pageSize = 10;
        this.findGoodsParam.pageNum = 1;
        this.findGoodsParam.name = null;
        this.findGoodsParam.taxCodeId = null; //税收分类id
        this.findGoodsParam.primaryAttributeValue = null; //规格
        this.findGoodsParam.taxCodeId=null;
        this.findGoodsParam.oldErpSkuId=null;  
        }
        if(this.$route.query.id3){
        this.findGoodsParam.organizationId = null;
        this.findGoodsParam.adminId = null;
        this.findGoodsParam.creatorId = null;
        this.findGoodsParam.id = null; //商品id
        this.findGoodsParam.no =null;//商品编号
        this.findGoodsParam.brandId = null;
        this.brandId = null;
        this.firstLevelCategoryId = null;
        this.secondLevelCategoryId = null;
        this.thirdLevelCategoryId = null;
        this.findGoodsParam.firstLevelCategoryId = null ; //一级分类
        this.findGoodsParam.secondLevelCategoryId = null; //二级分类
        // this.findGoodsParam.thirdLevelCategoryId = null ; //三级分类
        this.optionsClassify3=[{id:this.$route.query.id3,name:this.$route.query.name3}]
        this.findGoodsParam.brandName = null; //品牌名称
        this.findGoodsParam.websiteAvailable = null; //上下柜状态
        this.findGoodsParam.pageSize = 10;
        this.findGoodsParam.pageNum = 1;
        this.findGoodsParam.name = null;
        this.findGoodsParam.taxCodeId = null; //税收分类id
        this.findGoodsParam.primaryAttributeValue = null; //规格
        this.findGoodsParam.taxCodeId=null;
        this.findGoodsParam.oldErpSkuId=null; 
        }
    },
    reset() {
        this.findGoodsParam.organizationId = null;
        this.findGoodsParam.adminId = null;
        this.findGoodsParam.creatorId = null;
        this.isTiac=true
        this.findGoodsParam.id = null; //商品id
        this.findGoodsParam.no =null;//商品编号
        this.findGoodsParam.brandId = null;
        this.brandId = null;
        this.firstLevelCategoryId = null;
        this.secondLevelCategoryId = null;
        this.thirdLevelCategoryId = null;
        this.findGoodsParam.firstLevelCategoryId = null ; //一级分类
        this.findGoodsParam.secondLevelCategoryId = null; //二级分类
        this.findGoodsParam.thirdLevelCategoryId = null ; //三级分类
        this.findGoodsParam.brandName = null; //品牌名称
        this.findGoodsParam.websiteAvailable = null; //上下柜状态
        this.findGoodsParam.pageSize = 10;
        this.findGoodsParam.pageNum = 1;
        this.findGoodsParam.name = null;
        this.findGoodsParam.taxCodeId = null; //税收分类id
        this.findGoodsParam.primaryAttributeValue = null; //规格
        this.findGoodsParam.taxCodeId=null;
        this.findGoodsParam.oldErpSkuId=null;
        this.change(this.isActive);
    },

    querySelect(query, type, list) {
      if (query!== '') {
        this.loading = true;
        if (type == 'getAdmin') {
          getUsername({ count: 5, userName: query }).then(res => {
            this.adminList = res.data;
            this.loading = false;
         });
        }
        if (type == 'getCreator') {
          getUsername({ count: 5, userName: query }).then(res => {
            this.creatorList = res.data;
            this.loading = false;
        });
        }
        if (type == 'getOrganization') {
          selectOrganization({name: query}).then(res => {
            this.organizationList = res.data;
            this.loading = false;
        });
        }
      } else {
        this[type] = []
      }
    },
    //商品名称模糊查询
    skuNameMethod(query) {
      if (query != "") {
        selectProduct({ name: query })
          .then(res => {
            if (res.code === "000000") {
              this.searchskuNames = [{skuName:query,value:query},...res.data];
            }
          })
          .catch(err => {});
      } else {
        this.searchskuNames = [];
      }
    },
    cancelAudit(row){
     this.$confirm("是否要撤回审核？", "撤回审核确认", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(res=>{
       cancelGoodsAudit(row.id,row.status).then(res=>{
       if(res.success){
         this.$message({
           message:'撤回审核成功',
           type:'success'
         })
         this.changeTab(this.isActive)
       }else{
         this.$confirm(`${res.message}`,'提示',{
           confirmButtonText:'确定',
           type:'warning'
         }).then(()=>{
           this.changeTab(this.isActive)          
         }).catch(()=>{})
       }
     })
      }).catch(()=>{})
    },
    openDia(type, row, data) {
      this.$refs[type].init(row, data);
    },
    oldGoodsDetail(row) {
      this.oldDetailID = row.oldId;
      this.$router.push({name:'GoodsDetail',query:{oldDetailID:this.oldDetailID}})
    },
    //跳转编辑页
    gotoEditer(row) {
      if(this.isActive==2){
        this.$router.push({name:'EditerGoods',query:{editerID:row.id,completionRate:row.completionRate,isActive:this.isActive,oldId:row.oldId}})
      }else{
       checkEditerGoodsId(row.id).then(res => { 
        if (res.data) {
          this.infoMessage = res.data.userName;
          this.infoRealName = res.data.realName;
          this.dialogVisible6 = true;
          this.change(this.isActive);
        } else {
          this.$router.push({name:"EditerGoods",query:{editerID:row.id,completionRate: row.completionRate,isActive: this.isActive,oldId:row.oldId}})
        }
      });
      } 
    },
    //点击查询结果获取列表
    queryData() {
      this.findGoodsParam.pageNum = 1;
      this.change(this.isActive);
    },
    //获取tab页的状态
    getData() {
      getState().then(res => {
        console.log(res.data);
        this.headers = res.data;
      });
    },
    remoteMethodBrand(query) {
      if (query !== "") {
        this.loadingBrand = true;
        let aa = { name: query };
        remoteBrandName(aa).then(res => {
          if (res.code == "000000") {
            this.optionsBrand = res.data.map(item=>{
              if(item.nameEN){
              return {id:item.id,brandName:item.nameCN+'-'+item.nameEN}               
              }else{
                return {id:item.id,brandName:item.nameCN} 
              }
            });
            console.log(this.optionsBrand,88888)
            this.loadingBrand = false;
          }
        });
      } else {
        this.optionsBrand = [];
      }
    },
    remoteMethodClassify1(query) {
      if (query !== "") {
        this.loadingClassify = true;
        // let aa={name:query}
        findClassify(1, 0, query).then(res => {
          if (res.code == "000000") {
            this.optionsClassify1 = res.data;
            this.loadingClassify = false;
          }
        });
      } else {
        this.optionsClassify1 = [];
      }
    },
    remoteMethodClassify2(query) {
      if (query !== "") {
        this.loadingClassify = true;
        if (this.findGoodsParam.firstLevelCategoryId) {
          findClassify(2, this.findGoodsParam.firstLevelCategoryId, query).then(
            res => {
              if (res.code == "000000") {
                this.optionsClassify2 = res.data;
                this.loadingClassify = false;
              }
            }
          );
        } else {
          findClassify(2, 0, query).then(res => {
            if (res.code == "000000") {
              this.optionsClassify2 = res.data;
              this.loadingClassify = false;
            }
          });
        }
      } else {
        this.optionsClassify2 = [];
      }
    },
    remoteMethodClassify3(query) {
      if (query !== "") {
        this.loadingClassify = true;
        if (this.findGoodsParam.secondLevelCategoryId) {
          findClassify(
            3,
            this.findGoodsParam.secondLevelCategoryId,
            query
          ).then(res => {
            if (res.code == "000000") {
              this.optionsClassify3 = res.data;
              this.loadingClassify = false;
            }
          });
        } else {
          findClassify(3, 0, query).then(res => {
            if (res.code == "000000") {
              this.optionsClassify3 = res.data;
              this.loadingClassify = false;
            }
          });
        }
      } else {
        this.optionsClassify3 = [];
      }
    },
    //获取表格数据
    getTableData() {
      getUsed(this.findGoodsParam).then(res => {
        console.log(res.data);
        this.SkuBasicInfoDTO = res.data.items;
        this.findGoodsParam.pageNum = res.data.pageNum;
        this.findGoodsParam.pageSize = res.data.pageSize;
        this.paginations.total = res.data.total;
      });
    },
    dialogCallback(type) {},
    //获取树结构
    getTreeData(row) {
      this.formTree.id = row.id;
      this.formTree.skuName = row.name;
      getGoodsNoArea(row.id).then(res => {
        console.log(res.data.regionTreeBasedIdDTOs);
        this.data2 = res.data.regionTreeBasedIdDTOs;
        this.data3 = res.data.regionIds;
        this.$refs.tree2.filter(this.data3);
        this.$nextTick(() => {
          this.getnode();
        });
      });
      this.dialogNoSaleVisible = true;
    },
    //设置非销售区域
    setGoodsArea() {
      setGoodsNoArea(this.formTree.id, this.skuArr).then(res => {
        console.log(res.data, 44444);
        if (res.code == "000000") {
          this.$message({
            message: "设置非销售区域成功",
            type: "success"
          });
          this.dialogNoSaleVisible = false;
        }
      });
    },
    //获取开票信息
    getInvoice(row) {
      this.invoiceID = row.id;
      //this.dialogFormVisible=true;
      var that = this;
      getGoodsInvoice(row.id)
        .then(res => {
          console.log(res.data);
          that.SkuInvoiceDTO = res.data;
          that.taxCodeID = res.data.taxCodeId;
        })
        .then(res => {
          if (that.taxCodeID != null) {
            getTaxCode(that.taxCodeID).then(res => {
              that.SkuInvoiceDTO.invoiceName = res.data.name;
              that.SkuInvoiceDTO.taxRate = res.data.taxRate;
              console.log(that.SkuInvoiceDTO.taxRate, 444444);
              that.SkuInvoiceDTO.taxCode = res.data.code;
              console.log(that.SkuInvoiceDTO.taxCode, 88888);
              that.SkuInvoiceDTO.taxCodeId = res.data.id;
              that.dialogFormVisible = true;
            });
          } else {
            that.dialogFormVisible = true;
          }
        });
    },
    //税收分类的远程搜索
    remoteMethod(query) {
      if (query !== "") {
        this.loading1 = true;
        findTaxCode(query).then(res => {
          if (res.code == "000000") {
            this.options16 = res.data;
            this.loading1 = false;
          }
        });
      } else {
        this.options16 = [];
      }
    },
    //选中值发生变化时触发事件
    getDataInvoiceName(ee) {
      this.options16 = this.options16.filter(item => {
        return item.name == this.SkuInvoiceDTO.invoiceName;
      });
      this.taxCodeID = this.options16[0] && this.options16[0].id;
      this.SkuInvoiceDTO.invoiceName =
        this.options16[0] && this.options16[0].name;
      this.SkuInvoiceDTO.taxRate =
        this.options16[0] && this.options16[0].taxRate;
      this.SkuInvoiceDTO.taxCode = this.options16[0] && this.options16[0].code;
      this.SkuInvoiceDTO.taxCodeId = this.options16[0] && this.options16[0].id;
    },
    submitForm(formName) {
      console.log(this.$refs[formName], 666666666);
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.SkuInvoiceParam.modelOnInvoice = this.SkuInvoiceDTO.modelOnInvoice;
          this.SkuInvoiceParam.nameOnInvoice = this.SkuInvoiceDTO.nameOnInvoice;
          this.SkuInvoiceParam.taxCodeId = this.SkuInvoiceDTO.taxCodeId;
          setGoodsInvoice(this.invoiceID, this.SkuInvoiceParam).then(res => {
            console.log(res.data);
            if (res.data == "1") {
              this.$message({
                message: "设置开票信息成功",
                type: "success"
              });
              this.dialogFormVisible = false;
            } else if (res.data == "0") {
              this.$message({
                message: "设置开票信息失败",
                type: "warning"
              });
              this.dialogFormVisible = false;
            }
          });
        }
      });
    },
    //切换tab
    changeTab(index,type) {
      // this.findGoodsParam.id = "";
      // this.findGoodsParam.no = null;
      // this.findGoodsParam.brandName = "";
      // if(this.isTiac){
      // this.findGoodsParam.firstLevelCategoryId = null;
      // this.findGoodsParam.secondLevelCategoryId = null;
      // this.findGoodsParam.thirdLevelCategoryId = null;
      // }else{
      // this.findGoodsParam.firstLevelCategoryId = this.$route.query.id1||null;
      // this.findGoodsParam.secondLevelCategoryId = this.$route.query.id2||null;
      // this.findGoodsParam.thirdLevelCategoryId = this.$route.query.id3||null;
      // }   
      // this.findGoodsParam.updatedSkuStatusTab = "";
      // this.findGoodsParam.websiteAvailable = "";
      // this.findGoodsParam.primaryAttributeValue = "";
      // this.findGoodsParam.taxCodeId = "";
      // this.findGoodsParam.pageNum = 1;
      if(type=='tab'){
        this.findGoodsParam.pageNum = 1;
      }
      this.isActive = index;
      this.getData();
      this.change(index);
    },
    //点击按钮获取列表
    change(index) {
      //已启用
      if (index == 0) {
        getUsed(this.findGoodsParam).then(res => {
          console.log(res.data.items);
          this.SkuBasicInfoDTO = res.data.items;
          this.findGoodsParam.pageNum = res.data.pageNum;
          this.findGoodsParam.pageSize = res.data.pageSize;
          this.paginations.total = res.data.total;
        });
      }
      //待启用
      if (index == 1) {
        getToEnable(this.findGoodsParam).then(res => {
          console.log(res.data.items);
          console.log(res.data);
          this.SkuBasicInfoDTO = res.data.items;
          this.findGoodsParam.pageNum = res.data.pageNum;
          this.findGoodsParam.pageSize = res.data.pageSize;
          this.paginations.total = res.data.total;
        });
      }
      //草稿
      if (index == 2) {
        this.findGoodsParam.organizationId=null;
        this.findGoodsParam.creatorId=null;
        getDraft(this.findGoodsParam).then(res => {
          console.log(res.data.items);
          this.SkuBasicInfoDTO = res.data.items;
          this.findGoodsParam.pageNum = res.data.pageNum;
          this.findGoodsParam.pageSize = res.data.pageSize;
          this.paginations.total = res.data.total;
        });
      }
      //待审核
      if (index == 3) {
        getToDraft(this.findGoodsParam).then(res => {
          console.log(res.data.items);
          this.SkuBasicInfoDTO = res.data.items;
          this.findGoodsParam.pageNum = res.data.pageNum;
          this.findGoodsParam.pageSize = res.data.pageSize;
          this.paginations.total = res.data.total;
        });
      }
      //已驳回
      if (index == 4) {
        this.findGoodsParam.organizationId=null;
        this.findGoodsParam.creatorId=null;
        getReject(this.findGoodsParam).then(res => {
          console.log(res.data.items);
          this.SkuBasicInfoDTO = res.data.items;
          this.findGoodsParam.pageNum = res.data.pageNum;
          this.findGoodsParam.pageSize = res.data.pageSize;
          this.paginations.total = res.data.total;
        });
      }
      //禁用
      if (index == 5) {
        getProhibit(this.findGoodsParam).then(res => {
          console.log(res.data.items);
          this.SkuBasicInfoDTO = res.data.items;
          this.findGoodsParam.pageNum = res.data.pageNum;
          this.findGoodsParam.pageSize = res.data.pageSize;
          this.paginations.total = res.data.total;
        });
      }
      //已上柜
      if (index == 6) {
        getCounted(this.findGoodsParam).then(res => {
          console.log(res.data.items);
          this.SkuBasicInfoDTO = res.data.items;
          this.findGoodsParam.pageNum = res.data.pageNum;
          this.findGoodsParam.pageSize = res.data.pageSize;
          this.paginations.total = res.data.total;
        });
      }
    },
    //删除操作
    deleteGoodsId(row) {
      this.delGoodsId = row.id;
      this.dialogVisible = true;
    },
    //确定删除
    isDeleteGoodsId() {
      deleteGoods(this.delGoodsId).then(res => {
        console.log(res.data);
        if (res.data == "1") {
          this.$message({
            message: "删除成功",
            showClose: true,
            type: "success"
          });
          this.changeTab(this.isActive)
          this.dialogVisible = false;
        } else if (res.data == "0") {
          this.$message({
            message: "删除失败",
            type: "warning"
          });
          this.dialogVisible = false;
        }
      });
     
    },
    //启用商品
    enableGoods(row) {
      toEnable(row.id).then(res => {
        if(res.success){
         this.$message({
          message: "启用成功",
          type: "success"
        });
        this.changeTab(this.isActive)
        }else{
          this.$confirm(res.message, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.changeTab(this.isActive)
            })
            .catch(() => {});
        }
        
      });
    },
    //禁用
    prohibitGoods(row) {
      prohibit(row.id).then(res => {
        if(res.success){
         this.$message({
          message: "禁用成功",
          type: "success"
        });
        this.changeTab(this.isActive)
        }else{
         this.$confirm(res.message, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.changeTab(this.isActive)
            })
            .catch(() => {});
        }   
      });
    },

    //撤销启用
    noEnableGoods(row) {
      this.noEnableGoodsID = row.id;
      this.dialogVisible1 = true;
    },
    //是否撤销启用
    isNoEnableGoods() {
      noEnable(this.noEnableGoodsID).then(res => {
        if(res.success){
          this.$message({
            message: "撤销启用成功",
            type: "success"
          });
          this.dialogVisible1=false;
          this.changeTab(this.isActive)
        }else{
          this.dialogVisible1=false;
          this.$confirm(res.message, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.changeTab(this.isActive)
            })
            .catch(() => {});
        }
      });
    },
    //撤销禁用
    noProhibitGoods(row) {
      this.noProhibitID = row.id;
      this.dialogVisible2 = true;
    },
    //是否撤销禁用
    isNoProhibitGoods() {
      noProhibit(this.noProhibitID).then(res => {
        if(res.success){
          this.$message({
            message: "撤销禁用成功",
            type: "success"
          });
          this.dialogVisible2 = false;
          this.changeTab(this.isActive)
        }else{
          this.dialogVisible2 = false;
          this.$confirm(res.message, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.changeTab(this.isActive);
            })
            .catch(() => {});
        }
      });
    },
    //下柜
    cabinetGoods(row) {
      cabinet(row.id).then(res=>{
        if (res.data.length !== 0) {
          this.openDia("goodsTips", row, res.data);
        } else {
          // this.dialogVisible7 = true; 
          this.$message({
            message: "下柜成功",
            type: "success"
          });
          this.changeTab(this.isActive)  
        }
        
        // if(res.success){
        //   this.$message({
        //       message: "下柜成功",
        //       type: "success"
        //     });
        //     this.changeTab(this.isActive) 
        // }else{
        //   this.openDia("goodsTips", row, res.data);
        // }
      })
      // this.openDia("goodsTips", row, res.data);
    },
     lowerCabinet() {},
     goodsTipCallback(){
      // cabinet(row.id).then(res => {
      //   if (res.success) {   
      //       this.$message({
      //         message: "下柜成功",
      //         type: "success"
      //       });
      //       this.changeTab(this.isActive)     
      //   } else {
      //     this.$confirm(res.message, "提示", {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning"
      //     })
      //       .then(() => {
      //         this.changeTab(this.isActive)
      //       })
      //       .catch(() => {});
      //   }
      // });
      this.changeTab(this.isActive)
     },
    //是否下柜
    isCabinetGoods() {
      cabinet(this.cabinetGoodsID).then(res => {
        if (res.data == "1") {
          this.$message({
            message: "下柜成功",
            type: "success"
          });
          this.dialogVisible3 = false;
          this.changeTab(this.isActive) 
        } else if (res.data == "0") {
          this.$message({
            message: "下柜失败",
            type: "warning"
          });
          this.dialogVisible3 = false;
        }
      });
    },
    //提审
    ArraignGoods(row) {
      Arraign(row.id).then(res => {
        this.$message({
          message: "提审成功",
          type: "success"
        });
        this.changeTab(this.isActive)
      });
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    //上柜
    upperCabinetGoods(row) {
      this.upperCabinetGoodsID = row.id;
      this.dialogVisible4 = true;
    },
    //是否上柜
    isUpperCabinetGoods() {
      this.dialogVisible4 = false;
      upperCabinet(this.upperCabinetGoodsID).then(res => {
        if (res.success) {
          if (res.data == "1") {
            this.$message({
              message: "上柜成功",
              type: "success"
            });
            this.changeTab(this.isActive)
          } else if (res.data == "0") {
            this.$message({
              message: "上柜失败",
              type: "warning"
            });
          }
        } else {
          this.$confirm(res.message, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.changeTab(this.isActive)
            })
            .catch(() => {});
        }
      });
    },
    //审核
    toExamine(row) {
      getGoodsCheck(row.id).then(res=>{
        if(res.data==1){
        //  const { href } = this.$router.resolve({
        // name: "GoodsAuditer",
        // query: {
        //   auditerId: row.id
        // }
        // });
        // window.open(href, "_blank");
        this.$router.push({name:"GoodsAuditer",query:{auditerId:row.id}})
        }else{
          this.$confirm('商品状态变更，请刷新列表重试', "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.changeTab(this.isActive)
            })
            .catch(() => {});
        }
      })
      
    },
    //跳转详情页
    gotoDetail(row) {
      this.$router.push({name:'GoodsDetail',query:{id:row.id}})
    },
    //导入记录
    importdetail() {
      // const { href } = this.$router.resolve({
      //   name: "SysImportRecord",
      //   query: { type: "goods-import-list" }
      // });
      // window.open(href, "_blank");
      this.$router.push({name:'SysImportRecord',query:{type: "goods-import-list"}})
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.findGoodsParam.pageSize = val;
      this.change(this.isActive);
      this.getData()
    },
    handleCurrentChange(val) {
      this.findGoodsParam.pageNum = val;
      this.change(this.isActive);
      this.getData()
    },
    //显示隐藏
    showHelp() {
      this.isShow = !this.isShow;
    },
    //调转详情
    //添加
    addGoods() {
      // const { href } = this.$router.resolve({
      //   name: "AddGoods"
      // });
      // window.open(href, "_blank");
      this.$router.push({name:'AddGoods'})
    },
    getnode() {
      this.skuArr = this.$refs.tree.getCheckedKeys(true);
      this.$refs.tree2.filter(this.skuArr);
    },
    filterNode(value, data) {
      if (!value) return true;
      return value.includes(data.id);
    },
    //点击复制跳转复制页面
    gotoCopy(row) {
      // const { href } = this.$router.resolve({
      //   name: "copyGoods",
      //   query: {
      //     copyID: row.id
      //   }
      // });
      // window.open(href, "_blank");
      this.$router.push({name:'copyGoods',query:{copyID:row.id}})
    },
    //迁移
    transfer() {
      this.skuIDs = this.multipleSelection.map((item, index) => {
        return item.id;
      });
      this.multipleSelection.forEach(item => {
        this.categoryNames.push(item.categoryName);
      });
      this.categoryNames = new Set(this.categoryNames);
      this.categoryNames = Array.from(this.categoryNames);
      this.categoryNames2 = this.categoryNames;
      this.categoryNames2 = this.categoryNames2.toString();
      this.categoryNames2 = this.categoryNames2.split(">");
      if (this.categoryNames.length == 1) {
        this.dialogForm1Visible = true;
        let aaa = this.skuIDs;
        aaa = { skuIds: aaa };
        getTransferInfo(aaa).then(res => {
          this.thirdLevelCategoryIdTran = res.data.thirdLevelCategoryId;
        });
        for (let i = 0; i < this.categoryNames2.length; i++) {
          this.form.categoryName1 = this.categoryNames2[0];
          this.form.categoryName2 = this.categoryNames2[1];
          this.form.categoryName3 = this.categoryNames2[2];
        }
        selectGoods(1, 0).then(res => {
          this.form.region1 = res.data;
        });
        this.categoryNames = [];
      } else {
        this.$confirm(
          "迁移商品三级分类不一致",
          "请选择同一三级分类下的商品进行迁移",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
            center: true
          }
        );
        this.categoryNames = [];
        this.skuIDs = [];
      }
    },
    //获取二级全部分类
    getsecond() {
      selectGoods(2, this.firmID.value1).then(res => {
        this.form.region2 = res.data;
        this.firmID.value2 = "";
        this.firmID.value3 = "";
      });
    },
    //获取三级全部分类
    getthree() {
      selectGoods(3, this.firmID.value2).then(res => {
        this.form.region3 = res.data;
        this.firmID.value3 = "";
      });
    },
    //当选择框发生变化时的事件
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //对话框关闭的时候清除下拉框和input的值
    clearSelect() {
      this.form.categoryName1 = "";
      this.form.categoryName2 = "";
      this.form.categoryName3 = "";
      this.firmID.value1 = "";
      this.firmID.value2 = "";
      this.firmID.value3 = "";
    },
    //调转到迁移页面
    gotoTransfer() {
      if (
        this.firmID.value1 != "" &&
        this.firmID.value2 != "" &&
        (this.firmID.value3 != "") & (this.form.categoryName1 != "") &&
        this.form.categoryName2 != "" &&
        this.form.categoryName2 != ""
      ) {
        // const { href } = this.$router.resolve({
        //   name: "goodsTransfer",
        //   query: {
        //     thirdLevelCategoryId: this.thirdLevelCategoryId,
        //     destinationCategoryId: this.firmID.value3,
        //     skuIDs: this.skuIDs.join(",")
        //   }
        // });
        // window.open(href);
        this.$router.push({name:'goodsTransfer',query:{thirdLevelCategoryId: this.thirdLevelCategoryIdTran,destinationCategoryId: this.firmID.value3,skuIDs: this.skuIDs.join(",")}})
        this.dialogForm1Visible=false;
      } else {
        this.$confirm("未输入目标分类，或者输入不完善",{
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          }
        );
      }
    }
  }
};
</script>
<style scoped>
.goodsBox >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>
<style scoped lang="less">
.goodsBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
    }
  }
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
    clear: both;
    border: 1px solid #e4e4e4;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #e4e4e4;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
      color: #303133;
    }
    .rightBox {
      float: right;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 5px 0 5px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      .inputBox {
        float: left;
        margin: 5px 10px;
      }
      .el-input {
        width: 180px;
        margin-left: 10px;
      }
      .el-select {
        width: 180px;
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    // line-height: 50px;
    .listBoxTop {
      line-height: 50px;
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      height: 50px;
      .white-btn {
        margin-top: 10px;
        margin-right: 10px;
      }
    }
    box-sizing: border-box;
    .listLeftBox {
      position: relative;
      overflow: auto;
      background-color: #ffffff;
      border: 1px solid #e5e5e5;
      margin-right: 20px;
      width: 200px;
      height: 300px;
      .headerDialogBox {
        width: 200px;
        height: 35px;
        position: absolute;
        z-index: 1111;
        top: 0;
        left: 0;
        border: 1px solid #e4e4e4;
        text-align: center;
        color: red;
        line-height: 36px;
      }
    }
    .listRightBox {
      border: 1px solid #e5e5e5;
      height: 300px;
      width: 200px;
      overflow: auto;
      position: relative;
      .headerDialogBox {
        height: 35px;
        position: absolute;
        top: 0;
        width: 200px;
        left: 0;
        text-align: center;
        border: 1px solid #e4e4e4;
        z-index: 1111;
        color: red;
        line-height: 36px;
      }
    }
  }
  .el-table {
    margin-top: -2px;
    .el-button {
      font-size: 12px;
    }
  }
  .block {
    margin-top: 5px;
    float: right;
  }
}
</style>
<style lang="less" scoped>
.goodsBox {
  .listBox {
    .el-dialog__header {
      padding: 10px;
      padding-bottom: 0;
      background: #e4e4e4;
    }
    .el-dialog__body {
      font-size: 16px;
    }
    .el-tree {
      margin-top: 40px;
    }

    tree__empty-text {
      position: absolute;
      left: 50%;
      top: 60px;
      -webkit-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      color: #696f4d;
    }
    .el-form {
      .el-form-item {
        .el-input {
          width: 400px;
        }
         margin-bottom: 20px;
        .avatar-uploader .el-upload {
          border: 1px dashed #d9d9d9;
          border-radius: 6px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #339999;
        }
        .avatar-uploader-icon {
          font-size: 28px;
          color: #8c939d;
          width: 120px;
          height: 120px;
          line-height: 120px;
          text-align: center;
        }
        .avatar {
          width: 120px;
          height: 120px;
          display: block;
        }
        .el-textarea {
          width: 400px;
        }
        .el-form-item__error {
          color: #f56c6c;
          font-size: 12px;
          line-height: 1;
          padding-top: 4px;
          // position: absolute;
          // top: 12px;
          // left: 450px;
        }
        .textBox {
          width: 400px;
        }
      }
    }
    .transferBox {
      .el-form {
        .el-form-item {
          .el-input,.el-select{
            width: 100%;
          }
        }
      }
      .inputBox {
        width: 100%;
        display: flex;
        .el-form-item {
          justify-content: flex-start;
          width:33%;
        }
      }
      .selectBox {
        // width: 100%;
        display: flex;
        .el-form-item {
          justify-content: flex-start;
          width:33%;
        }
      }
    }
  }
}
</style>


















