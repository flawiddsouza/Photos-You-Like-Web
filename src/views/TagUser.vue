<template>
    <section class="section">
        <div class="container">
            <ScopeSwitcher></ScopeSwitcher>
            <h1 class="title">Photos tagged "{{ $route.params.tag }}"</h1>
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
            photos: []
        }
    },
    created() {
        this.fetchPhotos()
    },
    watch: {
        scope: function(newScope, oldScope) {
            if(newScope !== oldScope) {
                this.$router.push(`/tag/${this.$route.params.tag}`)
            }
        }
    },
    methods: {
        fetchPhotos() {
            this.axios.get(`/tag/${this.$route.params.tag}/user`, this.$store.state.axiosConfig).then(response => {
                if(response.data.success) {
                    this.photos = response.data.photos
                    document.title = this.$route.params.tag + ' - ' + document.title
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
