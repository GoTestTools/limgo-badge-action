import * as fs from "fs";

export interface Coverage {
  stmt: string;
  line: string;
  branch: string;
  failed: boolean;
}

export async function parseCoverageFile(
  file: string,
  format: string
): Promise<Coverage> {
  const limgoFileContent = fs.readFileSync(file, "utf8");

  switch (format) {
    case "md":
      return parseMarkdownFile(limgoFileContent);
    case "json":
      return parseJSONFile(limgoFileContent);
    case "tab":
      return parseTabFile(limgoFileContent);
  }

  throw new Error(`Unsupported file format: '${format}'`);
}

async function parseMarkdownFile(fileContent: string): Promise<Coverage> {
  throw new Error("not implemented yet");
}
async function parseJSONFile(fileContent: string): Promise<Coverage> {
  throw new Error("not implemented yet");
}

async function parseTabFile(fileContent: string): Promise<Coverage> {
  const isFailed = fileContent.includes("Expected coverage thresholds not met");

  const lines = fileContent.split("\n");
  if (lines.length < 2) {
    throw new Error("No coverage information found");
  }

  const values = lines[1].split(" ").filter(function (value: string) {
    return value != "";
  });

  if (values.length != 4) {
    throw new Error("No coverage information found");
  }

  return {
    stmt: values[1],
    line: values[2],
    branch: values[3],
    failed: isFailed,
  };
}
