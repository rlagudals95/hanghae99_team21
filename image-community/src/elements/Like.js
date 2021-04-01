import React from "react";
import styled from "styled-components";
import { actionCreators as postActions } from "../redux/modules/like";
import { useDispatch, useSelector } from "react-redux";

const Like = (props) => {
  const { is_flex, _onClick, children } = props;
  //   const [like, setLike] = React.useState(0);

  // const likes = useSelector((state) => state.like.like);

  //   console.log(likes);

  const styles = {
    is_flex: is_flex,
  };

  return (
    <React.Fragment>
      <LikeBtn {...styles} onClick={_onClick}>
        {children}
      </LikeBtn>
    </React.Fragment>
  );
};

const LikeBtn = styled.div`
  width: 130px;
  height: 50px;
  ${(props) => (props.is_flex ? `display:flex` : "")};
  position: absolute;
  right: 0px;
  display: flex;
  font-weight: bold;
  font-size: 18px;
`;

export default Like;
