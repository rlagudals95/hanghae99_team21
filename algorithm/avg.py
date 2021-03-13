
students = input()

for i in students:
    s = list(map(int, input().split()))

    tests = s[:1] # 학생수
    scores = s[1:] # 학생들이 받은 점수

    avg = sum(scores)/len(scores)
    A = []

    for j in scores:
        if j > avg:
             A.append(j)
    rate = len(A)/s[0]*100 # 퍼센트 비율을 구하려면 평균넘는 학생수 나누기 학생수 곱하기 100
     

print(f'{rate:.3f}%') # 소숫점 3자리 까지 출력
