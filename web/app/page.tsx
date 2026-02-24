import { ComponentExample } from "@/components/component-example";
import Message from "./message";

export default async function Page() {
  const res = await fetch("http://pokemath-api:3000");
  const { message } = await res.json();

  return (
    <>
      <p>message from nest (via node rsc server): {message}</p>
      <Message />
      <ComponentExample />
    </>
  );
}
