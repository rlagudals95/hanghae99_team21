import React from "react";
import moment from "moment";

import { useSelector, useDispatch } from "react-redux";
import { firestore } from "./firebase"; // 파이어베이스

import Calendar from "./Calendar";
import Popup from "./Popup";

import { Button } from "./Styles";
//메인화면이다 캘린더가 있고

const _todo_list = {
  //리덕스에 이니셜스테이트로 정보가 있으니 없어도 될듯하다
  // "2021-03-01": [
  //   {
  //     todo_id: 11,
  //     datetime: "2021-03-01 10:10:00",
  //     contents: "산책가기1",
  //     completed: false,
  //   },
  //   {
  //     todo_id: 155555,
  //     datetime: "2021-03-01 10:15:00",
  //     contents: "산책가기2",
  //     completed: true,
  //   },
  // ],
  // "2021-03-21": [
  //   {
  //     todo_id: 8,
  //     datetime: "2021-03-21 10:00:00",
  //     contents: "산책가기3",
  //     completed: false,
  //   },
  //   {
  //     todo_id: 4,
  //     datetime: "2021-03-21 10:10:00",
  //     contents: "산책가기4",
  //     completed: false,
  //   },
  // ],
};

const Main = (props) => {
  // is_open 사용해서 팝업을 보였다가 안보이게 해줄거예요 :)
  const [is_open, setIsOpen] = React.useState(false); //이즈오픈, 뒤엔 이즈오픈을 변경시켜주는 것
  // 이 값에 선택한 일정 정보를 넣어줄거예요.
  // 없을 때는 null로!
  // 앗, 여기서 잠깐! 팝업을 닫을 때 이 값을 어떻게 해줘야할까요?
  // -> 그렇습니다 :) null로 다시 바꿔줘야죠!
  const [selected_todo, setSeletedTodo] = React.useState(null);

  //   완료된 일정만 보기 토글이에요!
  //   이 값은 캘린더에도 전달해줄거예요.
  //   그럼 캘린더가 이 값을 보고 완료된 일정만 보여주자! 앗 아니야, 전체를 보여주자! 결정할 수 있겠죠? :)
  const [show_completed, setShowCompleted] = React.useState(false);

  return (
    //캘린더에 props로 정보를준다
    <React.Fragment>
      <Calendar
        show_completed={show_completed}
        _showPopup={setIsOpen} //일단 기본값이 false니까 팝업이 렌더링 되지않는다
        _setSeletedTodo={setSeletedTodo} //기본값은 null 선택한게 없으니까
      />
      {is_open && ( //이즈 오픈이 트루일때 팝업을 렌더링
        <Popup
          type="todo_detail"
          selected_todo={selected_todo}
          _showPopup={setIsOpen}
        />
      )}
      <Button
        float
        right="20px"
        bottom="20px"
        onClick={() => {
          // 버튼을 눌렀을 때 페이지 이동이 잘되나 한 번 봅시다!
          props.history.push("/write");
        }}
      >
        추가하기
      </Button>
      <Button
        float
        right="20px"
        bottom="60px"
        onClick={() => {
          //   !를 변수 앞에 붙여주면 무슨 뜻일까요? :) 찾아보기! //반대라는 뜻?
          setShowCompleted(!show_completed); //즉 쇼컴플리트 기본값이 false인데 //반대면 true일때?
        }}
      >
        {show_completed ? "전체 일정 보기" : "완료된 일정만 보기"}
        {/* 쇼컴플리티드가 true일때 전체일정보기 false면 완료된 일정만 보기 */}
      </Button>
    </React.Fragment>
  );
};

export default Main;
