/** GeoJSON Precision Options */
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

export const defaults: OptionsInterface = {
  ignorePoint: false,
  ignoreLineString: false,
  ignorePolygon: false,
  removeDuplicates: false,
};
