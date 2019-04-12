<template>
    <div class="container">
        <div class="jumbotron">
            <h1 class="display-3">Mock Up Data</h1>
            <p class="lead">

            </p>
        </div>
    </div>
</template>

<script>
    import nasdaqResources from "./services/nasdaq";

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
                nasdaqResources.getItems(null, {industry: "Major Pharmaceuticals"})
                        .then(function (result) {
                            console.log(result);
                        });
            })
        }
    };
</script>