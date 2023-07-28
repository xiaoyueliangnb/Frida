//过签名校验
function bypass(){
    //app需要提供存储权限
    Java.perform(function(){
            // try {
            // Java.openClassFile("/data/local/tmp/getsign.dex").load();
            // const getsign = Java.use('com.xiaokozi.signaturetest.getSing');
            // var path = "/MT2/apks/signtest.apk"
            // var orsign = getsign.getApkSignInfo(Java.use("android.os.Environment").getExternalStorageDirectory()+path);
            // console.log(JSON.stringify(orsign))
            // } catch (error) {
            //
            // }
        Java.use("android.app.ApplicationPackageManager").getPackageInfo.overload('java.lang.String', 'int').implementation = function(pakgname,flags){
            var PackageInfo = this.getPackageInfo(pakgname,flags);
            console.log("getPackageInfo is call",pakgname)
             
            if(PackageInfo.signatures.value != null){
                for(var i = 0;i< PackageInfo.signatures.value.length;i++){

                    // var s = Java.use('android.content.pm.Signature').$new(orsign);
                    // console.log(s)
                    //
                    // var objectarr = Java.array('java.lang.Object',[s])
                    // PackageInfo.signatures.value = objectarr;
                    console.log("a",PackageInfo.signatures.value[i])

                }
            }
            
                return PackageInfo;
        }
        

        //API28
        // Java.use("android.content.pm.SigningInfo").getApkContentsSigners.implementation = function(){
        //     console.log("hooking getApkContentsSigners")
        //     return this.getApkContentsSigners();
        // }
    

    


    })
}

function main(){
    bypass();
}
setImmediate(main);