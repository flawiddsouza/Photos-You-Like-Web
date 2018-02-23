<template>
    <section class="section">
        <div class="container">
            <h1 class="title">All Photos tagged "{{ $route.params.tag }}"</h1>
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
            photos: []
        }
    },
    created() {
        this.fetchPhotos()
    },
    methods: {
        fetchPhotos() {
            this.axios.get(`/tag/${this.$route.params.tag}`).then(response => {
                if(response.data.success) {
                    this.photos = response.data.photos
                }
            })
        }
    }
}
</script>
