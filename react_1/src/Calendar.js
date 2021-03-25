import React, { useEffect } from "react";
import { Grid, Button, Text } from "./Styles";
import moment from "moment";
import { firestore } from "./firebase";
// 임포트 해오기!

import { useSelector, useDispatch } from "react-redux";
import { changeToday } from "./redux/modules/todo";
import { updateTodo, deleteTodon, loadTodoFB } from "./redux/modules/todo";
/////////////////////
const todo = firestore.collection("todo");
// 여기 연결은 잘됐는데 어떻게 리덕스와 파이어 베이스를 연결하는지 ㅠ...
// 파이어 베이스 추가
// todo.add({ title: "캘리배우기", completed: false }).then((docRef) => {
//   console.log(docRef);
//   console.log(docRef.id);
// });
// 수정
// todo.doc("2021-03-01").update({ contents: "강변 걷기" });
// 삭제
// todo
//   .doc("242KdLTiLRwzZ32Ce33S")
//   .delete()
//   .then((docRef) => {
//     console.log("지움!");
//   });
////////////////////

/**
 * 달력 만들기 순서
 *  - 이번달이 몇 주가 필요한 지 "주"수 구하기
 *  - 주수만큼 map 돌리기
 *  - map 돌리면서 안에 날짜 넣어주기!
 *  - +) 일정도 같이 넣어주면 good!
 */
const Calendar = (props) => {
  // todo.js에서 가져온 정보
  const dispatch = useDispatch();

  const { show_completed, _showPopup, _setSeletedTodo } = props;

  const today = useSelector((state) => state.todo.today);
  const todo_list = useSelector((state) => state.todo.todo_list);
  // 넘어온 데이터를 확인하자!
  // console.log(todo_list);

  // 이번달의 시작 주, 끝 주를 구합니다.
  const start_week = moment(today).startOf("month").week();
  const end_week = moment(today).endOf("month").week();

  // 달력에 넣을 주수 배열 길이를 구합니다. (*주의* +1 해야함(7~11주는 총 몇 주인지 생각해보세요! :)!))
  // 마지막 주가 다음 해 1주일 수 있어요. (시작 주보다 끝 주가 숫자가 작을 수 있다!)
  const week_num =
    (start_week > end_week ? 53 - start_week : end_week - start_week) + 1;

  // 주수 길이의 배열을 만들고,
  const _week_arr = Array.from({ length: week_num }, (v, i) => start_week + i);

  // 주마다 7개씩 날짜를 넣어주면 끝!
  const week_arr = _week_arr.map((week_index) => {
    return (
      <Grid
        key={`${moment(today).format("MM")}_week_${week_index}`}
        margin="4px auto"
        flex_direction="row"
      >
        {/*한 주는 7일이니, 주에 7개씩 날짜 칸을 넣어줍니다. */}
        {Array.from({ length: 7 }, (v, i) => i).map((day_index) => {
          let _day = today
            .clone()
            .startOf("year")
            .week(week_index)
            .startOf("week")
            .add(day_index, "day");

          const is_today =
            moment().format("YYYY-MM-DD") === _day.format("YYYY-MM-DD");

          // todo_list(Main.js에서 props로 건네줬어요!)에 해당 일자 일정이 들어가 있나 보고, 추가해줍시다.
          const list_index = Object.keys(todo_list).indexOf(
            _day.format("YYYY-MM-DD")
          );

          // 주석풀고 데이터 확인해보기! :)!
          // console.log(list_index);
          // console.log(todo_list[_day.format("YYYY-MM-DD")]);

          // todo_list에 해당 일 일정이 있으면 일정을 list에 넣어주자! (없으면 null이나 빈배열로! 일단 빈배열로 해봅시다! :))
          const _list =
            list_index !== -1 ? todo_list[_day.format("YYYY-MM-DD")] : [];

          const list = _list.map((_l, idx) => {
            // 데이터 확인하기!
            // console.log(_l);
            // 일정을 뿌려줘요!
            // 앗, 뿌려주기 전에 잠깐!! 만약 지금 보여줘야하는 데이터가 완료된 것만이라면?
            //  -> 완료되지 않은 경우에는 null을 리턴해주면 되겠죠!
            if (props.show_completed && !_l.completed) {
              return null;
            }

            // 쨔잔! 위의 if문에서 return 되지 않은 경우에만 이 밑으로 내려올 수 있으니, 여기서부턴 완료된 일정입니다 :)
            // 혹은, 전체일정보기 모드(props로 받아온 show_completed가 false인 경우)던가요!
            return (
              <Grid
                hover
                bg={`${_l.completed ? "yellow" : "aliceblue"}`}
                height="auto"
                margin="1px 0px"
                key={`${_l.datetime}_${_l.todo_id}`}
                onClick={() => {
                  console.log("here");

                  props._showPopup(true);
                  // 여기에서 내가 선택한 일정 정보 전체를 넘겨줄거예요. (아이디만 넘기고, Popup 컴포넌트가 직접 데이터를 찾게 하면 더더더 좋아요!)
                  props._setSeletedTodo(_l);
                }}
              >
                <Text type="label">{_l.contents}</Text>
              </Grid>
            );
          });
          return (
            <Grid
              margin="0px 2px"
              key={`${moment(today).format(
                "MM"
              )}_week_${week_index}_day_${day_index}`}
              flex_direction="column"
              bg={is_today ? "#ffcece" : "#ffffff"}
            >
              {_day.format("MM") === moment(today).format("MM") && (
                <Text type="label">{_day.format("DD")}일</Text>
              )}

              {
                // 일정도 보여줍시다! :) null이 아닐때만 보여줘요!
                _list && list
              }
            </Grid>
          );
        })}
      </Grid>
    );
  });

  // 요일이 나올 배열도 만들어주기!
  const dow = ["일", "월", "화", "수", "목", "금", "토"].map((_d) => {
    return (
      <Grid
        margin="4px 2px"
        width="100%"
        flex_direction="column"
        bg={"#ffffff"}
        height="auto"
        key={`${moment(today).format("MM")}_week_${_d}`}
      >
        <Text bold type="label">
          {_d}
        </Text>
      </Grid>
    );
  });

  return (
    <Grid flex_direction="column" width="80vw" height="80vh" margin="auto">
      <Grid justify_contents="space-between">
        <Button
          onClick={() => {
            // 기준일을 한달 전으로 돌려요!
            dispatch(changeToday(moment(today).clone().subtract(1, "month")));
          }}
        >
          이전
        </Button>
        <Text type="title">{moment(today).format("MM")}월</Text>
        <Button
          onClick={() => {
            // 기준일을 한달 후로 돌려요!
            dispatch(changeToday(moment(today).clone().add(1, "month")));
          }}
        >
          이후
        </Button>
      </Grid>
      <Grid height="auto">{dow}</Grid>
      {week_arr}
    </Grid>
  );
};

// 기본적으로 꼭 필요한 props를 미리 정해줍시다!
Calendar.defaultProps = {
  _showPopup: () => {},
  _setSeletedTodo: () => {},
};

export default Calendar;
