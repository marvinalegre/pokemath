import { ComponentExample } from "@/components/component-example";
import Message from "./message";
import Test from "@/components/test";

export default async function Page() {
  const res = await fetch("http://pokemath-api:3000");
  const { message } = await res.json();

  return (
    <>
      <p>message from nest (via node rsc server): {message}</p>
      <Message />
      <Test />
      <ComponentExample />
    </>
  );
}
