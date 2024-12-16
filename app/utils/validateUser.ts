export function validateUsername(username: string) {
  if (username === "null") return "Please enter a username.";
  if (username.length < 3)
    return "The username must contain a minimum of 3 characters.";
  if (username.length > 20)
    return "The username must contain a maximum of 20 characters.";
  if (/^\d/.test(username)) return "The username cannot begin with a number.";
  if (!/^[a-z0-9]+$/.test(username))
    return "The username may only contain letters and numbers.";

  return "Username is valid.";
}
