<template>
    <section class="section">
        <div class="container">
            <ScopeSwitcher></ScopeSwitcher>
            <h1 class="title">Photos from {{ photographer.name }}</h1>
            <Gallery :photos="photos" />
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
            photos: [],
            photographer: {}
        }
    },
    created() {
        this.fetchPhotos()
    },
    watch: {
        '$route': 'fetchPhotos',
        scope: function(newScope, oldScope) {
            if(newScope !== oldScope) {
                if(this.scope === 'others') {
                    this.$router.push(`/photographer/${this.$route.params.id}/all/others`)
                }
                if(this.scope === 'all') {
                    this.$router.push(`/photographer/${this.$route.params.id}/all`)
                }
            }
        }
    },
    methods: {
        fetchPhotos() {
            this.axios.get(`/photographer/${this.$route.params.id}/all/user`, this.$store.state.axiosConfig).then(response => {
                if(response.data.success) {
                    this.photos = response.data.photos
                    this.photographer = response.data.photographer
                    document.title = this.photographer.name + ' - ' + document.title
                } else {
                    this.$router.push({ path: `/` })
                }
            })
        }
    },
    computed: {
        scope() {
            return this.$store.state.scope
        }
    }
}
</script>
