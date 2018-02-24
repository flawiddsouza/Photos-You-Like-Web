import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import 'bulma'
import './scss/main.scss'

import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:9883'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

import VueImg from 'v-img'
Vue.use(VueImg)

import alertify from 'alertify.js'
Vue.prototype.alertify = alertify

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, {
    loading: `data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 200 150'%2F%3E`
})

Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
    if(to.meta.title) {
        document.title = to.meta.title + ' - Photos You Like'
    } else {
        document.title = 'Photos You Like'
    }
    next()
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
