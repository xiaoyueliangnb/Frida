import requests

url = 'http://www.kozicluod.cn/aa.php'
# data = {'username': 'john', 'password': 'secret'}
response = requests.get(url)

print(response.text)