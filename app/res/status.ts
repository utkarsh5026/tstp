export enum StatusCode {
  OK = 200,
  CREATED = 201,
  TEMPORARY_REDIRECT = 307,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
}

export const StatusNames: Record<StatusCode, string> = {
  200: "OK",
  201: "Created",
  307: "Temporary Redirect",
  400: "Bad Request",
  404: "Not Found",
};
