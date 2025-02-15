import { createSandbox } from "codesandbox-import-utils/lib/create-sandbox";
import { fetchRepoInfo, downloadRepository } from "git-extractor/src/routes/github/api";
import { INormalizedModules, ISandbox } from "codesandbox-import-util-types";

/**
 * Initializes a repository by fetching its information and downloading its content.
 * @param username - The GitHub username.
 * @param repo - The repository name.
 * @param branch - The branch to fetch.
 * @param token - Optional GitHub token for authentication.
 * @returns A promise that resolves to the normalized modules of the repository.
 */
export async function initializeRepository(
  username: string,
  repo: string,
  branch: string,
  token?: string
): Promise<INormalizedModules> {
  const repoInfo = await fetchRepoInfo(username, repo, branch, "", false, token);
  const modules = await downloadRepository(
    { username, repo, branch },
    repoInfo.commitSha,
    false,
    token
  );
  return modules;
}

/**
 * Creates a sandbox from the given repository modules.
 * @param modules - The normalized modules of the repository.
 * @returns A promise that resolves to the sandbox object.
 */
export async function createRepositorySandbox(
  modules: INormalizedModules
): Promise<ISandbox> {
  const sandbox = await createSandbox(modules);
  return sandbox;
}

/**
 * Combines repository initialization and sandbox creation into a single function.
 * @param username - The GitHub username.
 * @param repo - The repository name.
 * @param branch - The branch to fetch.
 * @param token - Optional GitHub token for authentication.
 * @returns A promise that resolves to the sandbox object.
 */
export async function integrateRepository(
  username: string,
  repo: string,
  branch: string,
  token?: string
): Promise<ISandbox> {
  const modules = await initializeRepository(username, repo, branch, token);
  const sandbox = await createRepositorySandbox(modules);
  return sandbox;
}

/**
 * Exports all integration functions for external use.
 */
export default {
  initializeRepository,
  createRepositorySandbox,
  integrateRepository,
};
