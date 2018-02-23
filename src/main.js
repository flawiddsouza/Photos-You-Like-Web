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
