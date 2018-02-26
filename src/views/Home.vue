<template>
    <section class="section">
        <div class="container" v-if="authenticatedUser">
            <ScopeSwitcher></ScopeSwitcher>
            <h1 class="title">Photos Added by You</h1>
            <Gallery :photos="photos" />
        </div>
        <div class="container" v-else>
            <h1 class="title">Log in to add and manage photos</h1>
        </div>
    </section>
</template>

<script>
import ScopeSwitcher from '@/components/ScopeSwitcher.vue'
import Gallery from '@/components/Gallery.vue'

export default {
    components: {
        ScopeSwitcher,
        Gallery
    },
    data() {
        return {
            photos: []
        }
    },
    created() {
        this.$store.commit('setScopeToUser')
        if(this.authenticatedUser) {
            this.fetchPhotos()
        }
    },
    watch: {
        scope: function(newScope, oldScope) {
            if(newScope !== oldScope) {
                if(newScope === 'all') {
                    this.$router.push('/photo/all')
                }
            }
        }
    },
    methods: {
        fetchPhotos() {
            this.axios.get('/photo/all/user', this.$store.state.axiosConfig).then(response => {
                if(response.data.success) {
                    this.photos = response.data.photos
                } else {
                    console.log(response.data.error)
                }
            })
        }
    },
    computed: {
        authenticatedUser() {
            return this.$store.state.authenticatedUser
        },
        scope() {
            return this.$store.state.scope
        }
    }
}
</script>
