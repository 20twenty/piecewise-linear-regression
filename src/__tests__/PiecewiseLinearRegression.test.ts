import { PiecewiseLinearRegression } from '../index';

describe('PiecewiseLinearRegression', () => {
    it('should correctly initialize and find the best knot count', () => {
        const y = [
            480908734.61,
            418598119.85,
            427460738.33,
            618999891.13,
            313439976.55,
            299484629.79,
            519625618.31,
            665667339.66,
            708570866.01,
            766344390.58,
            749944347.47,
            902043201.84,
            674475488.50,
            631845186.90,
            652163993.42,
            779891715.88,
            797533136.93,
            836989815.67,
            956302630.94,
            1124572881.12,
            1010948927.96
        ]

        const x = Array.from({ length: y.length }, (_, i) => i);

        const params = {
            x,
            y,
            numberOfPossibleKnotsValues: 10,
            maxKnotCount: 3,
            folds: 3,
        };

        const piecewiseLinearRegression = new PiecewiseLinearRegression(params);

        expect(piecewiseLinearRegression.getBestKnotCount()).toBeGreaterThan(0);
        expect(piecewiseLinearRegression.getBestTestRMSE()).toBeLessThan(Infinity);
    });
});
