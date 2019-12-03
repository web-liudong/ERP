
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}


export function timeFormat(cjsj) {
  var date = new Date(cjsj) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate()) < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y+M+D+h+m+s
}
export function timeFormatGoods(cjsj) {
  var date = new Date(cjsj) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-'
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
  var D = (date.getDate()) < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' '
  var h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  var m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
  if((h + m + s)=='00:00:00'&&(M+D)=='00-00'){
    return Y 
  }else if((h + m + s)=='00:00:00'){
  return Y + M + D
   
  }else{
    return Y+M+D+h+m+s
  }
}
export function filterEmptyArray(arr) {
  let newarr = arr.filter((item, index) => {
    let u = Object.values(item)
    if (u.find(n => n)) {
      return item
    }
  })
  return newarr
}

export function isEmptyObject(obj){
  for(var n in obj){
   return false; 
} 
  return true; 
} 

/*
    函数:格式化字符串
    参数：str:字符串模板； data:数据
    调用方式:formatString("api/values/{id}/{name}",{id:101,name:"test"});
            formatString("api/values/{0}/{1}",101,"test");
*/
export function formatString(str, data) {
  if (!str || data == undefined) {
    return str;
  }
  if (typeof data === "object") {
    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        str = str.replace(new RegExp("\{" + key + "\}", "g"), data[key]);
      }
    }
  } else {
    let args = arguments,
      reg = new RegExp("\{([0-" + (args.length - 1) + "])\}", "g");
    return str.replace(reg, function (match, index) {
      return args[index - (-1)];
    });
  }
  return str;
}

let hostName = location.origin.indexOf("localhost") > -1 ? 'https://lxerptest.66123123.com' : location.origin;
export function addURL(url) {
  let str;
  str = hostName + '/image' + url
  return str;
}
//对数字保留两位小数不足2位自动补零
export function returnFloat(value) {
  if (parseFloat(value)) {
    var val = Math.round(parseFloat(value) * 100) / 100;
    var xsd = val.toString().split(".");
    if (xsd.length == 1) {
      val = val.toString() + ".00";
      return val;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        val = val.toString() + "0";
      }
      return val;
    }
  } else {
    return 0
  }

}
export function returnFloatTwoFour(value) {
  if (parseFloat(value)) {
    var val = Math.round(parseFloat(value) * 100) / 100;
    var xsd = val.toString().split(".");
    if (xsd.length == 1) {
      val = val.toString() + ".0000";
      return val;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        val = val.toString() + "000";
      }
      if (xsd[1].length == 2) {
        val = val.toString() + "00";
      }
      return val;
    }
  } else {
    return 0
  }

}
export function returnFloatFour(value) {
  if (parseFloat(value)) {
    var val = Math.round(parseFloat(value) * 10000) / 10000;
    var xsd = val.toString().split(".");
    if (xsd.length == 1) {
      val = val.toString() + ".0000";
      return val;
    }
    if (xsd.length > 1) {
      if (xsd[1].length < 2) {
        val = val.toString() + "000";
      }
      if (xsd[1].length == 2) {
        val = val.toString() + "00";
      }
      if (xsd[1].length == 3) {
        val = val.toString() + "0";
      }
      return val;
    }
  } else {
    return 0
  }
}
export const Debounce = (fn, delay = 300) => {
  let timer, timeStamp = 0;
  let context, args;
  let run = () => {
    timer = setTimeout(() => {
      fn.apply(context, args);
    }, delay);
  }
  let clean = () => {
    clearTimeout(timer);
  }

  return function () {
    context = this;
    args = arguments;
    let now = (new Date()).getTime();

    if (now - timeStamp < delay) {
      clean();
      run();
    } else {
      run();
    }
    timeStamp = now;
  }
};

export function removeID(value, array) {
  var index = array.indexOf(value);
  if (index > -1) {
    array.splice(index, 1);
  }
  return array;
}

export function downloadFile(data) {
  if (!data) {
    return
  }
  let url = window.URL.createObjectURL(new Blob([data], { type: "application/xls" }))
  let link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', '导出文件.xls')
  document.body.appendChild(link)
  link.click()
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function () {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function (...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function print() {
  var newstr = document.getElementById('print').innerHTML
  document.body.innerHTML = newstr
  var oldstr = document.body.innerHTML
  window.print()
  window.location.reload()
  document.body.innerHTML = oldstr
  return false
}

// 倒计时

export function countdownTime() {
  this.timeout = null;
}
countdownTime.prototype.startUp = function (endTime, sysDateTime, callback) {
  var date = new Date(sysDateTime.replace(/-/g,'/')).getTime();
  var until = new Date(endTime.replace(/-/g,'/'));
  this.timeout = setInterval(function () {
    // 获取现在的时间
    date+=1000;
    // 计算时会发生隐式转换，调用valueOf()方法，转化成时间戳的形式
    var days = (until - date) / 1000 / 3600 / 24;
    // 下面都是简单的数学计算 
    var day = Math.floor(days);
    var hours = (days - day) * 24;
    var hour = Math.floor(hours);
    var minutes = (hours - hour) * 60;
    var minute = Math.floor(minutes);
    var seconds = (minutes - minute) * 60;
    var second = Math.floor(seconds);
    var back = day + '天' + hour + '小时' + minute + '分钟' + second + '秒';
    callback(back);
  }, 1000)
}

countdownTime.prototype.shutDown = function () {
  clearInterval(this.timeout);
  this.timeout = null;
}

export function countdownTime2(startUp, endTime, callback) {
  var timeout = null;
  if (startUp) {
    timeout = setInterval(function () {
      // 获取现在的时间
      var date = new Date();
      var until = new Date(endTime);
      // 计算时会发生隐式转换，调用valueOf()方法，转化成时间戳的形式
      var days = (until - date) / 1000 / 3600 / 24;
      // 下面都是简单的数学计算 
      var day = Math.floor(days);
      var hours = (days - day) * 24;
      var hour = Math.floor(hours);
      var minutes = (hours - hour) * 60;
      var minute = Math.floor(minutes);
      var seconds = (minutes - minute) * 60;
      var second = Math.floor(seconds);
      var back = day + '天' + hour + '小时' + minute + '分钟' + second + '秒';
      callback(back);
    }, 1000)
  } else {
    clearTimeout(timeout);
  }
}

export function getBrowserType() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
  var isIE = userAgent.indexOf("compatible") > -1
    && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
  var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
  var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
  var isSafari = userAgent.indexOf("Safari") > -1
    && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
  var isChrome = userAgent.indexOf("Chrome") > -1
    && userAgent.indexOf("Safari") > -1; //判断Chrome浏览器

  if (isIE) {
    var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    var fIEVersion = parseFloat(RegExp["$1"]);
    if (fIEVersion == 7) {
      return "IE7";
    } else if (fIEVersion == 8) {
      return "IE8";
    } else if (fIEVersion == 9) {
      return "IE9";
    } else if (fIEVersion == 10) {
      return "IE10";
    } else if (fIEVersion == 11) {
      return "IE11";
    } else {
      return "0";
    }//IE版本过低
    return "IE";
  }
  if (isOpera) {
    return "Opera";
  }
  if (isEdge) {
    return "Edge";
  }
  if (isFF) {
    return "Firfox";
  }
  if (isSafari) {
    return "Safari";
  }
  if (isChrome) {
    return "Chrome";
  }
}