import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import PhotoAdd from './views/PhotoAdd.vue'
import PhotoOthers from './views/PhotoOthers.vue'
import PhotoAll from './views/PhotoAll.vue'
import Photo from './views/Photo.vue'
import PhotographerAll from './views/PhotographerAll.vue'
import PhotographerAllOthers from './views/PhotographerAllOthers.vue'
import PhotographerAllUser from './views/PhotographerAllUser.vue'
import Tag from './views/Tag.vue'
import TagUser from './views/TagUser.vue'
import PhotographerManager from './views/PhotographerManager.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            component: Home
        },
        {
            path: '/photo/add',
            component: PhotoAdd,
            meta: {
                title: 'Add Photo'
            }
        },
        {
            path: '/auth/callback',
            component: {
                template: '<div class="auth-component"></div>'
            }
        },
        {
            path: '/photo/others',
            component: PhotoOthers,
            meta: {
                title: 'Others Photos'
            }
        },
        { // /photo/all needs to come before /photo/:id or it always matches to /photo/:id, making it inaccesible
            path: '/photo/all',
            component: PhotoAll,
            meta: {
                title: 'All Photos'
            }
        },
        {
            path: '/photo/:id',
            component: Photo
        },
        {
            path: '/photographer/:id/all',
            component: PhotographerAll,
            meta: {
                title: 'All Photos'
            }
        },
        {
            path: '/photographer/:id/all/user',
            component: PhotographerAllUser,
            meta: {
                title: 'Your Photos'
            }
        },
        {
            path: '/photographer/:id/all/others',
            component: PhotographerAllOthers,
            meta: {
                title: 'Others Photos'
            }
        },
        {
            path: '/tag/:tag',
            component: Tag,
            meta: {
                title: 'All Photos'
            }
        },
        {
            path: '/tag/:tag/user',
            component: TagUser,
            meta: {
                title: 'Your Photos'
            }
        },
        {
            path: '/photographer/manager',
            component: PhotographerManager
        }
    ]
})
