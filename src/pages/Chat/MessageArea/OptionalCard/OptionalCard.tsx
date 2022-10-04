import { useAppSelector } from "@/app/hooks";

export default function OptionalCard() {
  const contextMenuAnchorPoint = useAppSelector(
    (state) => state.user.contextMenuAnchorPoint
  );

  const showContextMenu = useAppSelector((state) => state.user.showContextMenu);

  if (showContextMenu) {
    console.log("ACP", contextMenuAnchorPoint);
    return (
      <ul
        style={{
          position: "absolute",
          top: contextMenuAnchorPoint.y,
          left: contextMenuAnchorPoint.x,
          backgroundColor: "#d0e3e2",
          minWidth: "200px",
          zIndex: 3,
        }}
        id="test"
      >
        <li>Reply</li>
        <li>Copy</li>
        <li>Forward</li>
        <li>Select</li>
        <li>Pin</li>
        <li>Delete</li>
      </ul>
    );
  } else {
    return <></>;
  }
}
