import * as fs from 'fs';
import * as path from 'path';
import { PiecewiseLinearRegression, PiecewiseLinearRegressionParams } from '../index';

describe('20 qrtrs of VUG earnings', () => {
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
        ];

        const x = Array.from({ length: y.length }, (_, i) => 2019.25 + i/4);

        const numberOfPossibleKnotsValues = 14;
        const maxKnotCount = 5;
        const numFolds = 5;
        const refinementIterations = 8;

        const params: PiecewiseLinearRegressionParams = {x, y, numberOfPossibleKnotsValues, maxKnotCount, numFolds, refinementIterations};

        const plr = new PiecewiseLinearRegression(params);
        const cvResults = plr.getCrossValidationResults();
        const bestKnotCount = plr.getBestKnotCount();
        const model = plr.getModel();
        const plotData = plr.getPlotData();
        const rmse = plr.getRMSE();

        console.log('Cross Validation Results:', cvResults);
        console.log('Best Knot Count:', bestKnotCount);
        console.log('RMSE:', rmse);
        console.log('Model:', model);
        console.log('Plot Data:', plotData);

        const filePath = path.join(global.testOutputDir, '20QrtrsVugEarnings' + '.plot.html');
        fs.writeFileSync(filePath, plotData.plotHtml, 'utf8');
        console.log(`HTML file has been generated at: ${filePath}`);

        expect(cvResults.length).toBe(maxKnotCount);
        expect(bestKnotCount).toBe(3);
        expect(model).not.toBeNull();
        expect(plotData).not.toBeNull();
        expect(rmse).toBeLessThan(Infinity);

    });
});

describe('20 qrtrs of VUG earnings', () => {
    it('should correctly initialize and find the best knot count', () => {
        const y = [
            12.46,
            12.65,
            12.94,
            12.37,
            11.51,
            10.85,
            10.94,
            9.23,
            8.28,
            9.99,
            9.42,
            10.18,
            9.99,
            9.23,
            8.28,
            7.99,
            7.99,
            8.37,
            7.99,
            7.61,
            7.8,
            7.33,
            7.9,
            6.85,
            6.57,
            6.66,
            6.47,
            6.66,
            6.76,
            7.9,
            7.71,
            7.9,
            8.66,
            8.28,
            8.47,
            8.47,
            8.85,
            8.66,
            8.94,
            9.9,
            9.23,
            9.13,
            9.8,
            10,
            10.1,
            10.4,
            11.7,
            14,
            16.5,
            19.3,
            19,
            16.9,
            16.8,
            17.3,
            17.3,
            17.9,
            17.5,
            17.3,
            17.1,
            17.1,
            15.9,
            14.3,
            12.9,
            13.2,
            13.6,
            13.8,
            14.1,
            14.2,
            14,
            13.9,
            14.1,
            15.7,
            16.9,
            17.4,
            17.8,
            18.2,
            21.5,
            23.7,
            24,
            23.5,
            25.4,
            26.5,
            26.6,
            26.9,
            26.7,
            26.8,
            27.6,
            28.6,
            29,
            29.3,
            29.8,
            30,
            30.4,
            30.9,
            31.2,
            31.8,
            32.9,
            34.1,
            35.6,
            37.8,
            39.8,
            41.1,
            42.6,
            46.6,
            52.1,
            55.6,
            58.5,
            62.5,
            68.3,
            77.8,
            87,
            94.3,
            97.8,
            101.9,
            105.5,
            109.6,
            111.2,
            115.7,
            121.1,
            127.4,
            134.6,
            138.1,
            142.6,
            146.2,
            150.3,
            154.4,
            159.1,
            161.6,
            164.3,
            168.8,
            175.1,
            177.1,
            181.7,
            185.2,
            190.7,
            198.3,
            202.42,
            211.08,
            211.14,
            216.69,
            220.22,
            226.66,
            230.28,
            233.92,
            233.71,
            236.92,
            242.84,
            247.87,
            251.71,
            257.97,
            261.58,
            281.15,
            299.17,
            308.42,
            313.55,
        ].map(val => Math.log10(val))

        const x = Array.from({ length: y.length }, (_, i) => 1871 + i);

        const params: PiecewiseLinearRegressionParams = {
            x,
            y,
            maxKnotCount: 10,
            // numFolds: 5,
            // refinementIterations: 8,
            // numberOfPossibleKnotsValues: 10
        };

        const plr = new PiecewiseLinearRegression(params);
        const cvResults = plr.getCrossValidationResults();
        const bestKnotCount = plr.getBestKnotCount();
        const model = plr.getModel();
        const plotData = plr.getPlotData();
        const rmse = plr.getRMSE();

        console.log('Cross Validation Results:', cvResults);
        console.log('Best Knot Count:', bestKnotCount);
        console.log('RMSE:', rmse);
        console.log('Model:', model);
        console.log('Plot Data:', plotData);

        const filePath = path.join(global.testOutputDir, 'cpiByYear' + '.plot.html');
        fs.writeFileSync(filePath, plotData.plotHtml, 'utf8');
        console.log(`HTML file has been generated at: ${filePath}`);

        expect(cvResults.length).toBe(5);
        expect(bestKnotCount).toBe(3);
        expect(model).not.toBeNull();
        expect(plotData).not.toBeNull();
        expect(rmse).toBeLessThan(Infinity);

    });
});