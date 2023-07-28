//根据地址批量 Hook 函数
function hook_suspected_function(targetSo) {
	//在这里提供函数地址
    const funcs =
		['0x56d58']

    for (var i in funcs) {
        let relativePtr = funcs[i];
        let funcPtr = targetSo.add(relativePtr);
		hook_native_addr(funcPtr);
	}
}

function main() {
	//指定SO名字
    var targetSo = Module.findBaseAddress('libaot-System.Net.Http.dll.so');
	console.log(targetSo)
    hook_suspected_function(targetSo);
}

setImmediate(main);

function print_arg(addr){
	var module = Process.findRangeByAddress(addr);
	if(module != null){
		return hexdump(addr) + "\n";
	}else{
		return ptr(addr) + "\n";
	}
}

function hook_native_addr(funcPtr){
	var module = Process.findModuleByAddress(funcPtr);
	Interceptor.attach(funcPtr, {
		onEnter: function(args){
			this.args0 = args[0];
			this.args1 = args[1];
			this.args2 = args[2];
			this.args3 = args[3];
			this.logs = [];
			this.logs.push("call " + module.name + "!" + ptr(funcPtr).sub(module.base) + "\n");
			this.logs.push("this.args0 onEnter: " + print_arg(this.args0));
			this.logs.push("this.args1 onEnter: " + print_arg(this.args1));
			this.logs.push("this.args2 onEnter: " + print_arg(this.args2));
			this.logs.push("this.args3 onEnter: " + print_arg(this.args3));
			
		}, onLeave: function(retval){
			this.logs.push("this.args0 onLeave: " + print_arg(this.args0));
			this.logs.push("this.args1 onLeave: " + print_arg(this.args1));
			this.logs.push("this.args2 onLeave: " + print_arg(this.args2));
			this.logs.push("this.args3 onLeave: " + print_arg(this.args3));
			this.logs.push("retval onLeave: " + retval + "\n");
			console.log(this.logs);
		}
	});
}
