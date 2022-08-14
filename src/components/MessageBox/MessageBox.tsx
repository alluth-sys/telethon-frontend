import "./MessageBox.css";

export default function MessageBox({ message }) {
  return (
    <div className="mb-5 mx-10 justify-end">
      <div
        style={{ whiteSpace: "pre-wrap", overflowWrap: "break-word" }}
        className="bg-black w-fit max-w-sm h-fit rounded-xl"
      >
        <text style={{ color: "white" }} className="font-loader">
          {message}
        </text>
      </div>
    </div>
  );
}
