import fs from "node:fs";
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, test } from "@jest/globals";
import {
  compileRuleFn,
  patchFromGitHubPullRequest,
  RuleFnSourceLang,
  RuleLogMode,
  runRule,
} from "@fensak-io/reng";
import { Octokit } from "@octokit/rest";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ruleFnSrc = fs.readFileSync(`${__dirname}/sample.js`, "utf8");
const ruleFn = compileRuleFn(ruleFnSrc, RuleFnSourceLang.ES6);
const octokit = new Octokit({
  auth: process.env.GITHUB_API_TOKEN,
});
const testRepo = {
  owner: "fensak-io",
  name: "dotfensak-deno-template",
};
const opts = { logMode: RuleLogMode.Console };

test("No changes should be approved", async () => {
  const result = await runRule(ruleFn, [], opts);
  expect(result.approve).toBe(true);
});

test("Changes only to README should be approved", async () => {
  // View PR at
  // https://github.com/fensak-io/dotfensak-deno-template/pull/1
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 1);
  const result = await runRule(ruleFn, patches.patchList, opts);
  expect(result.approve).toBe(true);
});

test("Changes to non-README files should be rejected", async () => {
  // View PR at
  // https://github.com/fensak-io/dotfensak-deno-template/pull/2
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 2);
  const result = await runRule(ruleFn, patches.patchList, opts);
  expect(result.approve).toBe(false);
});

test("Change containing more than one file should be rejected", async () => {
  // View PR at
  // https://github.com/fensak-io/dotfensak-deno-template/pull/4
  const patches = await patchFromGitHubPullRequest(octokit, testRepo, 4);
  const result = await runRule(ruleFn, patches.patchList, opts);
  expect(result.approve).toBe(false);
});
