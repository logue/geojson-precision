# geojson-precision-ts

[English README](./README.md)

GeoJSON の過剰な小数精度を削減するライブラリです。座標が小数点以下 7 桁以上ある場合、実際のデータ精度以上に見せてしまっていることがあります。多くの Web アプリ用途ではそこまでの精度は不要で、桁を落とすことでファイルサイズを小さくできます。

このフォークは TypeScript で書き直されています。

## インストール

```sh
pnpm install geojson-precision-ts
```

## 使い方

```js
parse(geojson, precision, extrasPrecision, options);
omit(geojson);
```

| パラメータ      | 型               | デフォルト | 説明                                                                                                                                                                                                                                                                                                      |
| --------------- | ---------------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| geojson         | GeoJSON          | undefined  | `Point` / `LineString` / `Polygon` / `MultiPoint` / `MultiPolygon` / `MultiLineString` / `GeometryCollection` / `Feature` / `FeatureCollection` を受け取ります。入力が妥当か不安な場合は [Ajv](https://ajv.js.org/) + [geojson-schema](https://www.npmjs.com/package/geojson-schema) で検証してください。 |
| precision       | number           | 6          | 座標の小数精度。正の整数。入力より高い精度を指定しても、入力以上にはなりません。                                                                                                                                                                                                                          |
| extrasPrecision | number           | 2          | 3D 座標の高度など、追加軸に適用する小数精度。正の整数。                                                                                                                                                                                                                                                   |
| options         | OptionsInterface | -          | 振る舞いを制御するオプション。                                                                                                                                                                                                                                                                            |

### options

| オプション       | 型      | デフォルト | 説明                          |
| ---------------- | ------- | ---------- | ----------------------------- |
| ignorePoint      | boolean | false      | Point を処理対象から除外      |
| ignoreLineString | boolean | false      | LineString を処理対象から除外 |
| ignorePolygon    | boolean | false      | Polygon を処理対象から除外    |
| removeDuplicates | boolean | false      | 同じ座標点を削除              |

`omit()` は `parse(t, 0, 0, { removeDuplicates: true })` のエイリアスで、GeoJSON の小数部を取り除きます。

## 精度の目安

`precision` は「どこまで誤差を許容するか」を表します。単位は度です。

```plain
小数点以下
の桁数   位          距離
-------  -------          --------
0        1                111  km
1        0.1              11.1 km
2        0.01             1.11 km
3        0.001            111  m
4        0.0001           11.1 m
5        0.00001          1.11 m
6        0.000001         11.1 cm
7        0.0000001        1.11 cm
8        0.00000001       1.11 mm
```

## 例

### parse()

```js
import { parse } from 'geojson-precision-ts';

const trimmed = parse(
  {
    type: 'Point',
    coordinates: [18.984375, 57.32652122521709],
  },
  3
);
```

結果:

```json
{
  "type": "Point",
  "coordinates": [18.984, 57.326]
}
```

### omit()

```js
import { omit } from 'geojson-precision-ts';

const omitted = omit({
  type: 'Point',
  coordinates: [18.984375, 57.32652122521709],
});
```

結果:

```json
{
  "type": "Point",
  "coordinates": [18, 57]
}
```

## CLI

グローバルインストールすると CLI としても利用できます。

```sh
geojson-precision -p 4 input.json output.json
```

### CLI パラメータ

- `-p, --precision`: 座標精度（正の整数）
- `-e, --extras-precision`: 追加軸（例: 高度）の精度（正の整数）
- `input`: 入力 GeoJSON ファイル
- `output`: 出力 GeoJSON ファイル

## ライセンス

MIT

- Original: [jczaplew/geojson-precision](https://github.com/jczaplew/geojson-precision)
- TypeScript port: [Logue](https://github.com/logue)
