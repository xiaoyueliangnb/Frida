function log(path) {
    if(path.readCString().indexOf("/data/app/com.relax.tiles.match-Y_31pHvM6YgiC4kqYyQWQw==/base.apk/assets/bin/Data/") !== -1) {
                    console.log('RegisterNatives called from:\\n' + Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\\n') + '\\n');

        console.log("path result->", path.readCString())
    }
}

function iohook() {
    let open = Module.getExportByName('libc.so', 'open')
    let fopen = Module.getExportByName('libc.so', 'fopen')
    let fchownat = Module.getExportByName('libc.so', 'fchownat')
    let renameat = Module.getExportByName('libc.so', 'renameat')
    let mkdirat = Module.getExportByName('libc.so', 'mkdirat')
    let mknodat = Module.getExportByName('libc.so', 'mknodat')
    let truncate = Module.getExportByName('libc.so', 'truncate')
    let linkat = Module.getExportByName('libc.so', 'linkat')
    let unlinkat = Module.getExportByName('libc.so', 'unlinkat')
    let readlinkat = Module.getExportByName('libc.so', 'readlinkat')
    let __getcwd = Module.getExportByName('libc.so', 'getcwd')
    let __statfs = Module.getExportByName('libc.so', 'statfs')
    let symlinkat = Module.getExportByName('libc.so', 'symlinkat')
    let faccessat = Module.getExportByName('libc.so', 'faccessat')
    let utimensat = Module.getExportByName('libc.so', 'utimensat')
    let chdir = Module.getExportByName('libc.so', 'chdir')
    let execve = Module.getExportByName('libc.so', 'execve')
    let statfs64 = Module.getExportByName('libc.so', 'statfs64')
    let kill = Module.getExportByName('libc.so', 'kill')
    let vfork = Module.getExportByName('libc.so', 'vfork')
    let fstatat64 = Module.getExportByName('libc.so', 'fstatat64')
    Interceptor.attach(open, {
        onEnter: function (args) {
            console.log("open is call");
            this.arg1 = args[0];
            log(this.arg1)
        },
    });
    Interceptor.attach(fopen, {
        onEnter: function (args) {
            console.log("fopen is call");
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
    Interceptor.attach(fchownat, {
        onEnter: function (args) {
            console.log("fchownat is call");
            this.arg1 = args[1];
            log(this.arg1)
        }
    });
    Interceptor.attach(renameat, {
        onEnter: function (args) {
            console.log("renameat is call");
            this.arg1 = args[1];
            this.arg2 = args[3];
            log(this.arg1);
            log(this.arg2);
        }
    });
    Interceptor.attach(mkdirat, {
        onEnter: function (args) {
            console.log("mkdirat is call");
            this.arg1 = args[1];
            log(this.arg1)
        }
    });
    Interceptor.attach(mknodat, {
        onEnter: function (args) {
            console.log("mknodat is call");
            this.arg1 = args[1];
            log(this.arg1)
        }
    });
    Interceptor.attach(truncate, {
        onEnter: function (args) {
            console.log("truncate is call");
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
    Interceptor.attach(linkat, {
        onEnter: function (args) {
            console.log("linkat is call");
            this.arg1 = args[1];
            log(this.arg1)
        }
    });
    Interceptor.attach(unlinkat, {
        onEnter: function (args) {
            console.log("unlinkat is call");
            this.arg1 = args[1];
            log(this.arg1)
        }
    });
    Interceptor.attach(readlinkat, {
        onEnter: function (args) {
            console.log("readlinkat is call");
            this.arg1 = args[1];
            log(this.arg1)
        }
    });
    Interceptor.attach(__getcwd, {
        onEnter: function (args) {
            console.log("__getcwd is call");
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
    Interceptor.attach(__statfs, {
        onEnter: function (args) {
            console.log("__statfs is call");
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
    Interceptor.attach(symlinkat, {
        onEnter: function (args) {
            console.log("symlinkat is call");
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
    Interceptor.attach(faccessat, {
        onEnter: function (args) {
            console.log("faccessat is call");
            this.arg1 = args[1];
            log(this.arg1)
        }
    });
    Interceptor.attach(utimensat, {
        onEnter: function (args) {
            console.log("utimensat is call");
            this.arg1 = args[1];
            log(this.arg1)
        }

    });
    Interceptor.attach(chdir, {
        onEnter: function (args) {
            console.log("chdir is call");
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
    Interceptor.attach(fstatat64, {
        onEnter: function (args) {
            console.log("fstatat64 is call");

            this.arg1 = args[1];
             if(this.arg1.readCString().indexOf("/data/app/com.relax.tiles.match-Y_31pHvM6YgiC4kqYyQWQw==/base.apk/assets/bin/Data/") !== -1) {
                    console.log('RegisterNatives called from:\n' + Thread.backtrace(this.context, Backtracer.ACCURATE).map(DebugSymbol.fromAddress).join('\n') + '\n');

        console.log("path result->", this.arg1.readCString())
    }
            // log(this.arg1)
        }
    });
    Interceptor.attach(execve, {
        onEnter: function (args) {
            console.log("execve is call");
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
    Interceptor.attach(statfs64, {
        onEnter: function (args) {
            console.log("statfs64 is call");
            this.arg1 = args[0];
            log(this.arg1)
        }
    });
}

function main() {
    iohook();
}

setImmediate(main);