//typed by hanbingle for FART脱壳王课程，联系vx:hanbing1e

function Log(content) {
    var pid = Process.getCurrentThreadId();
    console.log("[" + pid + "]->" + content);
}

function readStdString(str) {
    const isTiny = (str.readU8() & 1) == 0;
    if (isTiny) {
        return str.add(1).readUtf8String();
    }
    return str.add(2 * Process.pointerSize).readPointer().readUtf8String();
}

function hooklibart() {
    var libartmodule = Process.getModuleByName("libart.so");
    var PrettyMethodaddr = null;
    var RegisterNativeaddr = null;
    libartmodule.enumerateExports().forEach(function (symbol) {
        if (symbol.name.indexOf("PrettyMethod") != -1) {
            Log(JSON.stringify(symbol));
        }
        if (symbol.name.indexOf("RegisterNative") != -1) {
            Log(JSON.stringify(symbol));
        }
        //android 7
        //_ZN3art12PrettyMethodEPNS_9ArtMethodEb
        //_ZN3art12PrettyMethodEPNS_9ArtMethodEb
        // if (symbol.name == "_ZN3art12PrettyMethodEPNS_9ArtMethodEb") {
        //     Log("find PrettyMethod:" + JSON.stringify(symbol));
        //     PrettyMethodaddr = symbol.address;
        // }
        //_ZN3art9ArtMethod12PrettyMethodEb
        //Android 8
        // if (symbol.name == "_ZN3art9ArtMethod12PrettyMethodEb") {
        //     Log("find PrettyMethod:" + JSON.stringify(symbol));
        //     PrettyMethodaddr = symbol.address;
        // }
        if (symbol.name.indexOf("PrettyMethod") != -1 && symbol.name.indexOf("ArtMethod") != -1 && symbol.name.indexOf("art") != -1) {
            Log("find PrettyMethod:" + JSON.stringify(symbol));
            PrettyMethodaddr = symbol.address;
        }
        if (symbol.name.indexOf("RegisterNativeMethod") == -1 && symbol.name.indexOf("ArtMethod") != -1 && symbol.name.indexOf("RegisterNative") != -1) {
            Log("find RegisterNative:" + JSON.stringify(symbol));
            RegisterNativeaddr = symbol.address;
        }
    });
    var PrettyMethodfunc = new NativeFunction(PrettyMethodaddr, ["pointer", "pointer", "pointer"], ["pointer", "int"]);
    Log("start interpreter RegisterNatives:" + RegisterNativeaddr);
    Interceptor.attach(RegisterNativeaddr, {
        onEnter: function (args) {
            var ArtMethodptr = args[0];
            this.JniFuncaddr = args[1];
            var result = PrettyMethodfunc(ArtMethodptr, 1);
            var stdstring = Memory.alloc(3 * Process.pointerSize);
            ptr(stdstring).writePointer(result[0]);
            ptr(stdstring).add(1 * Process.pointerSize).writePointer(result[1]);
            ptr(stdstring).add(2 * Process.pointerSize).writePointer(result[2]);
            this.funcnamestring = readStdString(stdstring);
            var addrinfo = DebugSymbol.fromAddress(ptr(this.JniFuncaddr));
            Log("[RegisterJni begin]" + this.funcnamestring + "--addr:" + this.JniFuncaddr + ",info:" + addrinfo + ",offset: " + this.JniFuncaddr.sub(Process.findModuleByAddress(this.JniFuncaddr).base));
        }, onLeave: function (retval) {
            Log("[RegisterJni over]" + this.funcnamestring + "--addr:" + this.JniFuncaddr);
            if(this.funcnamestring.indexOf("onCreate") != -1){
                console.log(hexdump(this.JniFuncaddr))
                console.log(Process.findModuleByAddress(this.JniFuncaddr))
            }
        }
    })
}

function hooklibc() {
    var libcmodule = Process.getModuleByName("libc.so");
    var dlsymaddr = libcmodule.getExportByName("dlsym");
    Interceptor.attach(dlsymaddr, {
        onEnter: function (args) {
            this.handle = args[0];
            this.symname = ptr(args[1]).readCString();
        }, onLeave: function (retval) {
            Log("[dlsym]handle:" + this.handle + ",symbol:" + this.symname + ",addr:" + retval);
        }
    })

}

function main() {
    Java.perform(function (){
        let StubApp = Java.use("com.stub.StubApp");
StubApp["attachBaseContext"].implementation = function (a) {
    let ret = this.attachBaseContext(a);
    hooklibc();
    hooklibart();
    return ret;
};
    })

}

setImmediate(main);