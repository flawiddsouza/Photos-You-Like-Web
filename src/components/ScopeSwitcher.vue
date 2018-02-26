<template>
    <div class="tabs is-toggle">
        <ul>
            <li v-bind:class="[scope === 'user' ? 'is-active' : '']">
                <a @click="setScopeToUser">Yours</a>
            </li>
            <li v-bind:class="[scope === 'all' ? 'is-active' : '']">
                <a @click="setScopeToAll">All</a>
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'ScopeSwitcher',
    methods: {
        setScopeToAll() {
            this.$store.commit('setScopeToAll')
        },
        setScopeToUser() {
            this.$store.commit('setScopeToUser')
        }
    },
    computed: {
        scope() {
            return this.$store.state.scope
        }
    }
}
</script>