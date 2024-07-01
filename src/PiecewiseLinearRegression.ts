import { SeededPRNG } from './SeededPRNG';
import { PlotGenerator } from './PlotGenerator';
import { crossValidation, CrossValidationResult } from './crossValidation';
import { gridSearch, GridSearchResult } from './gridSearch';
import { Matrix } from 'sylvester-es6';
import { getXY, predict } from './matrixOperations';

export type PiecewiseLinearRegressionParams = {
    x: number[];
    y: number[];
    numberOfPossibleKnotsValues?: number;
    maxKnotCount?: number;
    numFolds?: number;
    refinementIterations?: number;
}

export class PiecewiseLinearRegression {
    private cvResults: CrossValidationResult[] = [];
    private bestKnotCount: number;
    private gridSearchResult: GridSearchResult;
    private _seededPRNG = new SeededPRNG(161);

    constructor(private params: PiecewiseLinearRegressionParams) {
        const x = params.x;
        const y = params.y;
        const numberOfPossibleKnotsValues = params.numberOfPossibleKnotsValues || 10;
        const maxKnotCount = params.maxKnotCount || 5;
        const numFolds = params.numFolds || 5;
        const refinementIterations = params.refinementIterations || 8;

        // Learn the best knot count
        for (let knotCount = 1; knotCount <= maxKnotCount; knotCount++) {
            const cvResult = crossValidation(x, y, numberOfPossibleKnotsValues, knotCount, numFolds, refinementIterations, this._seededPRNG);
            this.cvResults.push(cvResult);
        }
        this.bestKnotCount = this.cvResults.reduce((best, result) => result.testRMSE < best.testRMSE ? result : best, this.cvResults[0]).knotCount;

        // Fit the model with the best knot count
        this.gridSearchResult = gridSearch(x, y, numberOfPossibleKnotsValues, this.bestKnotCount, refinementIterations);
    }

    getCrossValidationResults(): CrossValidationResult[] {
        return this.cvResults;
    }

    getBestKnotCount(): number {
        return this.bestKnotCount;
    }

    getModel(): GridSearchResult["model"] {
        return this.gridSearchResult.model;
    }

    getRMSE(): number {
        return this.gridSearchResult.RMSE;
    }

    getPlotData(): { original: { x: number[], y: number[] }, fitted: { x: number[], y: number[] }, plotHtml: string } {
        if (!this.gridSearchResult) throw new Error('Model not fitted yet');

        const x_knots = [Math.min(...this.params.x), ...this.gridSearchResult.model.knots, Math.max(...this.params.x)];
        const { X: X_KNOTS } = getXY(x_knots, this.params.y, this.gridSearchResult.model.knots);
        const y_knots = predict(X_KNOTS, new Matrix(this.gridSearchResult.model.betas));

        const plotHtml = new PlotGenerator(this.params.x, this.params.y, x_knots, y_knots).getHtml();

        return {
            original: {
                x: this.params.x,
                y: this.params.y
            },
            fitted: {
                x: x_knots,
                y: y_knots
            },
            plotHtml
        }
    }
}
