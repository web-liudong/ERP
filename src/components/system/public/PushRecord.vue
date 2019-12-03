<template>
  <div class="brandBox">
    <div class="filterBox">
      <div class="headerBox">
        <span>项目：sdfadsfadsff</span>
      </div>
      <div class="homeBoxTop">
        <span>
          <i class="iconfont iconsousuo"></i>筛选查询
        </span>
        <div class="rightBox">
          <el-button size="small" class="w80 h40" @click="queryForm()">查询结果</el-button>
        </div>
      </div>
      <div class="homeBoxBottom">
        <span style="width:100px;">操作时间范围：</span>
        <el-date-picker v-model="query.starttime" type="date" placeholder="选择日期"></el-date-picker>
        -
        <el-date-picker v-model="query.endtime" type="date" placeholder="选择日期"></el-date-picker>
        <span>推送类型：</span>
        <el-select v-model="query.type" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>推送记录</span>
        <el-table :data="tableData" border style="width: 100%" size="small">
          <el-table-column prop="date" label="序号" align="center"></el-table-column>
          <el-table-column prop="name" label="操作者" align="center"></el-table-column>
          <el-table-column prop="address" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="address" label="推送类型" align="center"></el-table-column>
          <el-table-column prop="brandstatus" label="失败原因" align="center">
            <template slot-scope="scope">
              <el-button type="text">{{scope.name}}某某文件.xlsx</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="推送结果" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="query.pageNum"
          :page-sizes="[10,20,30,40,50,100,500]"
          :page-size="query.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getDataList } from "@/api/release/specialProjectManage";
export default {
  inject: ["reload"],
  name:'SysPushRecord',
  data() {
    return {
      query: {
        id: "",
        starttime:'',
        endtime:'',
        registrant: "",
        pageNum: 1,
        pageSize: 10
      },
      totalPage: 0,
      tableData: [
        {
          date: "1000001",
          name: "清华同方",
          address: "同方股份有限公司同方股份有限公司",
          brandstatus: "草稿 审核情况 "
        },
        {
          date: "1000002",
          name: "戴尔",
          address: "戴尔有限公司",
          brandstatus: "已通过 审核情况 "
        },
        {
          date: "1000001",
          name: "清华同方",
          address: "同方股份有限公司",
          brandstatus: "草稿 审核情况 "
        },
        {
          date: "1000001",
          name: "清华同方",
          address: "同方股份有限公司",
          brandstatus: "草稿 审核情况 "
        }
      ],
      options: [
        {
          value: "全部",
          label: "全部"
        },
        {
          value: "商品添加",
          label: "商品添加"
        },
        {
          value: "商品详情信息",
          label: "商品详情信息"
        },
        {
          value: "商品上下架",
          label: "商品上下架"
        },
        {
          value: "商品商城价格",
          label: "商品商城价格"
        },
        {
          value: "商品删除",
          label: "商品删除"
        }
      ]
    };
  },
  mounted() {
    //获取表格数据
    this.getTableData();
  },
  methods: {
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.getTableData();
    },
    handleCurrentChange(val) {
      this.query.pageNum = val;
      this.getTableData();
    },
    queryForm() {
      this.query.pageNum = 1;
      this.getTableData();
    },
    //获取表格数据
    getTableData() {
      getDataList(this.query).then(res => {
        this.tableData = res.data.items;
        this.totalPage = res.data.total;
      });
    },
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  .filterBox {
    font-size: 12px;
    background-color: #f3f3f3;
    margin: 10px 0;
    clear: both;
    border: 1px solid #e4e4e4;
    .headerBox {
      border-bottom: 1px solid #e4e4e4;
      height: 50px;
      line-height: 50px;
      span {
        margin-left: 10px;
        width: auto;
      }
    }
    .homeBoxTop {
      height: 50px;
      line-height: 50px;
    }
    span {
      font-size: 14px;
      margin-left: 10px;
      color: #303133;
      display: inline-block;
      width: 80px;
      text-align: right;
    }
    .rightBox {
      float: right;
    }
    .el-button {
      float: right;
      height: 30px;
      margin: 10px 10px 0 10px;
    }
    .homeBoxBottom {
      border-top: 1px solid #e4e4e4;
      margin-top: -2px;
      .el-input {
        width: 140px;
        height: 40px;
        margin: 10px 0;
        margin-left: 10px;
      }
      .el-select {
        margin-left: 10px;
      }
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 20px 0 0 0;
    line-height: 50px;
    .listBoxTop {
      span {
        margin-left: 10px;
        font-size: 14px;
        color: #303133;
      }
    }
    .listBoxRight {
      float: right;
      margin-right: 10px;
      .white-btn {
        margin-top: 10px;
        margin-right: 10px;
      }
    }
    .el-table {
      margin-top: -2px;
      .el-button {
        font-size: 12px;
      }
    }
  }
  .block {
    margin-top: 10px;
    float: right;
  }
}
</style>
