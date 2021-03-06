import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        authenticatedUser: JSON.parse(localStorage.getItem('user')),
        authToken: localStorage.getItem('authToken'),
        axiosConfig: {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('authToken')
            }
        },
        scope: 'all'
    },
    mutations: {
        updateAuthenticatedUser: (state, authenticatedUser) => {
            state.authenticatedUser = authenticatedUser
            localStorage.setItem('user', JSON.stringify(authenticatedUser))
        },
        updateAuthToken: (state, authToken) => {
            state.authToken = authToken
            localStorage.setItem('authToken', authToken)
        },
        refreshAxiosConfig: (state) => {
            state.axiosConfig = {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('authToken')
                }
            }
        },
        setScopeToUser: (state) => {
            state.scope = 'user'
        },
        setScopeToOthers: (state) => {
            state.scope = 'others'
        },
        setScopeToAll: (state) => {
            state.scope = 'all'
        }
    }
})
