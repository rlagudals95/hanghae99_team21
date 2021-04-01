import React from "react";
import { Button } from "../elements";
import { storage } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { actionCreators as imageActions } from "../redux/modules/image";

const Upload = (props) => {
  const fileInput = React.useRef(); //인풋값 가져오기
  const dispatch = useDispatch();
  const is_uploading = useSelector((state) => state.image.uploading);

  const selectFile = (e) => {
    // console.log(e);
    // console.log(e.target);
    // console.log(e.target.files[0]);

    // console.log(fileInput.current.files[0]);

    //파일리더로 파일선택시 프리뷰 보여주기
    const reader = new FileReader();
    const file = fileInput.current.files[0];

    reader.readAsDataURL(file); // 파일내용 읽어오기

    //읽기가 끝났을 때 이벤트를 받아와야 읽어온 결과값을 받아올 수 있다
    reader.onloadend = () => {
      //프리뷰를 넣어주기
      dispatch(imageActions.setPreview(reader.result)); //리더의 리설트는 이미지의 데이터
      //읽기가 끝났을때 실행> 내장함수onloadend
      //   console.log(reader.result);
    };
  };

  const uploadFB = () => {
    let image = fileInput.current.files[0]; //인풋값 가져오기 text형식은 value지만 file형식은 files
    const _upload = storage.ref(`images/${image.name}`).put(image);

    dispatch(imageActions.uploadImage(image));
    // _upload.then((snapshot) => {
    //   //업로드 했으면 게시글 목록에서 이미지를 보여줘야하는데 이미지 링크를 받아와야한다!
    //   console.log(snapshot);
    //   snapshot.ref.getDownloadURL().then((url) => {
    //     console.log(url);
    //   });
    // });
  };

  return (
    <React.Fragment>
      <input
        type="file"
        onChange={selectFile}
        ref={fileInput}
        disabled={is_uploading} //업로딩 중엔 파일선택 버튼 누르기 불가!
      />
      <Button _onClick={uploadFB}>업로드하기</Button>
    </React.Fragment>
  );
};

export default Upload;
