<template>
    <div class="row">
        <div class="col-12">
            <pagination v-model="paginationIndex" countPer=12
                        :count="objectArray.length"/>
        </div>
        <tile v-for="(entry, ind) in objectArray" :entry="entry" :selectFunc="selectFunc"
              v-if="ind >= paginationIndex.min && ind <= paginationIndex.max"/>
    </div>
</template>

<script>
    import tile from './tile.vue';
    import pagination from './pagination.vue';

    export default {
        components: {
            tile: tile,
            pagination: pagination
        },
        props: ["selectFunc", "objectArray"],
        data: function () {
            return {
                paginationIndex: {}
            };
        }
    };
</script>