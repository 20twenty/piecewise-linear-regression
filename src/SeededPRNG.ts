/**
 * A pseudo-random number generator (PRNG) that can be seeded.
 * Uses the linear congruential generator (LCG) algorithm.
 */
export class SeededPRNG {
    private seed: number;

    /**
     * Creates an instance of SeededPRNG.
     * @param {number} seed - The initial seed value.
     */
    constructor(seed: number) {
        this.seed = seed % 2147483647;
        if (this.seed <= 0) {
            this.seed += 2147483646;
        }
    }

    /**
     * Generates the next pseudo-random number in the sequence.
     * @returns {number} The next pseudo-random number.
     */
    public next(): number {
        this.seed = (this.seed * 16807) % 2147483647;
        return this.seed;
    }

    /**
     * Generates the next pseudo-random floating-point number in the sequence.
     * @returns {number} The next pseudo-random floating-point number between 0 and 1.
     */
    public nextFloat(): number {
        return (this.next() - 1) / 2147483646;
    }
}
