export type CatchState = {
  error: string | null;
  // Epoch milliseconds. Numbers serialize cleanly between server and client.
  lockedUntil: number | null;
};
