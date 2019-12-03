import Cookies from 'js-cookie'

const app = {
  state: {
    sidebar: {
      opened: !+Cookies.get('sidebarStatus'),
      withoutAnimation: false
    },
    device: 'desktop',
    loading:false,
    dataListHeight:500,
    includePages:[]
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      if (state.sidebar.opened) {
        Cookies.set('sidebarStatus', 1)
      } else {
        Cookies.set('sidebarStatus', 0)
      }
      state.sidebar.opened = !state.sidebar.opened
      state.sidebar.withoutAnimation = false
    },
    CLOSE_SIDEBAR: (state, withoutAnimation) => {
      Cookies.set('sidebarStatus', 1)
      state.sidebar.opened = false
      state.sidebar.withoutAnimation = withoutAnimation
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    },
    REVISE_LOADING:(state,who) => {
    	state.loading=who
    },
    SET_DATALISTHEIGHT: (state, h) => {
      state.dataListHeight = h;
    },
    ADD_INCLUDE_PAGE: (state, page) => {
      state.includePages.push(page)
    },
    DEL_INCLUDE_PAGE: (state, page) => {
      let index;
      state.includePages.forEach((item,i) => {
        if(item == page){
          index = i;
        }
      });
      state.includePages.splice(index, 1)
    },
  },
  actions: {
    ToggleSideBar: ({ commit }) => {
      commit('TOGGLE_SIDEBAR')
    },
    CloseSideBar({ commit }, { withoutAnimation }) {
      commit('CLOSE_SIDEBAR', withoutAnimation)
    },
    ToggleDevice({ commit }, device) {
      commit('TOGGLE_DEVICE', device)
    },
    reviseLoading({ commit },who){
    	commit('REVISE_LOADING', who)
    },
  }
}

export default app
