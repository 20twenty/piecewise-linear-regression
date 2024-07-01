import { Matrix } from 'sylvester-es6';
import { getXY, fit, predict } from './matrixOperations';

export type GridSearchResult = {
    model: {
        knots: number[];
        betas: number[];
    }
    RMSE: number;
    table: number[][];
};

function findOptimalCombination(knotCombinations: number[][], x: number[], y: number[]): GridSearchResult {
    let gridSearchResult: GridSearchResult = { model: { knots: [], betas: [] }, RMSE: Infinity, table: [] };
    for (const knots of knotCombinations) {

        const { X, Y } = getXY(x, y, knots);
        let BETAS: Matrix;
        try {
            BETAS = fit(X, Y);
        } catch (e) {
            continue;
        }
        const y_pred = predict(X, BETAS);
        const RMSE = Math.sqrt(y_pred.reduce((sum, val, i) => sum + Math.pow(val - y[i], 2), 0) / y.length);

        if (RMSE < gridSearchResult.RMSE) {
            gridSearchResult = { model: { knots, betas: BETAS.elements.map(row => row[0]) }, RMSE, table: x.map((val, i) => [val, y[i], y_pred[i]]) };
        }
    }
    if (gridSearchResult.model.knots.length === 0) throw new Error('No best fit found');

    return gridSearchResult;
}

function generateRefinedCombinations(knots: number[], distance: number): number[][] {
    if (knots.length < 1) {
        throw new Error('The array of knots must have a length greater than 0');
    }

    const generateValues = (knot: number): number[] => {
        return [knot - distance, knot, knot + distance];
    };

    const generateAllCombinations = (index: number): number[][] => {
        if (index === knots.length) {
            return [[]];
        }

        const currentKnotValues = generateValues(knots[index]);
        const restCombinations = generateAllCombinations(index + 1);

        const allCombinations: number[][] = [];

        for (const value of currentKnotValues) {
            for (const combination of restCombinations) {
                const newCombination = [value, ...combination];
                if (isValidCombination(newCombination)) {
                    allCombinations.push(newCombination);
                }
            }
        }

        return allCombinations;
    };

    const isValidCombination = (combination: number[]): boolean => {
        for (let i = 1; i < combination.length; i++) {
            if (combination[i] <= combination[i - 1]) {
                return false;
            }
        }
        return true;
    };

    return generateAllCombinations(0);
}

function generateInitialCombinations(arr: number[], k: number): number[][] {
    if (k === 0) return [[]];
    return arr.flatMap((v, i) => generateInitialCombinations(arr.slice(i + 1), k - 1).map(c => [v, ...c]));
};

export function gridSearch(x: number[], y: number[], numberOfPossibleKnotsValues: number, knotCount: number, refinementIterations: number): GridSearchResult {
    const xMax = Math.max(...x);
    const xMin = Math.min(...x);

    // exhaustive rough cut of the search space
    const possibleKnotValues = Array.from({ length: numberOfPossibleKnotsValues }, (_, i) => xMin + i * (xMax - xMin) / numberOfPossibleKnotsValues);
    const knotCombinations = generateInitialCombinations(possibleKnotValues, knotCount);
    let gridSearchResult = findOptimalCombination(knotCombinations, x, y);

    // refine the search space around the best combination
    let factor = (xMax - xMin) / (2 * numberOfPossibleKnotsValues);
    for (let i = 0; i < refinementIterations; i++) {
        const knotCombinations = generateRefinedCombinations(gridSearchResult.model.knots, factor);
        gridSearchResult = findOptimalCombination(knotCombinations, x, y);
        factor /= 2;
    }

    return gridSearchResult;
}
