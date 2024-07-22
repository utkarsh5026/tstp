import { HttpResponse } from "../res/response";
import { HttpRequest } from "./request";

enum HttpHeader {
  ContentType = "Content-Type",
  Authorization = "Authorization",
}

export enum HttpReqHeader {
  AcceptEncoding = "Accept-Encoding",
}

export enum HttpResHeader {
  ContentEncoding = "Content-Encoding",
  ContentType = "Content-Type",
}

export const handleEncoding = (req: HttpRequest, res: HttpResponse) => {
  const acceptEncoding = req.getHeader(HttpReqHeader.AcceptEncoding).split(",");

  console.log(req.headers);

  for (const encoding of acceptEncoding) {
    if (encoding.trim() === "gzip") {
      res.setHeader(HttpResHeader.ContentEncoding, "gzip");
      break;
    }
  }
};
