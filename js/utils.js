/*********************************************************************

    London Click
    File: utils.js

*********************************************************************/

const Utils = {

    round(value, decimals = 3) {

        const factor = Math.pow(10, decimals);

        return Math.round(value * factor) / factor;

    }

};

