<template>
  <div class="detaillBox"  v-if="$authorities.WarehouseLocationAdmin">
    <div class="detaillTable clear"  >
      <div class="detaillTopBox">
        <span><i></i>区位管理</span>
        <span style="float: right;margin-right: 50px;"> 仓库ID：{{this.$route.query.Id}}    &nbsp;  &nbsp; &nbsp;    仓库名称 ：{{this.$route.query.name}}</span>      </div>
      <div style="text-align: center;margin: 20px;">
        <span style="font-size: 14px">新增区位数量：</span>
        <el-input v-model="locationCreateData.areaCount" placeholder="请输入新增数量" style="width:150px;"></el-input>
        <span style="font-size: 14px;margin-right: 10px;">个</span>
        <el-button type="primary" style="float:none" @click="postWarehouseLocationCreate()">新增区位</el-button>
      </div>
      <el-table
        :data="areaData"
        border
        stripe

        max-height="400"
        style="width: 90%;"
        size="small">
        <el-table-column
          prop="areaNo"
          label="区位码"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="routeWayCount"
          label="通道数量/每区"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="shelfCount"
          label="货架数量/每通道"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="levelCount"
          label="层数/每货架"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="cellCount"
          label="位数/每层"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="enableCount"
          label="已启用库位数合计"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          align="center">
          <template slot-scope="scope">
            <el-button @click="clickclickLocationUpdate(scope.row)"
                       type="text" size="small">编辑
            </el-button>
            <el-button type="text" size="small"
                       @click="clickLocationDelete(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="detaillTable clear" style="margin-bottom: 50px">
      <div class="detaillTopBox">
        <span><i></i>库位管理</span>
      </div>
      <div style="margin: 0px auto;margin-top: 15px; width: 90%" class="clear">
        <el-tabs v-model=" locationListData.areaNo" @tab-click="handleClick" style="width: 85%; float: left;">
          <el-tab-pane v-for="(item,index) in areanoData" :label='item' :name="item" :key="index"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" style="float:left;margin-left: 2%; " @click="dialogBatchPrint = !dialogBatchPrint">
          批量打印
        </el-button>
      </div>
      <el-table
        :data="locationData"
        border
        show-summary
        stripe
        max-height="400"
        style="width: 90%;"
        size="small">
        <!--<el-table-column label="当前区位内：通道数量合计（2）、货架数量合计（4）、货架层数合计（8）、库位数合计（16）、已启用库位数合计（14）">-->
        <el-table-column
          prop="warehouseId"
          label="仓库ID"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="areaNo"
          label="区位"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="routeWayNo"
          label="通道"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="shelfNo"
          label="货架"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="levelNo"
          label="层"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="cellNo"
          label="位"
          style="width: 33%"
          align="center">
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          style="width: 33%"
          align="center">
          <template slot-scope="scope">
              <span v-if="scope.row.status==1">
                已启用
              </span>
            <span v-if="scope.row.status==0">
                未启用
              </span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="180"
          align="center">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status==1"
                       @click="activeForbid=scope.row,dialogForbid=!dialogForbid"
                       type="text" size="small">撤销启用
            </el-button>
            <el-button v-if="scope.row.status==0"
                       @click="putWarehouseLocationActivate(scope.row)"
                       type="text" size="small">启用
            </el-button>
            <el-button type="text" size="small"
                       @click="getWarehouseLocationPrint(scope.row.id)">打印
            </el-button>
          </template>
        </el-table-column>
        <!--</el-table-column>-->
      </el-table>

    </div>
    <el-dialog :visible.sync="dialogDelete" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">删除提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">删除之后，列表将不再展示该条数据，同时该区位下所有库位码将被删除，确定要删除吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogDelete = false">取 消</el-button>
        <el-button type="primary" @click="dialogDelete=false,deleteWarehouseLocationDelete()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogUpdate" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">区位编辑</span>
      </div>
      <div class="message-box">
        <el-form :model="updateData" :rules="rules" ref="updateData" label-width="160px" class="demo-ruleForm"
        >
          <el-form-item label="区位码：">
            <el-input v-model="updateData.areaNo" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="通道数量：" prop="routeWayCount">
            <el-input type="number" v-model="updateData.routeWayCount"></el-input>
          </el-form-item>
          <el-form-item label="货架数量/每通道：" prop="shelfCount">
            <el-input type="number" v-model="updateData.shelfCount"></el-input>
          </el-form-item>
          <el-form-item label="层数/每货架：" prop="levelCount">
            <el-input type="number" v-model="updateData.levelCount"></el-input>
          </el-form-item>
          <el-form-item label="位数/每层：" prop="cellCount">
            <el-input type="number" v-model="updateData.cellCount"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('updateData')">修改</el-button>
        <el-button @click=" dialogUpdate = !dialogUpdate;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogBatchPrint" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">批量打印</span>
      </div>
      <div class="message-box">
        <el-form :model="batchPrint" :rules="rules" ref="batchPrintData" label-width="160px" class="demo-ruleForm"
        >
          <el-form-item label="打印范围：">
            <el-radio-group v-model="batchPrint.printAll" @change="radioChange">
              <el-radio :label=1>全部</el-radio>
              <el-radio :label=0>部分</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="区位码：" >
            <el-select v-model="batchPrint.areaNo" placeholder="请选择区位" :disabled='batchPrint.printAll==1'
                       @change="areaNoChange">
              <el-option
                v-for="item in areanoData"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="通道：">
            <el-select v-model="batchPrint.routeWayNo" placeholder="请选择通道" :disabled='batchPrint.printAll==1' @change="routeWayNoChange">
              <el-option
                v-for="item in routeWayOption"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="货架/每通道：">
            <el-select v-model="batchPrint.shelfNo" placeholder="请选择货架" :disabled='batchPrint.printAll==1' @change="shelfNoChange">
              <el-option
                v-for="item in shelfOption"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="层/每货架：">
            <el-select v-model="batchPrint.levelNo" placeholder="请选择层" :disabled='batchPrint.printAll==1'  @change="levelNoChange">
              <el-option
                v-for="item in levelOption"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="位/每层：">
            <el-select v-model="batchPrint.cellNo" placeholder="请选择位" :disabled='batchPrint.printAll==1'>
              <el-option
                v-for="item in cellOption"
                :key="item"
                :label="item"
                :value="item">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="batchPrintSubmitForm('batchPrintData')">打印</el-button>
        <el-button @click=" dialogBatchPrint = !dialogBatchPrint;">取消</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogForbid" width="500px" custom-class="dialog-box">
      <div slot="title" class="dialog-title">
        <span class="reject-title">撤销启用提示</span>
      </div>
      <div class="message-box">
        <div class="first-step-box">撤销启用之后，该库位码不能被打印使用，确定要撤销启用吗？</div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogForbid = false">取 消</el-button>
        <el-button type="primary" @click="dialogForbid=false,putWarehouseLocationForbid()">确 定</el-button>
      </div>
    </el-dialog>
    <div class="printOrder-data" >
      <img :src="doPrintImg" alt="" >
    </div>
  </div>
</template>
<script>
  import {
    postWarehouseLocationCreate,
    putWarehouseLocationUpdate,
    deleteWarehouseLocationDelete,
    getWarehouseLocationUpdateDetaills,
    putWarehouseLocationActivate,
    putWarehouseLocationForbid,
    getWarehouseLocationPrint,
    getWarehouseLocationAreaLlist,
    getWarehouseLocationAreanoList,
    postWarehouseLocationBatchPrint,
    postWarehouseLocationList,
    getWarehouseCellNoList,
    getWarehouseLevelNoList,
    getWarehouseShelfNoList,
    getWarehouseRoutewayNoList
  } from '@/api/warehouse/warehouseLocationAdmin'

  export default {
    name: "WarehouseLocationAdmin",
    data() {
      return {
        //批量打印
        batchPrint: {
          cellNo: null,
          levelNo: null,
          shelfNo: null,
          routeWayNo: null,
          areaNo: null,
          printAll: 0,
          warehouseId: this.$route.query.Id,
        },
        cellOption: [], //位数/每层
        levelOption: [], //层数/每货架
        shelfOption: [], //货架数量/每通道"
        routeWayOption: [], //通道数量/每区
        routeWayVal: '',
        doPrintImg: '',
        //查询库位Table
        locationListData: {
          areaNo: "",
          warehouseId: this.$route.query.Id,
        },
        //要删除的区位数据
        deleteData: null,
        //编辑的data
        updateData: {
          areaNo: "string",
          cellCount: 0,
          levelCount: 0,
          routeWayCount: 0,
          shelfCount: 0,
          warehouseId: this.$route.query.Id,
        },
        //新增区位data
        locationCreateData: {
          areaCount: null,
          warehouseId: this.$route.query.Id,
        },
        //区位码list
        areanoData: [],
        //区位Table
        areaData: [],
        //库位table
        locationData: [],
        activeName: '',
        //启用 禁用的当前行数据
        activeForbid: {},
        dialogDelete: false,
        dialogUpdate: false,
        dialogBatchPrint: false,
        dialogForbid: false,
        rules: {
          cellCount: [
            {required: true, message: '请输入正确的位数', trigger: 'change'}
          ],
          levelCount: [
            {required: true, message: '请输入正确的层数', trigger: 'change'}
          ],
          routeWayCount: [
            {required: true, message: '请输入正确的通道数量', trigger: 'change'}
          ],
          shelfCount: [
            {required: true, message: '请输入正确的货架数量', trigger: 'change'}
          ],
          areaNo: [
            {required: true, message: '请输入正确的货架数量', trigger: 'change'}
          ],
        },
      }
    },
    computed: {
    },
    created() {
      this.getWarehouseLocationAreaLlist();
      this.getWarehouseLocationAreanoList();
    },
    mounted() {

    },
    methods: {
      //批量打印下拉框
      //区位码change
      areaNoChange() {
        getWarehouseRoutewayNoList(
          this.$route.query.Id,
          this.batchPrint.areaNo,
          this.batchPrint.routeWayNo,
          this.batchPrint.shelfNo,
          this.batchPrint.levelNo
        ).then((res) => {
          if (res.code == '000000') {
            this.routeWayOption = res.data
            this.batchPrint.cellNo=null;
            this.batchPrint.levelNo=null;
            this.batchPrint.shelfNo=null;
            this.batchPrint.routeWayNo=null;
            console.log(this.routeWayOption);
          } else {
            this.$message({
              message: '获取通道信息失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //通道change
      routeWayNoChange() {
        getWarehouseShelfNoList(
          this.$route.query.Id,
          this.batchPrint.areaNo,
          this.batchPrint.routeWayNo,
        ).then((res) => {
          if (res.code == '000000') {
            this.shelfOption = res.data
            this.batchPrint.cellNo=null;
            this.batchPrint.levelNo=null;
            this.batchPrint.shelfNo=null;
            console.log(this.routeWayOption);
          } else {
            this.$message({
              message: '获取货架信息失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //货架change
      shelfNoChange() {
        getWarehouseLevelNoList(
          this.$route.query.Id,
          this.batchPrint.areaNo,
          this.batchPrint.routeWayNo,
          this.batchPrint.shelfNo,
        ).then((res) => {
          if (res.code == '000000') {
            this.levelOption = res.data
            this.batchPrint.cellNo=null;
            this.batchPrint.levelNo=null;
          } else {
            this.$message({
              message: '获取层信息失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //层change
      levelNoChange() {
        getWarehouseCellNoList(
          this.$route.query.Id,
          this.batchPrint.areaNo,
          this.batchPrint.routeWayNo,
          this.batchPrint.shelfNo,
          this.batchPrint.levelNo
        ).then((res) => {
          if (res.code == '000000') {
            this.cellOption = res.data
            this.batchPrint.cellNo=null;
            console.log(this.routeWayOption);
          } else {
            this.$message({
              message: '获取位信息失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //批量打印单选
      radioChange(val) {
        console.log(val, 'val');
        console.log(this.batchPrint.printAll, 'input的值');
        if (this.batchPrint.printAll == 1) {
          this.batchPrint = {
            cellNo: null,
            levelNo: null,
            shelfNo: null,
            routeWayNo: null,
            areaNo: null,
            printAll: 1,
            warehouseId: this.$route.query.Id,
          }
        }else{
          this.batchPrint.areaNo=this.areanoData[0]
        }
      },
      //批量打印接口
      postWarehouseLocationBatchPrint() {
        postWarehouseLocationBatchPrint(
          this.batchPrint
        ).then((res) => {
          if (res.code == '000000') {
            let str = res.data[0].replace(/[\r\n]/g, "");
            //let data = res.data.replace(/\\n/g, '\n');
            console.log(str);
            this.doPrintImg = 'data:image/jpg;base64,' + str;
            //this.doPrint();
            this.$nextTick(function () {

              // setInterval(this.doPrint(),1000);
            })
            //this.doPrint();
          } else {
            this.$message({
              message: '获取打印信息失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })

      },
      //批量打印表单提交
      batchPrintSubmitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            //alert('这里还没写好，先略过');
            this.postWarehouseLocationBatchPrint();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //打印功能
      doPrint() {
        // 1.设置要打印的区域 div的className
        var newstr = document.getElementsByClassName('printOrder-data')[0].innerHTML
        //2. 复制给body，并执行window.print打印功能
        document.body.innerHTML = newstr
        document.body.style.width="auto";
        document.body.style.height="auto";
        document.body.style.display="block";
        // 3. 还原：将旧的页面储存起来，当打印完成后返给给页面。
        var oldstr = document.body.innerHTML
        let ro = window.location.href;
        setTimeout(pringFun, 100)

        function pringFun() {
          window.print()
          document.body.innerHTML = oldstr;
          window.open(ro)
          window.opener = null;
          window.close()
        }

        return false
      },
      //打印接口
      getWarehouseLocationPrint(id) {
        getWarehouseLocationPrint(
          id
        ).then((res) => {
          if (res.code == '000000') {
            let str = res.data.replace(/[\r\n]/g, "");
            let data = res.data.replace(/\\n/g, '\n');
            this.doPrintImg = 'data:image/jpeg;base64,' + str;
            this.$nextTick(function () {
            this.doPrint();
              // setInterval(this.doPrint(),1000);
            })
            //this.doPrint();
          } else {
            this.$message({
              message: '获取打印信息失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //撤销启用
      putWarehouseLocationForbid() {
        putWarehouseLocationForbid(
          this.activeForbid.id
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '撤销启用成功',
              type: "success",
            });
            this.postWarehouseLocationList();
          } else {
            this.$message({
              message: '启撤销启用失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //启用
      putWarehouseLocationActivate(row) {
        console.log(row.id);
        putWarehouseLocationActivate(
          row.id
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '启用成功',
              type: "success",
            });
            this.postWarehouseLocationList();
          } else {
            this.$message({
              message: '启用失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //点击编辑
      clickclickLocationUpdate(row) {
        this.dialogUpdate = !this.dialogUpdate;
        this.updateData = row;//为了传值
        this.getWarehouseLocationUpdateDetaills();
      },
      //编辑提交
      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          console.log(formName);
          if (valid) {
            this.putWarehouseLocationUpdate();
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      //点击删除
      clickLocationDelete(row) {
        console.log(row);
        if (row.enableCount == 0) {
          this.$message({
            message: '该区位含有已启用库位，不能删除！',
            type: 'warning',
          })
        } else {
          this.dialogDelete = !this.dialogDelete;
          this.deleteData = row;
        }
      },
      //编辑区位
      putWarehouseLocationUpdate() {
        putWarehouseLocationUpdate(
          this.updateData.areaNo,
          this.updateData
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '修改成功',
              type: "success",
            });
            this.dialogUpdate = !this.dialogUpdate;
            this.getWarehouseLocationAreaLlist();
            console.log(this.updateData);
          } else {
            this.$message({
              message: '获取库位信息失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //获取库位信息 编辑
      getWarehouseLocationUpdateDetaills() {
        getWarehouseLocationUpdateDetaills(
          this.updateData.areaNo
        ).then((res) => {
          if (res.code == '000000') {
            this.updateData = res.data;
            this.updateData.warehouseId = this.$route.query.Id,
              console.log(this.updateData);
          } else {
            this.$message({
              message: '获取库位信息失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //删除区位
      deleteWarehouseLocationDelete() {
        deleteWarehouseLocationDelete(
          this.deleteData.areaNo
        ).then((res) => {
          if (res.code == '000000') {
            this.$message({
              message: '删除成功',
              type: "success",
            });
            this.areaData = res.data;
            console.log(this.areaData);
          } else {
            this.$message({
              message: '删除失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //新建区位并查找
      postWarehouseLocationCreate() {
        if (!this.locationCreateData.areaCount || this.locationCreateData.areaCount <= 0) {
          this.$message({
            message: '请输入正确的数量',
            type: 'warning',
          })
        } else {
          postWarehouseLocationCreate(
            this.locationCreateData
          ).then((res) => {
            if (res.code == '000000') {
              this.$message({
                message: '新增成功',
                type: "success",
              });
              this.areaData = res.data;
              this.getWarehouseLocationAreaLlist();
              this.getWarehouseLocationAreanoList();
              console.log(this.areaData);
            } else {
              this.$message({
                message: '查询区位列表失败',
                type: 'warning',
              })
            }
            console.log(res)
          }).catch(err => {
            console.log(err);
          })
        }

      },
      //查询库位列表table
      postWarehouseLocationList() {
        postWarehouseLocationList(
          this.locationListData
        ).then((res) => {
          if (res.code == '000000') {
            this.locationData = res.data;
            console.log(this.areaData);
          } else {
            this.$message({
              message: '查询区位列表失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //查询区位列表
      getWarehouseLocationAreaLlist() {
        getWarehouseLocationAreaLlist(
          this.$route.query.Id,
        ).then((res) => {
          if (res.code == '000000') {
            this.areaData = res.data;
            console.log(this.areaData);
          } else {
            this.$message({
              message: '查询区位列表失败',
              type: 'warning',
            })
          }
          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      //查询区位编码列表
      getWarehouseLocationAreanoList() {
        getWarehouseLocationAreanoList(
          this.$route.query.Id,
        ).then((res) => {
          if (res.code == '000000') {
            this.areanoData = res.data;
            console.log(this.areanoData);
            this.locationListData.areaNo = res.data[0];
            this.batchPrint.areaNo = res.data[0];
            this.postWarehouseLocationList();
          } else {
            this.$message({
              message: '查询区位列表失败',
              type: 'warning',
            })
          }

          console.log(res)
        }).catch(err => {
          console.log(err);
        })
      },
      handleClick(tab, event) {
        console.log(tab.name);
        this.locationListData.areaNo = tab.name;
        this.postWarehouseLocationList();
      },
      getParams() {
        // 取到路由带过来的参数
        let routerParams = this.$route.query.Id;
        // 将数据放在当前组件的数据内
        this.msg = routerParams;
        console.log(this.msg);
      }
    },
    watch: {
      activeName(a, b) {

      }
    }
  }
</script>
<style scoped lang="less">
  @tableBorderColor: #e4e4e4;
  .detaillBox {
    width: 100%;
    padding-top: 10px;
    .detaillTable {
      font-size: 12px;
      border: 1px solid #e4e4e4;
      line-height: 40px;
      .detaillTopBox {
        height: 50px;
        background: #f3f3f3;
        border-bottom: 1px solid #d1d1d1;
        span {
          line-height: 50px;
          margin-left: 10px;
          font-size: 14px;
          i {

          }
        }
      }
      .el-table {
        margin: 20px auto;
        span {
          font-size: 12px;
        }
        .el-button {
          font-size: 12px;
        }
      }
    }
    .dialog-box {
      position: relative;
      .tree {
        display: flex;
        justify-content: center;
      }
      .message-box {
        /*padding: 0px 20px;*/
        font-size: 14px;
        color: #666;
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
          /*padding:20px 0;*/
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
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        border-top: 1px solid #d1d1d1;
        padding: 10px;
        box-sizing: border-box;
      }
    }
  }


</style>
