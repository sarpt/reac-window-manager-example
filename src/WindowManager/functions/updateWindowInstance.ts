import { windowInstance } from "../commonTypes";

export type windowInstanceUpdate = Partial<windowInstance>;

export function updateWindowInstances(key: string, instances: windowInstance[], data: windowInstanceUpdate): windowInstance[] {
  const idx = instances.findIndex(instance => instance.key === key);
  if (idx < 0) return [];

  const updatedInstance = Object.assign(
    {},
    instances[idx],
    { ...data }
  );
  return [
    ...instances.slice(0, idx),
    updatedInstance,
    ...instances.slice(idx + 1)
  ];
}
