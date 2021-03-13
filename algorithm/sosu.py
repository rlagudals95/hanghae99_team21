import math

def IsPrime(num): #소수인지 판별하는 함수
    a = int(math.sqrt(num)) # 루트2 루트3 루트4(2) 루트 5 루트 6
    if num == 1:
        return False
    else:
        for i in range(2, a+1):
            if num % i == 0: 
                return False
        return True

Num_list = list(range(2,246912)) #미리 뽑아 버린다 소수를
Sort_list = []
for i in Num_list: # 위에 함수에 들어갈 수를 반복문으로
    if IsPrime(i): #
         Sort_list.append(i) #소수인 것만 넣어라

while True:
    n = int(input())  #범위설정
    if n == 0:
        break
    cnt = 0
    for i in Sort_list: # 소수 뽑은 리스트를 반복문으로 하나씩 꺼낸다
        if n < i <= n*2: # 반복문으로 꺼낸수가 n과 2n 사이에 있으면
            cnt += 1 # 카운트를 1씩 올리자
    print(cnt)     