import Vue from 'vue'
import Main from './index.vue'
	let instance;
	let MessageConstructor = Vue.extend(Main);
	const MessageTips=(options={})=>{
		if (typeof options === 'string') {
		    options = {
		      message: options
		    };
		  }
		instance = new MessageConstructor({
		    data: options
		  }).$mount();
	  document.body.appendChild(instance.$el);
//	  if(options.path){
//	  	instance.dialogVisibleUpdata=true
//	  }else{
	  	instance.dialogVisible=true
//	  }
		
	}
	
export default MessageTips