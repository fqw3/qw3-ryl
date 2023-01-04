function hasValueDeep(json, findValue) {
  try {
    const values = Object.values(json);
  } catch (err) {
    return false;
  }
  const values = Object.values(json);
  let hasValue = values.includes(findValue);
  values.forEach(function (value) {
    if (typeof value === 'object') {
      hasValue = hasValue || hasValueDeep(value, findValue);
    }
  });
  return hasValue;
}

module.exports = hasValueDeep;
