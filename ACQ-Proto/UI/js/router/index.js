/**
 * Created by rxudsk on 6/18/2018.
 */
import Vue from 'vue';

import home from '../home.vue';
import mock from '../mock.vue';
import acq from '../acquisition.vue';
import notes from '../notes.vue';


import Router from 'vue-router';

const routerMapping = [
    {
        path: '/',
        name: 'Home',
        component: home
    },
    {
        path: '/workspace',
        name: 'Acquisition Workspace',
        component: acq,
        desc: "Workspace where coding challenge goals will be met."
    },
    {
        path: '/mockData',
        name: 'Mock Data',
        component: mock,
        desc: "Mocks up data for easier testing and presentation."
    },
    {
        path: '/notes',
        name: 'Notes',
        component: notes,
        desc: "Comments from dev about the app."
    }
];

Vue.use(Router);

export default new Router({
    routes: routerMapping
});