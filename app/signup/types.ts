export type SignupErrors = {
  username?: string;
  password?: string;
};

export type SignupState = {
  status: "idle" | "error" | "success";
  errors: SignupErrors;
  username: string;
};

export const initialSignupState: SignupState = {
  status: "idle",
  errors: {},
  username: "",
};
