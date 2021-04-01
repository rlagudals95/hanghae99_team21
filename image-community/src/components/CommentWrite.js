import React from "react";

import { Grid, Input, Button } from "../elements";
import { actionCreators as commentActions } from "../redux/modules/comment";
import { useDispatch, useSelector } from "react-redux";

const CommentWrite = (props) => {
  const dispatch = useDispatch();
  const [comment_text, setCommentText] = React.useState();

  const { post_id } = props;
  const onChange = (e) => {
    setCommentText(e.target.value); // 인풋밸류 가져오기
  };
  // 파이어스토어 요청과 리덕스 추가할 수 있는 함수

  const write = () => {
    console.log(comment_text);
    if (comment_text === "") {
      window.alert("댓글을 입력해주세요!");
      return;
    }
    dispatch(commentActions.addCommentFB(post_id, comment_text));
    setCommentText(""); //댓글작성 후 날아감
  };

  return (
    <React.Fragment>
      <Grid padding="16px" is_flex>
        <Input
          placeholder="댓글 내용을 입력해주세요 :)"
          _onChange={onChange}
          value={comment_text}
        />
        <Button width="50px" margin="0px 2px 0px 2px" _onClick={write}>
          작성
        </Button>
      </Grid>
    </React.Fragment>
  );
};

export default CommentWrite;
