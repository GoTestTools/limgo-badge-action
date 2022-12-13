import * as ghexec from "@actions/exec";

export async function updateBadgeInRepo(
  ghTokenOwner: string,
  ghToken: string,
  repo: string,
  badgeBranch: string,
  badgePath: string,
  badgeFileTargetName: string
): Promise<void> {
  const tmpRepoDir = "tmpRepo";

  await ghexec.exec(`git config --global user.email "limgo@badge-action.com"`);
  await ghexec.exec(`git config --global user.name "limgo badge action"`);

  await ghexec.exec(
    `git clone https://${ghTokenOwner}:${ghToken}@${repo}.git ${tmpRepoDir}`
  );

  const repoHasBranch = await hasRepoBadgeBranch(tmpRepoDir, badgeBranch);

  let checkoutCmd = `checkout --track origin/${badgeBranch}`;
  if (!repoHasBranch) {
    checkoutCmd = `switch --orphan ${badgeBranch}`;
  }
  await ghexec.exec(assembleGitCmd(tmpRepoDir, checkoutCmd));

  await ghexec.exec(
    `cp -f ${badgePath} ./${tmpRepoDir}/${badgeFileTargetName}`
  );

  // check for diff and abort early if there is no change
  if (repoHasBranch) {
    const diff = await ghexec.getExecOutput(assembleGitCmd(tmpRepoDir, `diff`));
    if (diff.stderr != "") {
      console.log(`Encountered error while checking for diff: ${diff.stderr}`);
      return;
    }
    if (diff.stdout == "") {
      console.log("No changes detected, skipping...");
      return;
    }
  }

  await ghexec.exec(assembleGitCmd(tmpRepoDir, `add ${badgeFileTargetName}`));
  await ghexec.exec(
    assembleGitCmd(tmpRepoDir, `commit -m "updated limgo badge"`)
  );
  await ghexec.exec(
    assembleGitCmd(
      tmpRepoDir,
      `push https://${ghTokenOwner}:${ghToken}@${repo}.git HEAD`
    )
  );

  await ghexec.exec(`rm -rf ${tmpRepoDir}`);
}

async function hasRepoBadgeBranch(
  tmpRepoDir: string,
  badgeBranch: string
): Promise<boolean> {
  const out = await ghexec.getExecOutput(
    assembleGitCmd(tmpRepoDir, "branch -a")
  );
  var badgeBranchAlreadyExists = false;
  out.stdout.split("\n").forEach(function (value: string) {
    console.log(value);
    if (value.endsWith(`origin/${badgeBranch}`)) {
      badgeBranchAlreadyExists = true;
    }
  });
  return badgeBranchAlreadyExists;
}

function assembleGitCmd(tmpRepoDir: string, cmd: string): string {
  return `git --git-dir=./${tmpRepoDir}/.git --work-tree=./${tmpRepoDir} ${cmd}`;
}
