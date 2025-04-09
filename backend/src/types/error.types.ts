export interface ErrorDetails {
  code?: string;
  message: string;
  path?: string[];
}
export interface ErrorData {
  details: ErrorDetails[];
}
