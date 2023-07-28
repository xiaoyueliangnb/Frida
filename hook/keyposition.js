function showStacks() {
    console.log(
        Java.use("android.util.Log")
            .getStackTraceString(
                Java.use("java.lang.Throwable").$new()
            )
    );
}

//Hook HashMap put
function HashMap(name, Stack) {
    Java.perform(function () {
        let hashMap = Java.use("java.util.HashMap");
        hashMap.put.implementation = function (a, b) {
            if (name != null) {
                if (a.equals(name)) {
                    if (Stack) {
                        showStacks();
                    }
                    console.log("hashMap.put: ", a, b);
                }
            } else {
                if (Stack) {
                    showStacks();
                }
                console.log("hashMap.put: ", a, b);
            }
            return this.put(a, b);
        }

    })
}

function ArrayList(name, Stack) {
    Java.perform(function () {
        var arrayList = Java.use("java.util.ArrayList");
        arrayList.add.overload('java.lang.Object').implementation = function (a) {
            if (name != null) {
                if (a.equals(name)) {
                    if (Stack) {
                        showStacks();
                    }
                    console.log("arrayList.add(Object): ", a);
                }
            } else {
                console.log("arrayList.add(Object) ", a);
            }

            //console.log("arrayList.add: ", a);
            return this.add(a);
        }
        arrayList.add.overload('int', 'java.lang.Object').implementation = function (a, b) {
            if (Stack) {
                showStacks();
            }
            console.log("arrayList.add(I,Object): ", a);
            return this.add(a, b);
        }

    })
}

function HookisEmpty(name, Stack) {
    Java.perform(function () {
        var textUtils = Java.use("android.text.TextUtils");
        textUtils.isEmpty.implementation = function (a) {
            if (name != null) {

                if (a == name) {
                    if (Stack) {
                        showStacks();
                    }
                    console.log("textUtils.isEmpty: ", a);
                }
            } else {
                console.log("textUtils.isEmpty: ", a);
            }
            return this.isEmpty(a);
        }

    })
}

function Hooksort(Stack) {
    Java.perform(function () {
        var collections = Java.use("java.util.Collections");
        collections.sort.overload('java.util.List').implementation = function (a) {
            if (Stack) {
                showStacks();
            }
            let result = Java.cast(a, Java.use("java.util.ArrayList"));
            console.log("collections.sort List(List): ", result.toString());
            return this.sort(a);
        }
        collections.sort.overload('java.util.List', 'java.util.Comparator')
            .implementation = function (a, b) {
            if (Stack) {
                showStacks();
            }
            let result = Java.cast(a, Java.use("java.util.ArrayList"));
            console.log("collections.sort List Comparator(List,Comparator): ", result.toString());
            return this.sort(a, b);
        }

    })
}

function HookJSONS(Stack) {
    Java.perform(function () {
        var jSONObject = Java.use("org.json.JSONObject");
        jSONObject.put.overload('java.lang.String', 'java.lang.Object')
            .implementation = function (a, b) {
            if (Stack) {
                showStacks();
            }
            //var result = Java.cast(a, Java.use("java.util.ArrayList"));
            console.log("jSONObject.put: ", a, b);
            return this.put(a, b);
        }
        jSONObject.getString.implementation = function (a) {
            if (Stack) {
                showStacks();
            }
            console.log("jSONObject.getString: ", a);
            var result = this.getString(a);
            console.log("jSONObject.getString result: ", result);
            return result;
        }
        let Gson = Java.use("com.google.gson.Gson");
        if (Gson != null) {
            Gson.fromJson.implementation = function (arg1, arg2) {
                if (Stack) {
                    showStacks();
                }
                console.log("arg1:", arg1);
                console.log("参数2的Class名字:", arg2.getClass().getName());
                return this.fromJson(arg1, arg2);
            }
            Gson.toJson.implementation = function (arg1) {
                if (Stack) {
                    showStacks();
                }
                console.log("arg1:", arg1);
                console.log("参数1的Class名字:", arg1.getClass().getName());
                return this.toJson(arg1);
            }
        }
        let aliJson = Java.use("com.alibaba.fastjson.JSON");
        if (aliJson != null) {
            aliJson.parse.implementation = function (arg1) {
                if (Stack) {
                    showStacks();
                }
                console.log("arg1:", arg1)
                let ret = this.parse(arg1);
                console.log("返回内存类名:", ret.getClass().getName());
            }
            aliJson.parseObject.implementation = function (arg1) {
                if (Stack) {
                    showStacks();
                }
                console.log("arg1:", arg1)
                let ret = this.parseObject(arg1);
                console.log('返回内容', ret.toString());
            }
            aliJson.toJSONString.implementation = function (arg1) {
                if (Stack) {
                    showStacks();
                }
                let ret = this.toJSONString(arg1);
                console.log("返回内容:", ret.toString());
                console.log('参数1名字', arg1.getClass().getName());
            }
        }
        let jackson = Java.use("com.fasterxml.jackson.databind.ObjectMapper");
        if (jackson != null) {
            jackson.writeValueAsString.implementation = function (arg1, arg2) {
                if (Stack) {
                    showStacks();
                }
                let ret = this.writeValueAsString(arg1, arg2);
                console.log('返回内容', ret.toString())
                console.log('参数1名字', arg1.getClass().getName())
            }
            jackson.readValue.implementation = function (arg1,arg2){
                if (Stack) {
                    showStacks();
                }
                console.log('参数1内容',arg1.toString())
                console.log('参数2类名',arg2.getClass().getName())
                return this.readValue(arg1, arg2);
            }
        }
        Java.use("java.util.zip.GZIPOutputStream").write.implementation = function(arg1,arg2,arg3){
            if(arg1 != null) {
                console.log("参数1 byte[] U8编码内容",Java.use("java.lang.String").$new(arg1));
            }
              let ret = this.write(arg1,arg2,arg3);
              console.log("ret: ",ret);
              return ret;     
        }
        Java.use("ava.io.ByteArrayOutputStream").toJson.implementation = function(arg1){
              let ret = this.toJson();
              
              console.log("返回结果:",ret);
              return ret;     
        }


    })
}

function Toast(Stack) {
    Java.perform(function () {
        let toast = Java.use("android.widget.Toast");
        toast.show.implementation = function () {
            if (Stack) {
                showStacks();
            }
            console.log("toast.show: ");
            return this.show();
        }

    })
}

function HookgetBytes(Stack) {
    Java.perform(function () {
        let str = Java.use("java.lang.String");
        str.getBytes.overload().implementation = function () {
            if (Stack) {
                showStacks();
            }
            let result = this.getBytes();
            let newStr = str.$new(result);
            console.log("str.getBytes result: ", newStr);
            // if(newStr.indexOf(" http://www.wigwy.xyz/api/login") != -1){
            //     showStacks();
            // }
            return result;
        }
        str.getBytes.overload('java.lang.String').implementation = function (a) {
            if (Stack) {
                showStacks();
            }
            let result = this.getBytes(a);
            let newStr = str.$new(result, a);
            console.log("str.getBytes result: ", newStr);
            // if(newStr.indexOf(" http://www.wigwy.xyz/api/login") != -1){
            //     showStacks();
            // }
            return result;
        }

    })
}

function Collection(name) {
    ArrayList(name, isStack);
    HashMap(name, isStack);
}

function Arrays(name) {
    Hooksort(isStack);
    HookisEmpty(name, isStack);
}

function Strings() {
    HookgetBytes(isStack);
}

function JSONS() {
    HookJSONS(isStack);
}

function AndroidEvent() {
    Toast(isStack);
}

var isStack = true;

function hook() {
    Java.perform(function () {
        //集合相关
        // Collection(null);
        //数组相关
        // ArrayList(null);
        //字符串相关
        Strings();
        //JSON相关
        // JSONS();
        //安卓事件相关
        // AndroidEvent();


    });

}

function main() {
    console.log("Loaded Success!")
    hook();
}

setImmediate(main)



