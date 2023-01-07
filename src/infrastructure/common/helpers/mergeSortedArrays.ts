// taken from https: https://stackoverflow.com/questions/31922223/how-to-merge-two-sorted-array-in-one-sorted-array-in-javascript-without-using-so
export function mergeSortedArray(a: any[], b: any[]) {
  let sorted = [],
    indexA = 0,
    indexB = 0;

  while (indexA < a.length && indexB < b.length) {
    if (a[indexA].createdAt - b[indexB].createdAt < 0) {
      sorted.push(b[indexB++]);
    } else {
      sorted.push(a[indexA++]);
    }
  }

  if (indexB < b.length) {
    sorted = sorted.concat(b.slice(indexB));
  } else {
    sorted = sorted.concat(a.slice(indexA));
  }

  return sorted;
}
