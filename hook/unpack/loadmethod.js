var maps={}
function hook() {
    Java.perform(function () {
        var addr = null;
        let modules = Process.enumerateModules();
        for (let i = 0; i < modules.length; i++) {
            let symbols = modules[i].enumerateSymbols()
            for (let j = 0; j < symbols.length; j++) {
                if(symbols[j].name.indexOf("_ZN3art11ClassLinker10LoadMethodERKNS_7DexFileERKNS_13ClassAccessor6MethodENS_6HandleINS_6mirror5ClassEEEPNS_9ArtMethodE") != -1){
                    console.log(symbols[j].name)
                     addr = symbols[j].address
                }
            }
        }


//         LoadMethod(const DexFile& dex_file,
// 3435                             const ClassDataItemIterator& it,
// 3436                             Handle<mirror::Class> klass,
// 3437                             ArtMethod* dst)
        console.log(addr)
        Interceptor.attach(addr,{
            onEnter: function (args){
                let dexfile = args[1];
                let begin = ptr(args[1]).add(Process.pointerSize).readPointer()
                let size = ptr(args[1]).add(Process.pointerSize * 2).readInt()
                if(maps[size]==undefined) {
                    dump(begin,size)
                    console.log(hexdump(begin), '\n', size)
                    maps[size]=1
                }

            },
            onLeave: function (retvlal){}
        })
    })
}

function dump(begin,size){
    let path = "/sdcard/unpack/"+size+".dex"
    let file = new File(path,"wr")
    file.write(ptr(begin).readByteArray(size))
    file.flush()
    file.close()
    console.log("dump success ",size,'.dex')
}
function main() {
    hook()
}

// setTimeout(main,500)
setImmediate(main)