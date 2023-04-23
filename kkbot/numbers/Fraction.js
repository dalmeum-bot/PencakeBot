function Rational(n, d) {
    if (d == 0) {
        throw new Error("Division by zero");
    }

    let negative = (n < 0) ^ (d < 0);

    this.numerator = Math.abs(n) * (negative ? -1 : 1);
    this.denominator = Math.abs(d);
}

Rational.prototype = {
    add(q) {
        return new Rational(
            this.numerator * q.denominator + q.numerator * this.denominator,
            this.denominator * q.denominator
        ).reduce();
    },

    sub(q) {
        return new Rational(
            this.numerator * q.denominator - q.numerator * this.denominator,
            this.denominator * q.denominator
        ).reduce();
    },

    mul(q) {
        return new Rational(
            this.numerator * q.numerator,
            this.denominator * q.denominator
        ).reduce();
    },

    div(q) {
        return new Rational(
            this.numerator * q.denominator,
            this.denominator * q.numerator
        ).reduce();
    },

    mod(q) {
        return new Rational(
            this.numerator * q.denominator % (this.denominator * q.numerator),
            this.denominator * q.denominator
        ).reduce();
    },

    pos() {
        return this;
    },

    neg() {
        return new Rational(-this.numerator, this.denominator);
    },



    inverse() {
        return new Rational(this.denominator, this.numerator);
    },

    reduce() {
        let gcd = (a, b) => b ? gcd(b, a % b) : a;
        let g = gcd(this.numerator, this.denominator);
        return new Rational(this.numerator / g, this.denominator / g);
    },

    toString() {
        return this.numerator + "/" + this.denominator;
    }
};

/**
 * @param {String | Number | Rational | undefined} numerator 
 * @param {String | Number | undefined} denominator 
 * @returns {Rational}
 */

// TODO: cycle
const _RATIONAL_FORMAT = /^\s*(?<sign>[-+]?)(?=\d|\.\d)(?<num>\d*|\d+(?:_\d+)*)(?:(?:[:/](?<denom>\d+(?:_\d+)*))?|(?:\.(?<decimal>|\d+(?:_\d+)*)?)?(?:[eE](?<exp>[-+]?\d+(?:_\d+)*))?)\s*$/;

module.exports = function Fraction(numerator, denominator) {
    if (numerator === undefined && denominator === undefined) {
        return new Rational(0, 1);
    } else if (denominator === undefined) {
        switch (numerator.constructor) {
            case Number:
                if (Number.isInteger(numerator)) {
                    return new Rational(numerator, 1);
                } else {
                    return Fraction(String(numerator));
                }
            case Rational:
                return numerator;
            case String:
                
            default:
                throw new TypeError("numerator should be a String or Number or Rational instance.");
        }
    } else {
        if (Number.isInteger(numerator) && Number.isInteger(denominator)) {
            return new Rational(numerator, denominator);
        } else {

        }
        return new Rational(numerator, denominator);
    }
};