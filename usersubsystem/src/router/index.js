import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import consumer from '@/views/consumer'
import passport from '@/views/passport'
import login from '@/components/login'
import registration from '@/components/registration'
import information from '@/components/information'
import address from '@/components/address'
import evaluation from '@/components/evaluation'
import order from '@/components/order'
import shop from '@/components/shop'
import collection from '@/components/collection'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: '/',
  routes: [{
    name: 'home',
    path: '/',
    component: home,
    children: [{
      path: '/login',
      component: login,
    },
    {
      path: '/registration',
      component: registration,
    },
    ],
  }, {
    name: 'passport',
    path: '/passport',
    component: passport,
  }, {
    name: 'consumer',
    path: '/consumer/:username',
    component: consumer,
    children: [{
      name: 'information',
      path: '/consumer/information',
      component: information,
    }, {
      name: 'collection',
      path: '/consumer/collection',
      component: collection,
    }, {
      name: 'address',
      path: '/consumer/address',
      component: address,
    }, {
      name: 'evaluation',
      path: '/consumer/evaluation',
      component: evaluation,
    }, {
      name: 'order',
      path: '/consumer/order',
      component: order,
    }, {
      name: 'shop',
      path: '/consumer/shop',
      component: shop,
    }],
  }],
})
