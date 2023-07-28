function printStackTrace() {
    Java.perform(function() {
        var Exception = Java.use("java.lang.Exception");
        var exception = Exception.$new();
        var stackTrace = exception.getStackTrace().toString();
        console.log("==========================\r\n" + stackTrace.replaceAll(",", "\r\n")
            + "\r\n==========================");
        exception.$dispose();
    });
}


function hook_dlopen() {
    let dlopen = Module.findExportByName("libdl.so", "android_dlopen_ext")
    Interceptor.attach(dlopen, {
        onEnter: function (args) {
            this.soname = args[0]
            if (this.soname.readCString().indexOf("libsgmainso-5.5.14690439.so") !== -1) {
                console.log("目标 ", this.soname.readCString(), "已加载")
                // hook_sgmain()
            }
        },
        onLeave: function (retval) {
            if (this.soname.readCString().indexOf("libmpaas_crypto.so") !== -1){
                console.log("目标 ", this.soname.readCString(), "已加载")
                hook_mpaas_crypto()
            }
        }
    })

}

function hook_mpaas_crypto(){
    let base = Module.getBaseAddress("libmpaas_crypto.so")
    let encode = base.add(0x4380).add(0x1)
    Interceptor.attach(encode,{
            onEnter: function (args){
                this.arg1 = args[0];
                this.arg2 = args[1];
                this.arg3 = args[2];
                this.arg4 = args[3];
                console.log("arg1=>",hexdump(this.arg1))
                console.log("key=>",hexdump(this.arg2))
                console.log("key_len=>",this.arg3.toInt32())
                console.log("arg4=>",hexdump(this.arg4))

            },
            onLeave: function (retval){
            }
        });
    let result = base.add(0x4414).add(0x1)
    Interceptor.attach(result,{
            onEnter: function (args){
                console.log("result=>",hexdump(this.context.sp.add(28).readPointer()))

            },
            onLeave: function (retval){
            }
        });


}
function hook_sgmain() {
    Java.perform(function () {
        Java.enumerateClassLoaders({
            "onMatch": function (loader) {

                try {
                    //寻找加载JNICLibrary类的ClassLoader
                    if (loader.loadClass("com.taobao.wireless.security.adapter.JNICLibrary")) {
                        console.log("found correct loader!");
                        //设置为加载JNICLibrary类的ClassLoader
                        Java.classFactory.loader = loader;
                        //这里编写相关Hook代码
                        let JNICLibrary = Java.use(decodeURIComponent("com.taobao.wireless.security.adapter.JNICLibrary"));
                        JNICLibrary.doCommandNative.implementation = function (i, objArr) {
                            console.log(`JNICLibrary.doCommandNative is called: i=${i}, objArr=${objArr}`);
                            let result = this.doCommandNative(i, objArr);
                            console.log(`JNICLibrary.doCommandNative result=${result}`);
                            return result;
                        };
                    }
                } catch (err) {
                }
            },
            "onComplete": function () {
                console.log("success");
            }
        });
    })
}


function

hook_jiagu() {
    Java.perform(function () {
        let BridgeAppMini = Java.use("com.ali.mobisecenhance.ld.BridgeAppMini");
        BridgeAppMini["onCreate"].implementation = function () {
            let ret = this.onCreate();
            hook_java()
            return ret;
        };
    })
}

function hook_java() {
    Java.perform(function () {
let MiscUtils = Java.use(decodeURIComponent("com.alipay.mobile.common.transport.utils.MiscUtils"));
MiscUtils.generateRandomStr.implementation = function (i2) {
    console.log(`MiscUtils.generateRandomStr is called: i2=${i2}`);
    let result = this.generateRandomStr(i2);
    console.log(`MiscUtils.generateRandomStr result=${result}`);
    return "1234567890abcdef";
};
let ClientRpcPack = Java.use(decodeURIComponent("com.alipay.mobile.common.transport.http.selfencrypt.ClientRpcPack"));
ClientRpcPack.encrypt.implementation = function (bArr) {
    console.log(`ClientRpcPack.encrypt is called: bArr=${Java.use("java.lang.String").$new(bArr)}`);
    let result = this.encrypt(bArr);
    return result;
};





    })
}

function main() {
    hook_dlopen()
    // hook_jiagu()
}


setImmediate(main)