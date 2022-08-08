import { useAppSelector } from "@/app/hooks";
import { RootState } from "@/app/store";

export default function Settings() {
  const UserData = useAppSelector((state: RootState) => state.user.data);

  return (
    <div className="w-full">
      <div>{`Name: ${UserData?.first_name} ${UserData?.last_name}`}</div>
      <hr className="sidebar-hr" />
      <div>{`Phone: ${UserData?.phone}`}</div>
      <hr className="sidebar-hr" />
      <div>{`Username: ${UserData?.username}`}</div>
    </div>
  );
}
