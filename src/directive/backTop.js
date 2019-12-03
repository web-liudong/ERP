import Vue from 'vue'
Vue.directive("backTop",{
	inserted: function (el, binding, vnode) {
    el.addEventListener("click", function(){
    		var timer=null
			clearInterval(timer);
			timer = setInterval(function(){
			  var speed = document.querySelector(".slideBox").scrollTop/8;
			  speed = speed>0?Math.ceil(speed):Math.floor(speed);
			  if(document.querySelector(".slideBox").scrollTop==0){
			   clearInterval(timer);
			  }else{
			   document.querySelector(".slideBox").scrollTop = document.querySelector(".slideBox").scrollTop-speed;
			  }
			  
			  },30);
	})
  },
})

Vue.directive("close",{
	inserted: function (el, binding, vnode) {
    el.addEventListener("click", function(){
    	window.close()
	})
  },
})
