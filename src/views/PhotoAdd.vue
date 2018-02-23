<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Add Photo</h1>
            <label class="label">Title
                <input type="text" class="input" v-model="photo.title">
            </label>
            <div class="box">
                <label class="label">Image</label>
                <div v-for="(image, index) in photo.images" class="box">
                    <div class="tabs">
                        <ul>
                            <li v-bind:class="[image.local ? '' : 'is-active']"><a @click="$set(image, 'local', false)">Upload from URL</a></li>
                            <li v-bind:class="[image.local ? 'is-active' : '']"><a @click="$set(image, 'local', true)">Upload from file</a></li>
                        </ul>
                    </div>
                    <div v-if="!image.local">
                        <input type="text" v-model="image.image" class="input">
                    </div>
                    <div v-else>
                        <input type="file" class="input" @change="processFile($event, image)">
                    </div>
                </div>
                <button class="button" @click="addAnotherImage">Add another image</button>
            </div>
            <div class="box">
                <label class="label">Photographer</label>
                <div class="tabs">
                    <ul>
                        <li v-bind:class="[photo.existingPhotographer ? 'is-active' : '']"><a @click="photo.existingPhotographer = true">Existing</a></li>
                        <li v-bind:class="[photo.existingPhotographer ? '' : 'is-active']"><a @click="photo.existingPhotographer = false">New</a></li>
                    </ul>
                </div>
                <div v-if="photo.existingPhotographer">
                    <label class="label">Select Existing Photographer</label>
                    <v-select v-model="photo.selectedPhotographer" :options="photographersMadeSelectFriendly" class="is-block"></v-select>
                </div>
                <div v-else>
                    <label class="label">Photographer name
                        <input type="text" class="input" v-model="photo.newPhotographer.name">
                    </label>
                    <label class="label">Photographer website
                        <div v-for="(link, index) in photo.newPhotographer.links" class="field has-addons" v-bind:class="[index > 0 ? 'small-top-margin' : '']">
                            <div class="control">
                                <input type="text" class="input" v-model="photo.newPhotographer.links[index]">
                            </div>
                            <button v-if="index > 0" @click="removeLinkInput(index)" class="button">x</button>
                        </div>
                        <button class="button small-top-margin" @click="addAnotherLinkInput">Add one more</button>
                    </label>
                </div>
            </div>
            <label class="label">Source
                <input type="text" class="input" v-model="photo.source">
            </label>
            <label class="label">Tags
                <input-tag placeholder="Add Tag" :tags.sync="photo.tagsArray" class="input"></input-tag>
            </label>
            <label class="label">Note
                <textarea class="textarea" v-model="photo.note"></textarea>
            </label>
            <br>
            <button @click="addPhoto" class="button">Add Photo</button>
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
            photographers: [],
            photo: {
                title: '',
                images: [{
                    local: false,
                    image: null
                }],
                existingPhotographer: true,
                selectedPhotographer: null,
                newPhotographer: {
                    name: '',
                    links: ['']
                },
                source: '',
                tagsArray: [],
                note: ''
            }
        }
    },
    created () {
        this.getPhotographers()
    },
    methods: {
        getPhotographers() {
            this.axios.get('/photographer/all').then(response => {
                this.photographers = response.data
            })
        },
        addAnotherImage() {
            this.photo.images.push({ local: false, image: null })
        },
        processFile(event, image) {
            image.image = event.target.files[0]
        },
        addAnotherLinkInput() {
            this.photo.newPhotographer.links.push('')
        },
        removeLinkInput(index) {
            this.photo.newPhotographer.links.splice(index, 1)
        },
        addPhoto() {
            var data = new FormData()
            data.append('title', this.photo.title)
            if(this.photo.existingPhotographer) {
                data.append('existingPhotographer', true)
                data.append('photographerId', this.photo.selectedPhotographer.value)
            } else {
                data.append('existingPhotographer', false)
                data.append('photographerName', this.photo.newPhotographer.name)
                let links = this.photo.newPhotographer.links.filter(link => link) // only links that aren't empty
                data.append('photographerLinks', JSON.stringify(links)) 
            }
            data.append('images', JSON.stringify(this.photo.images))
            this.photo.images.forEach(image => {
                if(image.image instanceof File) {
                    data.append('localImage', image.image)
                }
            })
            data.append('source', this.photo.source)
            data.append('tags', JSON.stringify(this.photo.tagsArray))
            data.append('note', this.photo.note)
            // for(const pair of data.entries()) {
            //     console.log(pair[0], pair[1])
            // }
            this.axios.post('/photo/add', data, this.$store.state.axiosConfig).then(response => {
                if(response.data.success) {
                    this.$router.push({ path: `/photo/${response.data.id}` })   
                } else {
                    console.log(response.data.error)
                }
            })
        }
    },
    computed: {
        photographersMadeSelectFriendly() {
            var selectFriendlyArr = []
            this.photographers.forEach(photographer => {
                selectFriendlyArr.push({ label: photographer.name, value: photographer.id })
            })
            this.photo.selectedPhotographer = selectFriendlyArr[0] // set first photograph in array as selected
            return selectFriendlyArr
        }
    }
}
</script>