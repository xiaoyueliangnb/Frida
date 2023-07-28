function getAddress() {
    let libcModule = Process.getModuleByName("libc.so");
    let fopen_addr = libcModule.getExportByName("fopen");
    let fgets_addr = libcModule.getExportByName("fgets");
    let fopen = new NativeFunction(fopen_addr, "pointer", ['pointer', 'pointer']);
    let fgets = new NativeFunction(fgets_addr, "pointer", ['pointer', 'int', 'pointer']);
    let line = Memory.alloc(1024);
    let maps = Memory.allocUtf8String("/proc/self/maps");
    let mode = Memory.allocUtf8String("r");
    let fp = fopen(maps, mode);
    let con = 1024;
    while (fgets(line, con, fp)) {
        if (line.readCString().indexOf("r-xp 00000000 00:00 0") !== -1) {
            console.log(line.readCString())
            let str = line.readCString();
            let a = str.substring(0, str.indexOf('-')).trim();
            console.log(a)
            return a;

        }

    }

}

//获取映射表
function getMappingKey(addr){
    Interceptor.attach(addr,{
                            onEnter: function (args){
                                // console.log("r1=>",this.context.r1," key=",this.context.r2)
                                // console.log("context=>",JSON.stringify(this.context))
                                // console.log("code=> ",this.context.r4.readPointer());
                                let code = this.context.r4.readPointer();
                                let tmp = code.toString(16)
                                let a = tmp.substring(tmp.length-4,tmp.length)
                                console.log("code=0x",a)
                            },
                            onLeave: function (retval){
                            }
                        });
}


function getClassName(addr){
    var result;
    Interceptor.attach(addr,{
            onEnter: function (args){
                console.log("addr is call");
                // console.log(hexdump(this.context.r0));
                result = this.context.r0.readCString();
                console.log(result)

            }
        });
    return result;

}
function getMethodName(addr){

}
function getEncodeCode(addr){

}
function getDecodeIndexKey(addr){

}
function getMappingIndex(addr){

}
function getKeyFile(addr){

}


function hook() {

    let strstr = Module.findExportByName("libc.so", "strstr")
    console.log(strstr)
    Interceptor.attach(strstr, {
        onEnter: function (args) {
            this.arg1 = ptr(args[0]).readCString();
            this.arg2 = ptr(args[1]).readCString();
            // if(this.arg2.indexOf("kozivmp") != -1){
            //     if(this.arg1.indexOf("onRequestPermissionsResult") != -1) {
            //         console.log(this.arg1)
            //     }
            // }

            if (this.arg2.indexOf("RegisterNativeFlag") !== -1) {
                if (this.arg1.indexOf("onCreate") !== -1) {
                    console.log("[JniMethodStart]: ", this.arg1)
                    let base = getAddress().trim();
                    //ede67001
                    console.log("base:",base)
                    console.log("addr: "+(parseInt(base,16)+0x38D30).toString(16));
                    let classNameAddr = ptr(parseInt(base,16)).add(0x28458).add(0x1);
                    let methodNameAddr = parseInt(base,16)+(classNameAddr+0x28);
                    let encodeCodeAddr = parseInt(base,16)+0x38D30;
                    let decodeIndexKeyAddr = parseInt(base,16)+0x4F838;
                    let mappingIndexAddr = parseInt(base,16)+0x475D4;
                    let keyFileAddr = parseInt(base,16)+mappingIndexAddr+4;
                    //38D3E 映射值

                    let className = getClassName(classNameAddr);
                    console.log("className=",className)
                    // let methodName = getMethodName(methodNameAddr);
                    // let encodeCode = getEncodeCode(encodeCodeAddr)
                    // let decodeIndexKey = getDecodeIndexKey(decodeIndexKeyAddr)
                    // let mappingIndex = getMappingIndex(mappingIndexAddr)
                    // let keyFile = getKeyFile(keyFileAddr)
                    // console.log("className:"+className)
                    // console.log("methodName:"+methodName)
                    // console.log("encodeCode:"+encodeCode)
                    // console.log("decodeIndexKey:"+decodeIndexKey)
                    // console.log("mappingIndex:"+mappingIndex)
                }
            }

        },
        onLeave: function (retval) {
            if (this.arg2.indexOf("JniMethodStart") !== -1) {
                if (this.arg1.indexOf("onCreate") !== -1) {
                    // retval.replace(0x123)
                }
            }
        }
    });

}


function main() {
    hook();
}

//必须延迟一会儿,让解释器so加载进maps
// setTimeout(main,200)
setImmediate(main)