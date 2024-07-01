# piecewise-linear-regression

A TypeScript implementation of piecewise linear regression with cross-validation and grid search to determine the optimal number of knots.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [API](#api)
  - [PiecewiseLinearRegressionParams](#piecewiselinearregressionparams)
  - [PiecewiseLinearRegression](#piecewiselinearregression)
    - [getCrossValidationResults()](#getcrossvalidationresults)
    - [getBestKnotCount()](#getbestknotcount)
    - [getModel()](#getmodel)
    - [getRMSE()](#getrmse)
    - [getPlotData()](#getplotdata)
- [Development](#development)
- [License](#license)

## Installation

To install the package, use npm:

```bash
npm install piecewise-linear-regression
```

## Usage

Here's an example of how to use the `PiecewiseLinearRegression` class:

```typescript
import { PiecewiseLinearRegression } from 'piecewise-linear-regression';

const x = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const y = [2, 4, 6, 5, 7, 8, 9, 10, 12, 14];

const plrParams = {
    x: x,
    y: y,
    numberOfPossibleKnotsValues: 10,
    maxKnotCount: 5,
    numFolds: 5,
    refinementIterations: 8
};

const plr = new PiecewiseLinearRegression(plrParams);

console.log(plr.getCrossValidationResults());
console.log(plr.getBestKnotCount());
console.log(plr.getModel());
console.log(plr.getRMSE());

const plotData = plr.getPlotData();
console.log(plotData.original);
console.log(plotData.fitted);
console.log(plotData.plotHtml);
```

### API

#### PiecewiseLinearRegressionParams

Parameters for initializing `PiecewiseLinearRegression`.

- `x`: `number[]` - Array of x values.
- `y`: `number[]` - Array of y values.
- `numberOfPossibleKnotsValues`: `number` (optional) - Number of possible knot values for the grid search. Default is 10.
- `maxKnotCount`: `number` (optional) - Maximum number of knots to evaluate. Default is 5.
- `numFolds`: `number` (optional) - Number of folds for cross-validation. Default is 5.
- `refinementIterations`: `number` (optional) - Number of refinement iterations. Default is 8.

#### PiecewiseLinearRegression

Class for performing piecewise linear regression.

##### `getCrossValidationResults()`

Returns the cross-validation results as an array of objects, each containing:
- `knotCount`: `number` - The number of knots.
- `trainRMSE`: `number` - The root mean squared error (RMSE) on the training set.
- `testRMSE`: `number` - The RMSE on the test set.

**Example:**

```json
[
  {
    "knotCount": 1,
    "trainRMSE": 105299414.99391018,
    "testRMSE": 145637666.0650324
  },
  {
    "knotCount": 2,
    "trainRMSE": 86685860.99063551,
    "testRMSE": 133999506.11119208
  },
  {
    "knotCount": 3,
    "trainRMSE": 63138045.08756206,
    "testRMSE": 122360808.70402923
  },
  {
    "knotCount": 4,
    "trainRMSE": 45925209.68797879,
    "testRMSE": 187103043.9565541
  },
  {
    "knotCount": 5,
    "trainRMSE": 35060547.07612642,
    "testRMSE": 106186937.9715987
  }
]
```

##### `getBestKnotCount()`

Returns the best knot count determined by cross-validation.

**Example:**

```javascript
const bestKnotCount = plr.getBestKnotCount();
console.log(bestKnotCount); // 5
```

##### `getModel()`

Returns the fitted model as an object containing:
- `knots`: `number[]` - The positions of the knots.
- `betas`: `number[]` - The coefficients for the piecewise linear segments.

**Example:**

```javascript
const model = plr.getModel();
console.log(model);
// {
//   knots: [2020.1442522321427, 2020.3200334821431, 2020.8752790178569, 2022.0443638392858, 2022.352678571429],
//   betas: [-341218523983.126, 169192303.77881718, -2635458768.356966, 3347396804.36822, -675523302.5786195, -1157763747.8393607, 1218123646.153238]
// }
```

##### `getRMSE()`

Returns the root mean squared error (RMSE) of the fitted model.

**Example:**

```javascript
const rmse = plr.getRMSE();
console.log(rmse); // 45600885.60747723
```

##### `getPlotData()`

Returns an object containing the original data, fitted data, and HTML for plotting.

**Example:**

```javascript
const plotData = plr.getPlotData();
console.log(plotData);
/*
{
  original: {
    x: [2019.25, 2019.5, 2019.75, 2020, 2020.25, 2020.5, 2020.75, 2021, 2021.25, 2021.5, 2021.75, 2022, 2022.25, 2022.5, 2022.75, 2023, 2023.25, 2023.5, 2023.75, 2024, 2024.25],
    y: [480908734.61, 418598119.85, 427460738.33, 618999891.13, 313439976.55, 299484629.79, 519625618.31, 665667339.66, 708570866.01, 766344390.58, 749944347.47, 902043201.84, 674475488.5, 631845186.9, 652163993.42, 779891715.88, 797533136.93, 836989815.67, 956302630.94, 1124572881.12, 1010948927.96]
  },
  fitted: {
    x: [2019.25, 2020.1442522321427, 2020.3200334821431, 2020.8752790178569, 2022.0443638392858, 2022.352678571429, 2024.25],
    y: [423035422.25061035, 574336017.5661621, 140812615.5883789, 630056303.138794, 870428369.5217285, 576864428.3261719, 1081489194.3897705]
  },
  plotHtml: '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><script src="https://cdn.plot.ly/plotly-latest.min.js"></script><title>Scatter and Line Plot</title><style>body, html {width: 100%;height: 100%;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;}#plot-container {width: 100%;max-width: 1200px;height: 50vw;max-height: 800px;}#plot {width: 100%;height: 100%;}</style></head><body><div id="plot-container"><div id="plot"></div></div><script>var traceOrig = {x: [2019.25,2019.5,2019.75,2020,2020.25,2020.5,2020.75,2021,2021.25,2021.5,2021.75,2022,2022.25,2022.5,2022.75,2023,2023.25,2023.5,2023.75,2024,2024.25],y: [480908734.61,418598119.85,427460738.33,618999891.13,313439976.55,299484629.79,519625618.31,665667339.66,708570866.01,766344390.58,749944347.47,902043201.84,674475488.5,631845186.9,652163993.42,779891715.88,797533136.93,836989815.67,956302630.94,1124572881.12,1010948927.96],mode: 'lines+markers',type: 'scatter',name: 'Original Data',line: {dash: 'dot',width: 1,color: 'rgb(31, 119, 180)'},marker: {size: 14,color: 'rgb(31, 119, 180)'}};var traceFit = {x: [2019.25,2020.1442522321427,2020.3200334821431,2020.8752790178569,2022.0443638392858,2022.352678571429,2024.25],y: [423035422.25061035,574336017.5661621,140812615.5883789,630056303.138794,870428369.5217285,576864428.3261719,1081489194.3897705],mode: 'lines',type: 'scatter',name: 'PLR Fit',line: {dash: 'solid',width: 3,color: 'rgb(255, 127, 14)'}};var data = [traceOrig, traceFit];var layout = {title: 'Scatter and Line Plot',xaxis: {title: 'X Axis'},yaxis: {title: 'Y Axis'},autosize: true};Plotly.newPlot('plot', data, layout, {responsive: true});</script></body></html>'
}
*/
```

## Development

To build the project, run:

```bash
npm run build
```

To test the project, run:

```bash
npm run disttest
npm run srctest
```

## License

This project is licensed under the ISC License. See the LICENSE file for details.
