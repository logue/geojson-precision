# geojson-precision-ts

[![jsdelivr CDN](https://data.jsdelivr.com/v1/package/npm/geojson-precision-ts/badge)](https://www.jsdelivr.com/package/npm/geojson-precision-ts)
[![NPM Downloads](https://img.shields.io/npm/dm/geojson-precision-ts.svg?style=flat)](https://www.npmjs.com/package/geojson-precision-ts)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/geojson-precision-ts/file/README.md)
[![npm version](https://img.shields.io/npm/v/geojson-precision-ts.svg)](https://www.npmjs.com/package/geojson-precision-ts)
[![Open in Gitpod](https://shields.io/badge/Open%20in-Gitpod-green?logo=Gitpod)](https://gitpod.io/#https://github.com/logue/geojson-precision)
[![Twitter Follow](https://img.shields.io/twitter/follow/logue256?style=plastic)](https://twitter.com/logue256)

Remove meaningless precision from your GeoJSON. If your coordinates go out to 7+ digits, you are [probably misrepresenting your data](http://gis.stackexchange.com/a/8674/14196). Most scenarios in which GeoJSON is useful (i.e. web-related applications) do not require survey-grade precision, and a higher value is placed on a compact file size. Trimming the precision of coordinates can greatly reduce file size, while removing the appearance of fake high precision.

This fork is rewritten in typescript.

## Installation

```sh
npm install geojson-precision-ts
```

or

```sh
yarn add geojson-precision-ts
```

## Usage

```js
parse(*geojson*, *precision*, *extrasPrecision*, *options*)
```

| Parameter       | Type    | Default   | Description                                                                                                                                                                                                                                                                                                                                                      |
| --------------- | ------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| geojson         | GeoJSON | undefined | `geojson` is a valid GeoJSON object, and can be of type `Point`, `LineString`, `Polygon`, `MultiPoint`, `MultiPolygon`, `MultiLineString`, `GeometryCollection`, `Feature`, or `FeatureCollection`. If you are unsure whether or not your GeoJSON object is valid, you can run it through a linter such as [geojsonhint](https://github.com/mapbox/geojsonhint). |
| precision       | number  | 6         | `precision` is a positive integer. If your specified `precision` value is greater than the precision of the input geometry, the output precision will be the same as the input. For example, if your input coordinates are `[10.0, 20.0]`, and you specify a `precision` of `5`, the output will be the same as the input.                                       |
| extrasPrecision | number  | 2         | `extrasPrecision` is a positive integer. If your specified `extrasPrecision` value is greater than the precision of the input geometry, the output precision will be the same as the input. For example, if your input coordinates are `[10.0, 20.0]`, and you specify a `precision` of `5`, the output will be the same as the input.                           |

`options` are bellows:

| Option           | Type    | Default | Description                            |
| ---------------- | ------- | ------- | -------------------------------------- |
| ignorePoint      | boolean | false   | Skip Point                             |
| ignoreLineString | boolean | false   | Skip LineString                        |
| ignorePolygon    | boolean | false   | Skip Polygon                           |
| removeDuplicates | boolean | false   | Delete points at the same coordinates. |

### Example

```js
import gp from 'geojson-precision-ts';

const trimmed = gp(
  {
    type: 'Point',
    coordinates: [18.984375, 57.32652122521709],
  },
  3
);
```

`trimmed` will now look like this:

```json
{
  "type": "Point",
  "coordinates": [18.984, 57.326]
}
```

## CLI

Geojson-precision can also be used via the command line when installed globally (using `-g`).

### Parameters

#### precision (-p)

A positive integer specifying coordinate precision

#### extras precision (-e)

A positive integer specifying extra coordinate precision for things like the z value when the coordinate is \[longitude, latitude, elevation\].

#### input

An input GeoJSON file

#### output

An output GeoJSON file

### Example use

```sh
geojson-precision -p 4 input.json output.json
```

## Inspiration

Concepts, ideas, etc borrowed to various degrees from:

- [wellknown](https://github.com/mapbox/wellknown/pull/18)
- [LilJSON](https://github.com/migurski/LilJSON)

## License

MIT
