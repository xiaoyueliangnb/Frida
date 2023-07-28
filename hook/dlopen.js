//寻找so加载时机，当指定so被加载时，执行Hook函数

function hookFunc(dlopen,soname,callback,name){
    Interceptor.attach(dlopen,{
        onEnter: function (args){
            let soPath = args[0].readCString();
            // console.log(name+": ",soPath);
           if(soPath.indexOf(soname) != -1) this.hook = true
        },
        onLeave: function (retval){
            if(this.hook)   callback()
        }
    })
}

function hookDlopen(){
    let dlopen1 = Module.findExportByName('libdl.so','dlopen')
    let dlopen2 = Module.findExportByName('libdl.so','android_dlopen_ext')
    // console.log(JSON.stringify(Process.getModuleByAddress(dlopen1)))
    // console.log(JSON.stringify(Process.getModuleByAddress(dlopen2)))
    //换成要Hook的so
    hookFunc(dlopen1,'libmpaas_crypto.so',hook_native,"dlopen")
    hookFunc(dlopen2,'libmpaas_crypto.so',hook_native,"android_dlopen_ext")
}

//具体的函数代码在此处编写
function hook(){
    let base = Module.findBaseAddress('libxiaojianbang.so')
    let soAddr = base.add(0x2A84)
    Interceptor.attach(soAddr,{
        onEnter: function (args){
            this.arg1 = args[1];
        },
        onLeave: function (retval){
            console.log(hexdump(this.arg1))
        }
    })
}
function hook_native(){
    let imgui = Module.getBaseAddress("libmpaas_crypto.so");
    let decode = imgui.add(0x4A0E).add(0x1)
    console.log(decode)
    Interceptor.attach(decode,{
            onEnter: function (args){

                // console.log("decode is call");
                // console.log("arg1:",hexdump(args[0].readPointer().readPointer()))
                console.log("randomstr:",hexdump(args[1]))
                console.log("arg3:",args[2].toInt32())
                console.log("datastr:",hexdump(args[3]))
                console.log("len:",args[4].toInt32())



            }
        });
    let result = imgui.add(0x5160).add(0x1)
    console.log(result)
    Interceptor.attach(result,{
            onEnter: function (args){

                // console.log("result is call");
                // console.log("result:",hexdump(args[0].readPointer().readPointer()))
                this.arg3 = args[2];

            },
        onLeave: function (retval){
                console.log("key=",hexdump(this.arg3))
        }

        });
//     let de = imgui.add(0x5A7E).add(0x1)
//     console.log(de)
//     Interceptor.attach(de,{
//             onEnter: function (args){
//
//                 this.result = this.context.sp.add(28).readPointer()
// console.log("result:",hexdump(this.result))
//             },
//         onLeave: function (retval){
//
//         }
//
//         });
    let final = imgui.add(0x505C).add(0x1)
    Interceptor.attach(final,{
            onEnter: function (args){

                this.result = args[1]

            },
        onLeave: function (retval){
            console.log("result:",hexdump(this.result.readPointer()))
        }

        });

}




setImmediate(hookDlopen)