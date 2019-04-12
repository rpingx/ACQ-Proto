<template>
    <div :style="styleObj">
        <div class="modal-dialog" style="position: fixed;top: 30%;left: 50%;transform: translate(-50%, -50%);">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" style="color: #222222;" aria-hidden="true"
                            @click="close">&times;</button>
                    <h4 class="modal-title">
                        <slot name="title">Alert</slot>
                    </h4>
                </div>
                <div class="modal-body">
                    <slot name="body"></slot>
                </div>
                <div class="modal-footer">
                    <slot name="footer">
                        <button type="button" class="btn btn-default" @click="close" autofocus>Close</button>
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