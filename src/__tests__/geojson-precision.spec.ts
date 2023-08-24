import { it, describe, assert, expect } from 'vitest';
import * as tg from './test_geometry.js';
import geojsonhint from '@mapbox/geojsonhint';
import { parse, omit } from '../index.js';
import type { GeoJSON, Point } from 'geojson';

/**
 * Test
 *
 * @param feature - Test data
 * @param precision -
 */
function test(feature: GeoJSON, precision: number): void {
  const parsed = parse(feature, precision);
  const errors: any[] = geojsonhint.hint(JSON.stringify(parsed), {});
  if (errors.length !== 0) {
    throw new Error(JSON.stringify(errors));
  }
}

describe('point', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.point, 3);
  });
});

describe('3D points', () => {
  it('should return valid GeoJSON with the specified Z precision', () => {
    expect(() => {
      const parsed = parse(tg.point3D, 0, 0) as Point;
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      return (
        parsed.coordinates[2]?.toString() !==
        tg.point3D.coordinates[2]?.toFixed()
      );
    });
  });
});

describe('feature point', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.featurePoint, 3);
  });
});

describe('feature line string', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.featureLineString, 3);
  });
});

describe('line string', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.lineString, 3);
  });
});

describe('multi point', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.multiPoint, 3);
  });
});

describe('polygon', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.polygon, 3);
  });
});

describe('holy polygon', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.holyPolygon, 3);
  });
});

describe('multi polygon', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.multiPoly, 3);
  });
});

describe('multi lineString', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.multiLineString, 3);
  });
});

describe('feature collection', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.featureCollection, 3);
  });
});

describe('geometry collection', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.geometryCollection, 3);
  });
});

describe('Invalied object check', () => {
  it('null value incorrectly returned', () => {
    expect(() => parse(tg.baddyNull as any, 4)).toThrow();
  });
  it('Undefined value incorrectly returned', () => {
    expect(() => parse(tg.baddyUndefined as any, 5)).toThrow();
  });
  it('Empty array incorrectly returned', () => {
    expect(() => parse(tg.empty as any, 5)).toThrow();
  });
  it('Bad object incorrectly returned', () => {
    expect(() => parse(tg.baddyObject as any, 5)).toThrow();
  });
  it('Null feature geometry incorrectly returned', () => {
    expect(() => parse(tg.baddyNoGeom, 5));
  });
});

describe('mutate', () => {
  it('should not mutate the original object', () => {
    const original = Object.assign({}, tg.point);
    parse(tg.point, 3);
    assert.deepEqual(original, tg.point);
  });
});

describe('Precision value check.', () => {
  it('precision zero value', () => {
    expect(() => parse(tg.point, 0));
  });
  it('extraPrecision zero value', () => {
    expect(() => parse(tg.point, 0, 0));
  });
  it('precision negative value must be error.', () => {
    expect(() => parse(tg.point, -1)).toThrow();
  });
  it('extra precision negative value must be error', () => {
    expect(() => parse(tg.point, 6, -1)).toThrow();
  });
  it('both precision negative value must be error', () => {
    expect(() => parse(tg.point, -6, -1)).toThrow();
  });
  it('precision greater than extrasPrecision', () => {
    expect(() => parse(tg.point, 1, 0));
  });
  it('precision lower than extrasPrecision must be error', () => {
    expect(() => parse(tg.point, 1, 2)).toThrow();
  });
});

describe('Omit precision check.', () => {
  it('Point', () => {
    const parsed = omit(tg.point);
    assert.deepEqual(parsed, {
      type: 'Point',
      coordinates: [18, 57],
    });
  });
});
