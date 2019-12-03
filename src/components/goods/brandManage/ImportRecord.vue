<template>
  <div class="brandBox">
    <div class="buttonBox">
      <el-button
        size="small"
        :class="{active:index==isActive}"
        v-for="(item,index) in headers"
        @click="changeTab(index)"
        :key="index"
      >{{item.statusName}}</el-button>
    </div>
    <div class="listBox">
      <div class="listBoxTop">
        <span>
          <i class="iconfont iconjinridingdanshu"></i>数据列表
        </span>
        <el-table :data="BrandImportFileLogDTO" border style="width: 100%" size="small">
          <el-table-column prop="id" label="序号" align="center"></el-table-column>
          <el-table-column prop="userName" label="操作者" align="center"></el-table-column>
          <el-table-column prop="importTime" label="操作时间" align="center"></el-table-column>
          <el-table-column prop="name" label="导入文件" align="center">
            <template slot-scope="scope">
              <el-button
                @click="downfile(scope.row)"
                type="text"
                v-if="scope.row.importFilePathDTO!=null"
              >{{scope.row.importFilePathDTO.name}}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="userId" label="导入失败反馈" align="center">
            <template slot-scope="scope">
              <el-button
                @click="downfile1(scope.row)"
                type="text"
                v-if="scope.row.importErrorFilePathDTO!=null"
              >{{scope.row.importErrorFilePathDTO.name}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="brandImportFileLogParam.pageNum"
          :page-size="brandImportFileLogParam.pageSize"
          :page-sizes="[10,20,30,40,50,100,500]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="paginations.total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { findBrandImportFileLogDTOList } from "@/api/brandManage";
import Butt from "../../common/Button/index";
export default {
  inject: ["reload"],
  name: "ImportRecord",
  data() {
    return {
      //table表格的数据结构
      BrandImportFileLogDTO: [
        {
          id: 0,
          importErrorFileId: 0,
          useId: 0,
          importErrorFileName: "",
          importErrorFilePath: "",
          importTime: "",
          importFileId: 0,
          importFileName: "",
          importFilePath: ""
        }
      ],
      //品牌导入的参数
      brandImportFileLogParam: {
        pageNum: 1,
        pageSize: 10,
        type: 0
      },
      headers: [{ statusName: "品牌新建导入" }, { statusName: "品牌更新导入" }],
      isActive: "",
      //分页器
      paginations: {
        total: 0
      }
    };
  },
  created() {
    //获取数据列表
    this.getDataList();
  },
  methods: {
    //获取数据列表
    getDataList() {
      findBrandImportFileLogDTOList(this.brandImportFileLogParam).then(res => {
        //获取导入文件
        this.BrandImportFileLogDTO = res.data.items;
        this.paginations.total = res.data.total;
        this.BrandImportFileLogDTO.pageNum = res.data.pageNum;
        this.BrandImportFileLogDTO.pageSize = res.data.pageSize;
      });
    },
    changeTab(index) {
      this.isActive = index;
      this.brandImportFileLogParam.type = index;
      this.getDataList();
    },
    handleClick(row) {
      console.log(row);
    },
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.brandImportFileLogParam.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.brandImportFileLogParam.pageNum = val;
      this.getDataList();
    },
    showHelp() {
      this.isShow = !this.isShow;
    },
    downfile(row) {
      let href =
        "/api/file-service/file/download?id=" +
        row.importFilePathDTO.id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
    },
    downfile1(row) {
      let href =
        "/api/file-service/file/download?id=" +
        row.importErrorFilePathDTO.id +
        "&access_token=" +
        this.$auth.token;
      window.open(href, "_blank");
    }
  }
};
</script>
<style scoped lang="less">
.brandBox {
  width: 100%;
  .buttonBox {
    margin-top: 10px;
    .active {
      background-color: #339999;
      border-color: #339999;
      color: #ffffff;
    }
  }
  .listBox {
    font-size: 12px;
    background-color: #f3f3f3;
    border: 1px solid #e4e4e4;
    clear: both;
    margin: 10px 0 0 0;
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
