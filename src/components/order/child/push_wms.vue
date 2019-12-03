<template>
  <el-dialog :visible.sync="isShow" :show-close="false" width="450px">
    <div class="con" v-if="status == 0">
      <div class="pic"></div>
      <h4>正在推送</h4>
      <p class="desc">等待WMS系统返回推送结果</p>
    </div>
    <div class="con" v-else-if="status == 1">
      <div class="res"><span class="icon iconfont">&#xe726;</span></div>
      <h4>推送成功</h4>
      <p class="desc">发货单已成功推送至WMS系统</p>
    </div>
    <div class="con" v-else>
      <div class="res fail"><span class="el-icon-error"></span></div>
      <h4>推送失败</h4>
      <p class="desc">{{ errMsg }}</p>
    </div>
  </el-dialog>
</template>
<script>
import { pushWms } from "@/api/order/invoiceOrder";
import { setTimeout } from "timers";
export default {
  props: {},
  data() {
    return {
      isShow: false,
      loading: true,
      resData: null,
      errMsg:"推送失败，请稍后重试",
      status: 0
    };
  },
  mounted() {},
  computed: {},
  methods: {
    init(row) {
      this.reset();
      this.resData = row;
      this.isShow = true;
      this.getData();
    },
    getData() {
      pushWms(this.resData.id, this.resData.deliveryStatus).then(res => {
        if(res.code == "000000000"){
          this.status = 1;
        }else{
          this.status = 2;
          this.errMsg = res.message;
        }
        setTimeout(()=>{
          this.$emit("callback", "pushWms");
          this.isShow = false;
        },3000)
      });
    },
    reset() {
      this.resData = null;
      this.status = 0;
    }
  }
};
</script>
<style scoped lang="less">
.con {
  text-align: center;
  color: #999;
  .pic {
    width: 50px;
    height: 50px;
    border: 20px solid #1abc9c;
    border-left: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-radius: 50%;
    display: inline-block;
    animation: loading 1s infinite linear;
  }
  .res {
    color: #1abc9c;
    span{
      font-size: 50px;
    }
  }
  .res.fail{
    color: red;
  }
  p {
    line-height: 40px;
  }
  h4 {
    font-size: 20px;
    color: #333;
    margin-top: 10px;
  }
  .desc {
    font-size: 14px;
  }
  @-webkit-keyframes loading {
    0% {
      transform: rotate(0);
    }
    100% {
      transform: rotate(360deg);
    }
  }
}
</style>