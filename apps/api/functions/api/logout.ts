export const onRequestGet: PagesFunction = async (context) => {
  // TODO: handle failed logout
  const response = new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `token=; path=/; secure; HttpOnly; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    },
  });
  return response;
};
