<template>
    <div>
        <div class="columns" v-for="photos in chunkedPhotos">
            <div class="column is-one-quarter" v-for="photo in photos">
                <div class="art-box">
                    <router-link :to="'/photo/' + photo.id">
                        <div class="art-title">{{ photo.title }}</div>
                    </router-link>
                    <img v-img:gallery="{ title: photo.title, src: generateImageURL(image) }" v-for="image in photo.images" v-lazy="generateThumbnailImageURL(image)" class="is-block">
                    <div class="art-by">
                        <h3 class="subtitle">by <router-link :to="generatePhotographerRouterLink(photo.photographer.id)">{{ photo.photographer.name }}</router-link> [<a :href="photo.photographer.links[0]">Web</a>]</h3>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="notWaiting && photos.length == 0">
            No photos found
        </div>
    </div>
</template>

<script>
import chunk from 'chunk'

export default {
    name: 'Gallery',
    props: {
        photos: Array
    },
    data() {
        return {
            notWaiting: false
        }
    },
    created() {
        setTimeout(this.updateNotWaiting, 1000)
    },
    methods: {
        updateNotWaiting() {
            this.notWaiting = true
        },
        generateImageURL(image) {
            return this.axios.defaults.baseURL + '/images/' + image
        },
        generateThumbnailImageURL(image) {
            return this.axios.defaults.baseURL + '/images/thumbnails/' + image
        },
        generatePhotographerRouterLink(photographerId) {
            if(this.scope == 'user') {
                return '/photographer/' + photographerId + '/all/user'
            }
            if(this.scope == 'others') {
                return '/photographer/' + photographerId + '/all/others'
            }
            if(this.scope == 'all') {
                return '/photographer/' + photographerId + '/all'
            }
        }
    },
    computed: {
        chunkedPhotos() {
            return chunk(this.photos, 4)
        },
        scope() {
            return this.$store.state.scope
        }
    }
}
</script>