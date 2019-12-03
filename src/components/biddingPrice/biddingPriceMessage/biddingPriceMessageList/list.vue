<template>
	<div class="brandBox">
    <div class="buttonBox">
      <el-button v-for="(item,index) in headerData" :key="index" size="small" :class="{ active: buttonshow==index }" @click="header_button_click(index,item.status)">{{item.statusName}}（{{item.statusCount}}）</el-button>
    </div>
    <div class="filterBox">
      <div class="homeBoxTop"><span><i class="icon iconfont iconsousuo"></i>&nbsp;筛选查询</span>
        <div class="rightBox">
         <span @click="showHelp()"><i class="el-icon-arrow-down" v-show="!isShow"></i><i class="el-icon-arrow-up" v-show="isShow"></i>&nbsp;<i v-show="isShow">收起</i><i v-show="!isShow">展开</i>筛选</span>
          <el-button size="small" class="w80 h40" @click="search">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="homeBoxBottom" v-if="isShow">
          <el-row style="width:100%">
            <el-col :span="6" class="el-col">
              <span class="span-style">竞价信息编号：</span>
              <el-input    
                v-model="list.biddingNo"
                placeholder="竞价信息编号"
                clearable>
              </el-input>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">外部竞价编号：</span>
              <el-input    
                v-model="list.exteriorNo"
                placeholder="外部竞价编号"
                clearable>
              </el-input>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">是否已报价：</span>
              <el-select v-model="list.priceQuoteStatus" style="margin-left:0px;">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="是" value="2"></el-option>
                <el-option label="否" value="1"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">竞价结果：</span>
              <el-select v-model="list.biddingResult" style="margin-left:0px;">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="竞价成功" value="1"></el-option>
                <el-option label="竞价失败" value="2"></el-option>
                <el-option label="流拍" value="3"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="width:100%">
            <el-col :span="6" class="el-col">
              <span class="span-style">项目名称：</span>
              <el-select
                v-model="list.projectId"
                filterable
                remote
                clearable
                placeholder="项目名称"
                :remote-method="projectNameRemote"
                style="margin-left:0px;"
                :loading="loading">
                <el-option
                  v-for="item in projectName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">客户：</span>
              <el-autocomplete
                v-model="list.customerNameCustomize"
                :fetch-suggestions="querySearchAsync"
                value-key="name"
                @select="handleSelect"
                clearable
                placeholder="客户姓名">
              </el-autocomplete>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">服务方：</span>
              <el-select
                v-model="list.serverId"
                filterable
                remote
                clearable
                placeholder="服务方名称"
                :remote-method="servicePartyRemote"
                style="margin-left:0px;"
                :loading="loading">
                <el-option
                  v-for="item in servicePartyName"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">中标公司：</span>
              <el-input    
                v-model="list.winningBiddingCompany"
                placeholder="请输入中标公司"
                clearable>
              </el-input>
            </el-col>
          </el-row>
          <el-row style="width:100%">
            <el-col :span="6" class="el-col">
              <span class="span-style">结果跟踪：</span>
              <el-select v-model="list.resultStatus" style="margin-left:0px;">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="未开始" value="1"></el-option>
                <el-option label="发货中" value="2"></el-option>
                <el-option label="已完成" value="3"></el-option>
                <el-option label="交易作废" value="4"></el-option>
              </el-select>
            </el-col>
            <el-col :span="6" class="el-col">
              <span class="span-style">报备状态：</span>
              <el-select v-model="list.reportPreparedStatus" style="margin-left:0px;">
                <el-option label="全部" :value="null"></el-option>
                <el-option label="无报备" value="0"></el-option>
                <el-option label="已报备" value="1"></el-option>
                <el-option label="报备异常" value="2"></el-option>
                <el-option label="已取消" value="3"></el-option>
              </el-select>
            </el-col>
          </el-row>
          <el-row style="width:100%">
            <el-col :span="12" class="el-col">
              <span class="span-style">收货地址：</span>
              <div class="address-wrap">
                <el-select v-model="list.provinceId" placeholder="选择省/直辖市" @change="onProvincesChange" style="margin-left:0;">
                  <el-option
                    v-for="(item,index) in province"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="list.cityId" placeholder="选择城市" @change="onCityChange" >
                  <el-option
                    v-for="(item,index) in city"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
                <el-select v-model="list.countyId" placeholder="选择区/县" >
                  <el-option
                    v-for="(item,index) in county"
                    :key="index"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </div>
            </el-col>
            <el-col :span="12" class="el-col">
              <div class="time-wrap">
                <div class="time-title">
                  <span class="span-style">时间：</span>
                  <el-select v-model="list.timeType">
                    <el-option label="报价截止时间" value="0"></el-option>
                    <el-option label="竞价截止时间" value="1"></el-option>
                    <el-option label="创建时间" value="2"></el-option>
                  </el-select>
                </div>
                <div class="time-box">
                  <el-date-picker
                    v-model="list.sTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                  <div class="text">至</div>
                  <el-date-picker
                    v-model="list.eTime"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    placeholder="选择日期时间">
                  </el-date-picker>
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-collapse-transition>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <div class="listBoxTop-left">
          <span><i class="iconfont iconshujuliebiao"></i>数据列表</span>
        </div>
        <div class="listBoxRight">
          <el-button size="medium" @click="pushService" v-if="$authorities.biddingPriceMessageChangeServerBatch"><i class="iconfont iconkuaijierukou"></i>批量更改服务方</el-button>
          <el-button size="medium" @click="batchPush" v-if="$authorities.biddingPriceMessageBatchPush"><i class="iconfont iconkuaijierukou"></i>批量推送</el-button>
          <el-button size="small" @click="biddingResults('importFile','biddingResult')" v-if="$authorities.biddingPriceMessageResultImport"><i class="iconfont icondaoru"></i>竞价结果导入</el-button>
          <el-button size="small" @click="biddingResults('importFile','militaryNetworkBidding')" v-if="$authorities.biddingPriceMessageArmyImport"><i class="iconfont icondaoru"></i>军网竞价信息导入</el-button>
          <el-button size="small" @click="biddingResults('importFile','bidding')" v-if="$authorities.biddingPriceMessageImport"><i class="iconfont icondaoru"></i>竞价信息导入</el-button>
          <el-button size="small" @click="importRecord('importFile')" v-if="$authorities.biddingPriceMessageImportRecord"><i class="iconfont icondingdanguanli"></i>导入记录</el-button>
          <el-button size="small" @click="exportBiddingPriceInfo()" v-if="$authorities.biddingPriceMessageExport"><i class="iconfont icondaochu" ></i>导出</el-button>
          <el-button size="small" @click="addBidding"  v-if="$authorities.biddingPriceMessageCreate"><i class="iconfont icontianjiashangpin"></i><span>添加</span></el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        ref="multipleTable"
        :max-height="dataListHeight"
        border
        style="width: 100%"
        :cell-class-name="cell"
        :row-class-name="filterRow"
        @selection-change="selectionFn"
        size="small">
        <el-table-column
          type="selection"
          fixed="left"
          width="55">
        </el-table-column>
        <el-table-column
          prop="biddingNo"
          label="竞价信息编号"
          align="center">
        </el-table-column>
        <el-table-column
          prop="exteriorNo"
          label="外部竞价编号"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          prop="customerNameCustomize"
          label="客户"
          align="center">
        </el-table-column>
        <el-table-column
          prop="detailAddressLine"
          label="收货地址"
          :show-overflow-tooltip="true"
          width="150"
          align="center">
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="88"
          align="center">
        </el-table-column> 
        <el-table-column
          prop="priceQuoteEndTime"
          label="报价截止时间"
           min-width="88"
          align="center">
        </el-table-column> 
        <el-table-column
          prop="endTime"
          label="竞价截止时间"
          min-width="88"
          align="center">
        </el-table-column> 
        <el-table-column
          prop="startPrice"
          label="起拍价"
          :formatter="retainDecimals"
          align="center">
        </el-table-column>
         <el-table-column
          prop="serverName"
          label="服务方"
          :show-overflow-tooltip="true"
          align="center">
        </el-table-column>
        <el-table-column
          prop="priceQuoteStatusName"
          label="是否已报价"
          align="center">
        </el-table-column>
        <el-table-column
          prop="statusName"
          label="状态"
          align="center">
        </el-table-column>
        <el-table-column
          prop=""
          label="报备状态"
          align="center">
          <template slot-scope="scope">
            <span >{{scope.row.reportPreparedStatusName}}</span>
            <el-button type="text" size="small" v-if="scope.row.reportPreparedStatus==1||scope.row.reportPreparedStatus==2" @click="goReportDetail(scope.row.reportPreparedId)">查看报备详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="biddingResultName"
          label="竞价结果"
          align="center">
        </el-table-column>
        <el-table-column
          prop="winningBiddingCompany"
          label="中标公司"
          align="center">
        </el-table-column>
        <el-table-column
          prop="winningPrice"
          :formatter="retainDecimals"
          label="中标价"
          align="center">
        </el-table-column>
        <el-table-column
          prop="resultStatusName"
          label="结果跟踪"
          align="center">
          <template slot-scope="scope">
            <span >{{scope.row.resultStatusName}}</span>
            <el-button type="text" size="small" v-if="scope.row.resultStatus!=0&&scope.row.resultStatus!=1&&scope.row.orderId!=null" @click="goOrderDetail(scope.row.orderId)">查看订单详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center" min-width="150px">
          <template slot-scope="scope">
              <el-button type="text" size="small" v-if="scope.row.status==0&&$authorities.biddingPriceMessagePushServer" @click="sendServiceparty(scope.row.id)">推送服务方</el-button>
              <el-button type="text" size="small" v-if="scope.row.status==0&&$authorities.biddingPriceMessageChangeServer" @click="getServiceInfo(scope.row.id)">更改服务方</el-button>
              <el-button type="text" size="small" v-if="(scope.row.status==0||scope.row.status==6)&&$authorities.biddingPriceMessageEdit" @click="goEdit(scope.row.id,scope.row.status)" >编辑</el-button>
              <el-button type="text" size="small" v-if="(scope.row.status==0||scope.row.status==6)&&$authorities.biddingPriceMessageDelete" @click="tipsDiglog('delete',scope.row.id)">删除</el-button>
              <el-button type="text" size="small" @click="goDetail(scope.row.id)" v-if="$authorities.biddingPriceMessageDetail">详情</el-button>
              <el-button type="text" size="small" v-if="scope.row.status==1&&$authorities.biddingPriceMessageDetail" @click="tipsDiglog('retract',scope.row.id)">撤回</el-button>
              <el-button type="text" size="small" v-if="scope.row.status==3&&$authorities.biddingPriceMessageInputResult" @click="entryResult(scope.row.id)" >录入结果</el-button>
              <el-button type="text" size="small" v-if="scope.row.biddingResult==1&&scope.row.resultStatus==1&&scope.row.status==4&&$authorities.biddingPriceMessageTovoid" @click="tipsDiglog('obsolete',scope.row.id)">交易作废</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block" v-show="total!=0">
      <el-pagination
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="list.pageNum"
          :page-size="list.pageSize"
          :page-sizes="[10,20,30,40,50,100,200,500]"
          layout="total,sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
    <el-dialog
      :title="batchPushDialogTile"
      :visible.sync="batchPushDialog"
      width="30%">
      <span>{{DialogTipsContent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchDialog">确定</el-button>
      </span>
    </el-dialog>

    <importFile
        ref="importFile"
        :title="'竞价信息导入'"
        :type="importType"
        @callback="dialogCallback">
    </importFile>

    <el-dialog title="更改服务方" :visible.sync="changeServicePartyDialog" class="dialog-wrap">
      <table>
        <tr>
          <th>竞价编号：</th>
          <td>{{form.biddingNo}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{form.projectName}}</td>
        </tr>
        <tr>
          <th>收货地址：</th>
          <td>{{form.addressLine}}</td>
        </tr>
        <tr>
          <th>报备服务方：</th>
          <td>{{form.reportPreparedServerName}}</td>
        </tr>
      </table>
      <el-form ref="formName" :rules="changeServicePartyRules" :model="changeServicePartyForm" class="form-box ">
        <el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="服务方选择范围：" label-width="135px" class="forms" prop="servicePartySelecRange">
                <el-radio v-model="changeServicePartyForm.servicePartySelecRange" label="1">按匹配结果中选择服务方</el-radio>
                <el-radio v-model="changeServicePartyForm.servicePartySelecRange" label="2">从全部中选择服务方</el-radio>
              </el-form-item>
            </el-col>  
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="服务方：" label-width="135px" class="forms" prop="serviceParty">
                <!-- <el-select
                  v-model="changeServicePartyForm.servicePartyId"
                  filterable
                  remote
                  clearable
                  placeholder="请输入服务方名称"
                  :remote-method="servicePartyRemote"
                  style="margin-left:0px; width:65%;"
                  :loading="loading">
                  <el-option
                    v-for="item in servicePartyName"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select> -->
                <el-autocomplete
                  v-model="changeServicePartyForm.serviceParty"
                  :fetch-suggestions="servicePartyRemote"
                  placeholder="请输入内容"
                  clearable
                  value-key="name"
                  @select="changeServicePartyRemote"
                  style="width: 60%"
                  :popper-append-to-body="false"
                  :loading="loading"
                ></el-autocomplete>
              </el-form-item>
            </el-col> 
          </el-row>
        </el-form-item>
        <el-form-item class="form-button-box">
          <el-button type="primary" @click="changeServiceParty('formName')" class="form-button">保存</el-button>
          <el-button type="primary" @click="oncancel('changeServicePartyDialog','formName')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

     <el-dialog title="批量更改服务方" :visible.sync="pushServicePartyDialog" class="dialog-wrap">
      <el-form ref="formName" :rules="changeServicePartyRules" :model="changeServicePartyForm" class="form-box ">
        <el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="服务方：" label-width="135px" class="forms" prop="servicePartyId">
                <el-select
                  v-model="changeServicePartyForm.servicePartyId"
                  filterable
                  remote
                  clearable
                  placeholder="请输入服务方名称"
                  :remote-method="servicePartyRemote1"
                  style="margin-left:0px; width:65%;"
                  :loading="loading">
                  <el-option
                    v-for="item in servicePartyName"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col> 
          </el-row>
        </el-form-item>
        <el-form-item class="form-button-box">
          <el-button type="primary" @click="pushServiceParty('formName')" class="form-button">保存</el-button>
          <el-button type="primary" @click="oncancel('pushServicePartyDialog','formName')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog title="录入结果" :visible.sync="entryResultDialog" class="dialog-wrap">
      <table>
        <tr>
          <th>竞价编号：</th>
          <td>{{entryResultEcho.biddingNo}}</td>
        </tr>
        <tr>
          <th>起拍价：</th>
          <td>{{entryResultEcho.startPrice}}</td>
        </tr>
        <tr>
          <th>项目：</th>
          <td>{{entryResultEcho.projectName}}</td>
        </tr>
        <tr>
          <th>收货地址：</th>
          <td>{{entryResultEcho.addressLine}}</td>
        </tr>
      </table>
      <el-form ref="entryResultForm" :rules="entryResultRules" :model="entryResultForm" class="form-box">
        <el-form-item>
          <el-row>
            <el-col :span="24">
              <el-form-item label="竞价结果：" label-width="135px" class="forms" prop="biddingResult">
                <el-radio-group v-model="entryResultForm.biddingResult" @change="changeResult">
                  <el-radio  label="1">竞价成功</el-radio>
                  <el-radio  label="2">竞价失败</el-radio>
                  <el-radio  label="3">流拍</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>  
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="中标公司：" label-width="135px"  class="forms" :rules="entryResultForm.biddingResult==3?entryResultRules.winningBiddingCompany1:entryResultRules.winningBiddingCompany" prop="winningBiddingCompany">
                <!-- <el-input  v-model="entryResultForm.winningBiddingCompany"  :disabled="entryResultForm.biddingResult!=2?true:false" style="width: 60%"></el-input>  -->
                <el-autocomplete
                  v-model="entryResultForm.winningBiddingCompany"
                  :fetch-suggestions="getWinningBid"
                  :disabled="entryResultForm.biddingResult!=2?true:false" 
                  placeholder="请输入内容"
                  clearable
                  value-key="name"
                  style="width: 60%"
                  :popper-append-to-body="false"
                  :loading="loading"
                ></el-autocomplete>
              </el-form-item>
            </el-col> 
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="中标价：" label-width="135px" class="forms" :rules="entryResultForm.biddingResult==3?entryResultRules.winningPrice1:entryResultRules.winningPrice" prop="winningPrice">
                 <el-input type="number" v-model.number="entryResultForm.winningPrice" :disabled="entryResultForm.biddingResult==3?true:false" style="width:60%"></el-input> 
              </el-form-item>
            </el-col> 
          </el-row>
           <el-row>
            <el-col :span="24">
              <el-form-item label="备注：" label-width="135px" class="forms" prop="resultMemo">
                 <el-input type="textarea"  v-model="entryResultForm.resultMemo" placeholder="请输入200字以内的备注" style="width:60%" class="memo-textarea"></el-input> 
              </el-form-item>
            </el-col> 
          </el-row>
        </el-form-item>
        <el-form-item class="form-button-box">
          <el-button type="primary" @click="submitEntryResult('entryResultForm')" class="form-button">保存</el-button>
          <el-button type="primary" @click="oncancel('entryResultDialog','entryResultForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <el-dialog
      :title="commonTitle"
      :visible.sync="commonDialog"
      width="30%">
      <span>{{commonContent}}</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogSubmit(commonTitle)">确 定</el-button>
        <el-button type="primary" @click="commonDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="变更提示"
      :visible.sync="tipsDialog"
      width="30%">
      <span>当前竞价信息状态已发生变化，请刷新数据获取最新状态。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="tipsDialogSubmit()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import importFile from "@/components/common/module/ImportFile";

import {
    provinces_based_id,
    subs
} from '@/api/basicSupplier';

import {
  customerName
} from "@/api/customerManage";

 import {
    nameList,
    simpleList,
    organizationListName
  } from "@/api/projectController/projectController";

import {
  getStatusCount,
  getPendingList,
  getBiddingPriceList,
  getQuoteList,
  getPendingFinishList,
  getFinishedList,
  getDeletedList,
  getAbnormalAddressList,
  sendServiceparty,
  getServiceInfo,
  batchPush,
  deleteBiddingPrice,
  transactionVoid,
  retract,
  entryResult,
  getEntryInfo,
  changeServiceParty,
  exportBiddingPriceInfo,
  getServiceParty,
  regionServiceParty,
  editEchoBiddingPriceInfo,
  pushServiceParty,
  getWinningBid
} from '@/api/biddingPrice/biddingPriceMessage';
import { constants } from 'crypto';
import { truncate } from 'fs';
import { formatString} from "@/utils";

export default {
  inject:['reload','close'],
  name:'biddingPriceMessageList',
  components: {
    importFile
  },
  data() {
    var changePrice=(rule,value,callback)=>{
      let reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
      if(reg.test(value)){
        callback();
      }else{
        callback(new Error('请输入包含两位小数的正数！'))
        this.entryResultForm.winningPrice=null;
      }
    }
    return {
      province:[],
      city:[],
      county:[],
      multipleSelection:[],
      projectId:'',
      projectName:[],
      servicePartyId:'',
      servicePartyName:[],
      winningBiddingCompanys:[],
      batchPushDialog:false,
      changeServicePartyDialog:false,
      pushServicePartyDialog:false,
      entryResultDialog:false,
      commonDialog:false,
      commonTitle:'',
      commonContent:'',
      batchPushDialogTile:'',
      DialogTipsContent:'',
      entryResultTitle:'',
      entryResultContent:'',
      deleteBiddingPriceId:'',
      tipsDialog:false,
      importType:'bidding-result-import',
      tableData:[],
      changeServicePartyForm:{
        servicePartySelecRange:'',
        servicePartyId:'',
        serviceParty:''
      },
      changeServicePartyForms:{
        servicePartySelecRange:'',
        servicePartyId:'',
        serviceParty:''
      },
      changeServicePartyRules:{
        servicePartySelecRange:[
          { required:true, message: '请选择服务方选择范围', trigger:'blur'}
        ],
        serviceParty:[
          {required:true, message: '请输入服务方名称', trigger:'change'}
        ]
      },
      entryResultEcho:{
        addressLine:null,
        biddingNo:null,
        id:null,
        partyBId:null,
        partyBName:null,
        projectId:null,
        projectName:null,
        startPrice:null
      },
      entryResultForm:{
        biddingResult:null,
        resultMemo:null,
        winningBiddingCompany:null,
        winningPrice: null
      },
      entryResultForms:{
        biddingResult:null,
        resultMemo:null,
        winningBiddingCompany:null,
        winningPrice: null
      },
      entryResultRules:{
        biddingResult:[
          { required:true, message: '请选择竞价结果', trigger:'blur'}
        ],
        resultMemo:[
          { min: 1, max: 200, message: '长度在 1 到 200 个字符', trigger: 'blur' }
        ],
        winningBiddingCompany:[
          { required:true, message: '请选择中标公司', trigger:'blur'}
        ],
        winningBiddingCompany1:[
          { message: '请选择中标公司', trigger:'blur'}
        ],
        winningPrice:[
          { required:true, message: '请选择中标价', trigger:'blur'},
          {
              type:'number',
              validator:changePrice,
              trigger:'blur'
          }
        ],
        winningPrice1:[
          { message: '请选择中标价', trigger:'blur'}
        ],
      },
      winningBiddingCompany:'',
      list:{
        biddingNo:null,
        biddingResult:null,
        cityId:null,
        countyId:null,
        exteriorNo:null,
        pageNum:1,
        pageSize:10,
        eTime:null,
        sTime:null,
        priceQuoteStatus:null,
        projectId:null,
        provinceId:null,
        reportPreparedStatus:null,
        resultStatus:null,
        serverId:null,
        timeType:null,
        customerNameCustomize:null,
        winningBiddingCompany:null,
        winningBiddingCompanyNameCustomize:null
      },
      endDate:'',
      page:1,
      purchaseNo:'',
      startDate:'',
      purchaserId:'',
      purchaserName:[],
      headerData:[],
      buyerName:[],
      timeType:null,
      status:0,
      total:0,
      isShow:false,
      buttonshow:0,
      loading:false,
      biddingId:null,
      timeout:null,
      form:{
        addressLine:null,
        biddingNo:null,
        countyId:null,
        id:null,
        projectId:null,
        projectName:null,
        reportPreparedServerId:null,
        reportPreparedServerName:null
      },
    }
  },
  created() {
    this.getStatusCount();
    this.getPendingList();
    this.getProvinces();
  },
  activated(){
    if(this.$route.params.isUpdate){
      this.getStatusCount();
      this.search();
    }
  },
  computed:{
    dataListHeight(){
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    search(){
      let n=this.status;
          switch(n){
            case 0:
            this.getPendingList()
            break;
            case 1:
              this.getQuoteList()
            break;
            case 2:
              this.getBiddingPriceList()
            break;
            case 3:
              this.getPendingFinishList()
            break;
             case 4:
            this.getFinishedList()
          break;
          case 5:
            this.getDeletedList()
          break;
          case 6:
            this.getAbnormalAddressList()
          break;
        }
    },
    reset(){
      let list={
        biddingNo:null,
        biddingResult:null,
        cityId:null,
        countyId:null,
        exteriorNo:null,
        pageNum:this.list.pageNum,
        pageSize:this.list.pageSize,
        eTime:null,
        sTime:null,
        priceQuoteStatus:null,
        projectId:null,
        provinceId:null,
        reportPreparedStatus:null,
        resultStatus:this.list.status,
        serverId:null,
        timeType:null,
        customerNameCustomize:null,
        winningBiddingCompany:null,
        winningBiddingCompanyNameCustomize:null
      }
      this.list=list;
      this.search();
    },
    getStatusCount(){
    	getStatusCount().then(res=>{
        this.headerData=res.data
    	})
    },
    header_button_click(index,status){
      this.buttonshow=index;
        if(status==-1){
          this.status=0;
        }else{
          this.status=status;
        }
    		this.requestData(index)
    },
    requestData(index){
      let n=index?index:this.buttonshow;
      this.list.pageNum=1;
    		switch(n){
          case 0:
           this.getPendingList()
           this.status=n;
    			break;
    			case 1:
            this.getQuoteList()
            this.status=n;
          break;
          case 2:
            this.getBiddingPriceList()
            this.status=n;
    			break;
    			case 3:
            this.getPendingFinishList()
            this.status=n;
          break;
          case 4:
            this.getFinishedList()
            this.status=n;
          break;
          case 5:
            this.getDeletedList()
            this.status=n;
          break;
          case 6:
            this.getAbnormalAddressList()
            this.status=n;
          break;
    	}
    },
    getPendingList(){
    	 getPendingList(this.list).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    getBiddingPriceList(){
    	 getBiddingPriceList(this.list).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    getQuoteList(){
    	getQuoteList(this.list).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    getPendingFinishList(){
    	getPendingFinishList(this.list).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    getFinishedList(){
    	getFinishedList(this.list).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    getAbnormalAddressList(){
    	getAbnormalAddressList(this.list).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    getDeletedList(){
    	getDeletedList(this.list).then(res=>{
        if(res.code=='000000'){
          this.tableData = res.data.items;
          this.total = res.data.total;
        }
      })
    },
    cell({row, column, rowIndex, columnIndex}){
      if(columnIndex == 13&&row.reportPreparedStatus==2){
        return 'cell-class-name';
      }
    },
    projectNameRemote(query){
        this.loading = true
        if(query){
          nameList({name:query}).then(res=>{
            this.loading = false
            if(res.code=='000000'){
              this.projectName=res.data
            }
          })
        }
    },
    servicePartyRemote(query,cb){
      this.loading = true
          if(this.changeServicePartyForm.servicePartySelecRange==1){
             regionServiceParty(this.form.countyId,{name:query}).then(res=>{
              this.loading = false
              if(res.code=='000000'){
                this.servicePartyName=res.data;
                this.timeout = setTimeout(() => {
                  cb(this.servicePartyName);
                }, 3000 * Math.random());
              }
            })
          }else{
            getServiceParty({name:query}).then(res=>{
              this.loading = false
              if(res.code=='000000'){
                this.servicePartyName=res.data;
                this.timeout = setTimeout(() => {
                  cb(this.servicePartyName);
                }, 3000 * Math.random());
              }
            })
          }
        
    },
    changeServicePartyRemote(val){
      this.changeServicePartyForm.servicePartyId=val.id;
      this.changeServicePartyForm.serviceParty=val.name;
    },
    servicePartyRemote1(query){
      this.loading = true
        if(query){
            getServiceParty({name:query}).then(res=>{
              this.loading = false
              if(res.code=='000000'){
                this.servicePartyName=res.data
              }
            })
        }
    },
    getWinningBid(query,cb){
      this.loading = true;
        if(query){
            getWinningBid({name:query}).then(res=>{
              this.loading = false
              this.winningBiddingCompanys=[];
              if(res.code=='000000'){
                res.data.forEach((item,key)=>{
                  let j={};
                  j.name=item;
                  this.winningBiddingCompanys.push(j);
                });
                this.timeout = setTimeout(() => {
                  cb(this.winningBiddingCompanys);
                }, 3000 * Math.random());
              }
            })
        }
    },
    querySearchAsync(queryString, cb) {
      if(queryString!=''){
        customerName(queryString).then(res=>{
          if(res.code=='000000'){
            this.customerNames =res.data;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              cb(this.customerNames);
            }, 3000 * Math.random());
          }
        })
       }
    },
    querySearch(query,cb) {
      this.remoteLoading = true;
      getSupplierName({name:query}).then(res=>{
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          cb(res.data);
        }, 3000 * Math.random());
      })
    },
    handleSelect(item) {
      this.customerId=item.id;
    },
    selectionFn(val){
      this.multipleSelection=val;
    },
    batchPush(){
      if(this.multipleSelection.length>0){
        if(this.multipleSelection.length>200){
          this.batchPushDialogTile='警告提示';
          this.DialogTipsContent='本次推送只推送前200条！'
          this.batchPushDialog=true;
        }else{
          let ids=[];
          this.multipleSelection.forEach((item,index)=>{
            ids.push(item.id);
          });
          batchPush(ids).then(res=>{
            if(res.code=='000000'){
              this.batchPushDialogTile='结果提示';
              this.DialogTipsContent=`成功推送${res.data.successCount}条，失败${res.data.failCount}条`;
              this.batchPushDialog=true;
            }
          });
        }
      }else{
        this.batchPushDialogTile='错误提示';
        this.DialogTipsContent='请先选择要批量推送的数据'
        this.batchPushDialog=true;
      }
      
    },
    batchDialog(){
      if(this.batchPushDialogTile=='错误提示'){
        this.batchPushDialog=false;
      }else if(this.batchPushDialogTile=='结果提示'){
        this.batchPushDialog=false;
        this.getStatusCount();
        this.search();
      }else{
        let ids=[];
        for(let i=0;i<200;i++){
          ids.push(this.multipleSelection[i].id);
        }
        batchPush(ids).then(res=>{
          if(res.code=='000000'){
            this.batchPushDialog=true;
            this.batchPushDialogTile='结果提示';
            this.DialogTipsContent=`成功推送${res.data.successCount}条，失败${res.data.failCount}条`;
          }
        });
      }
    },
    pushService(){
      if(this.multipleSelection.length>0){
        this.pushServicePartyDialog=true;
      }else{
        this.batchPushDialogTile='错误提示';
        this.DialogTipsContent='请先选择要批量更改服务方的数据';
        this.batchPushDialog=true;
      }
    },
    pushServiceParty(){
      if(this.multipleSelection.length>0){
        let ids=[];
        this.multipleSelection.forEach((item,index)=>{
          ids.push(item.id);
        });
        pushServiceParty(this.changeServicePartyForm.servicePartyId,ids).then(res=>{
          if(res.code=='000000'){
            this.pushServicePartyDialog=false;
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
              this.batchPushDialogTile='结果提示';
              this.DialogTipsContent=`成功更改${res.data}`;
              this.batchPushDialog=true;
              this.changeServicePartyForm=JSON.parse(JSON.stringify(this.changeServicePartyForms));
              this.getStatusCount();
              this.search();
            },3000 * Math.random());
          }
        });
      }
    },
    biddingResults(type,buttonType) {
      switch(buttonType){
          case 'biddingResult':
            this.importType='bidding-result-import';
    			break;
    			case 'militaryNetworkBidding':
            this.importType='military-network-import';
          break;
          case 'bidding':
            this.importType='bidding-import';
    			break;
      }
      this.$refs[type].init();
    },
    dialogCallback(type) {
      console.log(type);
    },
    importRecord(){
      this.$router.push({
        name: 'BiddingPriceImportRecord',
        params:{
          isUpdate:true
        }
      })
    },
    download(data) {
      if (!data) {
        return;
      }
      let url = window.URL.createObjectURL(new Blob([data], { type:'application/xls'}));
      let link = document.createElement("a");
      link.style.display = "none";
      link.href = url;
      link.setAttribute("download", "竞价信息.xls");
      document.body.appendChild(link);
      link.click();
    },
    exportBiddingPriceInfo(){
    	exportBiddingPriceInfo(this.list,this.status).then(res=>{
          if (!res) {
            this.$message({
              message: "导出失败",
              type: "warning"
            });
          } else if(res.type=='application/json') {
            this.$message({
              message: "导出失败",
              type: "error"
            });
          }else{
            this.download(res);
          }
      }).catch(rej=>{
        console.log(rej.response.data.type);
      })
    },
    addBidding(){
      this.$router.push({
        name: "biddingPriceMessageCreate"
      })
    },
    retainDecimals(row, column){
      let price='';
      if(column.property=='winningPrice'){
        if(row.winningPrice!=null&&row.winningPrice!=undefined){
          price=Number(row.winningPrice).toFixed(2);
          return price='￥'+price;
        }else{

        }
      }
      if(column.property=='startPrice'){
        if(row.startPrice!=null&&row.startPrice!=undefined){
          price=Number(row.startPrice).toFixed(2);
          return price='￥'+price;
        }else{
          
        }
      }
    },
    sendServiceparty(id){
      sendServiceparty(id).then(res=>{
        if(res.code=='000000'){
          this.$message({
            message: '操作成功',
            type: 'success'
          });
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.getStatusCount();
            this.search();
          }, 1000 * Math.random());
        }
      })
    },
    getServiceInfo(id){
      this.biddingId=id;
      getServiceInfo(id).then(res=>{
        if(res.code=='000000'){
          this.changeServicePartyDialog=true;
          this.form=res.data;
        }
      }).catch(rej=>{
        this.commonDialog=false;
        if(rej.response.data.code=='010210009'){
          this.tipsDialog=true;
        }
      })
    },
    changeServiceParty(formName){
      this.$refs[formName].validate((valid) => {
        if(valid) {
          changeServiceParty(this.biddingId,this.changeServicePartyForm.servicePartyId).then(res=>{
            if(res.code=='000000'){
              this.changeServicePartyDialog=false;
              this.changeServicePartyForm=JSON.parse(JSON.stringify(this.changeServicePartyForms));
              this.search();
              this.timeout = setTimeout(() => {
                this.$refs[formName].clearValidate();
              }, 3000 * Math.random());
            }
          }).catch(rej=>{
            this.commonDialog=false;
            if(rej.response.data.code=='170009'){
              this.tipsDialog=true;
            }
          })
          this.$refs[formName].clearValidate();
        } else {
          return false;
        }
      });      
      
    },
    goEdit(id,status){
      editEchoBiddingPriceInfo(id).then(res=>{
        if(res.code=='000000'){
          if(status!=6){
            this.$router.push({
              name: "biddingPriceMessageEdit",
              query:{id:id}
            })
          }else{
            this.$router.push({
              name: "biddingPriceMessageEditAbnormalAddress",
              query:{id:id}
            })
          }
        }
      })
      .catch(rej=>{
        if(rej.response.data.code=='010210009'){
          this.tipsDialog=true;
        }
      })
    },
    tipsDiglog(type,id){
      this.deleteBiddingPriceId=id; 
      switch(type){
        case 'delete':
          this.commonTitle='删除提示';
          this.commonContent='确定要删除该条竞价信息吗？';
        break;
        case 'retract':
          this.commonTitle='撤回提示';
          this.commonContent='撤回后，竞价信息进入待处理状态，服务方不可见该回款信息，已报价的内容清空，确定要撤回吗？';
        break;
        case 'obsolete':
          this.commonTitle='作废提示';
          this.commonContent='请确保已与客户沟通过作废该条竞价信息，还确定要作废吗？';
        break;
      }
      this.commonDialog=true;
    },
    dialogSubmit(type){
      switch(type){
        case '删除提示':
          this.deleteBiddingPrice();
        break;
        case '撤回提示':
          this.retract();
        break;
        case '作废提示':
          this.transactionVoid();  
        break;
      }
    },
    tipsDialogSubmit(){
      this.tipsDialog=false;
      let n=this.status;
      switch(n){
        case 0:
          this.getPendingList()
        break;
        case 1:
          this.getQuoteList()
        break;
        case 2:
          this.getBiddingPriceList()
        break;
        case 3:
          this.getPendingFinishList()
        break;
        case 4:
          this.getFinishedList()
        break;
        case 5:
          this.getDeletedList()
        break;
        case 6:
          this.getAbnormalAddressList()
        break;
      }
    },
    deleteBiddingPrice(){
      deleteBiddingPrice(this.deleteBiddingPriceId).then(res=>{
        if(res.code=='000000'){
          this.commonDialog=false;
          this.$message({
            message:'删除成功',
            type:'success'
          })
          this.search();
          this.getStatusCount();
        } 
      })
      .catch(rej=>{
        this.commonDialog=false;
        if(rej.response.data.code=='010210009'){
          this.tipsDialog=true;
        }
      })
    },
    retract(){
      retract(this.deleteBiddingPriceId).then(res=>{
        if(res.code=='000000'){
          this.commonDialog=false;
          this.$message({
            message:'撤回成功',
            type:'success'
          })
          this.getQuoteList();
          this.getStatusCount();
        } 
      })
      .catch(rej=>{
        this.commonDialog=false;
        if(rej.response.data.code=='170009'){
          this.tipsDialog=true;
        }
      })
    },
    transactionVoid(){
      transactionVoid(this.deleteBiddingPriceId).then(res=>{
        if(res.code=='000000'){
          this.commonDialog=false;
          this.$message({
            message:'交易作废成功！',
            type:'success'
          })
          this.search();
          this.getStatusCount();
        } 
      })
      .catch(rej=>{
        this.commonDialog=false;
        if(rej.response.data.code=='010210009'){
          this.tipsDialog=true;
        }
      })
    },
    goDetail(id){
      this.$router.push({
        name: "biddingPriceMessageDetail",
        query:{
          id:id
        }
      })
    },
    goReportDetail(id){
      this.$router.push({
        name:'biddingBackupsDetail',
        query:{
          detailId:id
        }
      })
    },
    goOrderDetail(id){
      this.$router.push({
        name: 'OrderDetail',
        query:{
          id:id
        }
      })
    },
    entryResult(id){
     this.biddingId=id;
      getEntryInfo(id).then(res=>{
        if(res.code=='000000'){
          this.entryResultDialog=true;
          this.entryResultEcho=res.data;
          this.winningBiddingCompany=res.data.partyBName;
          this.entryResultForm.winningBiddingCompany=this.winningBiddingCompany;
        }
      }).catch(rej=>{
        if(rej.response.data.code=='010210009'){
          this.tipsDialog=true;
        }
      })
    },
    changeResult(){
      if(this.entryResultForm.biddingResult==3){
        this.entryResultForm.winningBiddingCompany=null;
        this.entryResultForm. winningPrice=null;
        this.$refs['entryResultForm'].clearValidate();
      }else{
        this.entryResultForm.winningBiddingCompany=this.winningBiddingCompany;
      }
    },
    submitEntryResult(entryResultForm){
      this.$refs[entryResultForm].validate((valid) => {
        if(valid) {
          entryResult(this.biddingId,this.entryResultForm).then(res=>{
            if(res.code=='000000'){
              this.entryResultDialog=false;
              this.entryResultForm=JSON.parse(JSON.stringify(this.entryResultForms));
              this.$message({
                message:'录入成功！',
                type:'success'
              })
              this.search();
              this.getStatusCount();
              this.$refs[entryResultForm].clearValidate();
            }
          }).catch(rej=>{
            this.commonDialog=false;
            if(rej.response.data.code=='170009'){
              this.tipsDialog=true;
            }
          })
        } else {
          return false;
        }
      });     
    },
    handleCurrentChange(val) {
      this.list.pageNum=val;
      this.search();
    },
    handleSizeChange(val) {
      this.list.pageSize=val;
      this.search();
    },
    digitCheck(val,row,type){
        if(type=='qty'){
          row.qty=Number(row.qty).toFixed(0);
        }
        if(type=='price'){
          let reg=/^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/;
          if(!reg.test(val)){
          row.price=Number(row.price).toFixed(2);
          }
        }  
    },
    filterRow({ row, rowIndex }) {
      row.index = rowIndex;
      if (row.priceQuoteStatus==2) {
        return "warning-row";
      }
      return "";
    },
    getProvinces(){
      provinces_based_id().then(res=>{
        if(res.code=='000000'){
          this.province = res.data;
        }
      })
    },
    getcity(id){
      subs(id).then(res=>{
        if(res.code=='000000'){
          this.city = res.data;
        }
      })
    },
    getcounty(id,val){
      subs(id).then(res=>{
        if(res.code=='000000'){
          this.county = res.data;
          if(val){
            this.form.recipientAddressProvinceId=val.provinceId;
            this.form.recipientAddressCityId=val.cityId;
            this.form.recipientAddressCountyId=val.countyId;
            this.form.recipientAddressLine=val.addressLine;
          }
        }
      })
    },
    onCityChange(val){
      this.form.recipientAddressCountyId='';
      this.list.countyId=null;
      this.getcounty(val);
    },
    onProvincesChange(val){
      this.form.recipientAddressCityId=null;
      this.list.cityId=null;
      this.list.countyId=null;
      this.getcity(val);
    },
    oncancel(type,formName) {
      switch(type){
        case 'changeServicePartyDialog':
          this.changeServicePartyDialog=false;
          this.changeServicePartyForm=JSON.parse(JSON.stringify(this.changeServicePartyForms));
           this.$refs[formName].clearValidate();
        break;
        case 'pushServicePartyDialog':
          this.pushServicePartyDialog=false;
          this.changeServicePartyForm=JSON.parse(JSON.stringify(this.changeServicePartyForms));
           this.$refs[formName].clearValidate();
        break;pushServicePartyDialog
        case 'entryResultDialog':
          this.entryResultDialog=false;
          this.entryResultForm=JSON.parse(JSON.stringify(this.entryResultForms));
          this.$refs[formName].clearValidate();
        break;
      }
    },
    showHelp(){
      this.isShow=!this.isShow;
    }

  }
};
</script>

<style scoped lang='less'>
  @color:#f3f3f3;
 .brandBox {
    width: 100%;
    box-sizing: border-box;
    /deep/.el-table{
      .el-button--small{
        padding: 4px 0;
      }
    }
    .buttonBox {
      margin-top: 10px;
      .active{
      	background-color: #339999;
      	border-color: #339999;
      	color: #FFFFFF;
      }
    }
    .filterBox {
      font-size: 12px;
      background-color: #f3f3f3;
      margin-top: 10px;
      clear: both;
      border: 1px solid #e4e4e4;
      .homeBoxTop{
        height: 50px;
        display: flex;
        justify-content: space-between;
        line-height: 50px;
        padding-left: 20px;
        background-color: #f3f3f3;
        .head-left{
          display: flex;
          align-items: center;
        }
        .myicon{
          font-weight: bold;
          color:#666;
          font-size: 20px;
          line-height: 50px;
          margin-right: 5px;
        }
      }
      span {
        font-size: 14px;
        color: #303133;
      }
      .rightBox {
        float: right;
        span{
        	cursor: pointer;
        }
        .myicon{
          color: #999;
          font-size: 10px;
        }
      }
      .el-button {
        float: right;
        height: 30px;
        margin: 10px 10px 0 10px;
      }
      .homeBoxBottom {
        display: flex;
        flex-wrap: wrap;
        border-top: 1px solid #e4e4e4;
        padding-top: 10px;
        /deep/.el-row{
          /deep/.el-col{
            display: flex;
            flex-wrap: nowrap;
          }
          .span-style{
            display:inline-block;
            width:100px;
            text-align:right;
            line-height: 40px;
          }
          .el-input {
            width: 50%;
            height: 40px;
            margin-right: 10px;
            margin-bottom: 10px;
          }
          .el-select{
            width: 50%;
            height: 40px;
            margin-left: 10px;
            margin-bottom: 10px;
            .el-input {
              width: 100%;
            }
          }
          .el-autocomplete{
            width: 50%;
            height: 40px;
            .el-input {
              width: 100%;
            }
          }
        }
        .address-wrap{
          display: inline-flex;
          flex-wrap: nowrap;
          width: 80%;
          /deep/.el-select{
            width: 30%;
            .el-input{
              width: 100%;
            }
          }
        }
        .time-wrap{
          display:inline-flex;
          flex-wrap: nowrap;
          width: 100%;
          .time-title{
            width: 40%;
            display: inline-flex;
            flex-wrap: nowrap;
            /deep/.el-select{
              width: 65%;
            }
          }
          .time-box{
            width: 60%;
            height: 40px;
            display: flex;
            justify-content:flex-start;
            align-items: center;
            span{
              margin-left: 20px;
            }
            .el-date-editor{
              width: 50%;
              height: 40px;
              margin-left: 0;
              margin-bottom: 0;
            }
            .text{
              line-height: 40px;
            }
          }
        }
      }
    }
    .listBox {
      font-size: 12px;
      background-color:@color;
      border: 1px solid #e4e4e4;
      clear: both;
      margin: 10px 0 0 0;
      .listBoxTop {
        display: flex;
        justify-content: space-between;
        flex-shrink: 0;
        flex-grow: 0;
        flex-wrap: nowrap;
        .listBoxTop-left{
          margin-left: 10px;
          width: 85px;
          .myicon{
            margin-left: 20px;
            font-weight: bold;
            font-size: 20px;
          }
          span {
            margin-left: 5px;
            font-size: 14px;
            color: #303133;
            white-space: nowrap;
            line-height: 50px;
          }
        }
      }
      .listBoxRight {
        display: flex;
        justify-content: flex-end;
        flex-wrap: wrap;
        align-items: center;
        margin:0 20px 0 0;
        .el-button {
         padding: 9px 15px;
         border-radius: 3px;
         font-size: 12px;
        }
      }
      /deep/.el-table {
        margin-top: -2px;
        /deep/.warning-row {
          background: #ffc1c1;
        }
        .el-button {
          font-size: 12px;
        }
        /deep/.cell-class-name{
          .cell{
            color: red;
          }
        }
      }
    }
    /deep/.obsolete{
        .el-dialog{
          width: 60%;
          margin-top:0 ;
          .el-dialog__header{
            background-color:@color; 
          }
          .el-dialog__body{
            padding-top: 0;
            .el-froms{
              border:1px solid #e4e4e4;
              box-sizing: border-box; 
              margin-top: 30px;
              .form-box{
                overflow: auto;
                max-height: 532px;
              }
              table{
                width:100%;
                margin-top:0;
                td,th{
                  border: 1px solid #e4e4e4;
                  font-size:14px;
                  height:40px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                }
                th{
                  padding-right:6px;
                  box-sizing: border-box;
                  color:#666;
                  background: #F9FAFC;
                  font-weight:700;
                  font-size: 14px;
                  text-align: right;
                  width:20%;
                  i{
                    color:red;
                  }
                }
                td{
                  color: #666666;
                  text-align: left;
                  padding-left:10px;
                  width:30%;
                }
              }
              /deep/.el-table{
                width:100%;
                margin:0 auto;
              }
            }

          }
          .el-dialog__footer{
            text-align: center;
              .el-button{
                width: 14%;
                margin-right:40px; 
              }
          }
        }
    }
    /deep/.billing{
      .el-dialog{
          width: 45%;
          overflow: auto;
          max-height: 70%;
          margin-top:0 ;
          .el-dialog__header{
            background-color:@color; 
          }
          .el-dialog__body{
            padding-top: 0;
            .el-row{
              padding:10px;
              span{
                color: red;
              }
            }
            h3{
              padding: 10px;
              background-color:@color;
            }
            .bill-from{
              margin-top:15px;
              .el-form-item__content{
                width:70%;
                .area-elect{
                  width: 154px;
                }
                .el-paytime{
                  display:inline-block;
                  width:35%;
                  .el-form-item__content{
                    width: 100%;
                    .el-input{
                      width: 100%;
                    }
                  }
                 
                }
                .el-textarea__inner{
                  max-height: 70px;
                  overflow: auto;
                }
              }
              .form-button-box{
                  display: flex;
                  margin-top: 15px;
                  justify-content: space-around;
                  .el-form-item__content{
                    text-align: center;
                  }
              }
              .form-box{
                overflow: auto;
                max-height: 532px;
              }
            }
          }
        }
    }
    .form-button-box{
        display: flex;
        margin-top: 15px;
        justify-content: space-around;
        .el-form-item__content{
          text-align: center;
        }
    }
    .block {
      margin-top: 2px;
      display: flex;
      justify-content: flex-end;
    }
    /deep/.el-dialog__wrapper{
      .el-dialog__header{
        background-color: #F2F2F2;
      }
    }
    /deep/.dialog-wrap{
      .el-row{
        margin-top:25px; 
      }
      .memo-textarea{
        .el-textarea__inner{
          height: 110px;
        }
      }
    }
    table{
      width:90%;
      margin:20px auto;
      td,th{
        border: 1px solid #e4e4e4;
        font-size:14px;
        height:53px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      th{
        padding-right:6px;
        box-sizing: border-box;
        color:#666;
        font-weight:700;
        font-size: 14px;
        text-align: right;
        width:20%;
        i{
          color:red;
        }
      }
      td{
        color: #666666;
        text-align: left;
        padding-left:10px;
        width:30%;
      }
    }
    .my-scroll-bar{
      height:200px;
    }
  }
</style>