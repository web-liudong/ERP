<template>
  <div class="priceList">
    <div class="selectBox">
      <el-button
        size="small"
        v-for="(item,index) in statusData"
        :key="index"
        :class="{ active: buttonshow==index }"
        @click="header_button_click(index,item.status)"
      >{{item.statusName}}（{{item.statusCount}}）</el-button>
    </div>

    <div class="filterBox">
      <div class="leftBox">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <span @click="showHelp()" style="cursor: pointer">
            <i class="el-icon-arrow-up" v-show="isShow"></i>
            <i class="el-icon-arrow-down" v-show="!isShow"></i>
            {{isShow?screenInfo:screenBrand}}
          </span>

          <el-button size="small" class="w80 h40" @click="queryForm()">查询结果</el-button>
          <el-button size="small" class="w80 h40" @click="reset()" style="margin-left:10px">重置</el-button>
        </div>
      </div>
      <el-collapse-transition>
        <div class="bottomBox" v-show="isShow">
          <div class="module">
            <span>报备信息ID：</span>
            <el-input v-model="reportPreparedNo" clearable placeholder="请输入"></el-input>
          </div>
          <div class="module">
            <span>外部竞价编号：</span>
            <el-input v-model="exteriorNo" clearable placeholder="请输入"></el-input>
          </div>
          <div class="module">
            <span>服务方：</span>
            <el-select
              v-model="serverId"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod2"
            >
              <el-option
                v-for="item in options1"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="module">
            <span>创建人：</span>
            <el-select
              v-model="createUserName"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod6"
            >
              <el-option
                v-for="item in options6"
                :key="item.id"
                :label="item.realName"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="module">
            <span>项目名称：</span>
            <el-select
              v-model="projectId"
              filterable
              remote
              clearable
              reserve-keyword
              placeholder="请输入"
              :remote-method="remoteMethod1"
            >
              <el-option
                v-for="item in options3"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="module">
            <span>客户：</span>
            <el-autocomplete
              popper-class="my-autocomplete"
              v-model="customerNameCustomize"
              :fetch-suggestions="querySearch"
              value-key="name"
              placeholder="请输入"
              :trigger-on-focus="false"
              @select="handleSelect"
              clearable
            ></el-autocomplete>
          </div>
          <div class="module">
            <span>采购人：</span>
            <el-input v-model="purchaserName" clearable placeholder="请输入"></el-input>
          </div>

          <div class="module" style="width: 50%;">
            <span>收货地址：</span>
            <el-select v-model="provinceId" clearable placeholder="省/直辖市" @change="getcity">
              <el-option
                v-for="(item,index) in provinces"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="cityId" clearable placeholder="市" @change="getcountry">
              <el-option
                v-for="(item,index) in city"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <el-select v-model="countyId" clearable placeholder="区/县">
              <el-option
                v-for="(item,index) in country"
                :key="item.name + index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="module" style="width: 50%;">
            <span>时间：</span>
            <el-select style="width:50%;" v-model="createTime">
              <el-option
                v-for="item in options0"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-date-picker
              v-model="Time"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="selectPicker"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </div>
        </div>
      </el-collapse-transition>
    </div>

    <div class="mainBox">
      <div class="leftBox">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <div class="rBox">
          <router-link
            :to="{name:'myBackupsCreate', params:{isUpdate:true}}"
            v-if="$authorities.myBackupsCreate"
          >
            <div class="operation_btn">
              <i class="iconfont iconzengjia"></i>添加
            </div>
          </router-link>
          <!-- <el-button
            size="small"
            style="margin-right:10px;"
            @click="openNew('myBackupsCreate')"
            v-if="$authorities.myBackupsCreate"
          >
            <i class="iconfont iconzengjia" style="font-size:12px"></i>添加
          </el-button>-->
        </div>
      </div>
      <el-table
        :data="query"
        border
        size="small"
        :cell-style="cellstyle"
        :max-height="dataListHeight"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="reportPreparedNo" label="报备信息ID" width="80" align="center"></el-table-column>
        <el-table-column
          prop="exteriorNo"
          label="外部竞价编号"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>

        <el-table-column prop="createTime" label="创建时间" width="120" align="center"></el-table-column>
        <el-table-column prop="serverName" label="服务方" width="120" align="center"></el-table-column>
        <el-table-column width="120" label="创建人" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showPeoInfo(scope.row.createUserName)"
            >{{scope.row.createUserName}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="projectName"
          label="项目"
          width="120"
          align="center"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="customerNameCustomize" label="客户" width="120" align="center"></el-table-column>
        <el-table-column prop="purchaserName" label="采购人" align="center"></el-table-column>
        <el-table-column prop="purchaserPhone" label="采购人联系方式" align="center"></el-table-column>
        <el-table-column
          prop="detailAddressLine"
          label="收货地址"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
        ></el-table-column>
        <el-table-column prop="priceQuote" label="报价" width="120" align="center"></el-table-column>
        <el-table-column label="报备状态" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.statusName}}
            <el-button
              type="text"
              size="small"
              @click="goReDetail(scope.row.biddingId)"
              v-if="$authorities.presentationPriceDetail"
              v-show="scope.row.status==2"
            >查看报价详情</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="opertion" label="操作" width="150" align="center" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="goEdit(scope.row.id)"
              v-show="scope.row.status==0"
              v-if="$authorities.myBackupsEdit"
            >编辑</el-button>

            <el-button
              type="text"
              size="small"
              @click="cancel(scope.row.id)"
              v-show="scope.row.status==0||scope.row.status==1"
              v-if="$authorities.myBackupsCancel"
            >取消</el-button>

            <el-button
              type="text"
              style="text-align:center"
              size="small"
              @click="goDetail(scope.row.id)"
              v-if="$authorities.myBackupsDetail"
            >详情</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.pageNum"
        :page-size="this.pageSize"
        :page-sizes="[10,20,30,40,50,100,500]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    </div>
    
    <el-dialog title="人员信息" :visible.sync="peo" width="25%" class="people">
      <table border="1" :data="infor">
        <tr>
          <th>姓名：</th>
          <td>{{infor.realName}}</td>
        </tr>
        <tr>
          <th>手机号：</th>
          <td>{{infor.mobile}}</td>
        </tr>
        <tr>
          <th>电话号码：</th>
          <td>{{infor.telephone}}</td>
        </tr>
        <tr>
          <th>职务信息：</th>
          <td>{{infor.userPosts[0].organizationName}}-{{infor.userPosts[0].departmentName}}-{{infor.userPosts[0].post}}</td>
        </tr>
      </table>
    </el-dialog>
    <el-dialog title="删除提示" :visible.sync="DialogVisible" width="30%">
      <span>确定要删除该条竞价信息吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="DialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ensure()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="变更提示" :visible.sync="dialogBlock" width="30%">
      <span>当前报备信息状态已发生变化，请刷新数据获取最新状态。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="fresh()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { provinces_based_id, subs } from "@/api/basicSupplier";
import { nameList } from "@/api/projectController/projectController";
import { customerNameList, customerUserNameList } from "@/api/order/saleDown";
import { customerName } from "@/api/customerManage";
import { fuzzySearch } from "@/api/organizationManage";
import {
  statusCount,
  statusNoMatch,
  statusMatchError,
  statusAlMatch,
  statusDelete,
  reporeDelete,
  reporeEditEcho
} from "@/api/biddingMyReportPrepared";
import { getUserList, getusername } from "@/api/organizationManage";

export default {
  components: {},
  name: "myBackupsList",
  inject: ['reload', 'isFilterShow'],
  data() {
    return {
      isShow: this.isFilterShow,
      screenInfo: "收起筛选",
      screenBrand: "展开筛选",
      buttonshow: 0,
      DialogVisible: false,
      dialogBlock: false,
      peo: false,
      options3: [],
      options1: [],
      options2: [],
      options6: [],
      statusData: [],
      createTime: "创建时间",
      Time: [],
      status: 0,
      pageNum: 1,
      pageSize: 10,

      total: 0,
      id: null,
      cityId: "",
      countyId: "",
      createUserName: "",
      customerNameCustomize: "",
      endCreateTime: "",
      exteriorNo: "",
      projectId: "",
      provinceId: "",
      purchaserName: "",
      reportPreparedNo: "",
      serverId: "",
      startCreateTime: "",
      query: [],
      id: "",
      provinces: [],
      country: [],
      city: [],
      infor: {
        userPosts: [{}],
        roles: [{}]
      },
      customerOptions: [],
      options0: [
        {
          value: "createTime",
          label: "创建时间"
        }
      ]
    };
  },
  created(){
     this.getStatus();
       this.getList0();
  },
  mounted() {
    this.getProvinces();
  },
  activated() {
    if (this.$route.params.isUpdate) {
      this.resquestData();
       this.getStatus();

    }
  },
  computed: {
    dataListHeight() {
      return this.$store.getters.dataListHeight;
    }
  },
  methods: {
    reset() {
      (this.reportPreparedNo = ""),
        (this.exteriorNo = ""),
        (this.customerNameCustomize = ""),
        (this.serverId = ""),
        (this.createUserName = ""),
        (this.projectId = ""),
        (this.countyId = ""),
        (this.provinceId = ""),
        (this.purchaserName = ""),
        (this.startCreateTime = ""),
        (this.endCreateTime = ""),
        (this.cityId = ""),
        (this.Time = ""),
        this.resquestData();
    },
    showPeoInfo(createUserName) {
      this.peo = true;
      this.query.createUserName = createUserName;
      this.geto();
      // this.createUserName = null;
    },
    geto() {
      getUserList({ realName: this.query.createUserName }).then(res => {
        if ((res.code = "000000")) {
          this.infor = res.data.items[0];
        }
      });
    },

    cellstyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex == 5) {
        return "color:#339999";
      }
      if (columnIndex == 12 && row.status == 1) {
        return "color:red";
      }
    },
    getStatus() {
      statusCount().then(res => {
        this.statusData = res.data;
        // this.status=res.data[0].status;
      });
    },
    header_button_click(index, status) {
      this.buttonshow = index;
      this.status = status;
      this.resquestData(index);
    },
    resquestData(index) {
      let n = index ? index : this.buttonshow;
      switch (n) {
        case 0:
          this.getList0();
          break;
        case 1:
          this.getList1();
          break;
        case 2:
          this.getList2();
          break;
        case 3:
          this.getList3();
          break;
      }
    },
    remoteMethod1(query) {
      if (query !== "") {
        nameList({ name: query }).then(res => {
          this.options3 = res.data;
        });
      } else {
        this.options3 = [];
      }
    },

    fresh() {
      this.dialogBlock = false;
      switch (this.status) {
        case 0:
          this.getList0();
          break;
        case 1:
          this.getList1();
          break;
      }
    },
    querySearch(queryString, cb) {
      customerName(queryString).then(res => {
        if ((res.code = "000000")) {
          var restaurants = res.data;
          cb(restaurants);
        }
      });
    },
    cancel(id) {
      this.DialogVisible = true;
      this.id = id;
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.name.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },

    handleSelect(item) {
      this.query.customerId = item.id;
      this.query.customerNameCustomize = item.name;
    },
    ensure() {
      reporeDelete(this.id)
        .then(res => {
          if ((res.code = "000000")) {
            this.$message({
              message: "取消成功",
              type: "success"
            });
            this.DialogVisible = false;
            this.queryForm();
            this.getStatus();
          } else if (/^98/.test(res.code)) {
            this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.reload();
              }
            });
          }
        })
        .catch(rej => {
          switch (rej.response.data.code) {
            case "010210027":
              this.dialogBlock = true;
              break;
          }
        });
    },

    remoteMethod2(query) {
      if (query !== "") {
        fuzzySearch({ name: query }).then(res => {
          this.options1 = res.data;
        });
      } else {
        this.options1 = [];
      }
    },

    // remoteCustomerUser(query) {
    //   if (query !== "") {
    //     if (this.query.customerId) {
    //       customerUserNameList({
    //         userName: query,
    //         customerId: this.query.customerId
    //       }).then(res => {
    //         this.options2 = res.data;
    //       });
    //     }
    //   } else {
    //     this.options2 = [];
    //   }
    // },
    remoteMethod6(query) {
      if (query !== "") {
        getusername({ userName: query }).then(res => {
          this.options6 = res.data;
          console.log(res.data);
          //  this.realName=this.options6.userPosts[0].realName;
          //  console.log(this.realName)
        });
      } else {
        this.options6 = [];
      }
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    goDetail(id) {
      this.$router.push({
        name: "myBackupsDetail",
        query: { id: id }
      });
    },
    goEdit(id) {
      reporeEditEcho(id)
        .then(res => {
          if ((res.code = "000000")) {
            this.$router.push({
              name: "myBackupsEdit",
              query: { id: id }
            });
          } else if (/^98/.test(res.code)) {
            this.$alert("当前数据状态已发生变化，请刷新获取最新数据", "提示", {
              confirmButtonText: "确定",
              callback: action => {
                this.reload();
              }
            });
          }
        })

        .catch(rej => {
          if ((rej.response.data.code = "010210027")) {
            this.dialogBlock = true;
          }
        });
    },
    goReDetail(id) {
      this.$router.push({
        name: "PresentationPriceDetail",
        query: { id: id }
      });
    },

    handleSizeChange(val) {
      this.pageSize = val;
      this.queryForm();
    },
    handleCurrentChange(val) {
      this.pageNum = val;

      this.queryForm();
    },
    getcount() {
      statusCount().then(res => {
        if (res.code == "000000") {
          this.statusBag = res.data;
        }
      });
    },

    queryForm() {
      switch (this.status) {
        case 0:
          this.getList0();
          break;
        case 1:
          this.getList1();
          break;
        case 2:
          this.getList2();
          break;
        case 3:
          this.getList3();
          break;
      }
    },
    add(name, query) {
      let routeData = this.$router.resolve({
        name: name,
        query: query
      });
      window.open(routeData.href, "_blank");
    },
    getProvinces() {
      provinces_based_id().then(res => {
        if (res.code == "000000") {
          this.provinces = res.data;
        }
      });
    },
    getcity(id) {
      this.city = [];
      this.county = [];
      this.cityId = "";
      this.countyId = "";
      if (id <= 0) {
        return false;
      }
      subs(id).then(res => {
        if (res.code == "000000") {
          this.city = res.data;
        }
      });
    },
    getcountry(id) {
      this.country = [];
      this.query.countyId = "";
      if (id <= 0) return false;
      subs(id).then(res => {
        if (res.code == "000000") {
          this.country = res.data;
        }
      });
    },
    getList0() {
      let data = {
        cityId: this.cityId,
        countyId: this.countyId,
        createUserId: this.createUserName,
        customerNameCustomize: this.customerNameCustomize,
        endCreateTime: this.endCreateTime,
        exteriorNo: this.exteriorNo,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        projectId: this.projectId,
        provinceId: this.provinceId,
        purchaserName: this.purchaserName,
        reportPreparedNo: this.reportPreparedNo,
        serverId: this.serverId,
        startCreateTime: this.startCreateTime
      };
      statusNoMatch(data).then(res => {
        if ((res.code = "000000")) {
          this.query = res.data.items;
          this.pageSize = res.data.pageSize;
          this.pageNum = res.data.pageNum;
          this.total = res.data.total;
        }
      });
    },
    getList2() {
      statusAlMatch({
        cityId: this.cityId,
        countyId: this.countyId,
        createUserId: this.createUserName,
        customerNameCustomize: this.customerNameCustomize,
        endCreateTime: this.endCreateTime,
        exteriorNo: this.exteriorNo,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        projectId: this.projectId,
        provinceId: this.provinceId,
        purchaserName: this.purchaserName,
        reportPreparedNo: this.reportPreparedNo,
        serverId: this.serverId,
        startCreateTime: this.startCreateTime
      }).then(res => {
        if ((res.code = "000000")) {
          this.query = res.data.items;
          this.total = res.data.total;
        }
      });
    },
    getList1() {
      statusMatchError({
        cityId: this.cityId,
        countyId: this.countyId,
        createUserId: this.createUserName,
        customerNameCustomize: this.customerNameCustomize,
        endCreateTime: this.endCreateTime,
        exteriorNo: this.exteriorNo,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        projectId: this.projectId,
        provinceId: this.provinceId,
        purchaserName: this.purchaserName,
        reportPreparedNo: this.reportPreparedNo,
        serverId: this.serverId,
        startCreateTime: this.startCreateTime
      }).then(res => {
        if ((res.code = "000000")) this.query = res.data.items;
        this.total = res.data.total;
      });
    },
    getList3() {
      statusDelete({
        cityId: this.cityId,
        countyId: this.countyId,
        createUserId: this.createUserName,
        customerNameCustomize: this.customerNameCustomize,
        endCreateTime: this.endCreateTime,
        exteriorNo: this.exteriorNo,
        pageNum: this.pageNum,
        pageSize: this.pageSize,
        projectId: this.projectId,
        provinceId: this.provinceId,
        purchaserName: this.purchaserName,
        reportPreparedNo: this.reportPreparedNo,
        serverId: this.serverId,
        startCreateTime: this.startCreateTime
      }).then(res => {
        if ((res.code = "000000")) this.query = res.data.items;
        this.query = res.data.items;
        this.total = res.data.total;
      });
    },
    selectPicker(time) {
      if (time) {
        this.startCreateTime = time[0];
        this.endCreateTime = time[1];
      } else {
        this.startCreateTime = "";
        this.endCreateTime = "";
      }
    }
  }
};
</script>
<style scoped lang='less'>
.priceList {
  width: 100%;
  clear: both;
}
.selectBox {
  margin-top: 10px;
  .active {
    background-color: #339999;
    border-color: #339999;
    color: #ffffff;
  }
}
.filterBox {
  font-size: 12px;

  margin: 10px 0;
  clear: both;
  border: 1px solid #e4e4e4;
  .leftBox {
    height: 50px;
    line-height: 50px;
    background-color: #f3f3f3;
    i {
      margin-right: 5px;
    }
  }
  span {
    font-size: 14px;
    margin-left: 10px;
    color: #333;
  }
  .rightBox {
    float: right;
    overflow: hidden;
    height: 45px;
  }
  .el-button {
    float: right;
    height: 30px;
    margin: 10px 8px 0 3px;
  }
}

.el-table .cell {
  white-space: pre-line;
}
.bottomBox {
  border-top: 1px solid #e4e4e4;
  margin-top: -2px;
  display: flex;
  flex-wrap: wrap;
  span {
    margin: 0 0 0 10px;
    flex: 0 0 100px;
    text-align: right;
  }
  .module {
    width: 25%;
    display: flex;
    align-items: center;
  }
  .el-input {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }
  .el-autocomplete {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }
  .el-select {
    width: 200px;
    line-height: 56px;
    margin-left: 10px;
  }

  .el-date-editor {
    margin: 10px 0 10px 10px;
    width: 100%;
  }
}
.mainBox {
  font-size: 12px;
  clear: both;
  border-top: 1px solid #e4e4e4;
  .leftBox {
    height: 50px;
    line-height: 50px;
    background-color: #f3f3f3;
     border-left: 1px solid #e4e4e4;
     border-right: 1px solid #e4e4e4;
    i {
      margin-right: 5px;
    }
  }
  .rBox {
    float: right;
    margin-right: 10px;
  }
  span {
    font-size: 14px;
    margin-left: 10px;
    color: #303133;
  }
}
.abb {
  color: red;
}
.block {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}
.my-autocomplete {
  li {
    line-height: normal;
    padding: 7px;

    .name {
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .addr {
      font-size: 12px;
      color: #b4b4b4;
    }
  }
}
.people {
  /deep/.el-dialog__body {
    padding: 0 !important;
  }
}

table {
  width: 100%;
 border-left: 1px solid #e4e4e4;
  border-right: 1px solid #e4e4e4;
   border-bottom: 1px solid #e4e4e4;
  td,
  th {
    border: 1px solid #d1d1d1;
    font-size: 14px;
    height: 53px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  th {
    font-weight: bold;
    text-align: right;
    width: 25%;
    background-color: #f2f2f2;
  }
  td {
    color: #666666;
    text-align: left;
    padding-left: 10px;
  }
}
</style>
 <style >
.el-tooltip__popper {
  height: 80px;
  background-color: white;
}
</style> 
<style scoped>
.priceList >>> .el-table .el-button--small {
  padding: 4px 0;
}
</style>