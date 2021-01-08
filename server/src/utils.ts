export function countOccurrences(data: string, pattern: RegExp) {
  let result;
  let occurrences = 0;
  // eslint-disable-next-line no-cond-assign, no-unused-vars
  while ((result = pattern.exec(data))) {
    // eslint-disable-next-line no-plusplus
    occurrences++;
  }
  return occurrences;
}
