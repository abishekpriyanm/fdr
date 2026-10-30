/** Client-supplied concurrency metadata. Actor identity always comes from the session. */
export type CommandInput<TFields> = Readonly<{
  caseId: string;
  commandId: string;
  expectedCaseRevision: number;
  fields: TFields;
}>;

export type CommandErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INVALID_STATE"
  | "INTERNAL_ERROR";

export type CommandError = Readonly<{
  code: CommandErrorCode;
  message: string;
  fieldErrors?: Readonly<Record<string, readonly string[]>>;
}>;

/** Serializable results only: no Error objects, database rows, secrets or file paths. */
export type CommandResult<TData> =
  | Readonly<{ ok: true; data: TData; caseRevision: number; commandId: string }>
  | Readonly<{ ok: false; error: CommandError }>;

export const CASE_CONFLICT_MESSAGE =
  "This case changed. Review the latest evidence before continuing.";
