/**
 * Created by admin on 4/12/2019.
 */
const statusMap = {
    0: 'Initially Viewed',
    1: 'Researched',
    2: 'Proposed',
    3: 'Approved',
    4: 'Declined'
};

const statusStyleMap = {
    0: 'secondary',
    1: 'warning',
    2: 'info',
    3: 'success',
    4: 'danger'
};

var reverseMapFromMap = (map)=> {
    return Object.keys(map).reduce(function (accum, ele) {
        accum[map[ele]] = ele;
        return accum
    }, {})
};

var reverseMap = reverseMapFromMap(statusMap);

export default {
    forward: statusMap,
    reverse: reverseMap,
    getText: (val) => {
        return statusMap[val];
    },
    getStyle: (val) => {
        return statusStyleMap[val];
    },
    getValue: (text) => {
        return reverseMap[text];
    },
    getOptions: () => {
        let arr = [];
        Object.keys(statusMap).forEach((key) => {
            arr.push(
                {
                    text: statusMap[key],
                    value: key
                }
            );
        });

        return arr;
    }
}