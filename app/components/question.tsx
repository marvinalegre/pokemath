export default function Question({ questionCode, questionParameters }) {
  const centers = [];
  while (centers.length !== parseInt(questionParameters)) {
    const center = [
      Math.floor(Math.random() * (230 - 10 + 1)) + 10,
      Math.floor(Math.random() * (230 - 10 + 1)) + 10,
    ];

    let count = 0;
    for (let c of centers) {
      if (distance(c, center) >= 20) count++;
    }
    if (count === centers.length) centers.push(center);
  }

  return (
    <>
      {questionCode === "c" && (
        <>
          <p className="text-center text-xl mb-4">
            {questionParameters === "1"
              ? "How many dot is in the box?"
              : "How many dots are in the box?"}
          </p>
          <svg className="h-60 w-60 border border-black m-auto">
            {centers.map((c, i) => (
              <circle key={i} r="10" cx={c[0]} cy={c[1]} fill="black" />
            ))}
          </svg>
        </>
      )}
    </>
  );
}

function distance(pt1, pt2) {
  // Calculate the difference in x and y coordinates
  const dx = pt2[0] - pt1[0]; // x2 - x1
  const dy = pt2[1] - pt1[1]; // y2 - y1

  // Calculate the distance using the Pythagorean theorem
  return Math.sqrt(dx * dx + dy * dy);
}
