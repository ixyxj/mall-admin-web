

export function check_success(response) {
  return '0000' === response.resultStatus.resultCode;
}

export function get_list(response) {
  return response.value.records;
}

export function get_total(response) {
  return response.value.total;
}
