import { Matrix } from 'sylvester-es6';

export function getXY(x: number[], y: number[], knots: number[]): { X: Matrix, Y: Matrix } {
    return {
        X: new Matrix(x.map(val => {
            let row = [1, val];
            knots.forEach(knot => row.push(Math.max(0, val - knot)));
            return row;
        })),
        Y: new Matrix(y.map(val => [val]))
    };
}

export function fit(X: Matrix, Y: Matrix): Matrix {
    const inter = X.transpose().multiply(X).inverse();
    if (!inter) {
        throw new Error('inverse failed');
    }
    const betas = X.transpose().multiply(X).inverse().multiply(X.transpose()).multiply(Y);
    return betas;
}

export function predict(X: Matrix, BETAS: Matrix): number[] {
    return (X.multiply(BETAS)).elements.map(row => row[0]);
}
