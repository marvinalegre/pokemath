export function onRequest(context) {
  return Response.json({ message: "hello from cf pages" });
}
