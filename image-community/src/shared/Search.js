import React from "react";
import _ from "lodash";

const Search = () => {
  const debounce = _.debounce((e) => {
    console.log(e.target.value);
  }, 1000); //일정시간동안 기다렸다 시작한다

  const throttle = _.throttle((e) => {
    console.log(e.target.value);
  }, 1000);

  const onChange = (e) => {
    console.log(e.target.value);
  };

  return (
    <div>
      <input type="text" onChange={throttle} />
    </div>
  );
};

export default Search;
