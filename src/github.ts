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

  await ghexec.exec(
    `git clone https://${ghTokenOwner}:${ghToken}@${repo}.git ${tmpRepoDir}`
  );

  if (!(await hasRepoBadgeBranch(tmpRepoDir, badgeBranch))) {
    await ghexec.exec(
      assembleGitCmd(tmpRepoDir, `switch --orphan ${badgeBranch}`)
    );
  } else {
    await ghexec.exec(
      assembleGitCmd(tmpRepoDir, `checkout --track origin/${badgeBranch}`)
    );
  }

  await ghexec.exec(
    `cp -f ${badgePath} ./${tmpRepoDir}/${badgeFileTargetName}`
  );
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
