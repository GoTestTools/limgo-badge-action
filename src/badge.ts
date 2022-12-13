import * as tc from "@actions/tool-cache";
import { Coverage } from "./coverage";
import { EnabledCoverage } from "./input";

export async function generateBadge(
  coverage: Coverage,
  enabledCoverage: EnabledCoverage,
  badgeName: string
): Promise<string> {
  var color = "blue";
  if (coverage.failed) {
    color = "red";
  }

  let covs: string[] = [];
  if (enabledCoverage.stmts) {
    covs.push(`${coverage.stmt}%25%20Stmt`);
  }
  if (enabledCoverage.lines) {
    covs.push(`${coverage.line}%25%20Line`);
  }
  if (enabledCoverage.branches) {
    covs.push(`${coverage.branch}%25%20Branch`);
  }

  const url = `https://raster.shields.io/badge/coverage-${covs.join(
    "%20%7c%20"
  )}-${color}.svg?logo=data:image/png;base64,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`;
  return tc.downloadTool(url, `./${badgeName}`);
}
