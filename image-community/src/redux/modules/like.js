import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import firebase from "firebase/app";
import { ContactSupportTwoTone } from "@material-ui/icons";
import { actionCreators as postAction } from "./post";

const ADD_LIKE = "ADD_LIKE";
const SET_LIKE = "SET_LIKE";

const addLike = createAction(ADD_LIKE, (like) => ({ like }));
const setLike = createAction(SET_LIKE, (like) => ({ like }));

const initialState = {
  list: [],
  like: false,
};

const setLikeFB = (post_id) => {
  return function (getState, dispatch) {
    const likeDB = firestore.collection("like");
    if (!getState.user.user) {
      //로그인 정보가 없다면 리턴
      return;
    }

    const user_id = getState().user.user.uid; // uid를 가져오자

    likeDB
      .where("post_id", "==", post_id)
      .where("user_id", "==", user_id)
      .get()
      .then((docs) => {
        let like_list = [];
        docs.forEach((doc) => {
          like_list = { ...doc.data(), id: doc.id };
        });
        dispatch(setLike(like_list));
      });
  };
};

const addLikeFB = (post_id, like_id, nowLike) => {
  return function (dispatch, getState, { history }) {
    const likeDB = firestore.collection("like");
    const postDB = firestore.collection("post");

    //현재 좋아요 상태와 변하게 될 좋아요 상태
    let newLike;
    if (nowLike) {
      newLike = false;
    } else {
      newLike = true;
    }

    if (!getState().user.user) {
      //로그인 정보가 없다면
      window.alert("로그인 해주세요!");
      return;
    }
    const user_id = getState().user.user.uid; // 로그인 정보가 있으면 id 값을 가져오자

    let like = {
      post_id: post_id,
      user_id: user_id,
      user_like: newLike,
    };

    likeDB
      .where("post_id", "==", post_id)
      .where("user_id", "==", user_id)
      .get()
      .then((docs) => {
        //likeDB에 데이터가 없다면 새로 만들어주고 좋아요 1업!
        if (docs.empty) {
          likeDB.add(like).then((doc) => {
            like = { ...like, id: doc.id };

            dispatch(addLike(like));
            dispatch(setLike(like));
            //포스트 js 스테이트 값에서 현재 post_id와 일치하는 데이터를 찾아오자!
            const post = getState().post.list.find((l) => l.id == post_id);
            const increment = firebase.firestore.FieldValue.increment(1); // 파이어 베이스 데이터에 +1 해줄 변수
            postDB
              .doc(post_id)
              .update({ like_cnt: increment })
              .then(
                dispatch(
                  postAction.editPost(post_id, {
                    like_cnt: parseInt(post.like_cnt) + 1,
                  })
                )
              );
          });
        }
      });
  };
};
// const SET_LIKE = "SET_LIKE";
// const PLUE_LIKE = "PLUS_LIKE";

// const setLike = createAction(SET_LIKE, (like) => ({ like }));
// const plueLike = createAction(PLUE_LIKE, (like) => ({ like }));

// const initialState = {
//   like: 0,
// };

// const addLike = () => {
//   return function (getState, dispatch, { history }) {
//     const likes = getState().like.like;
//     dispatch(plueLike(likes));
//   };
// };

// export default handleActions(
//   {
//     [SET_LIKE]: (state, action) => {
//       produce(state, (draft) => {
//         draft.like = action.payload.like;
//       });
//     },
//     [PLUS_LIKE]: (state, action) =>
//       produce(state, (draft) => {
//         draft.like = action.payload.like;
//       }),
//   },
//   initialState
// );

// const actionCreators = {
//   setLike,
//   addLike,
//   plueLike,
// };

// export { actionCreators };

// // const ADD_LIKE = "ADD_LIKE";

// // const addLike = createAction(ADD_LIKE, (like) => ({ like })); // like >> 리듀서를 거친 like

// // const initialState = {
// //   list: [], // ??
// //   like: false,
// // };

// // const addLikeFB = (post_id) => {
// //   return function (dispatch, getState) {
// //     const likeDB = firestore.collection("like");

// //     const nowLike = getState().like.like; //like 컴포넌트의 like를 가져와라
// //     let newLike = false;
// //     if (nowLike) {
// //       newLike = false;
// //     } else {
// //       newLike = true;
// //     }
// //     console.log(newLike);

// //     const user_id = getState().user.user.user_id;
// //     console.log(user_id);
// //     console.log(post_id);

// //     let like = {
// //       post_id: post_id,
// //       user_id: user_id,
// //       user_like: newLike,
// //     };

// //     likeDB.add(like).then((doc) => {
// //       like = { ...like, id: doc.id };
// //       dispatch(addLike(like));
// //     });
// //   };
// // };

// // export default handleActions({
// //   [ADD_LIKE]: (state, action) =>
// //     produce(state, (draft) => {
// //       draft.list = action.payload.like;
// //     }),
// //   initialState,
// // });

// // const actionCreators = {
// //   addLikeFB,
// // };

// // export { actionCreators };

// // const getLikeFB = () => {
// //   return function (dispatch, getState, { history }) {
// //     const LikeDB = firestore.collection("like");

// //     LikeDB.get().then((docs) => {
// //       let like_list = [];
// //       docs.forEach((doc) => {
// //         console.log(doc.data());

// //         let _like = {
// //           likeCnt: doc.id,
// //           ...doc.data(),
// //         };

// //         like_list.push(_like);
// //       });
// //       let like_cnt = like_list[0].likeCnt;
// //       console.log(like_cnt);

// //       dispatch(setLike(like_cnt));
// //       //   dispatch(addLike(like_list[0]));
// //     });
// //   };
// // };

// // const likeDB = firestore.collection("like").doc("like");

// // console.log(likeDB);
// // likeDB
// //   .get()
// //   .then((doc) => {
// //     if (doc.exists) {
// //       console.log(doc.data());
// //     } else {
// //       console.log("없다");
// //     }
// //   })
// //   .catch((error) => {
// //     console.log("에러", error);
// //   });

// // likeDB.get().then(doc);

// // const increment = firebase.firestore.FieldValue.increment(1);
// // const a = likeDB.doc(likeCnt).update({});
