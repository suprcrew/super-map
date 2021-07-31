import {mapObject, ObjectMapFunction} from '../src/object-map';

interface TargetTestType {
  "foo": number,
  "bar": string
}

interface SourceTestType {
  "baz": number,
  "zap": string
}

const sourceObj: SourceTestType = {
  baz: 1,
  zap: '2',
}

const targetObj: TargetTestType = {
  foo: 1,
  bar: '2',
}

const objectMap = {
  foo: (input: SourceTestType) => input.baz,
  bar: (input: SourceTestType) => input.zap
}

describe('objectMap', () => {
  test('should map values to target typed object', () => {
    const target: TargetTestType = mapObject<TargetTestType>(objectMap, sourceObj);
    expect(target).toEqual(targetObj);
  });

  test('should map values to target typed object with curring', () => {
    const mapper: ObjectMapFunction<TargetTestType> = mapObject<TargetTestType>(objectMap);
    const target: TargetTestType = mapper(sourceObj);
    expect(target).toEqual(targetObj);
  });
});
