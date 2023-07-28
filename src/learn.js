
function hook_java() {
    Java.perform(function () {

        Java.use("com.cccccccc.cccccc.ccccc.Bbbbbbbbbbbbbb").aaaaaaaaaaaaaa.implementation = function (con, str, str1, str2, str3, str4) {
            // console.log("\narg1=>", str);
            // console.log("arg2=>", str1);
            // console.log("arg3=>", str2);
            // console.log("arg4=>", str3);
            // console.log("arg5=>", str4);
            let ret = this.aaaaaaaaaaaaaa(con, str, str1, str2, str3, str4);

            // console.log("ret: ", ret);
            return ret;
        }
    })
}

function call_fun(){
    let context = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext();
    let bbb = Java.use("com.cccccccc.cccccc.ccccc.Bbbbbbbbbbbbbb")
    let result = bbb.aaaaaaaaaaaaaa(context,"ZFpKGtajWlEbuSTS","LJwDcNffNqAhFrlL","ZivAYdUXyMWnlFeo","xTXpxtdBtVzwDaMx","WIdxxiNkZnvTPTaT");
    console.log("call_aaa",result)

}

function hook_native(){
    let xxx = Module.getBaseAddress("libxxx.so")
    let sub_126AC = xxx.add(0x126ac).add(0x1)
    Interceptor.attach(sub_126AC,{
            onEnter: function (args){
                for (let i = 0; i < 6; i++) {
                    console.log("arg"+i,args[i])
                    if(i === 1){
                        console.log("byts=>",Java.vm.tryGetEnv().getByteArrayElements(args[i]).readCString())
                    }
                }
            },
            onLeave: function (retval){
            }
        });
}

function main() {
    hook_java()
    hook_native()

}

// setTimeout(main, 10)
setImmediate(main);