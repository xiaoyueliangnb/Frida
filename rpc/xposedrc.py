import requests

def encrypt(enParam):
    url = "http://192.168.124.28:8899"
    param = enParam
    headers = {"Content-Type":"application/x-www-form-urlencode"}
    r = requests.post(url=url,data=param,headers=headers)
    print(r.content)

    return r.content

if __name__ == '__main__':
    encrypt("xiaokozi")
