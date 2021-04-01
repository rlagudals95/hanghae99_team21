import React from "react";
import { Grid, Text, Button, Image } from "../elements";
import Card from "../components/Card";
import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const Notification = (props) => {
  const user = useSelector((state) => state.user.user);
  const [noti, setNoti] = React.useState([]);

  React.useEffect(() => {
    if (!user) {
      return;
    }

    const notiDB = realtime.ref(`noti/${user.uid}/list`);
    // 내림차순으로 가장 늦게온 알람이 가장위로
    const _noti = notiDB.orderByChild("insert_dt"); //일단 데이터 를 가져오고 자바스크립트로 역순으로정렬하자

    _noti.once("value", (snapshot) => {
      if (snapshot.exists()) {
        let _data = snapshot.val(); // 스냅샷이 있으면 스냅샷 데이터를 가지고 와라

        console.log(_data); // 리얼타임의 데이터가 리스트로 나온다

        // [1,2,3,4,5].reverse >> [5,4,3,2,1]
        let _noti_list = Object.keys(_data)
          .reverse()
          .map((s) => {
            return _data[s];
          });

        console.log(_noti_list);
        setNoti(_noti_list);
      }
    });
  }, [user]);

  // let noti = [
  //   { user_name: "aaaaa", post_id: "post1", image_url: "" },
  //   { user_name: "aaaaa", post_id: "post2", image_url: "" },
  //   { user_name: "aaaaa", post_id: "post3", image_url: "" },
  //   { user_name: "aaaaa", post_id: "post4", image_url: "" },
  //   { user_name: "aaaaa", post_id: "post5", image_url: "" },
  //   { user_name: "aaaaa", post_id: "post6", image_url: "" },
  // ];

  return (
    <React.Fragment>
      <Grid padding="16px" bg="#eff6ff">
        {noti.map((n, idx) => {
          //쉽게말해 noti 어레이 length 만큼 카드를 보여준다!
          return <Card key={`noti_${idx}}`} {...n}></Card>; //n의 정보들을 props로 넘겨준다
        })}
      </Grid>
    </React.Fragment>
  );
};

export default Notification;
