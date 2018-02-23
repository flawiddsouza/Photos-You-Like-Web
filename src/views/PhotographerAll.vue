<template>
    <section class="section">
        <div class="container">
            <h1 class="title">All Photos from {{ photographer.name }}</h1>
            <Gallery :photos="photos" />
        </div>
    </section>
</template>

<script>
import Gallery from '@/components/Gallery.vue'

export default {
    components: {
        Gallery
    },
    data() {
        return {
            photos: [],
            photographer: {}
        }
    },
    created() {
        this.fetchPhotos()
    },
    watch: {
        '$route': 'fetchPhotos'
    },
    methods: {
        fetchPhotos() {
            this.axios.get(`/photographer/${this.$route.params.id}/all`).then(response => {
                if(response.data.success) {
                    this.photos = response.data.photos
                    this.photographer = response.data.photographer
                    document.title = this.photographer.name + ' - ' + document.title
                } else {
                    this.$router.push({ path: `/` })
                }
            })
        }
    }
}
</script>
