function LogPrint(log) {
    var theDate = new Date();
    var hour = theDate.getHours();
    var minute = theDate.getMinutes();
    var second = theDate.getSeconds();
    var mSecond = theDate.getMilliseconds();

    hour < 10 ? hour = "0" + hour : hour;
    minute < 10 ? minute = "0" + minute : minute;
    second < 10 ? second = "0" + second : second;
    mSecond < 10 ? mSecond = "00" + mSecond : mSecond < 100 ? mSecond = "0" + mSecond : mSecond;
    var time = hour + ":" + minute + ":" + second + ":" + mSecond;
    var threadid = Process.getCurrentThreadId();
    console.log("[" + time + "]" + "->threadid:" + threadid + "--" + log);

}

function printNativeStack(context, name) {
    //Debug.
    var array = Thread.backtrace(context, Backtracer.ACCURATE);
    var first = DebugSymbol.fromAddress(array[0]);
    if (first.toString().indexOf('libopenjdk.so!NET_Send') < 0) {
        var trace = Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n");
        LogPrint("-----------start:" + name + "--------------");
        LogPrint(trace);
        LogPrint("-----------end:" + name + "--------------");
    }

}

function printJavaStack(name) {
    Java.perform(function () {
        var Exception = Java.use("java.lang.Exception");
        var ins = Exception.$new("Exception");
        var straces = ins.getStackTrace();
        if (straces != undefined && straces != null) {
            var strace = straces.toString();
            var replaceStr = strace.replace(/,/g, " \n ");
            LogPrint("=============================" + name + " Stack strat=======================");
            LogPrint(replaceStr);
            LogPrint("=============================" + name + " Stack end======================= \n ");
            Exception.$dispose();
        }
    });
}

function isprintable(value) {
    if (value >= 32 && value <= 126) {
        return true;
    }
    return false;
}

function getsocketdetail(fd) {
    var result = "";
    var type = Socket.type(fd);
    if (type != null) {
        result = result + "type:" + type;
        var peer = Socket.peerAddress(fd);
        var local = Socket.localAddress(fd);
        result = result + ",address:" + JSON.stringify(peer) + ",local:" + JSON.stringify(local);
    } else {
        result = "unknown";
    }
    return result;

}

function getip(ip_ptr) {
    var result = ptr(ip_ptr).readU8() + "." + ptr(ip_ptr.add(1)).readU8() + "." + ptr(ip_ptr.add(2)).readU8() + "." + ptr(ip_ptr.add(3)).readU8()
    return result;
}


function hooklibc() {
    var libcmodule = Process.getModuleByName("libc.so");
    var read_addr = libcmodule.getExportByName("read");
    var write_addr = libcmodule.getExportByName("write");
    console.log(read_addr + "---" + write_addr);
    Interceptor.attach(read_addr, {
        onEnter: function (args) {
            this.arg0 = args[0];
            this.arg1 = args[1];
            this.arg2 = args[2];

            this.socketinfo = getsocketdetail(this.arg0.toInt32());
            LogPrint("go into libc.so->read_addr" + "---" + this.socketinfo);
            this.flag = false;
            if (this.socketinfo.indexOf("tcp") >= 0) {
                this.flag = true;
            }
            if (this.flag) {
                printNativeStack(this.context, Process.getCurrentThreadId() + "read");
            }


        }, onLeave(retval) {

            if (this.flag) {
                var size = retval.toInt32();
                if (size > 0) {
                    console.log(Process.getCurrentThreadId() + "---libc.so->read:" + hexdump(this.arg1, {
                        length: size
                    }));
                }
            }


            LogPrint("leave libc.so->read");
        }
    });
    Interceptor.attach(write_addr, {
        onEnter: function (args) {
            this.arg0 = args[0];
            this.arg1 = args[1];
            this.arg2 = args[2];

            this.socketinfo = getsocketdetail(this.arg0.toInt32());
            LogPrint("go into libc.so->write" + "---" + this.socketinfo);
            this.flag = false;
            if (this.socketinfo.indexOf("tcp") >= 0) {
                this.flag = true;
            }
            if (this.flag) {
                printNativeStack(this.context, Process.getCurrentThreadId() + "write");
            }


        }, onLeave(retval) {
            if (this.flag) {
                var size = ptr(this.arg2).toInt32();
                if (size > 0) {
                    console.log(Process.getCurrentThreadId() + "---libc.so->write:" + hexdump(this.arg1, {
                        length: size
                    }));
                }
            }

            LogPrint("leave libc.so->write");
        }
    });
}

function hookssl() {
    var libcmodule = Process.getModuleByName("libssl.so");
    var read_addr = libcmodule.getExportByName("SSL_read");
    var write_addr = libcmodule.getExportByName("SSL_write");
    Interceptor.attach(read_addr, {
        onEnter: function (args) {
            this.arg0 = args[0];
            this.arg1 = args[1];
            this.arg2 = args[2];
            LogPrint("go into libssl.so->SSL_read");

            printNativeStack(this.context, Process.getCurrentThreadId() + "SSL_read");


        }, onLeave(retval) {

            var size = retval.toInt32();
            if (size > 0) {
                console.log(Process.getCurrentThreadId() + "---libssl.so->SSL_read:" + hexdump(this.arg1, {
                    length: size
                }));
            }
            LogPrint("leave libssl.so->SSL_read");
        }
    });
    Interceptor.attach(write_addr, {
        onEnter: function (args) {
            this.arg0 = args[0];
            this.arg1 = args[1];
            this.arg2 = args[2];
            LogPrint("go into libssl.so->SSL_write");

            printNativeStack(this.context, Process.getCurrentThreadId() + "SSL_write");


        }, onLeave(retval) {
            var size = ptr(this.arg2).toInt32();
            if (size > 0) {
                console.log(Process.getCurrentThreadId() + "---libssl.so->SSL_write:" + hexdump(this.arg1, {
                    length: size
                }));
            }

            LogPrint("leave libssl.so->SSL_write");
        }
    });
}

function main() {
    hooklibc();
    // hookssl();
}

setImmediate(main);