import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";
import { Button } from "@mui/material";

export default function Home() {
  const ws = useAppSelector((state: RootState) => state.socket.websocket);

  return (
    <div className="w-full">
      <div>home</div>
      <Button
        onClick={() => {
          ws?.emit("test");
        }}
      >
        test
      </Button>
    </div>
  );
}
