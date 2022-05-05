import type {
  Feature,
  FeatureCollection,
  GeoJSON,
  Geometry,
  GeometryCollection,
} from 'geojson';

const parse = (
  t: GeoJSON,
  coordinatePrecision: number,
  extrasPrecision: number = 6
): GeoJSON => {
  const point = p =>
    p.map(
      (e, index: number) =>
        1 * e.toFixed(index < 2 ? coordinatePrecision : extrasPrecision)
    );

  const multi = l => l.map(point);

  const poly = p => p.map(multi);

  const multiPoly = m => m.map(poly);

  const feature = (obj): Feature => {
    obj.geometry = geometry(obj.geometry);
    return obj;
  };

  const featureCollection = (f: FeatureCollection): FeatureCollection => {
    f.features = f.features.map(feature);
    return f;
  };

  const geometryCollection = (g: GeometryCollection): GeometryCollection => {
    g.geometries = g.geometries.map(geometry) as Geometry[];
    return g;
  };

  const geometry = (obj: GeoJSON) => {
    switch (obj.type) {
      case 'Point':
        obj.coordinates = point(obj.coordinates);
        return obj;
      case 'LineString':
      case 'MultiPoint':
        obj.coordinates = multi(obj.coordinates);
        return obj;
      case 'Polygon':
      case 'MultiLineString':
        obj.coordinates = poly(obj.coordinates);
        return obj;
      case 'MultiPolygon':
        obj.coordinates = multiPoly(obj.coordinates);
        return obj;
      case 'GeometryCollection':
        obj.geometries = obj.geometries.map(geometry) as Geometry[];
        return obj;
      case 'FeatureCollection':
        return obj;
      default:
        throw new Error(
          `geojson-precision: ${obj.type} is unknown geojson type.`
        );
    }
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
