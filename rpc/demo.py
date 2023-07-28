import time
import frida
from flask import Flask, request, json

def my_message_handler(message, payload):
    print(message)
    print(payload)


device = frida.get_device_manager().add_remote_device("124.222.94.67:48888")
pid = device.spawn("com.xiaokozi.signaturetest")
device.resume(pid)
time.sleep(1)
session = device.attach(pid)

with open("rpctest.js") as f:
    script = session.create_script(f.read())
script.on("message", my_message_handler)
script.load()

print(script.exports.encrypt("xiaokozi"))
print(script.exports.decrypt("Ljo6MBvuoh9EW0Tm4GVQZg=="))

# input()

app = Flask(__name__)



@app.route('/encrypt', methods=['POST'])  # url加密
def encrypt_class():
    data = request.get_data()
    json_data = json.loads(data.decode("utf-8"))
    postdata = json_data.get("data")
    print(postdata)
    res = script.exports.encrypt(postdata)
    return res


@app.route('/decrypt', methods=['POST'])  # url加密
def decrypt_class():
    data = request.get_data()
    json_data = json.loads(data.decode("utf-8"))
    postdata = json_data.get("data")
    print(postdata)
    res = script.exports.decrypt(postdata)
    return res

if __name__ == '__main__':
    app.run()