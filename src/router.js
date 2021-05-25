import Vue from 'vue'
import Router from 'vue-router'
import PlotTransfer from "./components/PlotTransfer.vue"

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'PlotTransfer',
      component: PlotTransfer
    }
  ]
})