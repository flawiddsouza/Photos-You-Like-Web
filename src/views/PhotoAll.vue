<template>
    <section class="section">
        <div class="container">
            <h1 class="title">All Photos</h1>
            <Gallery :photos="photos" />
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
        this.fetchPhotos()
    },
    methods: {
        fetchPhotos() {
            this.axios.get('/photo/all').then(response => {
                this.photos = response.data
            })
        }
    }
}
</script>
