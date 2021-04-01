import { createAction, handleActions } from "redux-actions";
import { produce } from "immer";
import { firestore, storage } from "../../shared/firebase";
import moment from "moment";
import user from "./user";
import { actionCreators as imageActions } from "./image";

const SET_POST = "SET_POST";
const ADD_POST = "ADD_POST";
const EDIT_POST = "EDIT_POST";
const LOADING = "LOADING"; // is_loading의 상태를 바꿔줄 친구

const setPost = createAction(SET_POST, (post_list, paging) => ({
  post_list,
  paging,
}));
const addPost = createAction(ADD_POST, (post) => ({ post }));
const editPost = createAction(EDIT_POST, (post_id, post) => ({
  post_id,
  post,
})); //포스트아이디가 있어야 뭘 수정할지 알고 수정할 것은 포스트
const loading = createAction(LOADING, (is_loading) => ({ is_loading }));

const initialState = {
  list: [], //왜 post_list가 아닐까? 컴포넌트에서 데이터가져올때 state.post.list로 가져오는게 더 이쁘니까!
  paging: { start: null, next: null, size: 3 },
  is_loading: false,
};

const initialPost = {
  //게시글 하나에 대한 기본정보들
  //   id: 0, // 자동으로 id생성됨 주석!
  //   user_info: {  ////유저 리덕스에 있는 값을 가져온다 주석!
  //     user_name: "mean0",
  //     user_profile: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  //   },
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "",
  comment_cnt: 0,
  insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"),
  //   insert_dt: "2021-02-27 10:00:00", //시간은 지금을 넣어줘야한다 게시글 작성시간
};

const addPostFB = (contents = "") => {
  //게시글 추가
  return function (dispatch, getState, { history }) {
    //getStatesms 스토어에 있는 정보가져온다
    const postDB = firestore.collection("post");
    const _user = getState().user.user; //getState는 store에 있는 정보에 접근할 수 있게 해준다
    const user_info = {
      user_name: _user.user_name,
      user_id: _user.uid,
      user_profile: _user.user_profile, //스토어에 있는 값들 받아온 값으로 교체
    };
    const _post = {
      ...initialPost,
      contents: contents, // 컨텐츠는 받아오는 값
      insert_dt: moment().format("YYYY-MM-DD hh:mm:ss"), //위에 있지만 만들어 지는 시점이 항상바뀌므로 게시글 작성 순간을 받아와야함
    };
    //위에서 받아온 값들 파이어스토어에 저장

    // 잘 만들어졌나 확인해보세요!!
    console.log(_post);

    // getState()로 store의 상태값에 접근할 수 있어요!
    const _image = getState().image.preview;

    // 데이터가 어떤 타입인지 확인해봐요!
    console.log(typeof _image);

    // 파일 이름은 유저의 id와 현재 시간을 밀리초로 넣어줍시다! (혹시라도 중복이 생기지 않도록요!)
    const _upload = storage
      .ref(`images/${user_info.user_id}_${new Date().getTime()}`)
      .putString(_image, "data_url");

    _upload
      .then((snapshot) => {
        snapshot.ref
          .getDownloadURL()
          .then((url) => {
            // url을 확인해봐요!
            console.log(url);
            dispatch(imageActions.uploadImage(url));
            return url;
          })
          .then((url) => {
            // return으로 넘겨준 값이 잘 넘어왔나요? :)
            // 다시 콘솔로 확인해주기!
            console.log(url);

            postDB
              .add({ ...user_info, ..._post, image_url: url })
              .then((doc) => {
                // 아이디를 추가해요!
                let post = { user_info, ..._post, id: doc.id, image_url: url };
                // 이제 리덕스에 넣어봅시다.
                dispatch(addPost(post));
                history.replace("/");
              })
              .catch((err) => {
                window.alert("앗! 포스트 작성에 문제가 있어요!");
                console.log("post 작성 실패!", err);
              });
          });
      })
      .catch((err) => {
        window.alert("앗! 이미지 업로드에 문제가 있어요!");
        console.log(err);
      });
  };
};

const getPostFB = (start = null, size = 3) => {
  return function (dispatch, getState, { history }) {
    //스타트가 값이 있고 넥스트에 값이 없다 다음 목록없음 아래 오직 실행될 필요없다
    let _paging = getState().post.paging;

    if (_paging.state && !_paging.next) {
      return;
    }

    dispatch(loading(true));

    const postDB = firestore.collection("post"); //콜렉션 선택

    let query = postDB.orderBy("insert_dt", "desc"); //날짜데이터 최신순으로 2개씩 나오게 정렬

    if (start) {
      //시작점 정보가 있니?
      query = query.startAt(start); //중복된 게시물 안들어오게!
    }

    //첫번째로 가져오는 거라면 시작점 정보가 없다 안들어간다
    //만약 시작점 정보가 있다면 그 시작점 부터 가져와야한다

    query
      .limit(size + 1)
      .get()
      .then((docs) => {
        let post_list = [];
        //새로운 페이징 정보
        let paging = {
          start: docs.docs[0], //스타트엔 도큐먼트 중에서 제일첫번째 0번째 친구를 가져올거야
          next:
            docs.docs.length === size + 1
              ? docs.docs[docs.docs.length - 1]
              : null,
          //가져온 docs의 길이를 본다 길이가 4개니 ? 그럼 다음 페이지가 있다 > 다음페이지 가기위해 length -1 : 4개보다 못미칠 경우?
          size: size, //넣어주는건 3개~
        };

        docs.forEach((doc) => {
          //여기서 파이어베이스 정보를 가져와서 리덕스에 넣어준다
          let _post = doc.data(); // 파이어스토어에서 가져온거
          // ['comment_cnt', 'contents', ...] 오브젝트 키는 배열로 만들어준다
          let post = Object.keys(_post).reduce(
            (acc, cur) => {
              // reduce는 내장함수로 계속 더해주는 친구? 1,2,3,4 => 10 // cur를 정해주면 그 수에 다 더한다

              if (cur.indexOf("user_") !== -1) {
                // user_ 이 포함이 된다면?
                return {
                  ...acc,
                  user_info: { ...acc.user_info, [cur]: _post[cur] },
                };
              }
              return { ...acc, [cur]: _post[cur] };
            },
            { id: doc.id, user_info: {} }
          ); //아이디가 없으니 기본값으로 넣어주자
          post_list.push(post);
        });
        post_list.pop(); // 4개가 들어왔으니 마지막 친구 pop!
        dispatch(setPost(post_list, paging));
      });

    return;

    postDB.get().then((docs) => {
      let post_list = [];

      docs.forEach((doc) => {
        //여기서 파이어베이스 정보를 가져와서 리덕스에 넣어준다
        let _post = doc.data(); // 파이어스토어에서 가져온거
        // ['comment_cnt', 'contents', ...] 오브젝트 키는 배열로 만들어준다
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            // reduce는 내장함수로 계속 더해주는 친구? 1,2,3,4 => 10 // cur를 정해주면 그 수에 다 더한다

            if (cur.indexOf("user_") !== -1) {
              // user_ 이 포함이 된다면?
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        ); //아이디가 없으니 기본값으로 넣어주자
        post_list.push(post);

        // console.log(doc.id, doc.data());
        //파이어 베이스와 이니셜 포스트 데이터 형식 맞춰주기
        // let _post = {
        //   //파이어베이스의 데이터 긁어오기 그리고 그안의 데이터 아래 post로 이니셜 스테이트와 맞춰주기
        //   id: doc.id,
        //   ...doc.data(),
        // };

        // console.log(_post);

        // let post = {
        //   id: doc.id,

        //   user_info: {
        //     user_name: _post.user_name,
        //     user_profile: _post.user_profile,
        //     user_id: _post.user_id,
        //   },
        //   image_url: _post.image_url,
        //   contents: _post.contents,
        //   comment_cnt: _post.comment_cnt,
        //   insert_dt: _post.insert_dt,
        // };
        //setPost에 넘기려면 정렬형태여야 한다 그래서 post_list라는 빈 배열에 넣어준다
        // post_list.push(post);
      });
      //   console.log(post_list);
      dispatch(setPost(post_list));
    });
  };
};

const editPostFB = (post_id = null, post = {}) => {
  return function (dispatch, getState, { history }) {
    if (!post_id) {
      console.log("게시물 정보가 없어요!");
      return;
    }
    const _image = getState().image.preview;
    const _post_idx = getState().post.list.findIndex((p) => p.id === post_id);
    const _post = getState().post.list[_post_idx];

    console.log(_post);
    const postDB = firestore.collection("post");

    if (_image === _post.image_url) {
      //두개 이미지가 같다면 이미지가아닌 컨텐츠만 수정
      postDB
        .doc(post_id)
        .update(post)
        .then((doc) => {
          dispatch(editPost(post_id, { ...post }));
          history.replace("/");
        });
      return;
    } else {
      const user_id = getState().user.user.uid;
      const _upload = storage
        .ref(`images/${user_id}_${new Date().getTime()}`)
        .putString(_image, "data_url");

      _upload
        .then((snapshot) => {
          snapshot.ref
            .getDownloadURL()
            .then((url) => {
              // url을 확인해봐요!
              console.log(url);

              return url;
            })
            .then((url) => {
              // return으로 넘겨준 값이 잘 넘어왔나요? :)
              // 다시 콘솔로 확인해주기!
              console.log(url);
              postDB
                .doc(post_id)
                .update({ ...post, image_url: url })
                .then((doc) => {
                  dispatch(editPost(post_id, { ...post, image_url: url }));
                  history.replace("/");
                });
            });
        })
        .catch((err) => {
          window.alert("앗! 이미지 업로드에 문제가 있어요!");
          console.log(err);
        });
    }
  };
};

const getOnePostFB = (id) => {
  return function (dispatch, getState, { history }) {
    const postDB = firestore.collection("post"); // 파이어 베이스에서 정보가져오기
    postDB
      .doc(id) // 클릭한 게시물의 정보를 불러온다
      .get()
      .then((doc) => {
        console.log(doc);
        console.log(doc.data());

        let _post = doc.data();
        let post = Object.keys(_post).reduce(
          (acc, cur) => {
            // reduce는 내장함수로 계속 더해주는 친구? 1,2,3,4 => 10 // cur를 정해주면 그 수에 다 더한다

            if (cur.indexOf("user_") !== -1) {
              // user_ 이 포함이 된다면?
              return {
                ...acc,
                user_info: { ...acc.user_info, [cur]: _post[cur] },
              };
            }
            return { ...acc, [cur]: _post[cur] };
          },
          { id: doc.id, user_info: {} }
        );

        dispatch(setPost([post])); //게시글 하나 페이징 정보 기본값 > 페이징기본값은 리듀서에서 조건문으로 없애줌
      });
  };
};

export default handleActions(
  {
    [SET_POST]: (state, action) =>
      produce(state, (draft) => {
        //리스트 갈아끼우기 원래 기본 리스트를 액션으로 넘어온 post_list로 만들어 줄거야!
        //여기서 포스트하나를 가지고온 상태에서 목록을 갔는데 리스트를 가지고온다 그 리스트에 댓글포스트가 하나 포함될 수 있음 >> 리스트 중복값 제거

        draft.list.push(...action.payload.post_list); //리스트에 있는거 푸쉬 대치가 아니다!

        draft.list = draft.list.reduce((acc, cur) => {
          //중복값제거 acc누산된값 cur 현재값 하나하나 돌때 그 당시 값
          if (acc.findIndex((a) => a.id === cur.id) === -1) {
            // id 가 지금 현재 가지고 있는 id랑 같아? -1이 나오면 중복된 값이 없다는것
            return [...acc, cur]; //기존배열 , 중복아닌 현재값
          } else {
            //중복값이라면?
            acc[acc.findIndex((a) => a.id === cur.id)] = cur; //배열은 순서대로 하나하나 돈다 그렇다면 뒤에있는 애가 최신값 최근값으로 덮어씌우자
            return acc; // acc는 누적된값 중복된거 빼고
          }
        }, []);

        if (action.payload.paging) {
          //페이징이 있을때만 페이징을 바꿔주도록 설정
          draft.paging = action.payload.paging; // 무한스크롤!
        }

        draft.is_loading = false; // 불러오면 로딩끝!
      }),

    [ADD_POST]: (state, action) =>
      produce(state, (draft) => {
        draft.list.unshift(action.payload.post); //배열 맨앞에 붙여줘야한다
      }),

    [EDIT_POST]: (state, action) =>
      produce(state, (draft) => {
        let idx = draft.list.findIndex((p) => p.id === action.payload.post_id); //원래 배열의 아이디랑 액션으로 넘어온 아이디가 같다면
        draft.list[idx] = { ...draft.list[idx], ...action.payload.post };
      }),
    [LOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.is_loading = action.payload.is_loading;
      }),
  },
  initialState
);

const actionCreators = {
  setPost,
  addPost,
  getPostFB,
  addPostFB,
  editPostFB,
  editPost,
  getOnePostFB,
};

export { actionCreators };
