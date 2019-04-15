<template>
    <div class="col-md-6 col-lg-4">
        <div :class="classCreator(entry.Status)" @click="selectFunc(entry)" style="cursor: pointer;">
            <div class="card-header text-truncate" :title="entry.Symbol + '-' + entry.Name">
                {{entry.Symbol}} - {{entry.Name}}
            </div>
            <div class="card-body">
                <div class="row">
                    <div class="col-5 font-weight-bold text-dark">Sector:</div>
                    <div class="col-7 text-truncate" :title="entry.Sector">{{entry.Sector}}</div>
                    <div class="col-5 font-weight-bold text-dark">Industry:</div>
                    <div class="col-7 text-truncate" :title="entry.Industry">{{entry.Industry}}</div>
                    <div class="col-5 font-weight-bold text-dark">Price:</div>
                    <div class="col-7 text-truncate" :title="'$' + entry.Price">${{entry.Price}}</div>
                    <div class="col-5 font-weight-bold text-dark"
                         v-show="entry.MarketCap && entry.MarketCap != 'n\a' && entry.MarketCap != 'n/a'">M. Cap:
                    </div>
                    <div class="col-7 text-truncate" :title="entry.MarketCap + 'M'"
                         v-show="entry.MarketCap && entry.MarketCap != 'n\a' && entry.MarketCap != 'n/a'">
                        {{entry.MarketCap}}M
                    </div>
                    <div class="col-5 font-weight-bold text-dark"
                         v-show="entry.IPOYear && entry.IPOYear != 'n\a' && entry.IPOYear != 'n/a'">
                        IPO:
                    </div>
                    <div class="col-7 text-truncate" :title="entry.IPOYear"
                         v-show="entry.IPOYear && entry.IPOYear != 'n\a' && entry.IPOYear != 'n/a'">
                        {{entry.IPOYear}}
                    </div>
                </div>
            </div>
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
                    return "card bg-" + statusService.getStyle(status) + " mb-3";
                }
                return "card text-white bg-" + statusService.getStyle(status) + " mb-3";
            }
        }
    };
</script>