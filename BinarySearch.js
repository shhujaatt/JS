function binarySearch(sortedArray, target) {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (sortedArray[mid] === target) return mid;
    sortedArray[mid] < target ? left = mid + 1 : right = mid - 1;
  }
  return -1;
}

module.exports = binarySearch;
