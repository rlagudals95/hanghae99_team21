import NotificationsIcon from "@material-ui/icons/Notifications";
import React from "react";
import { Badge } from "@material-ui/core";
import { realtime } from "../shared/firebase";
import { useSelector } from "react-redux";

const NotiBadge = (props) => {
  const [is_read, setIsRead] = React.useState(true);
  const user_id = useSelector((state) => state.user.user.uid); // 유저 id 가져와서 리얼타임 ref에 넣자
  //알림버튼을 클릭하면 알림리스트로 가고 알림이 꺼져야한다 그 역활을 해줄 함수!
  const notiCheck = () => {
    //노티 체크를 함면 노티를 꺼주면 된다~
    const notiDB = realtime.ref(`noti/${user_id}`);
    notiDB.update({ read: true });
    props._onClick();
  };

  React.useEffect(() => {
    //파이어 스토어에선 collection으로 리얼타임은 ref로 가져온다
    const notiDB = realtime.ref(`noti/${user_id}`);

    notiDB.on("value", (snapshot) => {
      //값이 바뀔 때 뭐를 동작했으면 좋겠어?
      //console.log(snapshot.val());//구독이된다 read: false가 찍힘
      setIsRead(snapshot.val().read);
    }); //구독하는 방법
    return () => notiDB.off(); // 구독종료
  }, []);

  return (
    <React.Fragment>
      <Badge
        color="secondary"
        variant="dot"
        invisible={is_read}
        onClick={notiCheck}
      >
        <NotificationsIcon />
      </Badge>
    </React.Fragment>
  );
};

NotiBadge.defaultProps = {
  _onClick: () => {},
};

export default NotiBadge;
