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
    import nasdaqResources from "./services/nasdaq";
    import mockResources from "./services/mock";

    export default {
        data() {
            return {
                branch: null
            }
        },
        mounted: function () {
            this.$nextTick(function () {
//                nasdaqResources.getDistinctIndustry()
//                        .then(function (result) {
//                            console.log(result);
//                        });
//                nasdaqResources.isReady()
//                        .then(function (result) {
//                            console.log(result===true);
//                        });
//                nasdaqResources.getItems(null, {industry: "Major Pharmaceuticals"})
//                        .then(function (result) {
//                            console.log(result);
//                        });
//                nasdaqResources.getItems('01QnkPNbKXJf8q9j')
//                        .then(function (result) {
//                            console.log(result);
//                        });

//                mockResources.mockLoad(14)
//                        .then(function (result) {
//                            console.log(result);
//                        });
            })
        },
        methods: {
            mockLoad: function (limit) {
                mockResources.mockLoad(limit);
            }
        }
    };
</script>