<template>
	<div class="">
		<affair-detail></affair-detail>
		
	</div>
</template>
<script>
		import {
		readId
	} from '@/api/noticeService/noticeService'
import affairDetail from '@/components/system/advertiseMessage/affairDetail'
export default {
  name:"messageDetail",
  components: {
  	affairDetail
  },
  data() {
    return {
      
    }
  },
  created() {
		readId(this.$route.query.pushId).then(res=>{
			console.log(res.data)
		})
  },
  mounted() { },
  methods: {
    
  }
};
</script>
<style scoped lang='less'>

</style>