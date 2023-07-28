/*
    8.1.0
    Hook SSLSokcet
*/
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

function hookssljava() {
    Java.perform(function () {
        
        var NativeCrypto = Java.use("com.android.org.conscrypt.NativeCrypto");
        NativeCrypto.SSL_write.implementation = function(fsslNativePointerd,fd,shc,buf,off,len,i){
            var ret = this.SSL_write(fsslNativePointerd,fd,shc,buf,off,len,i);
            var buffer = Java.array('byte',buf);
            var conetnt = "";
            for(var i = 0;i<len;i++){
                conetnt+=String.fromCharCode(buffer[i])
            }
            console.log("send=>",conetnt);
            printJavaStack("SSL_write");
                return ret;
        }

        NativeCrypto.SSL_read.implementation = function(fsslNativePointerd,fd,shc,buf,off,len,i){
            var ret = this.SSL_read(fsslNativePointerd,fd,shc,buf,off,len,i);
            var buffer = Java.array('byte',buf);
            var conetnt = "";
            for(var i = 0;i<len;i++){
                conetnt+=String.fromCharCode(buffer[i])
            }
            console.log("recevie=>",conetnt);
            printJavaStack("SSL_read");
                return ret;
        }
          
        
    })
}

function enumerate() {
    Java.perform(function () {
        Java.enumerateLoadedClassesSync().forEach(function (classname) {
            if (classname.indexOf("ConscryptFileDescriptorSocket") >= 0) {
                console.log(classname);
            }
        })
    })
}

function hookssljavaip(){
    Java.perform(function(){
        Java.use("com.android.org.conscrypt.ConscryptFileDescriptorSocket$SSLOutputStream").write.overload('[B', 'int', 'int').implementation = function(buf,off,length){
            var ret = this.write(buf,off,length);
            var buffer = Java.array('byte',buf);
            var conetnt = "";
            for(var i = 0;i<length;i++){
                conetnt+=String.fromCharCode(buffer[i])
            }
            var obj  = this.this$0.value;
            console.log("obj=>",obj.toString())
            // console.log("IP=>",obj.socket.value.toString())
            console.log("recevie=>",conetnt);
            printJavaStack("write");
                return ret;
        }

        Java.use("com.android.org.conscrypt.ConscryptFileDescriptorSocket$SSLInputStream").read.overload('[B', 'int', 'int').implementation = function(buf,off,length){
            var ret = this.read(buf,off,length);
            var buffer = Java.array('byte',buf);
            var conetnt = "";
            for(var i = 0;i<length;i++){
                conetnt+=String.fromCharCode(buffer[i])
            }
            var obj  = this.this$0.value;
            console.log("obj=>",obj.toString())
            // console.log("IP=>",obj.socket.value.toString())
            console.log("recevie=>",conetnt);
            printJavaStack("read");
                return ret;
        }
    });
}

function main() {
    // enumerate();
    // hookssljava();
    // 带IP端口
    hookssljavaip();
}

setImmediate(main)