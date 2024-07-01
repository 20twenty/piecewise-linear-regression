import { Matrix } from 'sylvester-es6';
import { getXY, predict } from './matrixOperations';
import { gridSearch } from './gridSearch';
import { SeededPRNG } from './SeededPRNG';

export type CrossValidationResult = {
    knotCount: number;
    trainRMSE: number;
    testRMSE: number;
}

export function crossValidation(x: number[], y: number[], numberOfPossibleKnotsValues: number, knotCount: number, folds: number, refinementIterations: number, seededPRNG: SeededPRNG): CrossValidationResult {
    const foldSize = Math.floor(x.length / folds);
    const indices = Array.from(Array(x.length).keys());

    // Randomly shuffle indices
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(seededPRNG.nextFloat() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    let totalTrainRMSE = 0;
    let totalTestRMSE = 0;

    for (let i = 0; i < folds; i++) {
        const testIndices = indices.slice(i * foldSize, (i + 1) * foldSize).sort((a, b) => a - b);
        const trainIndices = indices.filter(index => !testIndices.includes(index)).sort((a, b) => a - b);

        const x_train = trainIndices.map(index => x[index]);
        const y_train = trainIndices.map(index => y[index]);
        const x_test = testIndices.map(index => x[index]);
        const y_test = testIndices.map(index => y[index]);

        const gridSearchResult = gridSearch(x_train, y_train, numberOfPossibleKnotsValues, knotCount, refinementIterations);
        totalTrainRMSE += gridSearchResult.RMSE;

        const { X: X_test } = getXY(x_test, y_test, gridSearchResult.model.knots);
        const y_test_pred = predict(X_test, new Matrix(gridSearchResult.model.betas));
        const RMSE = Math.sqrt(y_test_pred.reduce((sum, val, i) => sum + Math.pow(val - y_test[i], 2), 0) / y_test.length);

        totalTestRMSE += RMSE;
    }

    return {
        knotCount,
        trainRMSE: totalTrainRMSE / folds,
        testRMSE: totalTestRMSE / folds
    }
}
