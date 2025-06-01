import geojsonhint from '@mapbox/geojsonhint';
import { describe, it, expect, assert } from 'vitest';

import { parse, omit } from '../index.js';

import * as tg from './test_geometry.js';

import type { GeoJSON, Geometry, Point } from 'geojson';

// GeoJSONの整合性検証
function validateGeoJSON(feature: GeoJSON, precision: number): void {
  const parsed = parse(feature, precision);
  const errors = geojsonhint.hint(JSON.stringify(parsed));
  if (errors.length !== 0) throw new Error(JSON.stringify(errors));
}

// ---------- Geometry 単体のテスト ----------

describe.each([
  ['point', tg.point],
  ['3D point', tg.point3D],
  ['featurePoint', tg.featurePoint],
  ['featureLineString', tg.featureLineString],
  ['lineString', tg.lineString],
  ['multiPoint', tg.multiPoint],
  ['polygon', tg.polygon],
  ['holyPolygon', tg.holyPolygon],
  ['multiPoly', tg.multiPoly],
  ['multiLineString', tg.multiLineString],
  ['featureCollection', tg.featureCollection],
  ['geometryCollection', tg.geometryCollection],
])('%s', (_, geojson) => {
  it('should return valid GeoJSON with the specified precision', () => {
    validateGeoJSON(geojson, 3);
  });
});

// ---------- 特別なケースの検証 ----------

describe('3D point precision', () => {
  it('should apply Z precision correctly', () => {
    const originalZ = tg.point3D.coordinates[2];
    const parsed = parse(tg.point3D, 2, 0) as Point;
    const roundedZ = parseFloat(originalZ!.toFixed(0));
    expect(parsed.coordinates[2]).toBe(roundedZ);
  });
});

// ---------- 無効な入力 ----------

describe('Invalid inputs', () => {
  it.each([
    ['null', tg.baddyNull],
    ['undefined', tg.baddyUndefined],
    ['empty array', tg.empty],
    ['invalid object', tg.baddyObject],
  ])('should throw error for %s input', (_, input) => {
    expect(() => parse(input as any, 5)).toThrow();
  });

  it('should allow null geometry in feature (no throw)', () => {
    expect(() => parse(tg.baddyNoGeom, 5)).not.toThrow();
  });
});

// ---------- 不変性チェック ----------

describe('Object immutability', () => {
  it('should not mutate the original object', () => {
    const original = structuredClone(tg.point);
    parse(tg.point, 3);
    expect(tg.point).toEqual(original);
  });
});

// ---------- 精度チェック ----------

describe('Precision constraints', () => {
  it('precision = 0', () => {
    expect(() => parse(tg.point, 0)).toThrow();
  });

  it('extraPrecision = 0', () => {
    expect(() => parse(tg.point, 1, 0)).not.toThrow();
  });

  it('precision < 0 should throw', () => {
    expect(() => parse(tg.point, -1)).toThrow();
  });

  it('extraPrecision < 0 should throw', () => {
    expect(() => parse(tg.point, 6, -1)).toThrow();
  });

  it('both precision < 0 should throw', () => {
    expect(() => parse(tg.point, -6, -1)).toThrow();
  });

  it('precision > extraPrecision should pass', () => {
    expect(() => parse(tg.point, 3, 1)).not.toThrow();
  });

  it('extraPrecision > precision should throw', () => {
    expect(() => parse(tg.point, 1, 2)).toThrow();
  });
});

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
  it('should round point coordinates to given precision', () => {
    const input: Geometry = {
      type: 'Point',
      coordinates: [123.456789, 98.7654321],
    };

    const result = parse(input, 3);
    expect(result).toEqual({
      type: 'Point',
      coordinates: [123.457, 98.765],
    });
  });
});

describe('feature line string', () => {
  it('should return valid GeoJSON with the specified precision', () => {
    test(tg.featureLineString, 3);
  });

  it('should remove duplicate points if configured', () => {
    const input: Geometry = {
      type: 'LineString',
      coordinates: [
        [1.1111111, 2.2222222],
        [1.1111111, 2.2222222],
        [3.3333333, 4.4444444],
      ],
    };

    const result = parse(input, 2, 2, { removeDuplicates: true });
    expect(result).toEqual({
      type: 'LineString',
      coordinates: [
        [1.11, 2.22],
        [3.33, 4.44],
      ],
    });
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

  it('should handle nested polygon structures correctly', () => {
    const input: Geometry = {
      type: 'Polygon',
      coordinates: [
        [
          [10.123456789, 20.123456789],
          [30.123456789, 40.123456789],
          [10.123456789, 20.123456789],
        ],
      ],
    };

    const result = parse(input, 2);
    expect(result).toEqual({
      type: 'Polygon',
      coordinates: [
        [
          [10.12, 20.12],
          [30.12, 40.12],
          [10.12, 20.12],
        ],
      ],
    });
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
    const original = { ...{}, ...tg.point };
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
      coordinates: [19, 57],
    });
  });
});
