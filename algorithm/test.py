A = input()
 
li = list(A)

# 0 1 2 3 4가 차례대로 들어간다 
for i in range(len(li)):  #리스트의 길이
    li[i] = int(li[i]) #리스트의 i번째 칸을 정수로 바꿔서 출력해주세요~ '1'의 ''이 사라지
    
    print(li[i]*(10**(len(li)-i)) # i = 0 => 4 - 0 = 4
