<template>
    <div class="container">
        <div class="jumbotron">
            <h1 class="display-3">Mock Up Data</h1>
            <p class="lead">
                <a @click.prevent="mockLoad(0)" href="#">Empty</a>: Empty the workspace.
            </p>
            <p class="lead">
                <a @click.prevent="mockLoad(20)" href="#">Load 20</a>: Empty the workspace and load the first 20 (by
                name) mock nasdaq entries.
            </p>
            <p class="lead">
                <a @click.prevent="mockLoad(100)" href="#">Load 100</a>: Empty the workspace and load the first 100 (by
                name) mock nasdaq entries.
            </p>
            <p class="lead">
                <a @click.prevent="mockLoad(1000)" href="#">Load 1000</a>: Empty the workspace and load the first 1000
                (by name) mock nasdaq entries.
            <p class="lead">
                <a @click.prevent="mockLoad(3000)" href="#">Load 3000</a>: Empty the workspace and load the first 3000
            (by name) mock nasdaq entries. Takes awhile depending on hardware.
            </p>
        </div>
    </div>
</template>

<script>
    import mockResources from "./services/mock";

    export default {
        data() {
            return {
                branch: null
            }
        },
        methods: {
            mockLoad: function (limit) {
                mockResources.mockLoad(limit);
            }
        }
    };
</script>