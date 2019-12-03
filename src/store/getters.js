const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  loading: state => state.app.loading,
  roles: state => state.user.roles,
  hideList: state => state.dynamicTable.hideList,
  includePages: state => state.app.includePages,
  dataListHeight: state => state.app.dataListHeight
}
export default getters
