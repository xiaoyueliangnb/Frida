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

function hookudp() {
    Java.perform(function () {
        var LinuxClass = Java.use('libcore.io.Linux');
        //private native int recvfromBytes(FileDescriptor fd, Object buffer, int byteOffset, int byteCount, int flags, InetSocketAddress srcAddress) throws ErrnoException, SocketException;
        LinuxClass.recvfromBytes.implementation = function (arg0, arg1, arg2, arg3, arg4, arg5) {
            var size = this.recvfromBytes(arg0, arg1, arg2, arg3, arg4, arg5);
            var bytearray = Java.array('byte', arg1);
            var content = "";
            for (var i = 0; i < size; i++) {

                if (isprintable(bytearray[i])) {
                    content = content + String.fromCharCode(bytearray[i]);
                }

            }
            console.log("address:" + arg5 + " [" + Process.getCurrentThreadId() + "]recvfromBytes:size:" + size + ",content:" + JSON.stringify(arg1) + "---content," + content);
            printJavaStack('recvfromBytes');
            return size;
        }
        //private native int sendtoBytes(FileDescriptor fd, Object buffer, int byteOffset, int byteCount, int flags, InetAddress inetAddress, int port) throws ErrnoException, SocketException;
        // private native int sendtoBytes(FileDescriptor fd, Object buffer, int byteOffset, int byteCount, int flags, SocketAddress address) throws ErrnoException, SocketException;
        LinuxClass.sendtoBytes.overload('java.io.FileDescriptor', 'java.lang.Object', 'int', 'int', 'int', 'java.net.InetAddress', 'int').implementation = function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
            var size = this.sendtoBytes(arg0, arg1, arg2, arg3, arg4, arg5, arg6);
            var bytearray = Java.array('byte', arg1);
            var content = "";
            for (var i = 0; i < size; i++) {
                if (isprintable(bytearray[i])) {
                    content = content + String.fromCharCode(bytearray[i]);
                }

            }
            console.log("address:" + arg5 + ",port" + arg6 + " [" + Process.getCurrentThreadId() + "]LinuxClass11.sendtoBytes:len:" + size + "--content:" + JSON.stringify(arg1) + "--content:" + content);
            printJavaStack('LinuxClass11.sendtoBytes')
            return size;
        }
        LinuxClass.sendtoBytes.overload('java.io.FileDescriptor', 'java.lang.Object', 'int', 'int', 'int', 'java.net.SocketAddress').implementation = function (arg0, arg1, arg2, arg3, arg4, arg5) {
            var size = this.sendtoBytes(arg0, arg1, arg2, arg3, arg4, arg5);
            var bytearray = Java.array('byte', arg1);
            var content = "";
            for (var i = 0; i < size; i++) {
                if (isprintable(bytearray[i])) {
                    content = content + String.fromCharCode(bytearray[i]);
                }
            }
            console.log("address:" + arg5 + " [" + Process.getCurrentThreadId() + "]LinuxClass22.sendtoBytes:len:" + size + "--content:" + JSON.stringify(arg1) + ",content:" + content);
            printJavaStack('LinuxClass22.sendtoBytes')
            return size;
        }


    })

}

function main() {
    hookudp();
}

setImmediate(main)