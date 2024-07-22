import { HttpResponse } from "../res/response";
import { HttpRequest } from "../req/request";
import { HttpReqHeader } from "./req";
import { HttpResHeader } from "./res";
import { gzipEncode } from "./encoding";

export const handleEncoding = async (req: HttpRequest, res: HttpResponse) => {
  console.log(req.headers);
  if (!req.containsHeader(HttpReqHeader.AcceptEncoding)) {
    return;
  }
  const acceptEncoding = req.getHeader(HttpReqHeader.AcceptEncoding).split(",");
  for (const encoding of acceptEncoding) {
    if (encoding.trim() === "gzip") {
      res.setHeader(HttpResHeader.ContentEncoding, "gzip");
      const body = await gzipEncode(res.body);
      console.log("Compressed body length:", body.length, res.body);
      res.setBody(body.toString());
      break;
    }
  }
};

export const handleContentLength = async (
  _req: HttpRequest,
  res: HttpResponse
) => {
  if (res.body) {
    res.setHeader(HttpResHeader.ContentLength, res.body.length);
  }
};
