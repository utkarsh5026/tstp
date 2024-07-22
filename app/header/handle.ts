import { HttpResponse } from "../res/response";
import { HttpRequest } from "../req/request";
import { HttpReqHeader } from "./req";
import { HttpResHeader } from "./res";
import { gunzipSync, gzipSync } from "zlib";

export const handleEncoding = async (req: HttpRequest, res: HttpResponse) => {
  if (!req.containsHeader(HttpReqHeader.AcceptEncoding)) {
    return;
  }
  const acceptEncoding = req.getHeader(HttpReqHeader.AcceptEncoding).split(",");

  for (const encoding of acceptEncoding) {
    console.log("Encoding:", encoding);
    if (encoding.trim() === "gzip") {
      res.setHeader(HttpResHeader.ContentEncoding, "gzip");

      console.log("Gzipping response " + res.getBody());
      const body = gzipSync(res.getBody());
      console.log("Gzipped response");
      console.log(gunzipSync(body).toString());
      res.setBody(body);
    }
  }
};

const handleContentLength = async (_req: HttpRequest, res: HttpResponse) => {
  const body = res.getBody();
  if (body) {
    res.setHeader(HttpResHeader.ContentLength, body.length);
  }
};

export const handlers = [handleEncoding, handleContentLength];
