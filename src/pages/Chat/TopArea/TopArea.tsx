import Description from "./Description/Description";
import Pinned from "./Pinned/Pinned";

type TopAreaProp = { collapsed: boolean; setCollapse: Function; focus: number };
export default function TopArea({
  collapsed,
  setCollapse,
  focus,
}: TopAreaProp) {
  return (
    <div
      style={{
        paddingBottom: "5px",
        display: "flex",
        alignItems: "center",
        width: "100%",
        height: "8vh",
        backgroundColor: "white",
      }}
    >
      {focus != 0 && (
        <>
          <div style={{ width: "50%", display: "flex" }}>
            <Description
              collapsed={collapsed}
              setCollapse={setCollapse}
              focus={focus}
            />
          </div>
          <div style={{ width: "50%", display: "flex" }}>
            <Pinned focus={focus} />
          </div>
        </>
      )}
    </div>
  );
}
