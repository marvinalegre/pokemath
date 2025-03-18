const ProgressBar = ({ current, max }) => {
  const percentage = (current / max) * 100; // Calculate the percentage (still needed for width adjustment)

  return (
    <div className="mx-auto md:mb-40 text-center">
      <div className="w-full h-6 bg-gray-400 rounded-full overflow-hidden mb-2">
        <div
          className="h-full bg-black transition-all duration-300"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-700">
        {current} / {max}
      </span>
    </div>
  );
};

export default ProgressBar;
