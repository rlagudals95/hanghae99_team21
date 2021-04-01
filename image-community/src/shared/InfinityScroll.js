import React from "react";
import _ from "lodash";
import Spinner from "../elements/Spinner";

const InfinityScroll = (props) => {
  const { children, callNext, is_next, loading } = props;
  const _handleScroll = _.throttle(() => {
    if (loading) {
      return;
    }

    const { innerHeight } = window;
    const { scrollHeight } = document.body;
    const scrollTop =
      (document.documentElement && document.documentElement.scrollTop) ||
      document.body.scrollTop;
    // 도큐먼트안에 도큐먼트 엘리먼드가 있니? 있으면 스크롤탑 가져와! 아니면 뒤처럼 가져와!

    if (scrollHeight - innerHeight - scrollTop < 200) {
      callNext();
    }
  }, 300);

  const handleScroll = React.useCallback(_handleScroll, [loading]); //메모이 제이션 여기있는 로딩값은 고정되어 있지만 배열에 넘겨주면 된다

  React.useEffect(() => {
    // 클린업 > 이함수형 컴포넌트가 화면에서 사라질때 리턴에 있는 구문 실행!
    if (loading) {
      return;
    }

    if (is_next) {
      window.addEventListener("scroll", handleScroll);
    } else {
      window.removeEventListener("scroll", handleScroll);
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [is_next, loading]); //is_next를 받아와서

  return (
    <React.Fragment>
      {children}
      {is_next && <Spinner />}
    </React.Fragment>
  );
};

InfinityScroll.defaultProps = {
  chidren: null,
  callNext: () => {},
  is_next: false,
  loading: false,
};

export default InfinityScroll;
