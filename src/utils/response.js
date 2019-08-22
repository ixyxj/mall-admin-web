

export function checkSuccess(response) {
  let resultCode = response.resultStatus.resultCode;
  if ('0000' === resultCode) {
      return true;
  } else {
      this.$notify.error('code: ${resultCode} ,error: ${response.resultStatus.resultMessage} ')
  }
}

export function getList(response) {
  return response.value.records;
}

export function getArray(response) {
  return response.value;
}

export function getTotal(response) {
  return response.value.total;
}
