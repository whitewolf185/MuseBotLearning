//helper
let helper = {
    Rand: function (prev){
        let result = Math.floor(Math.random() * 16*1000) % 16;
        if(prev == result){
            return this.Rand();
        }
        return result;
    },

    check: function (arr, elem){
        let result = -1;
        arr.forEach((item,i,array) => {
            if (item === elem){
                result = i;
            }
            // console.log(item)
        })
        return result;
    }
}

module.exports = helper;