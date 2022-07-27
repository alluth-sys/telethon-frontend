import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";

export default function Home() {
  const data = useAppSelector((state: RootState) => state.user.data);
  console.log(data);
  return <div className="w-full">Home</div>;
}
