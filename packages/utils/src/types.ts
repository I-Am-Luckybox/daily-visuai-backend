export type DeepOptional<T> = {
    [P in keyof T]?: T[P] extends object ? (T[P] extends Array<infer U> ? Array<DeepOptional<U>> : DeepOptional<T[P]>) : T[P];
};
