


function encrypt(planText){
    let result;
    Java.perform(function(){
            let MainActivity = Java.use("com.xiaokozi.signaturetest.MainActivity")
            result = MainActivity.enCrypt(Java.use("java.lang.String").$new(planText));
    })
    return result;
}

function decrypt(enCryptText){
    let result;
    Java.perform(function(){

        Java.choose("com.xiaokozi.signaturetest.MainActivity",{
            onMatch: function (instance){
                result = instance.deCrypt(enCryptText)
            },
            onComplete: function (instance){}
        })

    })
    return result;
}

function main(){
    console.log("encrypt=>",encrypt("xiaokozi"))
    console.log("deCrypt=>",decrypt(encrypt("xiaokozi")))
}



rpc.exports = {
    encrypt: encrypt,
    decrypt: decrypt
}
