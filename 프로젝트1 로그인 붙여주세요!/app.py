from flask import Flask, render_template, jsonify, request
app = Flask(__name__)

import requests
from bs4 import BeautifulSoup

from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client.dbsparta

## HTML을 주는 부분
@app.route('/')
def home():
   return render_template('index.html')

@app.route('/memo', methods=['GET'])
def listing():

    post_videos =list(db.aloneprac.find({}, {'_id': False}).sort('like', -1))

    return jsonify({'postVideos': post_videos})

## API 역할을 하는 부분

@app.route('/memo', methods=['POST'])
def saving():
    url_receive = request.form['url_give']
    comment_receive = request.form['comment_give']

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
    data = requests.get(url_receive, headers=headers)

    soup = BeautifulSoup(data.text, 'html.parser')

    title = soup.select_one('meta[property="og:title"]')['content']
    image = soup.select_one('meta[property="og:image"]')['content']
    desc = soup.select_one('meta[property="og:description"]')['content']

    doc = {'title': title,
           'image': image,
           'desc': desc,
           'url': url_receive,
           'comment': comment_receive,
           'like': 0
           }


    db.aloneprac.insert_one(doc)

    return jsonify({'msg':'POST!'})

#좋아요 기능

@app.route('/api/like', methods=['POST'])
def like_star():
    url_receive = request.form['url_give']
    target_star = db.aloneprac.find_one({'url': url_receive})
    current_like = target_star['like']

    new_like = current_like + 1


    db.aloneprac.update_one({'url': url_receive}, {'$set': {'like': new_like}})
    # 값을 변경해준다 네임값은 받은 네임값 라이크는 뉴라이크로
    return jsonify({'msg': 'like 완료!'})


if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)