<template>
    <div :style="styleObj">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <slot name="title">Alert</slot>
                    </h5>
                    <button type="button" class="close" @click="close">
                        <span>&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div>
                        <slot name="body"></slot>
                    </div>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button type="button" class="btn btn-outline-secondary" @click="close" autofocus>Close</button>
                    </slot>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ["close"],
        data: function () {
            return {
                styleObj: {
                    position: "fixed",
                    left: "0px",
                    top: "0px",
                    width: "100%",
                    height: "100%",
                    zIndex: 1000,
                    backgroundImage: "url(img/backdrop.png)"
                }
            };
        }
    };
</script>