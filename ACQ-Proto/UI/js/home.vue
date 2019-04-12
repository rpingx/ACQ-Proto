<template>
    <div class="container">
        <div class="jumbotron">
            <h1 class="display-3">Home</h1>
            <p class="lead" v-for="app in activeApps">
                <router-link :to="app.path">{{app.name}}</router-link>: {{app.desc}}
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props: [],
        computed: {
            activeApps: function () {
                var holderArr = [];
                this.$router.options.routes.forEach(function (appObj) {
                    if (appObj.desc) {
                        holderArr.push(appObj);
                    }
                });

                return holderArr;
            }
        }
    };
</script>
