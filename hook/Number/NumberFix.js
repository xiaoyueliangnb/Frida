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
        //必须等待一会会儿，让 libjiagu.so 加载好 才能搜到
        if (line.readCString().indexOf("r-xp 00000000 00:00 0") !== -1) {
            console.log(line.readCString())
            let str = line.readCString();
            let a = str.substring(0, str.indexOf('-')).trim();
            console.log(a)
            return a;

        }

    }

}
function dumoso(addr,size){
    let currentApplication = Java.use("android.app.ActivityThread").currentApplication();
    let dir = currentApplication.getApplicationContext().getFilesDir().getPath();
    let file_path = dir + "/jiagu_" + "0x78dc8ab000" + "_" + "0x16f000" + ".so";
    console.log(file_path)
    let file_handle = new File(file_path, "wb");
    let libso_buffer = ptr(addr).readByteArray(size);
            file_handle.write(libso_buffer);
            file_handle.flush();
            file_handle.close();
}
function hook() {
    let strstr = Module.findExportByName("libc.so", "strstr")
console.log(strstr)
    Interceptor.attach(strstr, {
        onEnter: function (args) {
            this.arg1 = ptr(args[0]).readCString();
            this.arg2 = ptr(args[1]).readCString();

            if (this.arg2.indexOf("RegisterNativeFlag") !== -1) {
                if (this.arg1.indexOf("onCreate") !== -1) {
                    console.log("[JniMethodStart]: ", this.arg1)
                    let base = getAddress().trim();
                    console.log("base:",base)
                    console.log("addr: "+(parseInt(base,16)).toString(16));

                }
            }

        },
        onLeave: function (retval) {
            if (this.arg2.indexOf("JniMethodStart") !== -1) {
                if (this.arg1.indexOf("onCreate") !== -1) {
                    retval.replace(0x123)
                }
            }
        }
    });

}


function main() {
    hook();
}

// setTimeout(main,1000)
setImmediate(main)