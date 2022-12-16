import { it, describe, assert } from 'vitest';
import * as tg from './test_geometry';
// @ts-ignore
import geojsonhint from '@mapbox/geojsonhint';
import gp from '../';
import type { GeoJSON } from 'geojson';

/**
 * Test
 *
 * @param feature - Test data
 * @param precision -
 */
function test(feature: GeoJSON, precision: number) {
  const parsed = gp(feature, precision);
  const errors = geojsonhint.hint(JSON.stringify(parsed), {});
  if (errors.length) {
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
    const zPrecision = 2;
    const parsed: any = gp(tg.point3D, 3, zPrecision);
    if (
      parsed.coordinates[2].toString() !==
      tg.point3D.coordinates[2].toFixed(zPrecision)
    ) {
      throw new Error("z coordinate precisions don't match");
    }
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

// The following test is played according to the TypeScript specification, so comment it out.
/*
describe('null value', () => {
  it('should return the same null value', done => {
    const parsed = gp(tg.baddyNull, 4);

    if (typeof parsed === 'object') {
      done();
    }
    throw new Error('null value incorrectly returned');
  });
});

describe('undefined value', () => {
  it('should return the same thing value', done => {
    const parsed: any = gp(tg.baddyUndefined, 5);

    if (typeof parsed === 'undefined') {
      done();
    }
    throw new Error('Undefined value incorrectly returned');
  });
});

describe('empty array', () => {
  it('should return the same thing value', done => {
    const parsed = gp(tg.empty as any, 5);

    if (Array.isArray(parsed)) {
      done();
    }
    throw new Error('Empty array incorrectly returned');
  });
});

describe('bad object', () => {
  it('should return the same thing value', done => {
    const parsed = gp(tg.baddyObject as any, 5);

    if (typeof parsed === 'object') {
      done();
    }
    throw new Error('Bad object incorrectly returned');
  });
});

describe('null Feature geometry', () => {
  it('should return the same thing value', done => {
    const parsed = gp(tg.baddyNoGeom as any, 5);

    if (typeof parsed === 'object' && parsed['type']) {
      done();
    }
    throw new Error('Null feature geometry incorrectly returned');
  });
});
*/

describe('mutate', () => {
  it('should not mutate the original object', () => {
    const original = Object.assign({}, tg.point);
    gp(tg.point, 3);
    assert.deepEqual(original, tg.point);
  });
});
