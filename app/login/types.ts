export type LoginState = {
  status: "idle" | "error" | "success";
  fieldErrors: {
    username?: string;
    password?: string;
  };
  formError?: string;
  username: string;
};

export const initialLoginState: LoginState = {
  status: "idle",
  fieldErrors: {},
  username: "",
};
