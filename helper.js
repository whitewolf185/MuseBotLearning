//helper
let helper = {
    Rand: function (prev){
        let result = Math.floor(Math.random() * 17*1000) % 17;
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