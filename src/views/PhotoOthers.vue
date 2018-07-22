<template>
    <section class="section">
        <div class="container">
            <ScopeSwitcher v-if="authenticatedUser"></ScopeSwitcher>
            <h1 class="title">Others Photos</h1>
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
        this.$store.commit('setScopeToOthers')
        this.fetchPhotos()
    },
    watch: {
        scope: function(newScope, oldScope) {
            if(newScope !== oldScope) {
                if(newScope === 'user') {
                    this.$router.push('/')
                }
                if(newScope === 'all') {
                    this.$router.push('/photo/all')
                }
            }
        }
    },
    methods: {
        fetchPhotos() {
            this.axios.get('/photo/others', this.$store.state.axiosConfig).then(response => {
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
