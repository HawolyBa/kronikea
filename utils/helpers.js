const intersperse = (arr, sep) => {
  if (arr.length === 0) {
    return [];
  }

  return arr.slice(1).reduce(function (xs, x, i) {
    return xs.concat([sep, x]);
  }, [arr[0]]);
}

const capitalize = (term) => {
  return `${term.charAt(0).toUpperCase()}${term.slice(1)}`
}

export { intersperse, capitalize }