import type {
  Feature,
  FeatureCollection,
  GeoJSON,
  Geometry,
  GeometryCollection,
  Position,
} from 'geojson';
import { defaults, type OptionsInterface } from './OptionsInterface';

/**
 * Geojson Presition
 *
 * @param t - Target GeoJSON Source
 * @param precision - Decimal places to omit from positon.
 * @param extraPrecision - Decimal places to leave from position.
 * @param options - Options. @see OptionsInterface
 */
export function parse(
  t: GeoJSON,
  precision: number = 6,
  extraPrecision: number = 2,
  options: OptionsInterface = defaults
): GeoJSON {
  if (precision < 0) {
    throw new RangeError(
      `geojson-precision: precision must be positive value. ${precision} is enterd.`
    );
  }
  if (extraPrecision < 0) {
    throw new RangeError(
      `geojson-precision: extraPrecision must be positive value. ${extraPrecision} is enterd.`
    );
  }
  if (extraPrecision > precision) {
    throw new RangeError(
      'geojson-precision: Invalid extraPrecision specification. extraPrecision must be lower than precition.'
    );
  }

  /** Process Point */
  const point = (p: Position): Position =>
    p.map(
      (value, index) =>
        1 * parseInt(value.toFixed(index < 2 ? precision : extraPrecision))
    );

  /** Process LineString Position */
  const multi = (l: Position[]): Position[] =>
    options.removeDuplicates
      ? l.map(point).filter((current, index, array) => {
          // Remove consecutive duplicate points
          // https://github.com/matthewrj/geojson-precision/blob/remove-duplicates/index.js

          /** Previous position */
          const previous = array[index - 1];
          return !(
            previous &&
            current.length === previous.length &&
            current.every((value, i) => value === previous[i])
          );
        })
      : l.map(point);

  /** Process Polygon Position */
  const poly = (p: Position[][]): Position[][] => p.map(multi);

  /** Process Mutil Polygon Position */
  const multiPoly = (m: Position[][][]): Position[][][] => m.map(poly);

  /** Process Feature */
  const feature = (obj: Feature): Feature =>
    Object.assign({}, obj, {
      geometry: geometry(obj.geometry),
    });

  /** Process FeatureCollection */
  const featureCollection = (f: FeatureCollection): FeatureCollection =>
    Object.assign({}, f, {
      features: f.features.map(feature),
    });
  /** Process GeometryCollection */
  const geometryCollection = (g: GeometryCollection): GeometryCollection =>
    Object.assign({}, g, {
      geometries: g.geometries.map(geometry),
    });

  const geometry = (obj: GeoJSON): GeoJSON => {
    switch (obj.type) {
      case 'Point':
        if (options.ignorePoint) {
          break;
        }
        obj.coordinates = point(obj.coordinates);
        break;
      case 'LineString':
        if (options.ignoreLineString) {
          break;
        }
        obj.coordinates = multi(obj.coordinates);
        break;
      case 'MultiPoint':
        if (options.ignorePoint) {
          break;
        }
        obj.coordinates = multi(obj.coordinates);
        break;
      case 'Polygon':
        if (options.ignorePolygon) {
          break;
        }
        obj.coordinates = poly(obj.coordinates);
        break;
      case 'MultiLineString':
        if (options.ignoreLineString) {
          break;
        }
        obj.coordinates = poly(obj.coordinates);
        break;
      case 'MultiPolygon':
        if (options.ignorePolygon) {
          break;
        }
        obj.coordinates = multiPoly(obj.coordinates);
        break;
      case 'GeometryCollection':
        obj.geometries = obj.geometries.map(geometry) as Geometry[];
        break;
      case 'FeatureCollection':
        break;
      default:
        throw new TypeError(
          `geojson-precision: ${obj.type} is unknown geojson type.`
        );
    }
    return obj;
  };

  switch (t.type) {
    case 'Feature':
      return feature(t);
    case 'GeometryCollection':
      return geometryCollection(t);
    case 'FeatureCollection':
      return featureCollection(t);
    case 'Point':
    case 'LineString':
    case 'Polygon':
    case 'MultiPoint':
    case 'MultiPolygon':
    case 'MultiLineString':
      return geometry(t);
    default:
      throw new TypeError(`geojson-precision: Unknown geojson type.`);
  }
}

/**
 * Omit Precision
 *
 * @param t - Geojson
 */
export function omit(t: GeoJSON): GeoJSON {
  return parse(t, 0, 0, Object.assign(defaults, { removeDuplicates: true }));
}
