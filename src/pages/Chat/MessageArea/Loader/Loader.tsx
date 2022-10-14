export default function Loader({ loading }: any) {
  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        top: 0,
        backgroundColor: "rgb(207, 185, 151)",
        opacity: 0.8,
        visibility: loading ? "visible" : "hidden",
        justifyContent: "center",
      }}
      className="grid"
    >
      <p className="font-loader">LOADING</p>
    </div>
  );
}
