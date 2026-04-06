import { useState } from "react";

export default function NumericInput({ question, onAnswer }) {
  const [value, setValue] = useState("");

  function handleSubmit() {
    if (value.trim() === "") return;
    onAnswer(value.trim());
    setValue("");
  }

  return (
    <div>
      <p>{question.question_text}</p>

      <input
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSubmit();
        }}
      />
      <button type="button" onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}
