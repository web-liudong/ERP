<!--
<template>
  <button
    class="mybutton"
    @click="handleClick"
    :disabled="buttonDisabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :class="[
      type ? 'el-button&#45;&#45;' + type : '',
      buttonSize ? 'el-button&#45;&#45;' + buttonSize : '',
      {
        'is-disabled': buttonDisabled,
        'is-loading': loading,
        'is-plain': plain,
        'is-round': round,
        'is-circle': circle
      }
    ]"
  >
    <i class="el-icon-loading" v-if="loading"></i>
    <i :class="icon" v-if="icon && !loading"></i>
    <span v-if="$slots.default"><slot></slot></span>
  </button>
</template>
<script>
  export default {

    inject: {
      elForm: {
        default: ''
      },
      elFormItem: {
        default: ''
      }
    },
    data(){
      return{
        buttonStatus:true,
        stopTime:null
      }
    },
    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      nativeType: {
        type: String,
        default: 'button'
      },
      loading: Boolean,
      disabled: Boolean,
      plain: Boolean,
      autofocus: Boolean,
      round: Boolean,
      circle: Boolean
    },

    computed: {
      _elFormItemSize() {
        return (this.elFormItem || {}).elFormItemSize;
      },
      buttonSize() {
        return this.size || this._elFormItemSize || (this.$ELEMENT || {}).size;
      },
      buttonDisabled() {
        return this.disabled || (this.elForm || {}).disabled;
      }
    },

    methods: {
      handleClick(evt) {
        if(this.buttonStatus){
          this.buttonStatus=false;
          this.$emit('onclick',evt)
        }
        this.setButton()
      },
      setButton(){
        clearTimeout(this.stopTime);
        this.stopTime=setTimeout(()=>{
          this.buttonStatus=true;
        },1500)
      },
    }
  };
</script>
-->
<template>
  <div class="button">
    <button :disabled="clickState"
            @click="onclick"
            class="butt"
            :class="{'butts' : !state}"
    >{{title}}</button>
  </div>
</template>
<script>
  export default {
    name: 'Butt',
    props: {
      clickState: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        required: false
      },
      state: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        buttonStatus: true,
        stopTime: null
      }
    },
    methods: {
      onclick() {
        if (this.buttonStatus) {
          this.buttonStatus = false;
          this.$emit('onclick')
        }
        this.setButton();
      },
      setButton() { //添加一个定时器，点击之后延时1.5s，防二次点击后台报错
        clearTimeout(this.stopTime);
        this.stopTime = setTimeout(() => {
          this.buttonStatus = true
        }, 1500)
      }
    }
  };
</script>
