<template>
    <div>
        <div class="container" v-if="!isLoaded">
            Loading...
        </div>
        <div v-if="isLoaded">
            <nav-bar></nav-bar>
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import nasdaqResources from "./services/nasdaq";

    import navBar from './components/navBar.vue';

    export default {
        data() {
            return {
                isLoaded: false
            }
        },
        components: {
            navBar
        },
        mounted: function () {
            this.$nextTick(this.checkLoaded);
        },
        methods: {
            checkLoaded: function () {
                var self = this;
                nasdaqResources.isReady()
                        .then(function (result) {
                            self.isLoaded = result;
                            if (!result) {
                                setTimeout(self.checkLoaded, 500);
                            }
                        });
            }
        }
    };
</script>