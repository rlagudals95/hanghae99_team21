import React from "react";
import { Button, Grid, Image, Text } from "../elements";
import { history } from "../redux/configureStore";
import Like from "../elements/Like";

import { useDispatch, useSelector } from "react-redux";

const Post = (props) => {
  const dispatch = useDispatch();
  // dispatch(likeActions.getLikeFB());
  // const like = useSelector((state) => state.like.like);

  //  const likeUp = dispatch(postActions.addLike(like));

  // const likes = useSelector((state) => state.like.like);

  return (
    <React.Fragment>
      <Grid>
        <Grid is_flex padding="16px">
          <Grid is_flex width="auto">
            <Image shape="circle" src={props.src} />

            <Text bold>{props.user_info.user_name}</Text>
          </Grid>
          <Grid is_flex width="auto">
            <Text>{props.insert_dt}</Text>
            {/* props로 is_me를 받아온 경우에만 버튼을 보여줘! */}
            {props.is_me && (
              <Button
                width="auto"
                padding="4px"
                margin="4px"
                _onClick={() => {
                  history.push(`/write/${props.id}`);
                }}
              >
                수정
              </Button>
            )}
          </Grid>
        </Grid>
        <Grid padding="16px">
          <Text>{props.contents}</Text>
        </Grid>
        <Grid>
          <Image shape="rectangle" src={props.image_url} />
          {/* src를 image_url로 바꿔줘야 이미지가 잘바뀜 */}
        </Grid>
        <Grid padding="16px">
          <Like>좋아요👍 : 0</Like>
          <Text margin="0px" bold>
            댓글 {props.comment_cnt}개
          </Text>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

Post.defaultProps = {
  user_info: {
    user_name: "mean0",
    user_profile: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  },
  image_url: "https://mean0images.s3.ap-northeast-2.amazonaws.com/4.jpeg",
  contents: "고양이네요!",
  comment_cnt: 10,
  insert_dt: "2021-02-27 10:00:00",
  is_me: false,
};

export default Post;
