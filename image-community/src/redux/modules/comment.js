import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, realtime } from "../../shared/firebase";
import "moment";
import moment from "moment";
import post from "./post";
import firebase from "firebase/app";
import { actionCreators as postActions } from "./post";

const SET_COMMENT = "SET_COMMENT";
const ADD_COMMENT = "ADD_COMMENT";
const LOADING = "LOADING";

const setComment = createAction(SET_COMMENT, (post_id, comment_list) => ({
  post_id,
  comment_list,
}));
const addComment = createAction(ADD_COMMENT, (post_id, comment) => ({
  post_id,
  comment,
}));

const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: {},
  is_loading: false,
};

const addCommentFB = (post_id, contents) => {
  //포스트아이디와 댓글을 받아와야함
  return function (dispatch, getState, { history }) {
    const commentDB = firestore.collection("comment");
    const user_info = getState().user.user; //유저js의 스테이트

    let comment = {
      //코멘트 하나에 대한 데이터 user의 데이터를 빌려서만듦
      post_id: post_id,
      user_id: user_info.uid,
      user_name: user_info.user_name,
      user_profile: user_info.user_profile,
      contents: contents,
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
    };

    //이제 위의 정보들을 파이어스토어에 밀어 넣어보자!
    commentDB.add(comment).then((doc) => {
      // then으로 넘어오는 건 작성이 성공했다는 의미 게시글 댓글수도 +1해주자
      const postDB = firestore.collection("post"); // 댓글 +1 해주기 위해 포스트 콜렉션 불러옴

      const post = getState().post.list.find((l) => l.id === post_id); //포스트 정보 가지고 오기

      const increment = firebase.firestore.FieldValue.increment(1); // increment에 들어가는 숫자만큼 증가시켜준다
      comment = { ...comment, id: doc.id };
      // let a = 5; a = a + 5 // comment_cnt + 1
      postDB
        .doc(post_id)
        .update({ comment_cnt: increment })
        .then((_post) => {
          //댓글이 써지고 여기서 noti도 불러주자

          // 그 포스트 db안의 접속아이디의 comment_cnt 업데이트
          dispatch(addComment(post_id, comment));
          //파이어스토어의 댓글개수에 +1이 되고 그 때 리덕스에서도 추가 해줘야한다

          if (post) {
            //자바스크립트는 문자랑 숫자랑 더하면 문자가됨 "0"+ 1 = 01 그래서 숫자인지 알아보자 parseInt 이용해 숫자로 바꿔주고+ 1
            dispatch(
              postActions.editPost(post_id, {
                comment_cnt: parseInt(post.comment_cnt) + 1,
              })
            ); // 파이어스토어가 아닌 리덕스 값을 고쳐준다

            //리얼타임 데이터 수정 가져오기 말고 넣고 sort하는 방법은?
            const _noti_item = realtime
              .ref(`noti/${post.user_info.user_id}/list`)
              .push();
            //공간확보 후 데이터를 넣는 방법은?
            _noti_item.set(
              {
                post_id: post.id,
                user_name: comment.user_name, // 포스트 유저네임? 이면 내이름이다 작성자 이름이 들어가야 한다 코멘트를 작성한!
                image_url: post.image_url,
                insert_dt: comment.insert_dt,
              },
              (err) => {
                if (err) {
                  console.log("알림 저장에 실패했습니다! 8ㅛ8");
                } else {
                  const notiDB = realtime.ref(`noti/${post.user_info.user_id}`);
                  notiDB.update({ read: false });
                }
              }
            );

            // notiDB.update({ read: false });
          }
        });
    });
  };
};

const getCommentFB = (post_id = null) => {
  return function (dispatch, getState, { history }) {
    //복합쿼리 게시몰의 id로 조건을 걸고 쿼리를 날리고 작성한일시인 dt로 정렬해주고 싶어서
    //post_id가 null이면 애초에 쿼리검색 불가능 이므로 막자주자
    if (!post_id) {
      return;
    }
    const commentDB = firestore.collection("comment");

    commentDB
      .where("post_id", "==", post_id)
      .orderBy("insert_dt", "decs") //포스트 id가 접속자(검색창) id와 같아야한다 // 그리고 작성날짜 최신순 정렬
      .get()
      .then((docs) => {
        let list = [];

        docs.forEach((doc) => {
          list.push({ ...doc.data(), id: doc.id });
        });
        dispatch(setComment(post_id, list)); //여기서 리스트는 코멘트 리스트다.. ? 왜지
      })
      .catch((err) => {
        console.log("댓글 정보를 가져올 수가 없습니다!", err);
      });
  };
};

export default handleActions(
  {
    [SET_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        //댓글이 들어갈 방을 만들고 그 방에다 그 방에다 게시글에 맞는 댓글리스트를 넣자
        // let data = {[post_id]: com_list , ......}  어떤 데이터가 있다면 이 데이터를// 포스트 아이디 하나에다가 저장을 해놓아서 다음번에 또 그 게시물에 들어갔을때 포스트 아이디 키값을 가지고 있나만 보면된다
        draft.list[action.payload.post_id] = action.payload.comment_list;
      }),
    [ADD_COMMENT]: (state, action) =>
      produce(state, (draft) => {
        draft.list[action.payload.post_id].push(action.payload.comment);
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  getCommentFB,
  setComment,
  addComment,
  addCommentFB,
};

export { actionCreators };
