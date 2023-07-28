//溯源Thread run 函数
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

function printJavaStack(name) {
    Java.perform(function () {
        var Exception = Java.use("java.lang.Exception");
        var ins = Exception.$new("Exception");
        var straces = ins.getStackTrace();
        if (straces != undefined && straces != null) {
            var strace = straces.toString();
            var replaceStr = strace.replace(/,/g, " \n ");
            LogPrint("=============================" + name + " Stack start=======================");
            LogPrint(replaceStr);
            LogPrint("=============================" + name + " Stack end======================= \n ");
            Exception.$dispose();
        }
    });
}

function printNativeStack(context, info) {
    var trace = Thread.backtrace(context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join("\n");
    LogPrint("=============================" + info + "->Native Stack strat=======================");
    LogPrint(trace)
    LogPrint("=============================" + info + "->Native Stack end=======================\r\n");
}

function hooklibc() {
    var pt_create_func = Module.findExportByName(null, 'pthread_create');
    LogPrint('pt_create_func:' + pt_create_func);
    Interceptor.attach(pt_create_func, {
        onEnter: function (args) {
            this.threadfunc = args[2];
            var funcsymbol = DebugSymbol.fromAddress(ptr(this.threadfunc));
            LogPrint("pt_create start run threadfunc:" + this.threadfunc + "---" + funcsymbol);
            printNativeStack(this.context, "pthread_create");

        },
        onLeave: function (retval) {
            LogPrint('pt_create called over', retval);
        }
    })
}

function hooklibart() {
    var libartmodule = Process.getModuleByName("libart.so");
    libartmodule.enumerateExports().forEach(function (symbol) {
        if (symbol.name.indexOf('CreateCallback') >= 0) {
            LogPrint(JSON.stringify(symbol));
            Interceptor.attach(symbol.address, {
                onEnter: function (args) {
                    LogPrint("go into childthread:Thread::CreateCallback")
                }, onLeave: function (retval) {
                    LogPrint("leave childthread:Thread::CreateCallback")
                }
            })
        }
    })
}

function hookmultithreads() {
    Java.perform(function () {
        var ThreadClass = Java.use("java.lang.Thread");
        ThreadClass.init2.implementation = function (arg0) {
            var target = this.target.value;
            if (target != null) {
                //通过直接实现Runnagle接口run来创建新线程
                LogPrint("go into Thread.init2->Runnable class:" + target.$className);
                printJavaStack("java.lang.Thread.init2")
            } else {
                //通过继承Thread类并覆写run函数来创建新线程
                LogPrint("go into Thread.init2->Thread class:" + this.$className);
                printJavaStack("java.lang.Thread.init2");
                var threadclassname = this.$className;
                var ChindThreadClass = Java.use(threadclassname);
                ChindThreadClass.run.implementation = function () {
                    LogPrint("go into " + threadclassname + ".run");
                    printJavaStack(threadclassname + ".run");
                    var result = this.run();
                    return result;
                }
            }
            var result = this.init2(arg0);
            return result;
        }
        ThreadClass.run.implementation = function () {
            var target = this.target.value;
            if (target != null) {
                LogPrint("go into Thread.run->Runnable class:" + target.$className);
                printJavaStack("java.lang.Thread.run")
            }

            var reuslt = this.run();
            return reuslt;

        }
    })
}

function isprintable(value) {
    if (value >= 32 && value <= 126) {
        return true;
    }
    return false;
}

function hooktcp() {
    Java.perform(function () {
        var SocketClass = Java.use('java.net.Socket');
        SocketClass.$init.overload('java.lang.String', 'int').implementation = function (arg0, arg1) {
            console.log("[" + Process.getCurrentThreadId() + "]new Socket connection:" + arg0 + ",port:" + arg1);
            printJavaStack('tcp connect...')
            return this.$init(arg0, arg1);
        }
        var SocketInputStreamClass = Java.use('java.net.SocketInputStream');
        //socketRead0
        SocketInputStreamClass.socketRead0.implementation = function (arg0, arg1, arg2, arg3, arg4) {
            var size = this.socketRead0(arg0, arg1, arg2, arg3, arg4);
            //console.log("[" + Process.getCurrentThreadId() + "]socketRead0:size:" + size + ",content:" + JSON.stringify(arg1));
            var bytearray = Java.array('byte', arg1);
            var content = '';
            for (var i = 0; i < size; i++) {
                if (isprintable(bytearray[i])) {
                    content = content + String.fromCharCode(bytearray[i]);
                }
            }
            var socketimpl = this.impl.value;
            var address = socketimpl.address.value;
            var port = socketimpl.port.value;

            console.log("\naddress:" + address + ",port" + port + "\n" + JSON.stringify(this.socket.value) + "\n[" + Process.getCurrentThreadId() + "]receive:" + content);
            printJavaStack('socketRead0')
            return size;
        }
        var SocketOutPutStreamClass = Java.use('java.net.SocketOutputStream');
        SocketOutPutStreamClass.socketWrite0.implementation = function (arg0, arg1, arg2, arg3) {
            var result = this.socketWrite0(arg0, arg1, arg2, arg3);
            //console.log("[" + Process.getCurrentThreadId() + "]socketWrite0:len:" + arg3 + "--content:" + JSON.stringify(arg1));
            var bytearray = Java.array('byte', arg1);
            var content = '';
            for (var i = 0; i < arg3; i++) {

                if (isprintable(bytearray[i])) {
                    content = content + String.fromCharCode(bytearray[i]);
                }
            }
            var socketimpl = this.impl.value;
            var address = socketimpl.address.value;
            var port = socketimpl.port.value;
            console.log("send address:" + address + ",port" + port + "[" + Process.getCurrentThreadId() + "]send:" + content);
            console.log("\n" + JSON.stringify(this.socket.value) + "\n[" + Process.getCurrentThreadId() + "]send:" + content);
            printJavaStack('socketWrite0')
            return result;
        }
    })
}


function main() {
    hooklibc();
    hooklibart();
    hookmultithreads();
    hooktcp();
}

setImmediate(main);