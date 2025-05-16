type InputType<T> = Omit<T, "id" | "createdAt" | "updatedAt">;

type MosqueInput = InputType<MosqueType>;
