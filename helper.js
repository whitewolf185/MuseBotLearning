//helper
let helper = {
    Rand: function (prev){
        let result = Math.floor(Math.random() * 17*1000) % 17;
        if(prev == result){
            return this.Rand();
        }
        return result;
    },

    //для получения индекса в массиве users
    check: function (arr, elem){
        let result = -1;
        arr.forEach((item,i,array) => {
            if (item.id === elem){
                result = i;
            }
        })
        return result;
    },

    exist: function (arr, elem){
        let result = false;
        arr.forEach((item,i, array) => {
            if(item.id == elem){
                result = true;
            }
        })

        return result;
    }
}

module.exports = helper;