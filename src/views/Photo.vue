<template>
    <section class="section">
        <div class="container">
            <div v-if="photo" class="box">
                <span v-if="authenticatedUser && authenticatedUser.id === photo.addedByUserId">
                    <button class="button is-pulled-right is-outlined is-danger" @click="deletePhoto">Delete</button>
                    <button class="button is-pulled-right small-right-margin is-outlined" @click="edit = false" v-if="edit">Cancel</button>
                    <button class="button is-pulled-right small-right-margin is-outlined is-primary" v-bind:class="{ 'is-loading': loading }" @click="updatePhoto" v-if="edit">Update</button>
                    <button class="button is-pulled-right small-right-margin is-outlined" @click="editPhoto" v-if="!edit">Edit</button>
                </span>

                <h3 class="title" v-if="!edit">
                    <router-link :to="$route.path" class="inherit-color">
                        {{ photo.title }}
                    </router-link>
                </h3>
                <input type="text" class="input is-inline" v-model="photoEdit.title" v-else>

                <h3 class="subtitle">
                    by
                    <span v-if="!edit">
                        <router-link :to="generatePhotographerRouterLink(photo.photographer.id)">
                            {{ photo.photographer.name }}
                        </router-link>
                        [<a :href="photo.photographer.links[0]">Web</a>]
                    </span>
                    <span v-else>
                        <v-select v-model="selectedPhotographer" label="name" :options="photographers"></v-select>
                    </span>
                </h3>

                <div v-if="!edit">
                    <div class="image-holder" v-for="image in photo.images">
                        <img v-img:group :src="axios.defaults.baseURL + '/images/' + image">
                        <button class="button is-small" @click="deleteImage(image)" v-if="authenticatedUser && authenticatedUser.id === photo.addedByUserId">
                            <img src="../assets/trash.svg" width="17em" height="17em">
                        </button>
                    </div>
                </div>
                <div v-else>
                    <div v-for="(image, index) in photoImagesEdit" class="box">
                        <div class="tabs">
                            <ul>
                                <li v-bind:class="[image.type == 'existing' ? 'is-active' : '']"><a @click="changeImageType(image, 'existing')">Existing Image</a></li>
                                <li v-bind:class="[image.type == 'url' ? 'is-active' : '']"><a @click="changeImageType(image, 'url')">Upload from URL</a></li>
                                <li v-bind:class="[image.type == 'file' ? 'is-active' : '']"><a @click="changeImageType(image, 'file')">Upload from file</a></li>
                            </ul>
                        </div>
                        <div v-if="image.type == 'existing'">
                            <input type="text" v-model="image.image" class="input" placeholder="Existing image filename">
                        </div>
                        <div v-else-if="image.type == 'url'">
                            <input type="text" v-model="image.image" class="input" placeholder="URL to image">
                        </div>
                        <div v-else-if="image.type == 'file'">
                            <input type="file" class="input" @change="processFile($event, image)">
                        </div>
                    </div>
                    <button class="button" @click="addAnotherImage">Add another image</button>
                </div>

                <h3 class="subtitle small-top-margin" v-if="!edit && photo.source">
                    Source:
                    <a :href="photo.source">{{ photo.source }}</a>
                </h3>
                <h3 class="subtitle small-top-margin" v-if="edit">
                    Source:
                    <input type="text" class="input" v-model="photoEdit.source">
                </h3>

                <h3 class="subtitle" v-if="!edit && photo.tags.length > 0">Tags:
                    <router-link :to="generateTagRouterLink(tag)" v-for="tag in photo.tags">
                        <span class="tag is-link is-medium small-right-margin">
                            {{ tag }}
                        </span>
                    </router-link>
                </h3>
                <h3 class="subtitle" v-if="edit">Tags:
                    <input-tag placeholder="Add Tag" :tags.sync="photoEdit.tags" class="input"></input-tag>
                </h3>

                <h3 class="subtitle" v-if="!edit && photo.note">Note: {{ photo.note }}</h3>
                <h3 class="subtitle" v-if="edit">Note:
                    <textarea class="textarea" v-model="photoEdit.note"></textarea>
                </h3>

                <h3 class="subtitle" v-if="photo.metadata">Metadata: {{ photo.metadata }}</h3>

                <p>Created at {{ photo.created_at | localizeDate }}</p>
                <p>Updated at {{ photo.updated_at | localizeDate }}</p>
            </div>
        </div>
    </section>
</template>

<script>
import InputTag from 'vue-input-tag'
import vSelect from 'vue-select'

export default {
    components: {
        InputTag,
        vSelect
    },
    data() {
        return {
            photo: null,
            photographers: [],
            edit: false,
            selectedPhotographer: null,
            photoEdit: null,
            photoImagesEdit: [],
            photoImagesEditStartState: [],
            loading: false
        }
    },
    created () {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
        fetchData() {
            this.axios.get(`/photo/${this.$route.params.id}`).then(response => {
                if(response.data.success) {
                    this.photo = response.data.photo
                    document.title = this.photo.title + ' - ' + 'Photos You Like'
                } else {
                    this.$router.push({ path: `/` })
                }
            })

            this.axios.get('/photographer/all').then(response => {
                this.photographers = response.data
            })
        },
        editPhoto() {
            this.photoEdit = JSON.parse(JSON.stringify(this.photo))
            this.selectedPhotographer = this.photoEdit.photographer
            this.photoImagesEdit = []
            if(this.photoEdit.images.length > 0) {
                this.photoEdit.images.forEach(image => {
                    this.photoImagesEdit.push({
                        type: 'existing',
                        image: image
                    })
                })
            } else {
                this.photoImagesEdit.push({ type: 'url', image: null })
            }
            this.photoImagesEditStartState = JSON.parse(JSON.stringify(this.photoImagesEdit))
            this.edit = true
            document.activeElement.blur() // so that update button loses focus
        },
        changeImageType(image, type) {
            switch(image.type) {
                case 'existing':
                    image.existing = image.image
                    break
                case 'url':
                    image.url = image.image
                    break
            }
            switch(type) {
                case 'existing':
                    image.image = image.existing
                    break
                case 'url':
                    image.image = image.url
                    break
            }
            this.$set(image, 'type', type)
        },
        addAnotherImage() {
            this.photoImagesEdit.push({ type: 'url', image: null })
        },
        processFile(event, image) {
            image.image = event.target.files[0]
        },
        updatePhoto() {
            this.loading = true
            document.activeElement.blur() // so that update button loses focus
            var data = new FormData()
            if(this.photoEdit.title !== this.photo.title) {
                data.append('title', this.photoEdit.title)
            }
            if(this.selectedPhotographer.id !== this.photo.photographer.id) {
                data.append('photographerId', this.selectedPhotographer.id)
            }
            if(JSON.stringify(this.photoImagesEdit) !== JSON.stringify(this.photoImagesEditStartState)) {
                this.photoImagesEdit.forEach(image => {
                    if(image.url) {
                        delete image.url
                    }
                    if(image.existing) {
                        delete image.existing
                    }
                    if(image.image instanceof File) {
                        data.append('localImage', image.image)
                    }
                })
                data.append('images', JSON.stringify(this.photoImagesEdit))
            }
            if(this.photoEdit.source !== this.photo.source) {
                data.append('source', this.photoEdit.source)
            }
            if(JSON.stringify(this.photoEdit.tags) !== JSON.stringify(this.photo.tags)) {
                data.append('tags', JSON.stringify(this.photoEdit.tags))
            }
            if(this.photoEdit.note !== this.photo.note) {
                data.append('note', this.photoEdit.note)
            }
            this.axios.patch(`/photo/${this.photo.id}`, data, this.$store.state.axiosConfig).then(response => {
                if(response.data.success) {
                    this.photo = JSON.parse(JSON.stringify(this.photoEdit))
                    document.title = this.photo.title + ' - ' + 'Photos You Like'
                    if(this.selectedPhotographer) {
                        this.photo.photographer = this.selectedPhotographer
                    }
                    if(response.data.updatedAt) {
                        this.photo.updated_at = response.data.updatedAt
                    }
                    if(response.data.images) {
                        this.photo.images = response.data.images
                    }
                    this.edit = false
                    this.loading = false
                    this.alertify.success('Photo updated')
                } else {
                    this.edit = false
                    this.loading = false
                    this.alertify.error(response.data.error)
                }
            })
        },
        deletePhoto() {
            this.alertify.confirm('Are you sure?', () => {
                this.axios.delete(`/photo/${this.photo.id}`, this.$store.state.axiosConfig).then(response => {
                    if(response.data.success) {
                        this.alertify.success('Photo deleted')
                        this.$router.push({ path: `/` })
                    }
                })
            })
        },
        deleteImage(image) {
            this.alertify.confirm('Are you sure?', () => {
                this.axios.patch(`/photo/${this.photo.id}/image/delete`, { image: image }, this.$store.state.axiosConfig).then(response => {
                    if(response.data.success) {
                        this.photo.images = this.photo.images.filter(photoImage => photoImage !== image)
                        this.alertify.success('Image deleted')
                    } else {
                        this.alertify.error(response.data.error)
                    }
                })
            })
        },
        generatePhotographerRouterLink(photographerId) {
            if(this.scope == 'all') {
                return '/photographer/' + photographerId + '/all'
            } else if(this.scope == 'user') {
                return '/photographer/' + photographerId + '/all/user'
            }
        },
        generateTagRouterLink(tag) {
            if(this.scope == 'all') {
                return '/tag/' + tag
            } else if(this.scope == 'user') {
                return '/tag/' + tag + '/user'
            }
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

// close alertify dialog when clicked around the dialog box
document.addEventListener('click', e => {
    if(e.target && e.target.matches('.alertify')) {
        e.target.remove()
    }
})

// close alertify dialog when esc is pressed
window.addEventListener('keyup', e => {
    if(e.key == 'Escape') {
        if(document.querySelector('.alertify')) {
            document.querySelector('.alertify').remove()
        }
    }
})
</script>