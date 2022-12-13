import { getInputs } from "./input";
import { parseCoverageFile } from "./coverage";
import { generateBadge } from "./badge";
import { updateBadgeInRepo } from "./github";

async function run(): Promise<void> {
  const inputs = await getInputs();

  const parsedFile = await parseCoverageFile(
    inputs.limgoFile,
    inputs.limgoFileFormat
  );
  const badgePath = await generateBadge(parsedFile, inputs.enabledCoverage, inputs.badgeName);

  updateBadgeInRepo(
    inputs.githubTokenOwner,
    inputs.githubToken,
    inputs.repo,
    inputs.branch,
    badgePath,
    inputs.badgeName
  );
}

run();
