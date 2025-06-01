import type {
  Feature,
  FeatureCollection,
  GeoJSON,
  Geometry,
  GeometryCollection,
  Position,
} from 'geojson';

export interface OptionsInterface {
  /** Ignore Point */
  ignorePoint: boolean;
  /** Ignore LineString */
  ignoreLineString: boolean;
  /** Ignore Polygon */
  ignorePolygon: boolean;
  /** Remove consecutive duplicate points */
  removeDuplicates: boolean;
}

/** Default option values */
const defaults: OptionsInterface = {
  ignorePoint: false,
  ignoreLineString: false,
  ignorePolygon: false,
  removeDuplicates: true,
};

/**
 * Geojson Precision
 *
 * @param t - Target GeoJSON Source
 * @param precision - Decimal places to omit from position.
 * @param extraPrecision - Decimal places to leave from position.
 * @param options - Options. @see OptionsInterface
 */
export function parse(
  t: GeoJSON,
  precision = 6,
  extraPrecision = 2,
  options: Partial<OptionsInterface> = defaults
): GeoJSON {
  const config = { ...defaults, ...options };

  if (precision < 0 || extraPrecision < 0) {
    throw new RangeError(
      'geojson-precision: precision and extraPrecision must be positive values.'
    );
  }
  if (extraPrecision > precision) {
    throw new RangeError(
      'geojson-precision: extraPrecision must be lower than or equal to precision.'
    );
  }

  const roundValue = (value: number, index: number): number =>
    +value.toFixed(index < 2 ? precision : extraPrecision);

  const isDuplicate = (a: Position, b: Position): boolean =>
    a.length === b.length && a.every((v, i) => v === b[i]);

  /** Process Point */
  const point = (p: Position): Position => p.map(roundValue);

  /** Process LineString Position */
  const multi = (coords: Position[]): Position[] => {
    const transformed = coords.map(point);
    return config.removeDuplicates
      ? transformed.filter(
          (curr, i, arr) => i === 0 || !isDuplicate(curr, arr[i - 1])
        )
      : transformed;
  };

  /** Process Polygon Position */
  const poly = (rings: Position[][]): Position[][] => rings.map(multi);

  /** Process Mutil Polygon Position */
  const multiPoly = (polys: Position[][][]): Position[][][] => polys.map(poly);

  const transformFeature = (f: Feature): Feature => ({
    ...f,
    geometry: geometry(f.geometry),
  });

  /** Process FeatureCollection */
  const transformFeatureCollection = (
    fc: FeatureCollection
  ): FeatureCollection => ({
    ...fc,
    features: fc.features.map(transformFeature),
  });

  /** Process GeometryCollection */
  const transformGeometryCollection = (
    gc: GeometryCollection
  ): GeometryCollection => ({
    ...gc,
    geometries: gc.geometries.map(geometry),
  });

  /** Process Geometry */
  const geometry = (geom: Geometry): Geometry => {
    switch (geom.type) {
      case 'Point':
        if (!config.ignorePoint) geom.coordinates = point(geom.coordinates);
        break;
      case 'MultiPoint':
        if (!config.ignorePoint) geom.coordinates = multi(geom.coordinates);
        break;
      case 'LineString':
        if (!config.ignoreLineString)
          geom.coordinates = multi(geom.coordinates);
        break;
      case 'MultiLineString':
        if (!config.ignoreLineString) geom.coordinates = poly(geom.coordinates);
        break;
      case 'Polygon':
        if (!config.ignorePolygon) geom.coordinates = poly(geom.coordinates);
        break;
      case 'MultiPolygon':
        if (!config.ignorePolygon)
          geom.coordinates = multiPoly(geom.coordinates);
        break;
      case 'GeometryCollection':
        geom.geometries = geom.geometries.map(geometry);
        break;
      default:
        throw new TypeError(`geojson-precision: Unknown geometry type.`);
    }
    return geom;
  };

  switch (t.type) {
    case 'Feature':
      return transformFeature(t);
    case 'FeatureCollection':
      return transformFeatureCollection(t);
    case 'GeometryCollection':
      return transformGeometryCollection(t);
    case 'Point':
    case 'MultiPoint':
    case 'LineString':
    case 'MultiLineString':
    case 'Polygon':
    case 'MultiPolygon':
      return geometry(t);
    default:
      throw new TypeError(`geojson-precision: Unknown GeoJSON type.`);
  }
}

/**
 * Omit Precision
 *
 * @param t - Geojson
 */
export function omit(t: GeoJSON): GeoJSON {
  return parse(t, 0, 0, { ...defaults, removeDuplicates: true });
}
