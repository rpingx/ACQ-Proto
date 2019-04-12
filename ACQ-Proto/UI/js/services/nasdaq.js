/**
 * Created by admin on 4/12/2019.
 */

import axios from 'axios';

const url = "nasdaq/";

export default {
    isReady: () => {
        return axios({
            url: url + 'ready',
            method: 'GET'
        }).then((res)=> {
            return res.data
        });
    },
    getDistinctSector: () => {
        return axios({
            url: url + 'distinctSector',
            method: 'GET',
            headers: {
                "Content-type": "application/json"
            }
        }).then((res)=> {
            return res.data
        });
    },
    getDistinctIndustry: () => {
        return axios({
            url: url + 'distinctIndustry',
            method: 'GET',
            headers: {
                "Content-type": "application/json"
            }
        }).then((res)=> {
            return res.data
        });
    },
    getItems: (id, filter) => {
        return axios({
            url: url + 'query',
            method: 'GET',
            headers: {
                "Content-type": "application/json"
            },
            params: {
                id: id, filter: filter
            }
        }).then((res)=> {
            return res.data
        });
    }
}