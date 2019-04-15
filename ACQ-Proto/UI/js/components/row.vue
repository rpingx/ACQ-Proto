<template>
    <div :class="classCreator(entry.Status)" @click="selectFunc(entry)" style="cursor: pointer;">
        <div class="col-4 col-lg-4 col-xl-2 text-truncate"
             :title="entry.Symbol + '\\' + entry.Name">
            {{entry.Symbol}}\{{entry.Name}}
        </div>
        <div class="col-3 col-lg-3 col-xl-2 text-truncate" :title="entry.Sector">
            {{entry.Sector}}
        </div>
        <div class="col-5 col-lg-5 col-xl-3 text-truncate" :title="entry.Industry">
            {{entry.Industry}}
        </div>
        <div class="col-xl-2 d-none d-xl-block text-truncate"
             :title="'$' + entry.Price">
            <span v-show="entry.Price && entry.Price != 'n\a' && entry.Price != 'n/a'">${{entry.Price}}</span>
        </div>
        <div class="col-xl-2 d-none d-xl-block text-truncate"
             :title="entry.MarketCap + 'M'">
            <span v-show="entry.MarketCap && entry.MarketCap != 'n\a' && entry.MarketCap != 'n/a'">{{entry.MarketCap}}M</span>
        </div>
        <div class="col-xl-1 d-none d-xl-block text-truncate" :title="entry.IPOYear">
            <span v-show="entry.IPOYear && entry.IPOYear != 'n\a' && entry.IPOYear != 'n/a'">{{entry.IPOYear}}</span>
        </div>
    </div>
</template>

<script>
    import statusService from "../services/status";

    export default {
        props: ["selectFunc", "entry"],
        data: function () {
            return {};
        },
        methods: {
            classCreator: function (status) {
                if (status == 0) {
                    return "row bg-" + statusService.getStyle(status);
                }
                return "row text-white bg-" + statusService.getStyle(status)
            }
        }
    };
</script>