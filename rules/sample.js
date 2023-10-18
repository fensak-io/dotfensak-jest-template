/**
 * This is a Fensak rule that allows any Pull Request that only has changes to
 * the root README.md file.
 */

function main(inp, _metadata) {
  const numPatches = inp.length;
  if (numPatches == 0) {
    // No files updated, so approve.
    console.log("Accepting since no changes.");
    return true;
  } else if (numPatches > 1) {
    // More than one file was updated, which means not just the README.md was changed so reject.
    console.log("Rejecting since more than one file was updated.");
    return false;
  }

  const patch = inp[0];
  const approve = patch.path === "README.md";
  if (approve) {
    console.log("Approving since only README.md was updated.");
  } else {
    console.log("Rejecting since file changed was not README.md.");
  }
  return approve;
}
