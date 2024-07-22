import { HttpResponse } from "../res/response";
import { HttpRequest } from "./request";

export enum HttpReqHeader {
  AcceptEncoding = "Accept-Encoding",
}

export enum HttpResHeader {
  ContentEncoding = "Content-Encoding",
  ContentType = "Content-Type",
}

export const handleEncoding = (req: HttpRequest, res: HttpResponse) => {
  console.log(req.headers);
  if (!req.containsHeader(HttpReqHeader.AcceptEncoding)) {
    return;
  }
  const acceptEncoding = req.getHeader(HttpReqHeader.AcceptEncoding).split(",");

  for (const encoding of acceptEncoding) {
    if (encoding.trim() === "gzip") {
      res.setHeader(HttpResHeader.ContentEncoding, "gzip");
      break;
    }
  }
};
