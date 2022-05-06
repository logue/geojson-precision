import geojsonhint from '@ricerobotics/geojsonhint';
import gp from '../src/geojson-precision';
import * as tg from './test_geometry';

/**
 * Test
 *
 * @param feature Test data
 * @param precision
 */
function test(feature, precision: number) {
  const parsed = gp(feature, precision);
  const errors = geojsonhint.hint(JSON.stringify(parsed), {});
  if (errors.length) {
    throw new Error(JSON.stringify(errors));
  }
}

describe('point', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.point, 3);
    done();
  });
});

describe('3D points', () => {
  it('should return valid GeoJSON with the specified Z precision', done => {
    const zPrecision = 2;
    const parsed: any = gp(tg.point3D, 3, zPrecision);
    if (
      parsed.coordinates[2].toString() !==
      tg.point3D.coordinates[2].toFixed(zPrecision)
    ) {
      throw new Error("z coordinate precisions don't match");
    }
    done();
  });
});

describe('feature point', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.featurePoint, 3);
    done();
  });
});

describe('feature line string', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.featureLineString, 3);
    done();
  });
});

describe('line string', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.lineString, 3);
    done();
  });
});

describe('multi point', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.multiPoint, 3);
    done();
  });
});

describe('polygon', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.polygon, 3);
    done();
  });
});

describe('holy polygon', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.holyPolygon, 3);
    done();
  });
});

describe('multi polygon', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.multiPoly, 3);
    done();
  });
});

describe('multi lineString', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.multiLineString, 3);
    done();
  });
});

describe('feature collection', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.featureCollection, 3);
    done();
  });
});

describe('geometry collection', () => {
  it('should return valid GeoJSON with the specified precision', done => {
    test(tg.geometryCollection, 3);
    done();
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
  it('should not mutate the original object', done => {
    const original = Object.assign({}, tg.point);
    gp(tg.point, 3);
    assert.deepEqual(original, tg.point);
    done();
  });
});
