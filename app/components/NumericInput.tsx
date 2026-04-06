import { Form } from "react-router";

export default function NumericInput({
  question,
  message,
}: {
  question: { question_text: string };
  message: undefined | string;
}) {
  return (
    <div>
      {message && <p className="text-red-500">{message}</p>}
      <p>{question.question_text}</p>

      <Form method="post">
        <input name="answer" />
        <button type="submit">Submit</button>
      </Form>
    </div>
  );
}
