<template>
    <div class="container">
        <div class="jumbotron">
            <h1 class="display-3">Acquisition Workspace</h1>
            <div class="row">
                <div class="col-lg-6 col-12">
                    <div class="form-group">
                        <label class="control-label">View mode:</label>
                        <div class="form-group">
                            <div class="input-group mb-3">
                                <button @click.prevent="viewMode = 'tile'"
                                        :class="[viewMode === 'tile' ? 'btn-primary' : 'btn-outline-primary', 'btn']">
                                    Tile
                                </button>
                                <button @click.prevent="viewMode = 'row'"
                                        :class="[viewMode === 'row' ? 'btn-primary' : 'btn-outline-primary', 'btn']">
                                    Row
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-lg-6 col-12">
                    <div class="form-group">
                        <label class="control-label">Add work items:</label>
                        <div class="form-group">
                            <div class="input-group mb-3 nowrap">
                                <button @click="startNasdaq" type="button" class="btn btn-info">From NASDAQ</button>
                                <button @click="addBlankWorkItem" type="button" class="btn btn-outline-info">From Blank
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-md-12">
                    Zone
                </div>

            </div>
        </div>

        <modal v-show="isNasdaqVisible" :close="closeNasdaq">
            <span slot="title">NASDAQ Query</span>
            <form slot="body">
                <fieldset class="container">
                    <div class="row">
                        <formElement>
                            <span slot="title">Name or symbol search</span>
                            <input slot="body" type="text" class="form-control"
                                   placeholder="Enter partial text"
                                   v-model="NasdaqFilter.text"
                                   @keydown="filterNasdaq">
                        </formElement>

                        <formElement>
                            <span slot="title">Sector filter</span>
                            <div slot="body" class="form-group">
                                <select class="form-control" v-model="NasdaqFilter.sector" @change="filterNasdaq">
                                    <option v-for="option in NasdaqSectorOpt" :value="option.value">
                                        {{ option.text }}
                                    </option>
                                </select>
                            </div>
                        </formElement>

                        <formElement class="col-md-12 col-12">
                            <span slot="title">Industry filter</span>
                            <div slot="body" class="form-group">
                                <select class="form-control" v-model="NasdaqFilter.industry" @change="filterNasdaq">
                                    <option v-for="option in NasdaqIndustryOpt" :value="option.value">
                                        {{ option.text }}
                                    </option>
                                </select>
                            </div>
                        </formElement>

                        <formElement class="d-none d-md-block">
                            <span slot="title">IPO year filter</span>
                            <input slot="body" type="number" class="form-control"
                                   placeholder="Enter min IPO year"
                                   v-model="NasdaqFilter.ipoYearMin"
                                   @keydown="debouncer(validateIPOMin)"
                                   @change="debouncer(validateIPOMin)">
                        </formElement>
                        <formElement class="d-none d-md-block">
                            <span slot="title">&nbsp</span>
                            <input slot="body" type="number" class="form-control"
                                   placeholder="Enter max IPO year"
                                   v-model="NasdaqFilter.ipoYearMax"
                                   @keydown="debouncer(validateIPOMax)"
                                   @change="debouncer(validateIPOMax)">
                        </formElement>

                        <formElement class="d-none d-md-block">
                            <span slot="title">Price filter</span>
                            <div slot="body" class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">$</span>
                                    </div>
                                    <input type="number" class="form-control"
                                           placeholder="Enter min Price"
                                           v-model="NasdaqFilter.priceMin"
                                           @keydown="debouncer(validatePriceMin)"
                                           @change="debouncer(validatePriceMin)">
                                </div>
                            </div>
                        </formElement>
                        <formElement class="d-none d-md-block">
                            <span slot="title">&nbsp</span>
                            <div slot="body" class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">$</span>
                                    </div>
                                    <input type="number" class="form-control"
                                           placeholder="Enter max Price"
                                           v-model="NasdaqFilter.priceMax"
                                           @keydown="debouncer(validatePriceMax)"
                                           @change="debouncer(validatePriceMax)">
                                </div>
                            </div>
                        </formElement>

                        <formElement class="d-none d-md-block">
                            <span slot="title">Market cap (millions) filter</span>
                            <div slot="body" class="form-group">
                                <div class="input-group">
                                    <input type="number" class="form-control"
                                           placeholder="Enter min market cap"
                                           v-model="NasdaqFilter.marketCapMin"
                                           @keydown="debouncer(validateMarketCapMin)"
                                           @change="debouncer(validateMarketCapMin)">
                                    <div class="input-group-append">
                                        <span class="input-group-text">M</span>
                                    </div>
                                </div>
                            </div>
                        </formElement>
                        <formElement class="d-none d-md-block">
                            <span slot="title">&nbsp</span>
                            <div slot="body" class="form-group">
                                <div class="input-group">
                                    <input type="number" class="form-control"
                                           placeholder="Enter max market cap"
                                           v-model="NasdaqFilter.marketCapMax"
                                           @keydown="debouncer(validateMarketCapMax)"
                                           @change="debouncer(validateMarketCapMax)">
                                    <div class="input-group-append">
                                        <span class="input-group-text">M</span>
                                    </div>
                                </div>
                            </div>
                        </formElement>
                        <div class="col-12" v-show="NasdaqResults.length > 0">
                            <pagination v-model="NasdaqPaginationIndex" :count="NasdaqResults.length"
                                        countPer=10></pagination>
                        </div>
                        <div class="col-12" v-show="NasdaqResults.length > 0">
                            <div class="row">
                                <div class="col-4 col-lg-4 col-xl-2 text-nowrap font-weight-bold text-white bg-dark">
                                    Symbol\Name
                                </div>
                                <div class="col-3 col-lg-3 col-xl-2 text-nowrap font-weight-bold text-white bg-dark">
                                    Sector
                                </div>
                                <div class="col-4 col-lg-4 col-xl-2 text-nowrap font-weight-bold text-white bg-dark">
                                    Industry
                                </div>
                                <div class="col-xl-1 d-none d-xl-block text-nowrap font-weight-bold text-white bg-dark">
                                    IPO
                                </div>
                                <div class="col-xl-2 d-none d-xl-block text-nowrap font-weight-bold text-white bg-dark">
                                    Price
                                </div>
                                <div class="col-xl-2 d-none d-xl-block text-nowrap font-weight-bold text-white bg-dark">
                                    Market Cap
                                </div>
                                <div class="col-1 col-lg-1 col-xl-1 text-nowrap font-weight-bold text-white bg-dark">
                                    Add
                                </div>
                                <template v-for="(entry, ind) in NasdaqResults"
                                          v-if="ind >= NasdaqPaginationIndex.min && ind <= NasdaqPaginationIndex.max ">
                                    <div class="col-4 col-lg-4 col-xl-2 text-truncate"
                                         :title="entry.Symbol + '\\' + entry.Name">
                                        {{entry.Symbol}}\{{entry.Name}}
                                    </div>
                                    <div class="col-3 col-lg-3 col-xl-2 text-truncate" :title="entry.Sector">
                                        {{entry.Sector}}
                                    </div>
                                    <div class="col-4 col-lg-4 col-xl-2 text-truncate" :title="entry.Industry">
                                        {{entry.Industry}}
                                    </div>
                                    <div class="col-xl-1 d-none d-xl-block text-truncate" :title="entry.IPOYear">
                                        {{entry.IPOYear}}
                                    </div>
                                    <div class="col-xl-2 d-none d-xl-block text-truncate" :title="'$' + entry.Price">
                                        ${{entry.Price}}
                                    </div>
                                    <div class="col-xl-2 d-none d-xl-block text-truncate"
                                         :title="entry.MarketCap + 'M'">
                                        {{entry.MarketCap}}M
                                    </div>
                                    <div class="col-1 col-lg-1 col-xl-1 text-truncate">
                                        <button type="button" @click="addNasdaqWorkItem(entry._id);"
                                                class="btn-xs btn-success">+
                                        </button>
                                    </div>
                                </template>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>
            <span slot="footer">
                      <button type="button" class="btn btn-outline-secondary" @click="closeNasdaq">Close</button>
            </span>
        </modal>

        <modal v-show="isWorkItemVisible" :close="closeWorkItem">
            <span slot="title">Work Item Details</span>
            <form slot="body">
                <fieldset class="container">
                    <div class="row">
                        <formElement>
                            <span slot="title">Symbol</span>
                            <input slot="body" type="text" class="form-control"
                                   placeholder="Enter stock symbol"
                                   v-model="modalWorkItem.Symbol">
                        </formElement>
                        <formElement>
                            <span slot="title">Name</span>
                            <input slot="body" type="text" class="form-control"
                                   placeholder="Enter company name"
                                   v-model="modalWorkItem.Name">
                        </formElement>
                        <formElement>
                            <span slot="title">Sector</span>
                            <input slot="body" type="text" class="form-control"
                                   placeholder="Enter sector"
                                   v-model="modalWorkItem.Sector">
                        </formElement>
                        <formElement>
                            <span slot="title">IPO year</span>
                            <input slot="body" type="number" class="form-control"
                                   placeholder="Enter IPO year"
                                   v-model="modalWorkItem.IPOYear">
                        </formElement>
                        <formElement class="col-md-12 col-12">
                            <span slot="title">Industry</span>
                            <input slot="body" type="text" class="form-control"
                                   placeholder="Enter industry"
                                   v-model="modalWorkItem.Industry">
                        </formElement>
                        <formElement>
                            <span slot="title">Price</span>
                            <div slot="body" class="form-group">
                                <div class="input-group">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text">$</span>
                                    </div>
                                    <input type="number" class="form-control"
                                           placeholder="Enter price"
                                           v-model="modalWorkItem.Price">
                                </div>
                            </div>
                        </formElement>
                        <formElement>
                            <span slot="title">Market Cap (millions)</span>
                            <div slot="body" class="form-group">
                                <div class="input-group ">
                                    <input type="number" class="form-control"
                                           placeholder="Enter market cap"
                                           v-model="modalWorkItem.MarketCap">
                                    <div class="input-group-append">
                                        <span class="input-group-text">M</span>
                                    </div>
                                </div>
                            </div>
                        </formElement>
                        <formElement>
                            <span slot="title">Status</span>
                            <div slot="body" class="form-group">
                                <select class="form-control" v-model="modalWorkItem.Status">
                                    <option v-for="option in statusOpt" :value="option.value">
                                        {{ option.text }}
                                    </option>
                                </select>
                            </div>
                        </formElement>
                        <formElement>
                        </formElement>
                        <div class="col-12 d-none d-md-block">
                            <pagination v-model="personPaginationIndex" :count="modalWorkItem.KeyContacts.length"
                                        countPer=2></pagination>
                        </div>
                        <formElement class="col-md-12 col-12 d-none d-md-block">
                            <span slot="title">
                                <a @click.prevent="addModalPerson" href="#" class="text-success">Add new key person</a>
                            </span>
                        </formElement>

                        <div class="col-12" v-for="(keyContact, index) in modalWorkItem.KeyContacts"
                             v-if="index >= personPaginationIndex.min && index <= personPaginationIndex.max">
                            <div class="row">
                                <formElement class="d-none d-md-block">
                                    <span slot="title">Person({{index+1}})'s name</span>
                                    <input slot="body" type="text" class="form-control"
                                           placeholder="Enter Contact Name"
                                           v-model="keyContact.name">
                                </formElement>
                                <formElement class="d-none d-md-block">
                                    <span slot="title">Person({{index+1}})'s contact</span>
                                    <input slot="body" type="text" class="form-control"
                                           placeholder="Enter Contact Name"
                                           v-model="keyContact.contact">
                                </formElement>
                                <formElement class="col-md-12 col-12 d-none d-md-block">>
                                    <span slot="title">
                                        <span v-show="!modalPersonConfirmVisible[index]">
                                            <a @click.prevent="toggleModalPersonConfirmation(index)" href="#"
                                               class="text-danger">Remove</a>
                                        </span>
                                        <span v-show="modalPersonConfirmVisible[index]">Confirm removal?
                                            <a @click.prevent="deleteModalPerson(index)"
                                               href="#" class="text-success">Yes</a>
                                            /
                                            <a @click.prevent="toggleModalPersonConfirmation(index)"
                                               href="#" class="text-danger">No</a>
                                        </span>
                                    </span>
                                </formElement>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </form>
            <span slot="footer">
                <button type="button" class="btn btn-success" @click="addWorkItem" v-show="!(modalWorkItem._id)">Add
                </button>
                <span v-show="!deleteWorkItemConfirmVisible && modalWorkItem._id">
                    <button type="button" class="btn btn-success" @click="updateWorkItem">
                        Update
                    </button>
                    <button type="button" class="btn btn-warning" @click="deleteWorkItemConfirmVisible=true">
                        Delete
                    </button>
                </span>
                <span v-show="deleteWorkItemConfirmVisible && modalWorkItem._id">
                    Confirm removal?
                    <button type="button" class="btn btn-success" @click="deleteWorkItem">
                        Yes
                    </button>
                    <button type="button" class="btn btn-danger" @click="deleteWorkItemConfirmVisible=false">
                        No
                    </button>
                </span>
                <button type="button" class="btn btn-outline-secondary" @click="closeWorkItem">Close</button>
            </span>
        </modal>
    </div>
</template>

<script>
    import nasdaqResources from "./services/nasdaq";
    import workspaceResources from "./services/workspace";
    import statusService from "./services/status";
    import utils from "./services/utils";

    import modal from "./components/modal.vue";
    import formElement from "./components/formElement.vue";
    import pagination from "./components/pagination.vue";

    export default {
        components: {
            modal: modal,
            formElement: formElement,
            pagination: pagination
        },
        data() {
            return {
                viewMode: "tile",
                isNasdaqVisible: false,
                debouncer: utils.getDebouncer(1200)("default"),
                debouncerNasdaq: utils.getDebouncer(750)("Nasdaq"),
                NasdaqSectorOpt: [],
                NasdaqIndustryOpt: [],
                NasdaqFilter: {
                    industry: null,
                    sector: null,
                    text: null,
                    ipoYearMin: null,
                    ipoYearMax: null,
                    marketCapMin: null,
                    marketCapMax: null,
                    priceMin: null,
                    priceMax: null
                },
                NasdaqResults: [],
                NasdaqPaginationIndex: {min: 0, max: 0},
                isWorkItemVisible: false,
                statusOpt: statusService.getOptions(),
                modalWorkItem: {
                    "Symbol": "",
                    "Name": "",
                    "Price": null,
                    "MarketCap": null,
                    "IPOYear": null,
                    "Sector": "",
                    "Industry": "",
                    "Status": "0",
                    "KeyContacts": [
                        {
                            "name": "",
                            "contact": ""
                        }
                    ]
                },
                modalPersonConfirmVisible: [],
                deleteWorkItemConfirmVisible: false,
                personPaginationIndex: {min: 0, max: 1},
                rawDataArr: []
            }
        },
        computed: {},
        watch: {
            "modalWorkItem.KeyContacts": function (val) {
                let visArr = [];
                val.forEach(function () {
                    visArr.push(false);
                });

                this.modalPersonConfirmVisible = visArr;
            }
        },
        mounted: function () {
            var self = this;
            this.$nextTick(function () {
                self.getAllItems();
                nasdaqResources.getDistinctIndustry().then(function (res) {
                    self.NasdaqIndustryOpt = res.map(ArrayToOptions);
                });

                nasdaqResources.getDistinctSector().then(function (res) {
                    self.NasdaqSectorOpt = res.map(ArrayToOptions);
                });

                const ArrayToOptions = function (value) {
                    if (value === "n/a") {
                        return {text: "no filter", value: null};
                    }
                    return {text: value, value: value}
                };
            })
        },
        methods: {
            validateIPOMin: function () {
                if (this.NasdaqFilter.ipoYearMin != null && this.NasdaqFilter.ipoYearMin.length > 0 &&
                        this.NasdaqFilter.ipoYearMax != null && this.NasdaqFilter.ipoYearMax.length > 0 &&
                        Number(this.NasdaqFilter.ipoYearMin) > Number(this.NasdaqFilter.ipoYearMax)) {
                    this.NasdaqFilter.ipoYearMax = this.NasdaqFilter.ipoYearMin;
                }
                this.filterNasdaq();
            },
            validateIPOMax: function () {
                if (this.NasdaqFilter.ipoYearMin != null && this.NasdaqFilter.ipoYearMin.length > 0 &&
                        this.NasdaqFilter.ipoYearMax != null && this.NasdaqFilter.ipoYearMax.length > 0 &&
                        Number(this.NasdaqFilter.ipoYearMin) > Number(this.NasdaqFilter.ipoYearMax)) {
                    this.NasdaqFilter.ipoYearMin = this.NasdaqFilter.ipoYearMax;
                }
                this.filterNasdaq();
            },
            validatePriceMin: function () {
                if (this.NasdaqFilter.priceMin != null && this.NasdaqFilter.priceMin.length > 0 &&
                        this.NasdaqFilter.priceMax != null && this.NasdaqFilter.priceMax.length > 0 &&
                        Number(this.NasdaqFilter.priceMin) > Number(this.NasdaqFilter.priceMax)) {
                    this.NasdaqFilter.priceMax = this.NasdaqFilter.priceMin;
                }
                this.filterNasdaq();
            },
            validatePriceMax: function () {
                if (this.NasdaqFilter.priceMin != null && this.NasdaqFilter.priceMin.length > 0 &&
                        this.NasdaqFilter.priceMax != null && this.NasdaqFilter.priceMax.length > 0 &&
                        Number(this.NasdaqFilter.priceMin) > Number(this.NasdaqFilter.priceMax)) {
                    this.NasdaqFilter.priceMin = this.NasdaqFilter.priceMax;
                }
                this.filterNasdaq();
            },
            validateMarketCapMin: function () {
                if (this.NasdaqFilter.marketCapMin != null && this.NasdaqFilter.marketCapMin.length > 0 &&
                        this.NasdaqFilter.marketCapMax != null && this.NasdaqFilter.marketCapMax.length > 0 &&
                        Number(this.NasdaqFilter.marketCapMin) > Number(this.NasdaqFilter.marketCapMax)) {
                    this.NasdaqFilter.marketCapMax = this.NasdaqFilter.marketCapMin;
                }
                this.filterNasdaq();
            },
            validateMarketCapMax: function () {
                if (this.NasdaqFilter.marketCapMin != null && this.NasdaqFilter.marketCapMin.length > 0 &&
                        this.NasdaqFilter.marketCapMax != null && this.NasdaqFilter.marketCapMax.length > 0 &&
                        Number(this.NasdaqFilter.marketCapMin) > Number(this.NasdaqFilter.marketCapMax)) {
                    this.NasdaqFilter.marketCapMin = this.NasdaqFilter.marketCapMax;
                }
                this.filterNasdaq();
            },
            numberValidate: function (obj, field) {
                if (obj[field] != null && obj[field].length > 0) {
                    obj[field] = Number(obj[field]);
                } else {
                    obj[field] = null;
                }

            },
            filterNasdaq: function () {
                var self = this;
                this.debouncerNasdaq(function () {
                    let shallowCopy = Object.assign({}, self.NasdaqFilter);
                    self.numberValidate(shallowCopy, "ipoYearMin");
                    self.numberValidate(shallowCopy, "ipoYearMax");
                    self.numberValidate(shallowCopy, "priceMin");
                    self.numberValidate(shallowCopy, "priceMax");
                    self.numberValidate(shallowCopy, "marketCapMin");
                    self.numberValidate(shallowCopy, "marketCapMax");

                    nasdaqResources.getItems(null, shallowCopy)
                            .then(function (docs) {
                                self.NasdaqResults = docs;
                            });
                });
            },
            getAllItems: function () {
                var self = this;
                workspaceResources.getAllItems()
                        .then(function (res) {
                            self.rawDataArr = res;
                            console.log(self.rawDataArr.length);
                        });
            },
            addNasdaqWorkItem: function (id) {
                var self = this;
                this.closeNasdaq();
                nasdaqResources.getItems(id)
                        .then(function (res) {
                            self.setWorkItemModal(res);
                        });
            },
            addBlankWorkItem: function () {
                this.setWorkItemModal(
                        {
                            "Symbol": "",
                            "Name": "",
                            "Price": null,
                            "MarketCap": null,
                            "IPOYear": null,
                            "Sector": "",
                            "Industry": "",
                            "Status": "0",
                            "KeyContacts": [
                                {
                                    "name": "",
                                    "contact": ""
                                }
                            ]
                        }
                );
            },
            setWorkItemModal: function (obj) {
                this.modalWorkItem = obj;
                this.isWorkItemVisible = true;
                this.personPaginationIndex = {min: 0, max: 1};
                this.modalPersonConfirmVisible = [];
                this.deleteWorkItemConfirmVisible = false;
            },
            startNasdaq: function () {
                this.isNasdaqVisible = true;
                this.NasdaqFilter = {
                    industry: null,
                    sector: null,
                    text: null,
                    ipoYearMin: null,
                    ipoYearMax: null,
                    marketCapMin: null,
                    marketCapMax: null,
                    priceMin: null,
                    priceMax: null
                };
                this.NasdaqResults = [];
                this.NasdaqPaginationIndex = {min: 0, max: 0};
            },
            closeNasdaq: function () {
                this.isNasdaqVisible = false;
            },
            closeWorkItem: function () {
                this.isWorkItemVisible = false;
                this.getAllItems();
            },
            addWorkItem: function () {
                workspaceResources.addItem(this.modalWorkItem)
                        .then(this.closeWorkItem);
            },
            updateWorkItem: function () {
                workspaceResources.updateById(this.modalWorkItem._id, this.modalWorkItem)
                        .then(this.closeWorkItem);
            },
            deleteWorkItem: function () {
                workspaceResources.deleteById(this.modalWorkItem._id)
                        .then(this.closeWorkItem);
            },
            addModalPerson: function () {
                this.modalWorkItem.KeyContacts.push(
                        {
                            "name": "",
                            "contact": ""
                        }
                );
            },
            deleteModalPerson: function (index) {
                this.modalWorkItem.KeyContacts.splice(index, 1);
            },
            toggleModalPersonConfirmation: function (index) {
                this.modalPersonConfirmVisible[index] = !this.modalPersonConfirmVisible[index];
                this.$forceUpdate();
            }
        }
    };
</script>