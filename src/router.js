import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'diff',
      component: require('@/components/Diff').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
