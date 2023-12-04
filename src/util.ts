export function removeId(obj: { _id: string; [key: string]: any }) {
  const { _id, ...rest } = obj;
  return rest;
}
