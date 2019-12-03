export default {
  _token: null,
  _user: null,

  get token () {
    if(!this._token){
      let str = window.localStorage.getItem("TokenKey")
      try {
        this._token = str
      } catch (err) {
        console.error('Invalid token: ' + err)
      }
    }
    return this._token
  },

  set token (val) {
    if (val) {
      this._token = val
      window.localStorage.setItem("TokenKey", this._token)
    } else {
      window.localStorage.removeItem("TokenKey")
      this._token = null
    }
  },

  get user () {
    if(!this._user){
      let str = window.localStorage.getItem("UserInfo")
      try {
        this._user = JSON.parse(str)
      } catch (err) {
        console.error('Invalid user info: ' + err)
      }
    }
    return this._user
  },

  set user (val) {
    this._user = Object.assign(this.user || {}, val)
    if (val) {
      window.localStorage.setItem("UserInfo", JSON.stringify(this._user))
    } else {
      window.localStorage.removeItem("UserInfo")
      this._user = null
    }
  },
}