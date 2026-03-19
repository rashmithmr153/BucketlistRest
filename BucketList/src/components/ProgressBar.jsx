function ProgressBar({ progressPercent }) {
  return (
    <div className="progressContainer">
      <div
        className="progressBar"
        style={{ width: progressPercent + "%" }}
      ></div>
    </div>
  );
}

export default ProgressBar;