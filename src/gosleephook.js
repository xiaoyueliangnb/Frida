function main() {
    Java.perform(function(){


let AESCBCUtils = Java.use(decodeURIComponent("com.btgame.gosleep.utils.AESCBCUtils"));
AESCBCUtils.encrypts.implementation = function (json, keyUrl) {
    let result = this.encrypts(json, keyUrl);
    console.log("\nRequest KeyUrl=",keyUrl,"\njson=>",Java.use("java.lang.String").$new(json).toString())
    return result;
};

AESCBCUtils.decrypt.overload('[B', 'java.lang.String', 'long').implementation = function (data, keyURL, mins) {
    let result = this.decrypt(data, keyURL, mins);
    console.log("\nResponse KeyUrl=",keyURL,"\njson=>",result,"\nmins=>",mins)
    return result;
};






    })
}

// setTimeout(main,500)
setImmediate(main);