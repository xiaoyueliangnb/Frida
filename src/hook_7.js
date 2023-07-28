function hook_java() {
    Java.perform(function () {
        var Bbbbbbbbbbbbbb = Java.use("com.cccccccc.cccccc.ccccc.Bbbbbbbbbbbbbb");
        Bbbbbbbbbbbbbb.aaaaaaaaaaaaaa.implementation = function (context, str, str2, str3, str4, str5) {
            var result = this.aaaaaaaaaaaaaa(context, str, str2, str3, str4, str5);
            console.log("aaaaaaaaaaaaaa:", context, str, str2, str3, str4, str5, result);
            return result;
        };
    });
}

function call_aaa() {
    Java.perform(function () {
        var context = Java.use("android.app.ActivityThread").currentApplication().getApplicationContext();

        //android.app.Application@a69de2d hqqswXiWVWQeHXLt tlKDnXctyXLipeEY HAtzrxPcyuTqCrKp OkFcfFQinEXmGpmx igByoyxkZXVGtcPN st=1584198852873&sign=87a547dd7ccfd9913c8fd5d51cbf990a&sv=101
        var Bbbbbbbbbbbbbb = Java.use("com.cccccccc.cccccc.ccccc.Bbbbbbbbbbbbbb");
        var result = Bbbbbbbbbbbbbb.aaaaaaaaaaaaaa(context, "111", "222", "333", "444", "555");
        console.log("call_aaa:", result);
    });
}

function hook_native_function(addr) {
    Interceptor.attach(addr, {
        onEnter: function (args) {
            this.arg0 = args[0];
            this.arg1 = args[1];
            this.arg2 = args[2];
            this.arg3 = args[3];
            console.log("addr:", addr, " onEnter \r\n", (this.arg0), "\r\n", this.arg1, "\r\n", (this.arg2), "\r\n", this.arg3, args[4]);
        }, onLeave: function (retval) {
            console.log("addr:", addr, " onLeave \r\n", (this.arg0), "\r\n", this.arg1, "\r\n", (this.arg2), "\r\n", this.arg3);
        }
    });
}

function hook_native() {
    var base_xxx = Module.findBaseAddress("libxxx.so");
    if (base_xxx) {
        var sub_126AC = base_xxx.add(0x00126AC + 1);
        // Interceptor.attach(sub_126AC, {
        //     onEnter: function (args) {
        //         for (var i = 0; i < 6; i++) {
        //             console.log("[sub_126AC] :", i, args[i]);
        //             if (i == 1) {
        //                 console.log("[sub_126AC] :\r\n", (ptr(Java.vm.tryGetEnv().getByteArrayElements(args[i])).readCString(parseInt(args[i + 1]))));
        //             }
        //         }
        //     }, onLeave: function (retval) {
        //         console.log("[sub_126AC] :\r\n", hexdump(ptr(Java.vm.tryGetEnv().getByteArrayElements(retval))));
        //     }
        // });
        var sub_227C = base_xxx.add(0x227C + 1);

        // Interceptor.attach(sub_227C, {
        //     onEnter: function (args) {
        //         this.arg0 = args[0];
        //         this.arg1 = args[1];
        //         this.arg2 = args[2];
        //         console.log("sub_227C onEnter:\r\n", hexdump(this.arg0), "\r\n", this.arg1, "\r\n", hexdump(this.arg2));
        //     }, onLeave: function (retval) {
        //         console.log("sub_227C onLeave:\r\n", hexdump(this.arg0), "\r\n", this.arg1, "\r\n", hexdump(this.arg2));
        //     }
        // });

        // hook_native_function(base_xxx.add(0x10E18 + 1));
        // hook_native_function(base_xxx.add(0x10DE4 + 1));
        // hook_native_function(base_xxx.add(0x10E4C + 1));
        //hook_native_function(base_xxx.add(0x10E4C + 1));

        var sub_0x10E4C = base_xxx.add(0x10E4C + 1);
        Interceptor.attach(sub_0x10E4C, {
            onEnter: function (args) {
                this.arg0 = args[0];
                this.arg1 = args[1];
                this.arg2 = args[2];
                this.arg3 = args[3];
                console.log("addr:", sub_0x10E4C, " onEnter \r\n", hexdump(args[0]), "\r\n", args[1], "\r\n", hexdump(args[2]), "\r\n", args[3], args[4]);
            }, onLeave: function (retval) {
                console.log("addr:", sub_0x10E4C, " onLeave \r\n", hexdump(this.arg0), "\r\n", this.arg1, "\r\n", hexdump(this.arg2), "\r\n", this.arg3);
            }
        });

        var sub_10DE4 = base_xxx.add(0x12ECC + 1);
        // Interceptor.attach(sub_10DE4, {
        //     onEnter: function (args) {
        //         this.arg0 = args[0];
        //         this.arg1 = args[1];
        //         this.arg2 = args[2];
        //         this.arg3 = args[3];
        //         console.log("addr:", sub_10DE4, " onEnter \r\n", (this.arg0).readCString(), "\r\n", this.arg1, "\r\n", (this.arg2).readCString(), "\r\n", this.arg3);
        //     }, onLeave: function (retval) {
        //         console.log("addr:", sub_10DE4, " onLeave \r\n", (this.arg0), "\r\n", this.arg1, "\r\n", hexdump(this.arg2), "\r\n", this.arg3);
        //     }
        // });
    }
}

function call_encode_2_function() {
    var base_xxx = Module.findBaseAddress("libxxx.so");
    if (base_xxx) {
        var addr_10DE4 = base_xxx.add(0x10DE4 + 1);
        console.log("addr_10DE4:", addr_10DE4);
        var sub_10DE4 = new NativeFunction(addr_10DE4, "void", ["pointer", "int", "pointer", "int"]);

        //80306f4370b39fd5630ad0529f77adb6
        //1
        //functionId=111&body=222&uuid=333&client=444ca&clientVersion=555&st=1584202224270&sv=120
        //0x55
        var input_str = "0123456789abdefg";
        var input_buffer = Memory.allocUtf8String(input_str);
        sub_10DE4(Memory.allocUtf8String("80306f4370b39fd5630ad0529f77adb6"), 1, input_buffer, input_str.length);
        console.log(hexdump(input_buffer, { length: input_str.length }));

    }
}

function call_encode_0_function() {
    var base_xxx = Module.findBaseAddress("libxxx.so");
    if (base_xxx) {
        var addr_10E4C = base_xxx.add(0x10E4C + 1);
        console.log("addr_10E4C:", addr_10E4C);
        var sub_10E4C = new NativeFunction(addr_10E4C, "void", ["pointer", "int", "pointer", "int"]);

        //80306f4370b39fd5630ad0529f77adb6
        //1
        //functionId=111&body=222&uuid=333&client=444&clientVersion=555&st=1584202224270&sv=120
        //0x55
        var input_str = "0123456789abcdef";
        var input_buffer = Memory.allocUtf8String(input_str);
        sub_10E4C(Memory.allocUtf8String("80306f4370b39fd5630ad0529f77adb6"), 1, input_buffer, input_str.length);
        console.log(hexdump(input_buffer, { length: input_str.length }));
    }
}

function call_12ECC() {
    var base_xxx = Module.findBaseAddress("libxxx.so");
    if (base_xxx) {
        var addr_12ECC = base_xxx.add(0x12ECC + 1);
        var sub_12ECC = new NativeFunction(addr_12ECC, "void", ["pointer", "int", "pointer", "int", "pointer"]);

        var input_str = "0123456789abcdef";
        var input_buffer = Memory.allocUtf8String(input_str);
        sub_12ECC(Memory.allocUtf8String("80306f4370b39fd5630ad0529f77adb6"), ptr(1), input_buffer, input_str.length, input_buffer);
        console.log(hexdump(input_buffer, { length: input_str.length }));
    }
}

function hook_gettimeofday() {
    var addr_gettimeofday = Module.findExportByName(null, "gettimeofday");
    var gettimeofday = new NativeFunction(addr_gettimeofday, "int", ["pointer", "pointer"]);

    var source = [
        'struct timeval {',
        '    int tv_sec;',
        '    int tv_usec;',
        '};',
        'void modify_time(struct timeval* tv, int tv_sec, int tv_usec) {',
        '  tv->tv_sec = tv_sec;',
        '  tv->tv_usec = tv_usec;',
        '}',
    ].join('\n');

    var cm = new CModule(source);
    var modify_time = new NativeFunction(cm.modify_time, 'void', ["pointer", "int", "int"]);

    Interceptor.replace(addr_gettimeofday, new NativeCallback(function (ptr_tz, ptr_tzp) {

        var result = gettimeofday(ptr_tz, ptr_tzp);
        if (result == 0) {
            console.log("hook gettimeofday:", ptr_tz, ptr_tzp, result);
            //modify_time(ptr_tz, 0xAAAA, 0xBBBB);
            var t = new Int32Array(ArrayBuffer.wrap(ptr_tz, 8));
            t[0] = 0xAAAA;
            t[1] = 0xBBBB;
            console.log(hexdump(ptr_tz));
        }
        return result;
    }, "int", ["pointer", "pointer"]));
}

function main() {
    // hook_java();
    //hook_native();
    // hook_gettimeofday();
}

setImmediate(main);