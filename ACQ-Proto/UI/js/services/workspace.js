/**
 * Created by admin on 4/12/2019.
 */
import axios from 'axios';
import utils from './utils';

const url = "workspace/";

export default {
    getAllItems: () => {
        return axios({
            url: url + 'items',
            method: 'GET'
        }).then((res)=> {
            return res.data
        });
    },
    addItem: (item) => {
        return axios({
            url: url + 'items/add',
            method: 'POST',
            data: utils.stringify({
                item: JSON.stringify(item)
            })
        }).then((res)=> {
            return res.data
        });
    },
    deleteById: (id) => {
        return axios({
            url: url + 'items/delete',
            method: 'POST',
            data: utils.stringify({
                id: id
            })
        }).then((res)=> {
            return res.data
        });
    },
    updateById: (id, item) => {
        try {
            item.Price = Number(item.Price);
        } catch (e) {
            console.log("updateById Price error: " + e);
            item.Price = null;
        }

        try {
            item.MarketCap = Number(item.MarketCap);
        } catch (e) {
            console.log("updateById MarketCap error: " + e);
            item.MarketCap = null;
        }

        try {
            item.IPOYear = Number(item.IPOYear);
        } catch (e) {
            console.log("updateById IPOYear error: " + e);
            item.IPOYear = null;
        }

        return axios({
            url: url + 'items/update',
            method: 'POST',
            data: utils.stringify({
                id: id,
                item: JSON.stringify(item)
            })
        }).then((res)=> {
            return res.data
        });
    }
}