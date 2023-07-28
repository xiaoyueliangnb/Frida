function hook() {
    Java.perform(function () {
        Java.use("android.os.Process").killProcess.implementation = function(pid){
            let ret = this.killProcess(pid);
            console.log("killProcess is call")

            return ret;
        }
    })
}

function main() {
    hook()
}

setImmediate(main)