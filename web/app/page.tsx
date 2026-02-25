import Navbar from "@/components/navbar";
import Message from "./message";
import Test from "@/components/test";

export const dynamic = "force-dynamic";

export default async function Page() {
  const res = await fetch("http://pokemath-api:3000");
  const { message } = await res.json();

  return (
    <>
      <Navbar />
      <p>message from nest (via node rsc server): {message}</p>
      <Message />
      <Test />
    </>
  );
}
