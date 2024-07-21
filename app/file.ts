import * as fs from "fs/promises";

export const readFromFile = async (path: string): Promise<string> => {
  try {
    const data = await fs.readFile(path, "utf-8");
    return data;
  } catch (error) {
    console.error(error);
    return "";
  }
};
