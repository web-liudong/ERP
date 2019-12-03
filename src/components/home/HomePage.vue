<template>
	<div class="homePageBox">
    <leftnav :leftnavData="leftnavData"></leftnav>
    <div class="slideBox">
      <div class="mainBox_tt">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<script>
 import leftnav from '../common/LeftNav/LeftNav'
export default {
  components: {
  	leftnav
  },
  data() {
    return {
      leftnavData: [
        {
          path: '/homepage/home',
          name: 'homeindex',
          meta: {
            title: '系统首页'
          },
          redirect: '/homepage/home/homeindex',
          children: [{
            path: '/homepage/home/homeindex',
            name: 'home',
            meta: {
              title: '系统首页'
            },
          }]
        }
      ],
    }
  },
  created() {

  },
  methods: {

  }
};
</script>
