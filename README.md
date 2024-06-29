# Piecewise Linear Regression

A TypeScript module for performing piecewise linear regression.

## Installation

```bash
npm install piecewise-linear-regression
```

## Usage
```node
import { piecewiseLinearRegression } from 'piecewise-linear-regression';

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  // more data points
];

const result = piecewiseLinearRegression(data);
console.log(result);
```

## API

```node
piecewiseLinearRegression(data: { x: number, y: number }[]): string
```
 - `data`: An array of objects with `x` and `y` properties representing the data points.
 - Returns a string with the result of the piecewise linear regression.

