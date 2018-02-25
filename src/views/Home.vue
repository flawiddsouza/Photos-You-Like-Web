<template>
    <section class="section">
        <div class="container" v-if="authenticatedUser">
            <h1 class="title">Photos Added by You</h1>
            <Gallery :photos="photos" />
        </div>
        <div class="container" v-else>
            <h1 class="title">Log in to add and manage photos</h1>
        </div>
    </section>
</template>

<script>
// @ is an alias to /src
import Gallery from '@/components/Gallery.vue'

export default {
    components: {
        Gallery
    },
    data() {
        return {
            photos: []
        }
    },
    created() {
        if(this.authenticatedUser) {
            this.fetchPhotos()
        }
    },
    methods: {
        fetchPhotos() {
            this.axios.get('/user/photo/all', this.$store.state.axiosConfig).then(response => {
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
        }
    }
}
</script>
