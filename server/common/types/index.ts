export type StrictOmit<T, U extends keyof T> = {
  [P in Exclude<keyof T, U>]: T[P];
};

export type NonNullableObj<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};
