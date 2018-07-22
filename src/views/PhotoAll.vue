<template>
    <section class="section">
        <div class="container">
            <ScopeSwitcher v-if="authenticatedUser"></ScopeSwitcher>
            <h1 class="title">All Photos</h1>
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
        this.$store.commit('setScopeToAll')
        this.fetchPhotos()
    },
    watch: {
        scope: function(newScope, oldScope) {
            if(newScope !== oldScope) {
                if(newScope === 'user') {
                    this.$router.push('/')
                }
                if(newScope === 'others') {
                    this.$router.push('/photo/others')
                }
            }
        }
    },
    methods: {
        fetchPhotos() {
            this.axios.get('/photo/all').then(response => {
                this.photos = response.data
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
