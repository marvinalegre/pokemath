import { Form } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export default function NumericInput({
  question,
  secondsLeft,
}: {
  question: { question_text: string };
  secondsLeft: number;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6 text-center">
        {secondsLeft > 0 && (
          <p className="text-sm font-medium text-destructive animate-in fade-in zoom-in duration-200">
            Wrong answer. Try again in {secondsLeft}s...
          </p>
        )}
        {/* Question Text */}
        <h2 className="text-xl font-semibold tracking-tight">
          {question.question_text}
        </h2>

        <Form method="post" className="space-y-4">
          <div className="space-y-2">
            <Input
              name="answer"
              type="number"
              className="h-12 text-center text-lg"
              autoFocus
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full font-semibold"
            disabled={secondsLeft > 0}
          >
            Submit
          </Button>
        </Form>
      </div>
    </div>
  );
}
