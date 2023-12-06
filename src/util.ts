export function removeId(obj: { [key: string]: any }) {
  const { _id, ...rest } = obj;
  return rest;
}
