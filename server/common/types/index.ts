export type StrictOmit<T, U extends keyof T> = Pick<T, Exclude<keyof T, U>>;

export type NonNullableObj<T> = {
  [K in keyof T]: NonNullable<T[K]>;
};

export type SubKeyObj<T, U extends { [K in keyof T]?: unknown }> = U;
