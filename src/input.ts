import * as core from "@actions/core";

export interface Inputs {
  limgoFile: string;
  limgoFileFormat: string;
  colorSuccess: string;
  colorFailure: string;
  badgeName: string;
  repo: string;
  branch: string;
  githubToken: string;
  githubTokenOwner: string;
}

export async function getInputs(): Promise<Inputs> {
  return {
    limgoFile: core.getInput("limgo_file"),
    limgoFileFormat: core.getInput("limgo_file_format"),
    colorSuccess: core.getInput("color_success"),
    colorFailure: core.getInput("color_failure"),
    badgeName: core.getInput("badge_name"),
    repo: core.getInput("repo"),
    branch: core.getInput("branch"),
    githubToken: core.getInput("github_token"),
    githubTokenOwner: core.getInput("github_token_owner"),
  };
}
