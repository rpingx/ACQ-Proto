<template>
    <div class="col-md-6 col-12">
        <label>
            <slot name="title"></slot>
        </label>
        <slot name="body"></slot>
        <small class="form-text text-muted">
            <slot name="subtext"></slot>
        </small>
    </div>
</template>

<!--<formElement>-->
    <!--<span slot="title">Top</span>-->
    <!--<input  slot="body" type="text" class="form-control"-->
            <!--placeholder="Enter email">-->
    <!--<span slot="subtext">Bot</span>-->
<!--</formElement>-->