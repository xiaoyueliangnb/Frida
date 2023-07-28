
function dumoso(addr,size){

}

function hook(){
    dumoso(0x78d7daf000,0x190000)
    console.log("hello")
}

setImmediate(hook)