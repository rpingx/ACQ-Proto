import axios from 'axios';
import utils from './utils';

const url = "mock/";

export default {
    mockLoad: (limit) => {
        return axios({
            url: url + 'load',
            method: 'POST',
            data: utils.stringify({
                count: limit
            })
        }).then((res)=> {
            return res.data
        });
    }
}