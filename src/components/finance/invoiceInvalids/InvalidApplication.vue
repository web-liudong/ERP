<template>
  <div class="demandBox">
    <div class="buttonBox">
      <el-button
        type="small"
        :class="{active: isActive == 5}"
        @click="changeTab(5)"
      >全部（{{this.tabLIst.count}}）</el-button>
      <el-button
        type="small"
        :class="{active: isActive == 0}"
        @click="changeTab(0)"
      >待审核（{{this.tabLIst.underApprovalCount}}）</el-button>
      <el-button
        type="small"
        :class="{active: isActive == 1}"
        @click="changeTab(1)"
      >待作废（{{this.tabLIst.remainInvoiceCount}}）</el-button>
      <el-button
        type="small"
        :class="{active: isActive == 2}"
        @click="changeTab(2)"
      >已驳回（{{this.tabLIst.rejectedCount}}）</el-button>
      <!-- <el-button
        type="small"
        :class="{active: isActive == 3}"
        @click="changeTab(3)"
      >作废中（{{this.tabLIst.invalidingCount}}）</el-button> -->
      <el-button
        type="small"
        :class="{active: isActive == 4}"
        @click="changeTab(4)"
      >已作废（{{this.tabLIst.invalidCount}}）</el-button>

      <el-button
        type="small"
        :class="{active: isActive == 6}"
        @click="changeTab(6)"
      >作废失败（{{this.tabLIst.invalidFailedCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>
          筛选查询
        </span>
        <div class="rightBox">
          <span @click="isShow = !isShow" style="cursor: pointer">
            <i class="el-icon-arrow-up" v-if="isShow"></i>
            <i class="el-icon-arrow-down" v-if="!isShow"></i>
            {{isShow? '收起':'展开'}}筛选
          </span>
          <el-button size="small" @click="getInquire()">查询结果</el-button>
          <el-button size="small" @click="Empty()">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBottomBox" v-if="isShow">
          <div class="inputBox">
            <span>提交时间：</span>
            <el-date-picker
              v-model="dataTime"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectPicker"
            ></el-date-picker>
          </div>
          <div class="inputBox">
            <span>客户名称：</span>
            <el-select
              v-model="tetrunData.customerName"
              remote
              filterable
              clearable
              placeholder="请输入客户名称"
              :remote-method="(query) => {
                querySelect(query,'customer','customer')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in customer"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>发票类型：</span>
            <el-select v-model="tetrunData.invoiceType" clearable placeholder="发票类型">
              <el-option label="专票" value="SPECIAL_INVOICE"></el-option>
              <el-option label="普票" value="GENERAL_INVOICE"></el-option>
              <el-option label="电子发票" value="ELERTRONIC_INVOICE"></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>项目名称：</span>
            <el-select
              v-model="tetrunData.projectId"
              remote
              filterable
              clearable
              placeholder="请输入项目名称"
              :remote-method="(query) => {
                querySelect(query,'project','projectNames')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in projectNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>提交服务方：</span>
            <el-select
              v-model="tetrunData.serverId"
              remote
              filterable
              clearable
              placeholder="请输入提交服务方"
              :remote-method="(query) => {
                querySelect(query,'serve','serveNames')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in serveNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="inputBox">
            <span>所属组织机构：</span>
            <el-select
              v-model="tetrunData.organizationId"
              remote
              filterable
              clearable
              placeholder="所属组织机构"
              :remote-method="(query) => {
                querySelect(query,'organization','organizationNames')
              }"
              :loading="loading"
            >
              <el-option
                v-for="item in organizationNames"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>

          <div class="inputBox">
            <span>发票号码：</span>
            <el-input placeholder="发票号码" v-model="tetrunData.invoiceNumber" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>发票代码：</span>
            <el-input placeholder="发票代码" v-model="tetrunData.invoiceCode" clearable></el-input>
          </div>
          <div class="inputBox">
            <span>发票申请单编号：</span>
            <el-input placeholder="发票申请单编号" v-model="tetrunData.invoiceApplicationNo" clearable></el-input>
          </div>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listLeft">
          <i class="iconfont iconjinridingdanshu"></i>
          数据列表
        </div>
        <div class="listRight">
          <el-button size="small" @click="goRecord()" v-if="$authorities.InvoiceDiscardOpaRecord">
            <span>操作记录</span>
          </el-button>
          <el-button
            size="small"
            v-if="this.isActive==0||this.isActive==1||this.isActive==6"
            @click="batchOperation()"
          >
            <span v-if="this.isActive==0" v-show="$authorities.InvoiceDiscardPassBatch">
              <i class="iconfont iconzengjia"></i>批量通过
            </span>
            <span v-else v-show="$authorities.InvoiceDiscardOpaBatch">
              <i class="iconfont iconzengjia"></i>批量作废
            </span>
          </el-button>
        </div>
      </div>
      <div class="listBoxBottom">
        <el-table
          :data="tableData.items"
          border
          :max-height="dataListHeight"
          style="width: 100%"
          :header-cell-style="tableStyle"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" :selectable="seletable"></el-table-column>
          <el-table-column
            prop="applicationNo"
            label="编号"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="invoiceTitle"
            label="发票抬头"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column
            prop="organizationName"
            label="申请服务方"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="creatorName" label="申请人" align="center"></el-table-column>
          <el-table-column
            prop="invoiceOfferName"
            label="开票方"
            align="center"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column width="90px" label="开票时间" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.invoicingTime | formatDateT}}</span>
              <br />
              <span>{{scope.row.invoicingTime | formatDateD}}</span>
            </template>
          </el-table-column>
          <el-table-column label="申请作废时间" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | formatDateT}}</span>
              <br />
              <span>{{scope.row.createTime | formatDateD}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="invoiceType" label="类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.invoiceType=='SPECIAL_INVOICE'">专票</span>
              <span v-if="scope.row.invoiceType=='GENERAL_INVOICE'">普票</span>
              <span v-if="scope.row.invoiceType=='ELERTRONIC_INVOICE'">电子发票</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invoiceAmount"
            label="开票金额"
            align="center"
            :formatter="formatPrice"
          ></el-table-column>
          <el-table-column prop="invoiceNumber" label="发票号码" align="center"></el-table-column>
          <el-table-column prop="returnTime" label="承诺退回日期" align="center" width="120px">
            <template slot-scope="scope">
              <span>{{scope.row.returnTime | formatDateT}}</span>
              <br />
              <span>{{scope.row.returnTime | formatDateD}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="statusText" label="状态" align="center"></el-table-column>
          <el-table-column prop="invalidType" label="作废类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.invalidType=='RED_WORD'">红冲</span>
              <span v-if="scope.row.invalidType=='INVALID'">作废</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="invalidReason"
            label="作废原因"
            align="center"
            width="150px"
            :show-overflow-tooltip="true"
          ></el-table-column>
          <el-table-column prop="demo" label="失败原因" align="center" v-if="this.isActive==6"></el-table-column>
          <el-table-column
            prop="demo"
            label="红字信息表"
            align="center"
            v-if="this.isActive==6||this.isActive==1||this.isActive==5"
            width="150"
          >
            <template slot-scope="scope">
              <div
                v-if="scope.row.invalidType=='RED_WORD'&&scope.row.invoiceType=='SPECIAL_INVOICE'&&(scope.row.status =='REMAIN_INVOICE'||scope.row.status =='INVALID_FAILED')"
              >
                {{scope.row.redWordInfo}}
                <br />
                <el-button
                  type="text"
                  size="small"
                  v-if="$authorities.InvoiceDiscardRedInfo"
                  @click="wRedWordInfo = true,dataLIst = scope.row,  formRedWordInfo.redWordInfo = scope.row.redWordInfo"
                >填写红字信息表</el-button>
              </div>
              <div v-else>--</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180" fixed="right">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-if="scope.row.status=='UNDER_APPROVAL'&&$authorities.InvoiceDiscardPass"
                @click="application = true,dataLIst = scope.row"
              >通过</el-button>
              <el-button
                type="text"
                size="small"
                v-if="(scope.row.status=='REMAIN_INVOICE'||scope.row.status=='UNDER_APPROVAL'||scope.row.status=='INVALID_FAILED')&&$authorities.InvoiceDiscardReject"
                @click="turnLication = true,dataLIst = scope.row"
              >驳回</el-button>
              <el-button
                type="text"
                size="small"
                @click="lication = true,dataLIst = scope.row"
                v-if="(scope.row.status=='REMAIN_INVOICE'||scope.row.status=='INVALID_FAILED')&&scope.row.invalidType=='INVALID'&&$authorities.InvoiceDiscardOpa"
              >作废</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.invalidType=='RED_WORD'&&$authorities.InvoiceDiscardRedRush&&(scope.row.status=='REMAIN_INVOICE'||scope.row.status=='INVALID_FAILED')"
                @click="btnReddialog(useLeadingWMS = scope.row),dataLIst = scope.row"
              >红冲</el-button>
              <el-button
                type="text"
                size="small"
                v-if="scope.row.invalidType=='RED_WORD'&&scope.row.useBaiWang==true&&$authorities.InvoiceDiscardTerminalCode&&(scope.row.status=='REMAIN_INVOICE'||scope.row.status=='INVALID_FAILED')"
                @click="wRedWordCode = true,formRedWordCode.invoiceTerminalCode = scope.row.invoiceTerminalCode,dataLIst = scope.row"
              >开票点编码</el-button>
              <el-button
                type="text"
                size="small"
                v-if="$authorities.InvoiceDiscardDetails"
                @click="openWin('InvoiceInvalidDetail',query.id = scope.row.id)"
              >详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <div class="block">
      <el-pagination
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :current-page="tableData.pageNum"
        :page-sizes="[10,20,30,40,50,100,500]"
        :page-size="10"
        layout="total,sizes, prev, pager, next, jumper"
        :total="tableData.total"
        background
      ></el-pagination>
    </div>
    <!-- 通过 -->
    <el-dialog :visible.sync="application" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">发票作废初审</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票号码：</th>
            <td>{{this.dataLIst.invoiceNumber}}</td>
            <th>发票类型：</th>
            <td>
              <span v-if="this.dataLIst.invoiceType=='SPECIAL_INVOICE'">专票</span>
              <span v-if="this.dataLIst.invoiceType=='GENERAL_INVOICE'">普票</span>
              <span v-if="this.dataLIst.invoiceType=='ELERTRONIC_INVOICE'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>发票代码：</th>
            <td>{{this.dataLIst.invoiceCode}}</td>
            <th>开票日期：</th>
            <td>{{this.dataLIst.invoicingTime|formatDate}}</td>
          </tr>
          <tr>
            <th>发票金额：</th>
            <td>
              <span>￥{{this.dataLIst.invoiceAmount}}</span>
            </td>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
          </tr>
          <tr>
            <th>承诺退回日期：</th>
            <td>{{ this.dataLIst.returnTime|formatDate}}</td>
            <th>纸质票（专票，普票）是否收到：</th>
            <td>
              <span v-if="this.dataLIst.receivedInvoice">是</span>
              <span v-else>否</span>
            </td>
          </tr>
          <tr>
            <th>退票原因：</th>
            <td colspan="3">{{this.dataLIst.invalidReason}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="application = false">取 消</el-button>
        <el-button type="primary" @click="passDialog()">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 作废 -->
    <el-dialog :visible.sync="lication" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">作废</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
            <th>发票类型：</th>
            <td>
              <span v-if="this.dataLIst.invoiceType=='SPECIAL_INVOICE'">专票</span>
              <span v-if="this.dataLIst.invoiceType=='GENERAL_INVOICE'">普票</span>
              <span v-if="this.dataLIst.invoiceType=='ELERTRONIC_INVOICE'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>申请金额：</th>
            <td>￥{{this.dataLIst.applicationAmount}}</td>
            <th>备注：</th>
            <td>{{this.dataLIst.memo}}</td>
          </tr>
          <tr>
            <th>开票金额：</th>
            <td colspan="3">￥{{this.dataLIst.invoiceAmount}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="lication = false">取 消</el-button>
        <el-button type="primary" @click="appsLication()">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 红冲WMS -->
    <el-dialog :visible.sync="redDialogWMS" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">红冲提示</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票抬头：</th>
            <td>{{this.dataLIst.invoiceTitle}}</td>
            <th>发票类型：</th>
            <td>
              <span v-if="this.dataLIst.invoiceType=='SPECIAL_INVOICE'">专票</span>
              <span v-if="this.dataLIst.invoiceType=='GENERAL_INVOICE'">普票</span>
              <span v-if="this.dataLIst.invoiceType=='ELERTRONIC_INVOICE'">电子发票</span>
            </td>
          </tr>
          <tr>
            <th>申请金额：</th>
            <td>￥{{this.dataLIst.applicationAmount}}</td>
            <th>备注：</th>
            <td>{{this.dataLIst.memo}}</td>
          </tr>
          <tr>
            <th>开票金额：</th>
            <td colspan="3">￥{{this.dataLIst.invoiceAmount}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="redDialogWMS = false">取 消</el-button>
        <el-button type="primary" @click="appsLication()">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 红冲 -->
    <el-dialog :visible.sync="redDialog" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">红冲提示</span>
      </div>
      <div class="message-box">
        <span>红冲后此记录失效，关联的相关订单可重新申请发票</span>
        <div style="margin-top:25px">
          <el-form
            :model="formApplication"
            :rules="rulse"
            ref="formApplication"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item label="红冲发票号码：" prop="redWordInvoiceNumber" label-width="150px">
              <el-input v-model="formApplication.redWordInvoiceNumber"></el-input>
            </el-form-item>
            <el-form-item label="红冲发票代码：" prop="redWordInvoiceCode" label-width="150px">
              <el-input v-model="formApplication.redWordInvoiceCode"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="redDialog = false,resetForm('formApplication')">取 消</el-button>
        <el-button type="primary" @click="pullRed('formApplication')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 填写红字信息表 -->
    <el-dialog :visible.sync="wRedWordInfo" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">填写红字信息表</span>
      </div>
      <div class="message-box">
        <span style="margin:20px;font-size:16px;">专票作废需要填写红字信息表</span>
        <el-form
          :model="formRedWordInfo"
          :rules="WordInfo"
          ref="formRedWordInfo"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="填写红字信息："
            prop="redWordInfo"
            label-width="150px"
            style="margin-top: 20px"
          >
            <el-input v-model="formRedWordInfo.redWordInfo" placeholder="红字信息"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="wRedWordInfo = false,resetForm('formRedWordInfo')">取 消</el-button>
        <el-button type="primary" @click="pullRedInfo('formRedWordInfo')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 开票点编码 -->
    <el-dialog :visible.sync="wRedWordCode" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">填写开票点编码</span>
      </div>
      <div class="message-box">
        <span style="font-size:16px;">红冲时填写开票点编码</span>
        <el-form
          :model="formRedWordCode"
          :rules="WordCode"
          ref="formRedWordCode"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="请选择开票点编码："
            prop="invoiceTerminalCode"
            label-width="150px"
            style="margin-top: 20px"
          >
            <el-select v-model="formRedWordCode.invoiceTerminalCode" placeholder="开票点编码" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="wRedWordCode = false,resetForm('formRedWordCode')">取 消</el-button>
        <el-button type="primary" @click="pullRedCode('formRedWordCode')">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 批量通过 -->
    <el-dialog :visible.sync="dialogBatch" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">批量通过</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票总金额：</th>
            <td>{{this.formData.sum}}</td>
            <th>发票张数：</th>
            <td>{{this.formData.sheets}}</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogBatch = false">取 消</el-button>
        <el-button type="primary" @click="postLica()">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 批量作废 -->
    <el-dialog :visible.sync="dialogLica" width="40%" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">批量作废</span>
      </div>
      <div class="message-box">
        <table border="1">
          <tr>
            <th>发票总金额：</th>
            <td>￥{{this.formData.sum}}</td>
            <th>发票张数：</th>
            <td>{{this.formData.sheets}}张</td>
          </tr>
        </table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogLica = false">取 消</el-button>
        <el-button type="primary" @click="postBatch()">保 存</el-button>
      </div>
    </el-dialog>
    <!-- 驳回 -->
    <el-dialog
      title="驳回作废申请"
      :visible.sync=" turnLication"
      width="40%"
      custom-class="dialog-box"
      @open="open('form')"
    >
      <span class="title">驳回后，申请方可修改内容再次提交作废申请</span>
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="驳回原因" prop="name" label-width="100px" style="margin-top: 20px">
          <el-input
            v-model="form.name"
            placeholder="字数长度1~200以内"
            type="textarea"
            maxlength="200"
            :rows="3"
            width="20px"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="turnLication = false,resetForm('form')">取 消</el-button>
        <el-button type="primary" @click="submitForm('form')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  postBillAppalllist,
  postBillAppfaliedlist,
  postBillApplidlist,
  postBillApplidinglist,
  postBillApprejectedlist,
  postBillApppendinglist,
  postBillApplidingreviewlist,
  putBillApppass,
  postBillAppreject,
  postBillAppinvalid,
  putBillAppred,
  getBillAppcount,
  postBillAppbatchs,
  postBillApppassbatchs,
  putBillAppredinfo,
  putBillAppredCode
} from "@/api/finance/invoiceInvalids";
import { selectOrganization } from "@/api/finance/receivable";
import { selectServer } from "@/api/finance/receivable";
import { selectCustomer } from "@/api/purchase/purchaseDemand";
import { findCustomList } from "@/api/goods/customCorrespondManage";
import { postOrganizationOptions } from "@/api/common/commonApi";
import { nameList } from "@/api/projectController/projectController";
import { customerNameList } from "@/api/order/saleDown";
import { parseTime, returnFloat } from "@/utils/index";
export default {
  inject: ["reload", "isFilterShow"],
  name: "Invalidapplication",
  data() {
    return {
      customer: [],
      projectNames: [],
      serveNames: [],
      useLeadingWMS: "",
      organizationNames: [],
      rules: {
        name: {
          required: true,
          message: "请输入驳回原因",
          trigger: "blur"
        }
      },
      returnId: {
        ids: []
      },
      form: { name: "" },
      forms: {
        rejectReason: ""
      },
      dataLIst: {},
      tableStyle: {
        background: "#f5f7fa"
      },
      dialogBatch: false,
      dialogLica: false,
      lication: false,
      redDialog: false,
      redDialogWMS: false,
      application: false,
      turnLication: false,
      isShow: this.isFilterShow,
      isActive: 5,
      loading: false,
      wRedWordInfo: false,
      wRedWordCode: false,
      multipleSelection: [], //选中的序号,
      tableData: {
        items: []
      },
      formApplication: {
        redWordInvoiceCode: "",
        redWordInvoiceNumber: ""
      },
      rulse: {
        redWordInvoiceCode: [
          { required: true, message: "请输入红冲发票代码", trigger: "blur" }
        ],
        redWordInvoiceNumber: [
          { required: true, message: "请输入红冲发票号码", trigger: "blur" }
        ]
      },
      formRedWordInfo: {
        redWordInfo: ""
      },
      formRedWordCode: {
        invoiceTerminalCode: ""
      },

      WordInfo: {
        redWordInfo: [
          { required: true, message: "请输入红字信息", trigger: "blur" }
        ]
      },
      WordCode: {
        invoiceTerminalCode: [
          { required: true, message: "请选择开票点编码", trigger: "blur" }
        ]
      },
      options: [
        //开票点编码
        {
          value: "kaipiaodian01",
          label: "开票点01"
        },
        {
          value: "kaipiaodian02",
          label: "开票点02"
        },
        {
          value: "tongyongkaipiao",
          label: "通用开票"
        },
        {
          value: "jinjizhipiao",
          label: "紧急纸票"
        }
        // {
        //   value: "kpyuan001",
        //   label: "开票点01"
        // },
        // {
        //   value: "kpyuan002",
        //   label: "开票点02"
        // }
      ],
      partnerName: null,
      partnerNames: [],
      organizationId: null,
      dataTime: null,
      invoiceType: null,
      formData: {
        sum: 0,
        sheets: 0
      },
      query: {
        id: ""
      },
      tetrunData: {
        createTimeEnd: null, //截止时间
        createTimeStart: null, //开始时间
        customerName: null, //客户名
        invoiceApplicationNo: null, //申请单编号
        invoiceCode: null, //发票代码
        invoiceNumber: null, //发票号码
        invoiceType: null, //发票类型
        organizationId: null, //组织机构
        pageNum: 1,
        pageSize: 10,
        projectId: null, //项目
        serverId: null //服务方
      },
      tabLIst: {}
    };
  },
  created() {
    // this.postBillAppalllist();
    // console.log(this.isActive);
    this.getData(this.isActive);
    this.getBillAppcount();
  },

  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    seletable(row, index) {
      if (row.status == "INVALID") {
        return false;
      }
      if (row.status == "REMAIN_INVOICE") {
        if (!row.useBaiWang) {
          return false;
        } else {
          return true;
        }
      } else {
        return true;
      }
    },
    open(formName) {
      // alert(this.form.name);
      if (this.form.name != "") {
        this.$refs[formName].resetFields();
      }
    },
    getBillAppcount() {
      getBillAppcount().then(res => {
        this.tabLIst = res.data;
        // console.log(this.tabLIst);
      });
    },

    //切换Tab
    changeTab(val) {
      if (this.isActive == val) return false;
      // console.log(val);
      this.tetrunData.pageNum = 1;
      this.isActive = val;
      this.getData(val);
    },

    //红冲判断
    btnReddialog(val) {
      if (val.useBaiWang) {
        // console.log(val);
        if (val.invoiceType == "SPECIAL_INVOICE") {
          if (val.redWordInfo) {
            this.redDialogWMS = true;
          } else {
            this.$confirm("缺少红字信息，请完善", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {})
              .catch(() => {});
          }
        } else {
          this.redDialogWMS = true;
        }
      } else {
        // console.log(val);
        this.redDialog = true;
      }
    },
    // 填写红字信息
    pullRedInfo(formName) {
      // putBillAppredinfo(formName).then(res => {});
      // console.log(this.formRedWordInfo);
      this.$refs[formName].validate(valid => {
        if (valid) {
          putBillAppredinfo(
            this.dataLIst.id,
            this.formRedWordInfo.redWordInfo
          ).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$refs[formName].resetFields();
              this.wRedWordInfo = false;
              this.getData(this.isActive);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 开票点编码
    pullRedCode(formName) {
      // putBillAppredinfo(formName).then(res => {});
      // console.log(this.formRedWordInfo);
      this.$refs[formName].validate(valid => {
        if (valid) {
          putBillAppredCode(
            this.dataLIst.id,
            this.formRedWordCode.invoiceTerminalCode
          ).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$refs[formName].resetFields();
              this.wRedWordCode = false;
              this.getData(this.isActive);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //未对接百旺红冲
    pullRed(formName) {
      var id = this.useLeadingWMS.id;
      // console.log(id);
      if (this.formApplication.redWordInvoiceNumber.length != 8) {
        console.log(this.formApplication.redWordInvoiceNumber.length);
        this.$message({
          message: "发票号码必须为8位数字",
          type: "error"
        });
        console.log(this.dataLIst);
        return;
      }
      if (this.dataLIst.invoiceType == "SPECIAL_INVOICE") {
        if (this.formApplication.redWordInvoiceCode.length != 10) {
          console.log(this.formApplication.redWordInvoiceCode.length);
          this.$message({
            message: "发票类型为专票时，发票代码必须为10位数字",
            type: "error"
          });

          console.log(this.dataLIst);
          return;
        }
      } else {
        if (this.formApplication.redWordInvoiceCode.length != 12) {
          console.log(this.formApplication.redWordInvoiceCode.length);
          if (this.dataLIst.invoiceType == "ELERTRONIC_INVOICE") {
            this.$message({
              message: "发票类型为电子发票时，发票代码必须为12位数字",
              type: "error"
            });
            return;
          } else {
            this.$message({
              message: "发票类型为普票时，发票代码必须为12位数字",
              type: "error"
            });
            return;
          }

          console.log(this.dataLIst);
          return;
        }
      }
      this.$refs[formName].validate(valid => {
        if (valid) {
          putBillAppred(id, this.formApplication).then(res => {
            if (res.code == "000000") {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.$refs[formName].resetFields();
              this.redDialog = false;
              this.getData(this.isActive);
              this.getBillAppcount();
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    //通过
    passDialog() {
      // console.log(this.dataLIst.id,'通过')
      putBillApppass(this.dataLIst.id).then(res => {
        // console.log(res)
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.application = false;
          this.getData(this.isActive);
          this.getBillAppcount();
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 批量作废
    postBatch() {
      postBillAppbatchs(this.returnId).then(res => {
        // console.log(res)
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.dialogLica = false;
          this.getData(this.isActive);
          this.getBillAppcount();
        }
      });
    },
    //驳回
    submitForm(formName) {
      // console.log(this.form);
      this.forms.rejectReason = this.form.name;
      this.$refs[formName].validate(valid => {
        if (valid) {
          postBillAppreject(this.dataLIst.id, this.forms.rejectReason).then(
            res => {
              if (res.code == "000000") {
                this.$message({
                  message: "操作成功",
                  type: "success"
                });
                this.turnLication = false;
                this.$refs[formName].resetFields();
                this.getData(this.isActive);
                this.getBillAppcount();
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //批量通过
    postLica() {
      // console.log(this.returnId)
      postBillApppassbatchs(this.returnId).then(res => {
        // console.log(res)
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.dialogBatch = false;
          this.getData(this.isActive);
          this.getBillAppcount();
        }
      });
    },
    //作废
    appsLication() {
      var id = this.dataLIst.id;
      postBillAppinvalid(id).then(res => {
        // console.log(res);
        if (res.code == "000000") {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.lication = false;
          this.redDialogWMS = false;
          this.getData(this.isActive);
          this.getBillAppcount();
        }
      });
    },
    //查询
    getInquire() {
      this.getData(this.isActive);
    },
    Empty() {
      this.tetrunData.pageNum = 1;
      this.tetrunData.createTimeEnd = null; //截止时间
      this.tetrunData.createTimeStart = null; //开始时间
      this.tetrunData.customerName = null; //客户名
      this.tetrunData.invoiceApplicationNo = null; //申请单编号
      this.tetrunData.invoiceCode = null; //发票代码
      this.tetrunData.invoiceNumber = null; //发票号码
      this.tetrunData.invoiceType = null; //发票类型
      this.tetrunData.organizationId = null; //组织机构
      this.tetrunData.projectId = null; //项目
      this.tetrunData.serverId = null; //服务方
      this.dataTime = null;

      this.getData(this.isActive);
    },
    getData(val) {
      switch (val) {
        case 0:
          this.postBillApplidingreviewlist(this.tetrunData);
          break;
        case 1:
          this.postBillApppendinglist(this.tetrunData);
          break;
        case 2:
          this.postBillApprejectedlist(this.tetrunData);
          break;
        case 3:
          this.postBillApplidinglist(this.tetrunData);
          break;
        case 4:
          this.postBillApplidlist(this.tetrunData);
          break;
        case 5:
          this.postBillAppalllist(this.tetrunData);
          break;
        case 6:
          this.postBillAppfaliedlist(this.tetrunData);
          break;
      }
    },
    //全部
    postBillAppalllist(val) {
      postBillAppalllist(val).then(res => {
        // console.log(res, "全部");
        this.tableData = res.data;
      });
    },
    //待审核
    postBillApplidingreviewlist(val) {
      postBillApplidingreviewlist(val).then(res => {
        // console.log(res, "待审核");
        this.tableData = res.data;
      });
    },
    ///待作废
    postBillApppendinglist(val) {
      postBillApppendinglist(val).then(res => {
        // console.log(res, "待作废");
        this.tableData = res.data;
      });
    },
    //已驳回
    postBillApprejectedlist(val) {
      postBillApprejectedlist(val).then(res => {
        // console.log(res, "已驳回");
        this.tableData = res.data;
      });
    },
    //作废中
    postBillApplidinglist(val) {
      postBillApplidinglist(val).then(res => {
        // console.log(res, "作废中");
        this.tableData = res.data;
      });
    },
    //已作废
    postBillApplidlist(val) {
      postBillApplidlist(val).then(res => {
        // console.log(res, "已作废");
        this.tableData = res.data;
      });
    },
    //作废失败
    postBillAppfaliedlist(val) {
      postBillAppfaliedlist(val).then(res => {
        // console.log(res, "作废失败");
        this.tableData = res.data;
      });
    },
    querySelect(query, type, list) {
      if (query !== "") {
        this.loading = true;
        if (type == "project") {
          nameList({ name: query }).then(res => {
            this.projectNames = res.data;
            this.loading = false;
          });
        }
        //客户
        if (type == "customer") {
          selectCustomer({ name: query }).then(res => {
            this.customer = res.data;
            this.loading = false;
          });
        }
        if (type == "serve") {
          selectServer({ name: query }).then(res => {
            this.serveNames = res.data;
            this.loading = false;
          });
        }
        if (type == "organization") {
          selectOrganization({ name: query }).then(res => {
            this.organizationNames = res.data;
            this.loading = false;
          });
        }
      } else {
        this[list] = [];
      }
    },
    //跳转操作记录
    goRecord() {
      this.$router.push({
        path: "/finance/InvalidApplication/InvoiceInvalidRecord"
      });
    },
    //批量通过&&作废
    batchOperation() {
      if (this.multipleSelection.length) {
        if (this.isActive == 0) {
          this.dialogBatch = true;
        }
        if (this.isActive == 1 || this.isActive == 6) {
          this.dialogLica = true;
        }
      } else {
        this.$message({
          message: "请先选择需要操作的数据",
          type: "error"
        });
      }
    },
    openWin(name, query) {
      // console.log(this.query);
      this.$router.push({
        name: name,
        query: this.query
      });
    },
    showDialog(type, row) {
      this.$refs[type].init(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.formData.sum = 0;
      this.returnId.ids = [];
      // console.log(this.multipleSelection);
      this.formData.sheets = this.multipleSelection.length;
      val.forEach(e => {
        this.formData.sum += e.invoiceAmount;
      });
      for (var i = 0; i < val.length; i++) {
        this.returnId.ids[i] = val[i].id;
      }
      // console.log(this.formData.length, 212);
    },

    selectPicker(dataTime) {
      if (dataTime) {
        this.tetrunData.createTimeStart = dataTime[0];
        this.tetrunData.createTimeEnd = dataTime[1];
        // console.log(this.fron)
      } else {
        this.tetrunData.createTimeStart = "";
        this.tetrunData.createTimeEnd = "";
      }
    },
    formatPrice(row, col, cellValue) {
      return "￥" + returnFloat(cellValue);
    },
    //分页跳转
    handleCurrentChange(val) {
      console.log(val);
      this.tetrunData.pageNum = val;
      this.getData(this.isActive);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.tetrunData.pageNum = 1;
      this.tetrunData.pageSize = val;
      this.getData(this.isActive);
    }
  },
  filters: {
    //时间截取字符串
    formatDate: function(val) {
      var dateee = new Date(val).toJSON();
      var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
        .toISOString()
        .replace(/T/g, " ")
        .replace(/\.[\d]{3}Z/, "");
      return date;
    },

    //时间截取字符串
    formatDateT: function(value) {
      if (!value) return "";
      return value.substring(0, 10);
    },
    formatDateD: function(value) {
      if (!value) return "";
      return value.substring(11, 19);
    }
  }
};
</script>

<style lang='less' scoped>
.demandBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .active {
      background: #339999;
      color: #fff;
    }
  }
  .filterBox {
    background: #f3f3f3;
    border: 1px solid #e4e4e4;
    margin: 10px 0;
    clear: both;
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
      padding: 0 20px;
    }
    span {
      font-size: 14px;
      color: #303133;
    }
    .rightBox {
      float: right;
      overflow: hidden;
      height: 45px;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 0 0 10px;
    }
    .homeBottomBox {
      border-top: 1px solid #e4e4e4;
      display: flex;
      flex-wrap: wrap;
      .inputBox {
        width: 24%;
        display: flex;
        align-items: center;
        span {
          text-align: right;
          flex: 0 0 120px;
        }
      }
      .el-input {
        max-width: 200px;
        padding: 5px;
      }
      .el-select {
        max-width: 200px;
        padding: 5px;
      }
    }
  }
  .listBox {
    border: 1px solid #e4e4e4;
    .listBoxTop {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f3f3f3;
      height: 50px;
      .listLeft {
        i {
          padding: 0 5px 0 20px;
        }
      }
      .listRight {
        i {
          font-size: 12px;
        }
        &:last-child {
          margin-right: 20px;
        }
      }
    }
  }
  .dialog-box {
    position: relative;
    display: flex;
    .message-box {
      padding: 0px 20px;
      font-size: 14px;
      color: #666;
      table {
        width: 90%;
        margin: 20px auto;
        td,
        th {
          border: 1px solid #d1d1d1;
          font-size: 14px;
          height: 42px;
        }
        th {
          padding-right: 6px;
          box-sizing: border-box;
          background: #f5f7fa;
          font-weight: 700;
          font-size: 14px;
          text-align: right;
          width: 20%;
          i {
            color: red;
          }
        }
        td {
          color: #666666;
          text-align: center;
          padding-left: 10px;
        }
      }
      .el-input {
        width: 80%;
      }
      .first-step-box {
        padding: 20px 0;
        .first-step {
          color: red;
          font-size: 18px;
          text-decoration: underline;
          cursor: pointer;
        }
      }
      .second-step-box {
        display: flex;
        padding: 20px 0;
        align-items: center;
        .input-box-file {
          width: 120px;
          margin-left: 20px;
          position: relative;
          cursor: pointer;
          .input-button {
            width: 120px;
            height: 30px;
            border: 1px solid #d1d1d1;
            color: #999;
            border-radius: 4px;
            line-height: 30px;
            font-size: 14px;
            text-indent: 10px;
            cursor: pointer;
          }
        }
      }
      .tip {
        display: flex;
        color: red;
        line-height: 30px;
      }
    }
    .dialog-title {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 50px;
      background-color: #f3f3f3;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
      box-sizing: border-box;
      .reject-title {
        font-size: 16px;
        font-weight: bold;
        color: #666;
      }
    }
    .dialog-footer {
      margin-top: 40px;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      padding: 10px;
      box-sizing: border-box;
    }
  }
  .block {
    margin: 5px 10px;
    text-align: right;
  }
}
</style>
