function showStacks() {
    console.log(
        Java.use("android.util.Log")
            .getStackTraceString(
                Java.use("java.lang.Throwable").$new()
            )
    );
}

function isJiaGu() {
    Java.perform(function () {

        let BridgeAppMini = Java.use(decodeURIComponent("com.ali.mobisecenhance.ld.BridgeAppMini"));
        BridgeAppMini.onCreate.implementation = function () {
            console.log(`BridgeAppMini.onCreate is called`);
            this.onCreate();
            hook_java()
        };


    })
}

function byteToHex(byte) {
    return byte.toString(16).padStart(2, '0');
}


function hook_java() {
    Java.perform(function () {
        let DefaultSecurityManager = Java.use(decodeURIComponent("com.alipay.mobile.common.netsdkextdepend.security.DefaultSecurityManager"));
DefaultSecurityManager.signature.implementation = function (signRequest) {
    console.log(`content=${signRequest.content.value}`);
    console.log(`appkey=${signRequest.appkey.value}`);
    let result = this.signature(signRequest);
    console.log(`DefaultSecurityManager.a result=${result.sign.value}`);
    return result;
};


    })
}

function call_fun() {
    Java.perform(function () {

    })
}

function log(path) {
    if (path.readCString().indexOf("bin/Data/") !== -1) {
        console.log("path result->", path.readCString())
    }
}

function hook_native() {
    let open = Module.getExportByName('libc.so', 'open')

    Interceptor.attach(open, {
        onEnter: function (args) {
            this.arg1 = args[0];
            log(this.arg1)
        },
    });
    Interceptor.attach(fopen, {
        onEnter: function (args) {
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
}

function main() {
    isJiaGu()
    // hook_java()
    // hook_native()

}

// setTimeout(main, 10)
setImmediate(main);