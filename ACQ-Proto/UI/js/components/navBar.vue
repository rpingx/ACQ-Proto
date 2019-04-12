<template>
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
        <a class="navbar-brand" href="#" title="Acquisition Comparison Queue">ACQ</a>
        <button class="navbar-toggler" type="button" @click="toggleBurger();" ref="burger">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div :class="[toggle ? 'show' : '', 'collapse', 'navbar-collapse']">
            <ul class="navbar-nav mr-auto">
                <li v-for="(app, index) in activeApps" :key="index" @click="activePath = app.path"
                    :class="[activePath === app.path ? 'active' : '', 'nav-item']">
                    <router-link class="nav-link" :to="{path: app.path}">
                        {{app.name}}
                    </router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
    export default {
        data: function () {
            return {
                toggle: false,
                activePath: "/"
            };
        },
        computed: {
            activeApps: function () {
                var holderArr = [];
                this.$router.options.routes.forEach(function (appObj) {
                    if (appObj.desc) {
                        holderArr.push(appObj);
                    }
                });

                this.activePath = this.$router.currentRoute.path;

                return holderArr;
            }
        },
        methods: {
            toggleBurger: function () {
                if (this.toggle) {
                    this.$refs.burger.blur();
                }

                this.toggle = !this.toggle;
            }
        }
    };
</script>