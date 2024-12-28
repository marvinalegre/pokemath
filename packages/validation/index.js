export function validateUsername(username) {
  class ValidationError extends Error {}

  if (typeof username !== "string") {
    throw new ValidationError("Username is not valid.");
  }
  if (username.length < 3) {
    throw new ValidationError(
      "The username must contain a minimum of 3 characters."
    );
  }
  if (username.length > 20) {
    throw new ValidationError(
      "The username must contain a maximum of 20 characters."
    );
  }
  if (/^\d/.test(username)) {
    throw new ValidationError("The username cannot begin with a number.");
  }
  if (!/^[a-z0-9]+$/.test(username)) {
    throw new ValidationError(
      "The username may only contain letters and numbers."
    );
  }
}
