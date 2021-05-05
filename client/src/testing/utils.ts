/* eslint-disable prefer-arrow/prefer-arrow-functions */
export function safe(fun: () => any, value: any) {
  if (value) { fun(); }
}
