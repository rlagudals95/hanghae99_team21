import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router";

import { Grid } from "./Styles";
import Main from "./Main";
import Write from "./Write";
import { firestore } from "./firebase"; // 파이어베이스

//실질적으로 보여주는 페이지 여기서 화면을 띄워준다
//메인화면을 Main.js로 설정해주고 스케줄을 추가해주는 곳은 Write로 해준다

function App() {
  return (
    <Grid is_root bg="#ddd">
      <BrowserRouter>
        <Route path="/" exact component={Main} />
        <Route path="/write" exact component={Write} />
      </BrowserRouter>
    </Grid>
  );
}

export default App;
