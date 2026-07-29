/** Options for {@link parse} */
export type GeojsonPrecisionOption = {
  /** Ignore Point */
  ignorePoint: boolean;
  /** Ignore LineString */
  ignoreLineString: boolean;
  /** Ignore Polygon */
  ignorePolygon: boolean;
  /** Remove consecutive duplicate points */
  removeDuplicates: boolean;
};

/** Default option values */
export const GeojsonPrecisionOption: GeojsonPrecisionOption = {
  ignorePoint: false,
  ignoreLineString: false,
  ignorePolygon: false,
  removeDuplicates: true,
};
