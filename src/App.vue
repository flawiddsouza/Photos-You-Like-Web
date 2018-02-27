<template>
    <div id="app">
        <nav class="navbar has-shadow is-fixed-top">
            <div class="container">
                <div class="navbar-brand">
                    <router-link class="navbar-item" to="/">
                        <h1>Photos You Like</h1>
                    </router-link>
                    <div class="navbar-burger">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
                <div class="navbar-menu">
                    <div class="navbar-start">
                        <div class="navbar-item" v-if="authenticatedUser">You're logged in as {{ authenticatedUser.name }}</div>
                    </div>
                    <div class="navbar-end">
                        <router-link class="navbar-item" to="/photo/add" v-if="authenticatedUser">Add Photo</router-link>
                        <router-link class="navbar-item" to="/photo/all">All Photos</router-link>
                        <router-link class="navbar-item" to="/photographer/manager">Photographer Manager</router-link>
                        <a class="navbar-item" v-if="!authenticatedUser" @click="loginGoogle">Login with Google</a>
                        <a class="navbar-item" v-if="authenticatedUser" @click="logout">Logout</a>
                    </div>
                </div>
            </div>
        </nav>
        <router-view />
    </div>
</template>

<script>
document.addEventListener('DOMContentLoaded', () => {
    var navBurger = document.querySelector('.navbar-burger')
    var navMenu = document.querySelector('.navbar-menu')
    navBurger.addEventListener('click', () => {
        navBurger.classList.toggle('is-active')
        navMenu.classList.toggle('is-active')
    })
})

export default {
    data() {
        return {
            clientId: process.env.CLIENT_ID,
            redirectUri: process.env.HOSTED_AT_URL + '/auth/callback'
        }
    },
    methods: {
        loginGoogle() {
            var popup = window.open(`https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=${this.clientId}&redirect_uri=${this.redirectUri}&scope=profile%20email&display=popup`, 'name', 'width=452, height=633')
            var pollTimer = window.setInterval(() => { 
                try {
                    if(popup.document.URL.startsWith(this.redirectUri)) {
                        window.clearInterval(pollTimer)
                        var authorizationCode = popup.document.location.search.replace('?code=', '')
                        popup.close()
                        this.axios.post('/auth/google', { code: authorizationCode, redirectUri: this.redirectUri }).then(response => {
                            if(response.data.success) {
                                this.$store.commit('updateAuthenticatedUser', response.data.user)
                                this.$store.commit('updateAuthToken', response.data.token)
                                this.$store.commit('refreshAxiosConfig')
                                this.$router.go() // reload current route, whichever it is
                            } else {
                                console.log('Server error', response.data.error)
                            }
                        })
                    }
                } catch(e) {} // empty because we are sending these errors to the void
            }, 100)
        },
        logout() {
            if(confirm('Are you sure?')) {
                this.$store.commit('updateAuthenticatedUser', null)
                this.$store.commit('updateAuthToken', null)
                localStorage.clear()
            }
        }
    },
    computed: {
        authenticatedUser() {
            return this.$store.state.authenticatedUser
        }
    }
}
</script>