// (function(){

const arm64CM = new CModule(`
#include <gum/gumstalker.h>
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

extern void on_message(const gchar *message);
static void log(const gchar *format, ...);
static void on_arm64_before(GumCpuContext *cpu_context, gpointer user_data);
static void on_arm64_after(GumCpuContext *cpu_context, gpointer user_data);

void hello() {
    on_message("Hello form CModule");
}

gpointer shared_mem[] = {0, 0};

gpointer 
get_shared_mem() 
{
    return shared_mem;
}


static void
log(const gchar *format, ...)
{
    gchar *message;
    va_list args;

    va_start(args, format);
    message = g_strdup_vprintf(format, args);
    va_end(args);

    on_message(message);
    g_free(message);
}


void transform(GumStalkerIterator *iterator,
               GumStalkerOutput *output,
               gpointer user_data)
{
    cs_insn *insn;

    gpointer base = *(gpointer*)user_data;
    gpointer end = *(gpointer*)(user_data + sizeof(gpointer));
    
    while (gum_stalker_iterator_next(iterator, &insn))
    {
        gboolean in_target = (gpointer)insn->address >= base && (gpointer)insn->address < end;
        if(in_target)
        {
            log("%p\t%s\t%s", (gpointer)insn->address, insn->mnemonic, insn->op_str);
            gum_stalker_iterator_put_callout(iterator, on_arm64_before, (gpointer) insn->address, NULL);
        }
        gum_stalker_iterator_keep(iterator);
        if(in_target) 
        {
            gum_stalker_iterator_put_callout(iterator, on_arm64_after, (gpointer) insn->address, NULL);
        }
    }
}


const gchar * cpu_format = "
    0x%x\t0x%x\t0x%x\t0x%x\t0x%x
    \t0x%x\t0x%x\t0x%x\t0x%x\t0x%x
    \t0x%x\t0x%x\t0x%x\t0x%x\t0x%x
    \t0x%x\t0x%x\t0x%x\t0x%x\t0x%x
    \t0x%x\t0x%x\t0x%x\t0x%x\t0x%x
    \t0x%x\t0x%x\t0x%x\t0x%x\t0x%x
    \t0x%x\t0x%x\t0x%x
    ";

static void
on_arm64_before(GumCpuContext *cpu_context,
        gpointer user_data)
{

}

static void
on_arm64_after(GumCpuContext *cpu_context,
        gpointer user_data)
{

}

`, {
    on_message: new NativeCallback(messagePtr => {
        const message = messagePtr.readUtf8String();
        var msg=initMessage();
        msg["data"]=message;
        send(msg);
        console.log(message);
        // send(message)
      }, 'void', ['pointer']),
});



function stalkerTraceRange(tid, base, size) {
    Stalker.follow(tid, {
        transform: (iterator) => {
            const instruction = iterator.next();
            const startAddress = instruction.address;
            const isModuleCode = startAddress.compare(base) >= 0 &&
                startAddress.compare(base.add(size)) < 0;
            // const isModuleCode = true;
            do {
                iterator.keep();
                if (isModuleCode) {
                    // var address=ptr(instruction["address"]-moduleBase);
                    // send({
                    //     type: 'inst',
                    //     tid: tid,
                    //     block: startAddress,
                    //     val: JSON.stringify(instruction),
                    //     jsname:"sktrace",
                    //     moduleBase:moduleBase,
                    //     address:address,
                    // })
                    // console.log()
console.log(instruction.mnemonic," " ,instruction.opStr)
                    iterator.putCallout((context) => {
                        // var callOutAddress=ptr(context.pc-moduleBase)
                        // send({
                        //     type: 'ctx',
                        //     tid: tid,
                        //     val: JSON.stringify(context),
                        //     jsname:"sktrace",
                        //     moduleBase:moduleBase,
                        //     address:callOutAddress
                        // })

                    })

                }
            } while (iterator.next() !== null);
            // if(flag){
            //     send(data)
            // }
        }
    })
}


function traceAddr(addr) {
    let moduleMap = new ModuleMap();
    let targetModule = moduleMap.find(addr);
    console.log("addr",addr,"m:",JSON.stringify(targetModule))
    // var msg=initMessage();
    // msg["data"]=JSON.stringify(targetModule);
    // send(msg);
    // let exports = targetModule.enumerateExports();
    // let symbols = targetModule.enumerateSymbols();

    Interceptor.attach(addr, {
        onEnter: function(args) {
            this.tid = Process.getCurrentThreadId()
            console.log("hello",this.context.pc)
            stalkerTraceRange(this.tid, targetModule.base, targetModule.size)
            // stalkerTraceRange(this.tid, addr, addr+2000)
        },
        onLeave: function(ret) {
            Stalker.unfollow(this.tid);
            Stalker.garbageCollect()
            // send({
            //     type: "fin",
            //     tid: this.tid,
            //     jsname:"sktrace"
            // })
        }
    })
}








var moduleBase=0;

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
function hook() {
    let strstr = Module.findExportByName("libc.so", "strstr")
console.log(strstr)
    Interceptor.attach(strstr, {
        onEnter: function (args) {
            this.arg1 = ptr(args[0]).readCString();
            this.arg2 = ptr(args[1]).readCString();
            if (this.arg2.indexOf("JniMethodStart") !== -1) {
                if (this.arg1.indexOf("onCreate") !== -1) {
                    // retval.replace(0x123)
                    moduleBase = parseInt(getAddress().trim(),16);
                    traceAddr(ptr(moduleBase + 0x740AC));

                }
            }


            if (this.arg2.indexOf("RegisterNativeFlag") !== -1) {
                if (this.arg1.indexOf("onCreate") !== -1) {
                    console.log("[JniMethodStart]: ", this.arg1)
                    // let base = getAddress().trim();
                    // console.log("base:",base)
                    // console.log("addr: "+(parseInt(base,16)).toString(16));
                }
            }

        },
        onLeave: function (retval) {
            if (this.arg2.indexOf("JniMethodStart") !== -1) {
                if (this.arg1.indexOf("onCreate") !== -1) {
                    // retval.replace(0x123)
                }
            }
        }
    });

}
function main(){
hook();

}
setTimeout(main,100);
