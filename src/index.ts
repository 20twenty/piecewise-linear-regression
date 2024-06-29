import { Matrix } from 'sylvester-es6';

type Result = {
    RMSE: number;
    knots: number[];
    parameters: any[];
    table: number[][];
}

type CrossValidationResult = {
    trainRMSE: number;
    testRMSE: number;
}

type BestResult = {
    RMSE: number;
    knots: number[];
    parameters: number[];
    table: number[][];
};

function getXY(x: number[], y: number[], knots: number[]): { X: Matrix, Y: Matrix } {
    return {
        X: new Matrix(x.map(val => {
            let row = [1, val];
            knots.forEach(knot => row.push(Math.max(0, val - knot)));
            return row;
        })),
        Y: new Matrix(y.map(val => [val]))
    };
}

function fit(X: Matrix, Y: Matrix): Matrix {
    const inter = X.transpose().multiply(X).inverse();
    if (!inter) {
        throw new Error('inverse failed');
    }
    const parameters = X.transpose().multiply(X).inverse().multiply(X.transpose()).multiply(Y);
    return parameters;
}

function predict(X: Matrix, parameters: Matrix): number[] {
    return (X.multiply(parameters)).elements.map(row => row[0]);
}

function gridSearch(x: number[], y: number[], knotValues: number[], knotCount: number): BestResult {

    let bestResult: BestResult = { RMSE: Infinity, knots: [], parameters: [], table: [] };

    const combinations = (arr: number[], k: number): number[][] => {
        if (k === 0) return [[]];
        return arr.flatMap((v, i) => combinations(arr.slice(i + 1), k - 1).map(c => [v, ...c]));
    };

    const knotCombinations = combinations(knotValues, knotCount);

    for (const knots of knotCombinations) {

        const { X, Y } = getXY(x, y, knots);
        let parameters: Matrix;
        try {
            parameters = fit(X, Y);
        } catch (e) {
            continue;
        }
        const y_pred = predict(X, parameters);
        const RMSE = Math.sqrt(y_pred.reduce((sum, val, i) => sum + Math.pow(val - y[i], 2), 0) / y.length);

        if (RMSE < bestResult.RMSE) {
            bestResult = { RMSE, knots, parameters: parameters.elements.map(row => row[0]), table: x.map((val, i) => [val, y[i], y_pred[i]]) };
        }
    }

    if (bestResult.knots.length === 0) throw new Error('No best fit found');

    return bestResult;
}

function crossValidation(x: number[], y: number[], knotValues: number[], knotCount: number, folds: number): CrossValidationResult {
    // const knotValues = x.slice(1, x.length - 1);

    // create 20 equally spaced knotValues from min of x to max of x

    const foldSize = Math.floor(x.length / folds);
    const indices = Array.from(Array(x.length).keys());

    // Randomly shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let totalTrainRMSE = 0;
    let totalTestRMSE = 0;

    for (let i = 0; i < folds; i++) {
        const testIndices = indices.slice(i * foldSize, (i + 1) * foldSize).sort((a, b) => a - b);
        const trainIndices = indices.filter(index => !testIndices.includes(index)).sort((a, b) => a - b);

        // console.log(testIndices, trainIndices);

        const x_train = trainIndices.map(index => x[index]);
        const y_train = trainIndices.map(index => y[index]);
        const x_test = testIndices.map(index => x[index]);
        const y_test = testIndices.map(index => y[index]);

        const bestResult = gridSearch(x_train, y_train, knotValues, knotCount);
        totalTrainRMSE += bestResult.RMSE;

        const { X: X_test } = getXY(x_test, y_test, bestResult.knots);
        const y_test_pred = predict(X_test, new Matrix(bestResult.parameters));
        const RMSE = Math.sqrt(y_test_pred.reduce((sum, val, i) => sum + Math.pow(val - y_test[i], 2), 0) / y_test.length);

        totalTestRMSE += RMSE;
    }

    return {
        trainRMSE: totalTrainRMSE / folds,
        testRMSE: totalTestRMSE / folds
    }
}


type PiecewiseLinearRegressionParams = {
    x: number[];
    y: number[];
    numberOfPossibleKnotsValues?: number;
    maxKnotCount?: number;
    folds?: number;
}

// Define types for the results
export class PiecewiseLinearRegression {
    private bestKnotCount: number = 0;
    private bestTestRMSE: number = Infinity;
    private bestResult: Result | null = null;

    constructor(params: PiecewiseLinearRegressionParams) {

        const x = params.x;
        const y = params.y;
        const numberOfPossibleKnotsValues = params.numberOfPossibleKnotsValues || 20;
        const maxKnotCount = params.maxKnotCount || 5;
        const folds = params.folds || 5;

        const xMax = Math.max(...x);
        const xMin = Math.min(...x);
        const possibleKnotValues = Array.from({ length: numberOfPossibleKnotsValues }, (_, i) => xMin + i * (xMax - xMin) / numberOfPossibleKnotsValues);

        let bestKnotCount = 0;
        let bestTestRMSE = Infinity;

        for (let knotCount = 1; knotCount <= maxKnotCount; knotCount++) {
            const bestResult = crossValidation(x, y, possibleKnotValues, knotCount, folds);
            if (bestResult.testRMSE < bestTestRMSE) {
                bestTestRMSE = bestResult.testRMSE;
                bestKnotCount = knotCount;
            }
            console.log([knotCount, bestResult.trainRMSE.toFixed(4), bestResult.testRMSE.toFixed(4)].join(','));
        }

        console.log('Best Knot Count:', bestKnotCount);

        this.bestTestRMSE = bestTestRMSE;
        this.bestKnotCount = bestKnotCount;

        this.bestResult = gridSearch(x, y, possibleKnotValues, bestKnotCount);

        console.log('RMSE:', this.bestResult.RMSE);
        console.log('Knots:', this.bestResult.knots);
        console.log('Parameters:', this.bestResult.parameters);
        console.log('Table:');
        console.log(this.bestResult.table.map(row => row.join(',')).join('\n'));

    }

    getBestKnotCount(): number {
        return this.bestKnotCount;
    }

    getBestTestRMSE(): number {
        return this.bestTestRMSE;
    }

    getBestResult(): Result | null {
        return this.bestResult;
    }
}





// for (let i = 1; i <= 5; i++) {
//     const bestResult = crossValidation(x, y, i, 10);
//     if (bestResult.testRMSE < this.bestTestRMSE) {
//         this.bestTestRMSE = bestResult.testRMSE;
//         this.bestKnotCount = i;
//     }
//     console.log([i, bestResult.trainRMSE.toFixed(4), bestResult.testRMSE.toFixed(4)].join(','));
// }

// console.log('Best Knot Count:', this.bestKnotCount);

// this.bestResult = gridSearch(x, y, x.slice(1, x.length - 1), this.bestKnotCount);

// if (this.bestResult) {
//     console.log('RMSE:', this.bestResult.RMSE);
//     console.log('Knots:', this.bestResult.knots);
//     console.log('Parameters:', this.bestResult.parameters);
//     console.log('Table:');
//     console.log(this.bestResult.table.map(row => row.join(',')).join('\n'));
// }



// Example usage:
// const x = [1, 2, 3, 4, 5];
// const y = [2, 3, 5, 7, 11];
// const plr = new PiecewiseLinearRegression(x, y);
// console.log('Best Knot Count:', plr.getBestKnotCount());
// console.log('Best Test RMSE:', plr.getBestTestRMSE());
// console.log('Best Result:', plr.getBestResult());
