/** GeoJSON Precision Options */
export default interface OptionsInterface {
  /** Ignore Point */
  ignorePoint: boolean;
  /** Ignore LineString */
  ignoreLineString: boolean;
  /** Ignore Polygon */
  ignorePolygon: boolean;
  /** Remove consecutive duplicate points */
  removeDuplicates: boolean;
}
