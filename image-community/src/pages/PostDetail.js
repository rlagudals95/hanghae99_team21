import React from "react";
import Post from "../components/Post";
import CommentList from "../components/CommentList";
import CommentWrite from "../components/CommentWrite";
import { useSelector, useDispatch } from "react-redux";
import { actionCreators as postActions } from "../redux/modules/post";

import Permit from "../shared/Permit";

const PostDetail = (props) => {
  const dispatch = useDispatch();
  const id = props.match.params.id;

  const user_info = useSelector((state) => state.user.user);
  const post_list = useSelector((store) => store.post.list);
  const post_idx = post_list.findIndex((p) => p.id === id); //post_list안의 값들중 id 값을 돌려서 그중에 params 즉 접속한 아이디랑 같은거
  const post = post_list[post_idx]; //일치하는 idx값을 가져오면  자연스럽게 일치하게 되겠죠??

  React.useEffect(() => {
    if (post) {
      return;
    }

    dispatch(postActions.getOnePostFB(id));
  }, []);

  return (
    <React.Fragment>
      {post && (
        <Post {...post} is_me={post.user_info.user_id === user_info?.uid} /> //옵셔널 체이닝 user_info?.uid 유저인포가 있는 값이야? 있으면 uid 가지고와~ 없으면 뒤에것 읽지마~
      )}
      <Permit>
        <CommentWrite post_id={id} />
      </Permit>
      <CommentList post_id={id} />
    </React.Fragment>
  );
};

export default PostDetail;
