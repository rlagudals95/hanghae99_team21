import { createAction, handleActions } from "redux-actions";
import produce from "immer";

import { storage } from "../../shared/firebase";

const UPLOADING = "UPLOADING";
const UPLOAD_IMAGE = "UPLOAD_IMAGE";
const SET_PREVIEW = "SET_PREVIEW";

const uploading = createAction(UPLOADING, (uploading) => ({ uploading }));
const uploadImage = createAction(UPLOAD_IMAGE, (image_url) => ({ image_url })); //업로드된 이미지의 url을 저장하는 친구
const setPreview = createAction(SET_PREVIEW, (preview) => ({ preview })); //프리뷰 이미지가 들어온다 프리뷰가 뭐지.,.

const initialState = {
  image_url: "",
  uploading: false,
  preview: null,
};

const uploadImageFB = (image) => {
  //이미지 파일을 인자로 받기
  return function (dispatch, getState, { history }) {
    dispatch(uploading(true)); // 업로딩 시작전 업로딩을 true로 바꿔준다
    const _upload = storage.ref(`images/${image.name}`).put(image);

    _upload.then((snapshot) => {
      //업로드 했으면 게시글 목록에서 이미지를 보여줘야하는데 이미지 링크를 받아와야한다!
      console.log(snapshot);

      snapshot.ref.getDownloadURL().then((url) => {
        dispatch(uploadImage(url)); //결국 디스패치란 받은값 url을 넘기고 그것을 액션 리듀서로 변환시킨값을 다시 리듀서 state로 새로 갈아끼워주는? 작업
        console.log(url);
      });
    });
  };
};

export default handleActions(
  //이미지를 받아오면 이동작을 수행!
  {
    [UPLOAD_IMAGE]: (state, action) =>
      produce(state, (draft) => {
        draft.image_url = action.payload.image_url;
        draft.uploading = false; // 업로딩은 한번해주면 끝나야한다
      }),
    [UPLOADING]: (state, action) =>
      produce(state, (draft) => {
        draft.uploading = action.payload.uploading;
      }),

    [SET_PREVIEW]: (state, action) =>
      produce(state, (draft) => {
        draft.preview = action.payload.preview; //리덕스 state의 프리뷰는 액션으로 넘어온 프리뷰가 된다
      }),
  },
  initialState
);

const actionCreators = {
  uploadImageFB,
  setPreview,
  uploadImage, //여기는 액션 타입밑에 액션 크리에이터를 써주는데 리듀서가 아니다!

  //업로딩은 바깥에서 조절을 하지않고 모듈안에서만 호출함
};

export { actionCreators };
