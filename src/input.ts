import * as core from "@actions/core";

export interface Inputs {
  limgoFile: string;
  limgoFileFormat: string;
  badgeName: string;
  enabledCoverage: EnabledCoverage;
  repo: string;
  branch: string;
  githubToken: string;
  githubTokenOwner: string;
}

export interface EnabledCoverage {
  stmts: boolean;
  lines: boolean;
  branches: boolean;
}

export async function getInputs(): Promise<Inputs> {
  return {
    limgoFile: core.getInput("limgo_file"),
    limgoFileFormat: core.getInput("limgo_file_format"),
    badgeName: core.getInput("badge_name"),
    enabledCoverage: {
      stmts: core.getBooleanInput("badge_enabled_stmt"),
      lines: core.getBooleanInput("badge_enabled_lines"),
      branches: core.getBooleanInput("badge_enabled_branch"),
    },
    repo: core.getInput("repo"),
    branch: core.getInput("branch"),
    githubToken: core.getInput("github_token"),
    githubTokenOwner: core.getInput("github_token_owner"),
  };
}
