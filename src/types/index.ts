import {
  IModule,
  INormalizedModules,
  ISandbox,
  ITemplate,
} from "codesandbox-import-util-types";

import {
  IGitInfo,
  IChanges,
  ITree,
  ITreeFile,
} from "git-extractor/src/routes/github/push";

import { IRepoResponse, ICompareResponse, IContentResponse } from "git-extractor/src/routes/github/api";

/**
 * Consolidated export of all TypeScript interfaces and types used across the integrated repositories.
 * This ensures type consistency throughout the unified system.
 */

// Export types from codesandbox-import-util-types
export type {
  IModule,
  INormalizedModules,
  ISandbox,
  ITemplate,
};

// Export types from git-extractor
export type {
  IGitInfo,
  IChanges,
  ITree,
  ITreeFile,
  IRepoResponse,
  ICompareResponse,
  IContentResponse,
};
