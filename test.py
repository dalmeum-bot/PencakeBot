from urllib.request import urlopen
from urllib.request import Request
from urllib.error import URLError, HTTPError
from bs4 import BeautifulSoup
from json import loads
import pprint

url = 'https://www.acmicpc.net/problem/2049'
req = Request(url, headers={'User-Agent': 'Mozila/5.0'})
webpage = urlopen(req)
soup = BeautifulSoup(webpage, features="html.parser")

문제 = soup.find('div', id='problem_description').text.strip()
입력 = soup.find('div', id='problem_input').text.strip()
출력 = soup.find('div', id='problem_output').text.strip()

예제_입력 = []
예제_출력 = []

i = 1
while soup.find('pre', id=f'sample-output-{i}') is not None:
	예제_입력.append(soup.find('pre', id=f'sample-input-{i}').text)
	예제_출력.append(soup.find('pre', id=f'sample-output-{i}').text)
	i += 1

print(f'문제: "{문제}"')
print(f'입력: "{입력}"')
print(f'출력: "{출력}"')
print(예제_입력)
print(예제_출력)