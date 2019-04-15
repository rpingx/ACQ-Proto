<template>
    <div>
        <div class="row">
            <div class="col-12">
                <pagination v-model="paginationIndex" countPer=25
                            :count="objectArray.length"/>
            </div>
            <div class="col-4 col-lg-4 col-xl-2 text-nowrap font-weight-bold text-white bg-dark">
                Symbol\Name
            </div>
            <div class="col-3 col-lg-3 col-xl-2 text-nowrap font-weight-bold text-white bg-dark">
                Sector
            </div>
            <div class="col-5 col-lg-5 col-xl-3 text-nowrap font-weight-bold text-white bg-dark">
                Industry
            </div>
            <div class="col-xl-2 d-none d-xl-block text-nowrap font-weight-bold text-white bg-dark">
                Price
            </div>
            <div class="col-xl-2 d-none d-xl-block text-nowrap font-weight-bold text-white bg-dark">
                Market Cap
            </div>
            <div class="col-xl-1 d-none d-xl-block text-nowrap font-weight-bold text-white bg-dark">
                IPO
            </div>
        </div>
        <row v-for="(entry, ind) in objectArray" :entry="entry" :selectFunc="selectFunc"
             v-if="ind >= paginationIndex.min && ind <= paginationIndex.max"/>
    </div>
</template>

<script>
    import row from './row.vue';
    import pagination from './pagination.vue';

    export default {
        components: {
            row: row,
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