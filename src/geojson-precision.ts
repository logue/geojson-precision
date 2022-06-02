import type {
  Feature,
  FeatureCollection,
  GeoJSON,
  Geometry,
  GeometryCollection,
  Position,
} from 'geojson';
import type OptionsInterface from './OptionsInterface';

const parse = (
  t: GeoJSON,
  coordinatePrecision: number = 6,
  extrasPrecision: number = 2,
  options: OptionsInterface = {
    ignorePoint: false,
    ignoreLineString: false,
    ignorePolygon: false,
    removeDuplicates: false,
  }
): GeoJSON => {
  /** Process Point */
  const point = (p: number[] | bigint[]) =>
    p.map(
      (e, index: number) =>
        1 * e.toFixed(index < 2 ? coordinatePrecision : extrasPrecision)
    );

  /** Process LineString Position */
  const multi = (l: Position[]): Position[] =>
    options.removeDuplicates
      ? l.map(point).filter((current, index, array) => {
          // Remove consecutive duplicate points
          // https://github.com/matthewrj/geojson-precision/blob/remove-duplicates/index.js

          /** Previous position */
          const previous: Position = array[index - 1];
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
  const geometryCollection = (g: GeometryCollection): GeometryCollection =>
    Object.assign({}, g, {
      geometries: g.geometries.map(geometry),
    });

  const geometry = (obj: GeoJSON) => {
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
        throw new Error(
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
      throw new Error(`geojson-precision: Unknown geojson type.`);
  }
};

export { parse as default };
