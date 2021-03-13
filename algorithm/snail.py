import math


a,b,v = map(int, input().split()) #a 올라가는 높이 b 미끄러지는 높이 v 총길이


n = (v-a)/(a-b)

day = math.ceil(n)

print(day+1)