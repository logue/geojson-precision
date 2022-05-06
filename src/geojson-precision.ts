import type {
  Feature,
  FeatureCollection,
  GeoJSON,
  Geometry,
  GeometryCollection,
} from 'geojson';
import OptionsInterface from './OptionsInterface';

const parse = (
  t: GeoJSON,
  coordinatePrecision: number,
  extrasPrecision: number = 5,
  options: OptionsInterface = {
    ignorePoint: false,
    ignoreLineString: false,
    ignorePolygon: false,
  }
): GeoJSON => {
  const point = p =>
    p.map(
      (e, index: number) =>
        1 * e.toFixed(index < 2 ? coordinatePrecision : extrasPrecision)
    );

  const multi = l => l.map(point);

  const poly = p => p.map(multi);

  const multiPoly = m => m.map(poly);

  const feature = (obj): Feature =>
    Object.assign({}, obj, {
      geometry: geometry(obj.geometry),
    });
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
