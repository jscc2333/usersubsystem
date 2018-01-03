import Vue from 'vue'
import Router from 'vue-router'
import home from '@/views/home'
import consumer from '@/views/consumer'
import seller from '@/views/seller'
import passport from '@/views/passport'
import login from '@/components/universal/login'
import registration from '@/components/universal/registration'
import information from '@/components/consumer/information'
import address from '@/components/consumer/address'
import evaluation from '@/components/consumer/evaluation'
import order from '@/components/consumer/order'
import collection from '@/components/consumer/collection'
import sInformation from '@/components/seller/sInformation'
import shop from '@/components/seller/shop'
import sOrder from '@/components/seller/sOrder'
import sEvaluation from '@/components/seller/sEvaluation'

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
    }],
  }, {
    name: 'seller',
    path: '/seller/:username',
    component: seller,
    children: [
      {
        name: 'sInformation',
        path: '/seller/sInformation',
        component: sInformation,
      }, {
        name: 'sEvaluation',
        path: '/seller/sEvaluation',
        component: sEvaluation,
      }, {
        name: 'sOrder',
        path: '/seller/sOrder',
        component: sOrder,
      }, {
        name: 'shop',
        path: '/seller/shop',
        component: shop,
      },
    ],
  }],
})
