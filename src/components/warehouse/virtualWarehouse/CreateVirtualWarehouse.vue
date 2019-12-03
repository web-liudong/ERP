<template>
  <div class="redactBox">
    <div class="redactTable">
      <div class="redactTopBox">
        <span><i></i>新增虚拟仓</span>
      </div>
      <el-form :model="addData" :rules="rules" ref="ruleForm" label-width="150px">
        <el-form-item label="虚拟仓库名称：" prop="name">
          <el-input v-model="addData.name" placeholder="字数长度1~50以内"></el-input>
        </el-form-item>
        <el-form-item label="虚拟仓库描述："  prop="description">
          <el-input type="textarea" v-model="addData.description" placeholder="请输入500字以内"></el-input>
        </el-form-item>
        <el-form-item label="选择要关联的仓库：" prop="warehouseIds">
          <el-transfer
            :props="{
              key: 'id',
              label: 'name'
            }"
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入城市拼音"
            :titles="['仓库选项列表','已选仓库']"
            v-model="addData.warehouseIds"
            :data="warehouseList">
          </el-transfer>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-show="$authorities.WarehouseAdminCreateRelevant"
                     @click="submitFormAdd('ruleForm')">提交并保存
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {
    postWarehouseDvailableList,
    getWarehouseViewedby,
  } from '@/api/warehouse/warehouseAdmin'
  import {
    postVirtualWarehouseCreate,
    putVirtualWarehouseUpdated,
    deleteVirtualWarehouseDelete,
    getVirtualWarehouseDetaills,
    getVirtualWarehouseUpdateDetaills,
    postVirtualWarehouseList,
    postVirtualWarehouseRelatedList,
    postVirtualWarehouseSKUList,
    postWarehouseList,
    postVirtualWarehouseRelatedListAll
  } from '@/api/warehouse/virtualWarehouse'
  import {
    provinces_based_id,
    subs,
    postSupplierOptions,
    postBrandOptions,
    deleteFileDelete
  } from "@/api/common/commonApi"
  import {simpleList} from "@/api/userService"

  export default {
    inject:['reload','close'],
    name:'CreateVirtualWarehouse',
    data() {
      return {
        value2: [],
        warehouseList: [],
        addData: {
          description: "",
          name: "",
          warehouseIds: [],
        },

        loading: false,
        rules:
          {
            warehouseIds: [
              {required: true, message: '请选择仓库', trigger: 'blur'}
            ],
            name: [
              {required: true, message: '请输入仓库名称', trigger: 'blur'},
              {min: 1, max: 50, message: '长度在 1 到 50 个字符', trigger: 'blur'}
            ],
            description: [
              {min: 0, max: 500, message: '长度在 0 到 500 个字符', trigger: 'blur'}
            ],
          }
      }
    },
    created() {
      this.postWarehouseList();
      //this.getVirtualWarehouseUpdateDetaills();
    },
    mounted() {

    },
    methods: {
      //获取编辑信息
      getVirtualWarehouseUpdateDetaills() {
        //请求列表
        getVirtualWarehouseUpdateDetaills(5
          //this.$route.query.id
        ).then((res) => {
          this.addData.description = res.data.description;
          this.addData.name = res.data.name;
          let idArr=[];
          for (var i=0; i<res.data.virtualWarehouseRelatedDTOS.length;i++){
            idArr.push(res.data.virtualWarehouseRelatedDTOS[i].warehouseId)
          }
          this.addData.warehouseIds = idArr;
          console.log(this.addData)
        }).catch(err => {
          console.log(err)
        });
      },
      //模糊搜索本地
      filterMethod(query, item) {
        console.log(item);
        return item.name.indexOf(query) > -1;
      },
      //获取可用仓库列
      postWarehouseList(data) {
        //请求列表
        postVirtualWarehouseRelatedListAll({}
        ).then((res) => {
          this.warehouseList = res.data;
          console.log(this.warehouseList)
        }).catch(err => {
          console.log(err)
        });
      },
      //
      //编辑保存
      putVirtualWarehouseUpdated() {
        putVirtualWarehouseUpdated(6,
          {
            //id:this.$route.query.id
            id:5,
            description: this.addData.description,
            name: this.addData.name,
            warehouseIds: this.addData.warehouseIds,
          }
        )
          .then((res) => {

            if (res.code == '000000') {
              this.$message({
                message: '保存成功',
                type: "success",
              });
             // this.$router.push({name: 'VirtualWarehouseAdmin'})
            } else {
              this.$message({
                message: '保存失败',
                type: 'warning',
              })
            }
            console.log(res)
          }).catch(err => {
          console.log(err)
        });
      },
      //新增保存
      postVirtualWarehouseCreate() {
        postVirtualWarehouseCreate(
          this.addData
        )
          .then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '保存成功',
                type: "success",
              });
              this.close({name:'CreateVirtualWarehouse', to: {name:'VirtualWarehouseAdmin', params:{isUpdate:true}}});
            } else {
              this.$message({
                message: '保存失败',
                type: 'warning',
              })
            }
            console.log(res)
          }).catch(err => {
          console.log(err)
        });
      },
      //提交保存
      submitFormAdd(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(this.addData);
          if (valid) {
            this.postVirtualWarehouseCreate();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //重置
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    },
  }
</script>
<style>
  .redactBox .el-form-item__error {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    /*position: absolute;*/
    /*top: 12px;*/
    /*left: 450px;*/
  }
</style>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .redactBox {
    width: 100%;
    padding-top: 10px;
    .redactTable {
      border: 1px solid #d1d1d1;
      .redactTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        margin-bottom: 20px;
        span {
          line-height: 50px;
          margin-left: 10px;
          i {

          }
        }
      }
      .el-form {
        margin: 0 0 50px 50px;
        .el-form-item {
          .el-form-item__content {
            .label {
              margin-left: 20px;
              display: inline-block;
              width: 130px !important;
              text-align: right;
            }
            .el-input {
              width: 400px;
            }
            .el-textarea {
              width: 400px;
            }
            .el-select {
              width: 400px;
            }
          }
        }
      }
    }
  }
</style>
