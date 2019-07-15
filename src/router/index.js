import Vue from 'vue'
import Router from 'vue-router'
import Recommend from 'components/recommend/recommend'
import Rank from 'components/rank/rank'
import Singer from 'components/singer/singer'
import SingerDetail from 'components/singer-detail/singer-detail'
import Search from 'components/search/search'
import Disc from 'components/disc/disc'
import TopList from 'components/top-list/top-list'
import User from 'components/user/user'
import UserCenter from 'components/user-center/user-center'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path:'/',
      redirect:'/recommend'
    },
    {
      path: '/userCenter',
      component: UserCenter,
    },
    {
      path: '/user',
      component: User,
    },
    {
      path: '/recommend',
      component: Recommend,
    },
    {
      path:'/recommend/:id',
      component:Disc
    },
    {
      path: '/rank',
      component: Rank,
      children:[{
        path:':id',
        component:TopList
      }]
    },
    {
      path: '/singer',
      component: Singer,
      children:[
        {
          path:':id',
          component: SingerDetail
        }
      ]
    },
    {
      path: '/search',
      component: Search
    },
  ]
})
