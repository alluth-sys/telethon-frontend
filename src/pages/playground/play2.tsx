import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { setDummyTestingp } from "@/states/play/playSlice";
import Button from "@material-ui/core/Button";

// import { setDummyTesting } from "@/states/user/userSlice";

import { isEqual } from "loadsh";
import { useDispatch, useSelector } from "react-redux";

const Pluto = () => {
  const dummy_testing = useSelector((state) => state.play.dummy_testing);
  return <p>{dummy_testing}</p>;
};

export default function Play2() {
  const dispatch = useDispatch();

  const dummy_dict = { "1": 1, "2": 2, "3": 3, "4": 4 };
  const dummy_arr = ["0", "1", "2"];

  // console.log(bbdict)
  return (
    <div className="grid">
      bbbbbbbbbbb
      <div className="flex">
        {dummy_arr.map(([key, index]) => {
          console.log(key);
          return <a>{key} , </a>;
        })}
      </div>
      <Pluto />
      <Button
        onClick={() => {
          console.log("click");
        }}
      >
        setcount
      </Button>
      <Button onClick={() => {}}>setcount and const</Button>
      <Button
        onClick={() => {
          for (let i = 0; i < 10; i++) {
            setTimeout(() => {
              dispatch(setDummyTestingp());
            }, i * 1000);
          }
        }}
      >
        set timming
      </Button>
    </div>
  );
}
