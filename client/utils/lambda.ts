export const lambda = <T, U>(constant: T, fn: (constant: T) => U) => fn(constant);
