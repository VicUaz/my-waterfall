export interface PropsOption {
  cols: number;
  gap: number;
  delay: number;
  useLazy: Boolean;
}

export interface RenderOptions<T> {
  getW(el: T): number;
  setW(el: T, v: number): void;
  getH(el: T, itemWidth: number): number;
  setH(el: T, v: number): void;
  getPad(el: T): [number, number, number, number];
  setX(el: T, v: number): void;
  setY(el: T, v: number): void;
  getChildren(el: T): { [index: number]: T, readonly length: number };
}

export type BasicType = boolean | number | string;
