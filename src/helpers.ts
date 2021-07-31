import {ObjectMapFunction} from './object-map';
import {JSONPath} from 'jsonpath-plus';

export type ConverterFunction<T> = (object: any) => T;

export function identity<T>(input: T): T {
  return input;
}

export function jpArray<T>(jsonPath: string, convert: ConverterFunction<T> = identity): ObjectMapFunction<T> {
  return (inputObject: object): T => {
    return convert(JSONPath({json: inputObject, path: jsonPath}));
  };
}

export function jpQuery<T>(jsonPath: string, convert: ConverterFunction<T> = identity): ObjectMapFunction<T> {
  return (inputObject: object): T => {
    return JSONPath({json: inputObject, path: jsonPath}).map(convert);
  };
}

export function jpValue<T>(jsonPath: string, convert: ConverterFunction<T> = identity): ObjectMapFunction<T> {
  return (inputObject: object): T => {
    return convert(JSONPath({json: inputObject, path: jsonPath})[0]);
  };
}
