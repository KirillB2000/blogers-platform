export type FieldError = {
  field: string | null;
  message: string | null;
};

export type ApiErrorResult = {
  errorsMessages: FieldError[] | null;
};
