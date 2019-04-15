<template>
    <div>
        <ul class="pagination">
            <li :class="[isLeftDisabled ? 'disabled' : '', 'page-item']">
                <a @click.prevent="shiftLeft" class="page-link"
                   href="#">&laquo;</a>
            </li>
            <li :class="[index === activePage ? 'active' : '', 'page-item', 'text-center']"
                v-for="(page, index) in totalPage"
                v-show="index >= shownMin && index <= shownMax"
                style="min-width: 42px;max-width: 42px;">
                <a @click.prevent="select(index)"
                   class="page-link" href="#">{{displayText(index)}}</a>
            </li>
            <li :class="[isRightDisabled ? 'disabled' : '', 'page-item']">
                <a @click.prevent="shiftRight" class="page-link" href="#">&raquo;</a>
            </li>
        </ul>
    </div>
</template>


<script>
    export default {
        props: ['value', 'count', 'countPer'],
        data: function () {
            return {
                idealCap: 5
            }
        },
        computed: {
            absoluteMax: function () {
                return Number(Math.ceil(this.count / this.countPer));
            },
            totalPage: function () {
                var tempTotal = [];
                for (let ind = 0; ind < this.absoluteMax; ind++) {
                    tempTotal.push(ind);
                }

                return tempTotal;
            },
            shownMin: function () {
                if (this.totalPage.length > 0) {
                    let max = this.totalPage.length - 1;

                    let highDelta = max - Number(this.activePage);
                    let lowDelta = Number(this.activePage);

                    if (highDelta < lowDelta && highDelta < this.idealCap) {
                        lowDelta = 10 - highDelta;
                    } else {
                        lowDelta = this.idealCap;
                    }

                    return this.activePage - lowDelta;
                }
                return 0;
            },
            shownMax: function () {
                if (this.totalPage.length > 0) {
                    let max = this.totalPage.length - 1;

                    let highDelta = max - Number(this.activePage);
                    let lowDelta = Number(this.activePage);

                    if (lowDelta < highDelta && lowDelta < this.idealCap) {
                        highDelta = 10 - lowDelta;
                    } else {
                        highDelta = this.idealCap;
                    }

                    return this.activePage + highDelta;
                }
                return Number(this.absoluteMax);
            },
            isLeftDisabled: function () {
                if (this.value) {
                    return this.value.min === 0;
                }
                return false;
            },
            isRightDisabled: function () {
                if (this.count === 0) {
                    return true;
                }
                if (this.value && this.value.max) {
                    return this.value.max === (this.count - 1);
                }
                return true;
            },
            activePage: function () {
                if (this.value && this.value.min) {
                    return Math.floor(this.value.min / this.countPer);
                }
                return 0;
            }
        },
        watch: {
            'value.min': function () {
                this.$emit('input', this.value);
            },
            'count': function () {
                if (this.value.min >= this.count) {
                    this.value.min = this.count - 1;
                }

                this.value.min -= this.value.min % this.countPer;

                this.value.max = Number(this.value.min) + Number(this.countPer) - 1;

                if (this.value.max >= this.count) {
                    this.value.max = this.count - 1;
                }
            }
        },
        mounted: function () {
            this.$nextTick(this.init);
        },
        methods: {
            displayText: function (index) {
                if (this.shownMin > 0 && index == this.shownMin) {
                    return "...";
                }

                if (this.shownMax < this.absoluteMax && index == this.shownMax) {
                    return "...";
                }

                return index + 1;
            },
            init: function () {
                if (!this.countPer) {
                    this.countPer = 10;
                } else {
                    this.countPer = Number(this.countPer);
                }

                this.count = Number(this.count);

                var tempObj = {min: null, max: null};
                if (this.value && this.value.min) {
                    tempObj.min = this.value.min;
                } else {
                    tempObj.min = 0;
                }

                // Remove remainder so min is always first index of some page.
                tempObj.min -= tempObj.min % this.countPer;

                tempObj.max = tempObj.min + this.countPer - 1;

                if (tempObj.max >= this.count) {
                    tempObj.max = this.count - 1;
                }

                this.value = tempObj;
            },
            shiftLeft: function () {
                this.value.min -= this.countPer;
                this.value.max = Number(this.value.min) + Number(this.countPer) - 1;
            },
            select: function (index) {
                this.value.min = index * this.countPer;
                this.value.max = Number(this.value.min) + Number(this.countPer) - 1;
                if (this.value.max >= this.count) {
                    this.value.max = this.count - 1;
                }

            },
            shiftRight: function () {
                if (this.count) {
                    var tempObj = {min: null, max: null};
                    tempObj.min = Number(this.value.min) + Number(this.countPer);

                    tempObj.max = Number(tempObj.min) + Number(this.countPer) - 1;

                    if (tempObj.max >= this.count) {
                        tempObj.max = this.count - 1;
                    }

                    this.value = tempObj;
                }
            }
        }
    };
</script>