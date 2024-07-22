import * as zlib from "zlib";

export const gzipEncode = async (body: string): Promise<Buffer> => {
  const compressedBody = await new Promise<Buffer>((resolve, reject) => {
    zlib.gzip(body, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    });
  });

  console.log("Compressed body length:", compressedBody.length, body);
  return compressedBody;
};
