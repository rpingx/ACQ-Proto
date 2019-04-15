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