<template>
    <div class="container">
        <div class="jumbotron">
            <h1 class="display-3">Acquisition Workspace</h1>
            <div class="row">
                <div class="col-md-6 col-12">
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

                <div class="col-md-6 col-12">
                    <div class="form-group">
                        <label class="control-label">Add work items:</label>
                        <div class="form-group">
                            <button type="button" class="btn btn-info">From NASDAQ</button>
                            <button @click="addBlankWorkItem" type="button" class="btn btn-outline-info">From Blank
                            </button>
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
            <p slot="body">
                Query goes here
            </p>
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
                        <div class="col-12">
                            <pagination v-model="personPaginationIndex" :count="modalWorkItem.KeyContacts.length"
                                        countPer=2></pagination>
                        </div>
                        <div class="col-12" v-for="(keyContact, index) in modalWorkItem.KeyContacts"
                             v-show="index >= personPaginationIndex.min && index <= personPaginationIndex.max ">
                            <div class="row">
                                <formElement>
                                    <span slot="title">Person({{index+1}})'s name</span>
                                    <input slot="body" type="text" class="form-control"
                                           placeholder="Enter Contact Name"
                                           v-model="keyContact.name">
                                </formElement>
                                <formElement>
                                    <span slot="title">Person({{index+1}})'s contact</span>
                                    <input slot="body" type="text" class="form-control"
                                           placeholder="Enter Contact Name"
                                           v-model="keyContact.contact">
                                </formElement>
                                <formElement class="col-md-12 col-12">
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
                        <formElement class="col-md-12 col-12">>
                            <span slot="title">
                                <a @click.prevent="addModalPerson" href="#" class="text-success">Add new key person</a>
                            </span>
                        </formElement>
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
                personPaginationIndex: {min: 0, max: 0},
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
            })
        },
        methods: {
            getAllItems: function () {
                var self = this;
                workspaceResources.getAllItems()
                        .then(function (res) {
                            self.rawDataArr = res;
                            console.log(self.rawDataArr.length);
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
                this.personPaginationIndex = {min: 0, max: 0};
                this.modalPersonConfirmVisible = [];
                this.deleteWorkItemConfirmVisible = false;
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
                console.log(JSON.stringify(this.modalWorkItem.KeyContacts));
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