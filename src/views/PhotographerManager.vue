<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Photographer Manager</h1>
            <button class="button is-medium block" @click="addPhotographerBool = true" v-if="authenticatedUser">Add New Photographer</button>
            <br v-if="authenticatedUser">
            <table class="table is-bordered is-narrow center-table" id="artist-manager">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Link</th>
                        <th>Photo Count</th>
                        <th>Added On</th>
                        <th>Last Updated On</th>
                        <th v-if="authenticatedUser"></th>
                        <th v-if="authenticatedUser"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(photographer, index) in photographers">
                        <td>{{ photographer.id }}</td>
                        <td>
                            <router-link :to="'/photographer/' + photographer.id + '/all'">
                                {{ photographer.name }}
                            </router-link>
                        </td>
                        <td>
                            <a v-for="link in photographer.links" :href="link" class="is-block">{{ link }}</a>
                        </td>
                        <td>{{ photographer.count }}</td>
                        <td>{{ photographer.created_at }}</td>
                        <td>{{ photographer.updated_at }}</td>
                        <td v-if="authenticatedUser"><button class="button is-outlined" @click="editPhotographer(photographer, index, $event)">Edit</button></td>
                        <td v-if="authenticatedUser"><button class="button is-danger is-outlined" @click="deletePhotographer(photographer.id, index, $event)">Delete</button></td>
                    </tr>
                </tbody>
            </table>
            <div class="modal" v-bind:class="{ 'is-active': addPhotographerBool }">
                <div class="modal-background" @click="addPhotographerBool = false"></div>
                <div class="modal-content">
                    <section class="modal-card-body">
                        <label class="label">Photographer name</label>
                        <input type="text" class="input" v-model="photographer.name">
                        <label class="label">Photographer website</label>
                        <div v-for="(link, index) in photographer.links" class="field has-addons" v-bind:class="[index > 0 ? 'small-top-margin' : '']">
                            <div class="control is-fullwidth">
                                <input type="text" class="input" v-model="photographer.links[index]">
                            </div>
                            <button v-if="index > 0" @click="removeLinkInput(index)" class="button">x</button>
                        </div>
                        <button class="button small-top-margin" @click="addAnotherLinkInput">Add another link</button>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" @click="addPhotographer">Add Photographer</button>
                        <button class="button" @click="addPhotographerBool = false">Cancel</button>
                    </footer>
                </div>
                <button class="modal-close is-large" aria-label="close" @click="addPhotographerBool = false"></button>
            </div>
            <div class="modal" v-bind:class="{ 'is-active': editPhotographerBool }">
                <div class="modal-background" @click="editPhotographerBool = false"></div>
                <div class="modal-content">
                    <section class="modal-card-body">
                        <label class="label">Photographer name</label>
                        <input type="text" class="input" v-model="photographer.name">
                        <label class="label">Photographer website</label>
                        <div v-for="(link, index) in photographer.links" class="field has-addons" v-bind:class="[index > 0 ? 'small-top-margin' : '']">
                            <div class="control is-fullwidth">
                                <input type="text" class="input" v-model="photographer.links[index]">
                            </div>
                            <button v-if="index > 0" @click="removeLinkInput(index)" class="button">x</button>
                        </div>
                        <button class="button small-top-margin" @click="addAnotherLinkInput">Add another link</button>
                    </section>
                    <footer class="modal-card-foot">
                        <button class="button" @click="updatePhotographer">Update Photographer</button>
                        <button class="button" @click="editPhotographerBool = false">Cancel</button>
                    </footer>
                </div>
                <button class="modal-close is-large" aria-label="close" @click="editPhotographerBool = false"></button>
            </div>
        </div>
    </section>
</template>

<script>
var currentInstance = null

export default {
    data() {
        return {
            photographers: [],
            addPhotographerBool: false,
            editPhotographerBool: false,
            photographer: {
                name: '',
                links: ['']
            }
        }
    },
    created() {
        currentInstance = this
        this.fetchPhotographers()
    },
    destroyed() {
        currentInstance = null
    },
    methods: {
        fetchPhotographers() {
            this.axios.get('/photographer/all/with/count').then(response => {
                this.photographers = response.data
            })
        },
        addAnotherLinkInput() {
            this.photographer.links.push('')
        },
        removeLinkInput(index) {
            this.photographer.links.splice(index, 1)
        },
        addPhotographer() {
            this.axios.post('/photographer/add', {
                name: this.photographer.name,
                links: JSON.stringify(this.photographer.links)
            }, this.$store.state.axiosConfig).then(response => {
                if(response.data.success) {
                    this.photographers.push(response.data.photographer)
                    this.addPhotographerBool = false
                    this.resetPhotographerObject()
                } else {
                    console.log(response.data.error)
                }
            })
        },
        editPhotographer(photographer, index, event) {
            this.photographer.index = index
            this.photographer.editButton = event.target
            this.photographer.id = photographer.id
            this.photographer.name = photographer.name
            this.photographer.links = photographer.links.slice(0) // https://davidwalsh.name/javascript-clone-array
            this.editPhotographerBool = true
        },
        updatePhotographer() {
            this.axios.patch(`/photographer/${this.photographer.id}`, {
                name: this.photographer.name,
                links: JSON.stringify(this.photographer.links)
            }, this.$store.state.axiosConfig).then(response => {
                if(response.data.success) {
                    this.photographers[this.photographer.index]['name'] = this.photographer.name
                    this.photographers[this.photographer.index]['links'] = this.photographer.links.slice(0)
                    this.photographers[this.photographer.index]['updated_at'] = response.data.updatedAt
                    this.editPhotographerBool = false
                    this.resetPhotographerObject()
                } else {
                    console.log(response.data.error)
                }
            })
        },
        deletePhotographer(id, index, event) {
            this.alertify.confirm('Deleting a photographer will also delete all photos assosicated to them. This action is irreversible! Are you sure?', () => {
                this.alertify.prompt('Type yes to confirm', (value, e) => {
                    if(value === 'yes') {
                        event.target.classList.add('is-loading')
                        this.axios.delete(`/photographer/${id}`, this.$store.state.axiosConfig).then(response => {
                            if(response.data.success) {
                                this.photographers.splice(index, 1)
                                this.alertify.success('Photographer deleted')
                            } else {
                                console.log(response.data.error)
                            }
                        })
                    } else {
                        this.alertify.error("You've didn't type yes, so we've cancelled the delete request")
                    }
                })
            })
        },
        resetPhotographerObject() {
            if(this.photographer.id) { // means the object was just in editing
                delete this.photographer.id
                delete this.photographer.index
                delete this.photographer.editButton
            }
            this.photographer.name = ''
            this.photographer.links = ['']
        }
    },
    computed: {
        authenticatedUser() {
            return this.$store.state.authenticatedUser
        }
    }
}

// close modal when esc is pressed
window.addEventListener('keyup', e => {
    if(e.key == 'Escape') {
        if(currentInstance) {
            currentInstance.addPhotographerBool = false
        }
    }
})
</script>
