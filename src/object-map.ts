import {jpValue} from './helpers';

export type ObjectMapFunction<T> = (input: object) => T;

export type ObjectMap<T> = {
  [K in keyof T]: ObjectMapFunction<T[K]> | ObjectMap<T[K]> | string;
};

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

export function mapObject<T>(map: ObjectMap<T>, input: object): T;
export function mapObject<T>(map: ObjectMap<T>): ObjectMapFunction<T>;
export function mapObject<T>(map: ObjectMap<T>, input?: object): T | ObjectMapFunction<T> {
  if (typeof input === 'undefined') {
    return (inputObject: object): T => extractFromObject(inputObject, map);
  } else {
    return extractFromObject(input, map);
  }
}

function extractFromObject<T>(inputObject: object, extractionMap: ObjectMap<T>): T {
  const resultObject: Partial<T> = {};
  const extractionKeys: Array<keyof T> = Object.keys(extractionMap) as Array<keyof T>;

  extractionKeys.forEach((extractionKey: keyof T): void => {
    resultObject[extractionKey] = _extractForKey(extractionMap, extractionKey, inputObject) as any; // screw this
  });

  return resultObject as T;
}

function isObjectMapFunction<T>(e: ObjectMapFunction<T> | ObjectMap<T>): e is ObjectMapFunction<T> {
  return typeof e === 'function';
}

function isString<T>(e: ObjectMapFunction<T> | ObjectMap<T> | string): e is string {
  return typeof e === 'string';
}

function _extractForKey<T>(extractionMap: ObjectMap<T>, extractionKey: keyof T, inputObject: object, extractionFn: <PartialOrT>(map: ObjectMap<T[keyof T]>, input?: object) => DeepPartial<T[keyof T]> | T[keyof T] = mapObject) {
  const extractorCandidate: ObjectMap<T[keyof T]> | ObjectMapFunction<T[keyof T]> | string = extractionMap[extractionKey];
  const extractor: ObjectMap<T[keyof T]> | ObjectMapFunction<T[keyof T]> = isString(extractorCandidate)
    ? jpValue(extractorCandidate)
    : extractorCandidate;

  if (isObjectMapFunction(extractor)) {
    return extractor(inputObject);
  } else {
    return extractionFn(extractor, inputObject);
  }
}
