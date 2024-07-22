import * as zlib from "zlib";

export const gzipEncode = async (body: string): Promise<Buffer> => {
  const buffer = Buffer.from(body, "utf-8");
  const compressedBody = await new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(buffer, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  console.log("Compressed body length:", compressedBody.length, body);
  return compressedBody;
};
