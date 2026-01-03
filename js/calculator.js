/* =====================================================
   NUMERICAL INTEGRATION CALCULATOR
   Semua metode integrasi numerik
   ===================================================== */

const Calculator = {
    // Parse function string to evaluable function
    parseFunction: function(funcStr) {
        try {
            const node = math.parse(funcStr);
            const compiled = node.compile();
            return function(x) {
                return compiled.evaluate({ x: x, e: Math.E, pi: Math.PI });
            };
        } catch (error) {
            console.error('Error parsing function:', error);
            return null;
        }
    },

    // Validate inputs
    validateInputs: function(funcStr, a, b, n) {
        if (!funcStr || funcStr.trim() === '') {
            return { valid: false, error: 'Masukkan fungsi f(x)' };
        }
        if (isNaN(a) || isNaN(b)) {
            return { valid: false, error: 'Batas harus berupa angka' };
        }
        if (a >= b) {
            return { valid: false, error: 'Batas bawah harus < batas atas' };
        }
        if (n < 1 || !Number.isInteger(n)) {
            return { valid: false, error: 'Jumlah partisi harus bilangan bulat positif' };
        }
        
        const f = this.parseFunction(funcStr);
        if (!f) {
            return { valid: false, error: 'Fungsi tidak valid' };
        }
        
        return { valid: true, f: f };
    },

    // =====================================================
    // RIEMANN LEFT
    // =====================================================
    riemannLeft: function(f, a, b, n) {
        const h = (b - a) / n;
        let sum = 0;
        const steps = [];
        const points = [];

        steps.push({
            desc: 'Hitung lebar partisi h',
            formula: `h = \\frac{b - a}{n} = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`
        });

        for (let i = 0; i < n; i++) {
            const xi = a + i * h;
            const fxi = f(xi);
            sum += fxi;
            points.push({ x: xi, y: fxi, type: 'left' });
            
            if (i < 5 || i === n - 1) {
                steps.push({
                    desc: `Partisi ${i + 1}`,
                    formula: `f(x_{${i}}) = f(${xi.toFixed(4)}) = ${fxi.toFixed(6)}`
                });
            } else if (i === 5) {
                steps.push({ desc: '...', formula: '' });
            }
        }

        const result = h * sum;
        steps.push({
            desc: 'Hasil akhir',
            formula: `I = h \\sum_{i=0}^{n-1} f(x_i) = ${h.toFixed(6)} \\times ${sum.toFixed(6)} = ${result.toFixed(6)}`
        });

        return { result, steps, points, h };
    },

    // =====================================================
    // RIEMANN RIGHT
    // =====================================================
    riemannRight: function(f, a, b, n) {
        const h = (b - a) / n;
        let sum = 0;
        const steps = [];
        const points = [];

        steps.push({
            desc: 'Hitung lebar partisi h',
            formula: `h = \\frac{b - a}{n} = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`
        });

        for (let i = 1; i <= n; i++) {
            const xi = a + i * h;
            const fxi = f(xi);
            sum += fxi;
            points.push({ x: xi, y: fxi, type: 'right' });
            
            if (i <= 5 || i === n) {
                steps.push({
                    desc: `Partisi ${i}`,
                    formula: `f(x_{${i}}) = f(${xi.toFixed(4)}) = ${fxi.toFixed(6)}`
                });
            } else if (i === 6) {
                steps.push({ desc: '...', formula: '' });
            }
        }

        const result = h * sum;
        steps.push({
            desc: 'Hasil akhir',
            formula: `I = h \\sum_{i=1}^{n} f(x_i) = ${h.toFixed(6)} \\times ${sum.toFixed(6)} = ${result.toFixed(6)}`
        });

        return { result, steps, points, h };
    },

    // =====================================================
    // RIEMANN MIDPOINT
    // =====================================================
    riemannMidpoint: function(f, a, b, n) {
        const h = (b - a) / n;
        let sum = 0;
        const steps = [];
        const points = [];

        steps.push({
            desc: 'Hitung lebar partisi h',
            formula: `h = \\frac{b - a}{n} = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`
        });

        for (let i = 0; i < n; i++) {
            const xi = a + (i + 0.5) * h;
            const fxi = f(xi);
            sum += fxi;
            points.push({ x: xi, y: fxi, type: 'mid' });
            
            if (i < 5 || i === n - 1) {
                steps.push({
                    desc: `Partisi ${i + 1} (titik tengah)`,
                    formula: `f(\\bar{x}_{${i}}) = f(${xi.toFixed(4)}) = ${fxi.toFixed(6)}`
                });
            } else if (i === 5) {
                steps.push({ desc: '...', formula: '' });
            }
        }

        const result = h * sum;
        steps.push({
            desc: 'Hasil akhir',
            formula: `I = h \\sum_{i=0}^{n-1} f(\\bar{x}_i) = ${h.toFixed(6)} \\times ${sum.toFixed(6)} = ${result.toFixed(6)}`
        });

        return { result, steps, points, h };
    },

    // =====================================================
    // TRAPEZOIDAL RULE
    // =====================================================
    trapezoidal: function(f, a, b, n) {
        const h = (b - a) / n;
        let sum = f(a) + f(b);
        const steps = [];
        const points = [{ x: a, y: f(a) }];

        steps.push({
            desc: 'Hitung lebar partisi h',
            formula: `h = \\frac{b - a}{n} = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`
        });

        steps.push({
            desc: 'Nilai di batas',
            formula: `f(a) = f(${a}) = ${f(a).toFixed(6)}, \\quad f(b) = f(${b}) = ${f(b).toFixed(6)}`
        });

        let interiorSum = 0;
        for (let i = 1; i < n; i++) {
            const xi = a + i * h;
            const fxi = f(xi);
            interiorSum += fxi;
            points.push({ x: xi, y: fxi });
            
            if (i <= 4) {
                steps.push({
                    desc: `Titik interior ${i}`,
                    formula: `f(x_{${i}}) = f(${xi.toFixed(4)}) = ${fxi.toFixed(6)}`
                });
            } else if (i === 5) {
                steps.push({ desc: '...', formula: '' });
            }
        }
        
        points.push({ x: b, y: f(b) });
        sum += 2 * interiorSum;

        const result = (h / 2) * sum;
        steps.push({
            desc: 'Hasil akhir',
            formula: `I = \\frac{h}{2} \\left[ f(a) + 2\\sum_{i=1}^{n-1} f(x_i) + f(b) \\right] = ${result.toFixed(6)}`
        });

        return { result, steps, points, h };
    },

    // =====================================================
    // SIMPSON 1/3
    // =====================================================
    simpson13: function(f, a, b, n) {
        // n must be even
        if (n % 2 !== 0) n++;
        
        const h = (b - a) / n;
        let sum = f(a) + f(b);
        const steps = [];
        const points = [{ x: a, y: f(a) }];

        steps.push({
            desc: 'Hitung lebar partisi h (n harus genap)',
            formula: `h = \\frac{b - a}{n} = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`
        });

        let oddSum = 0, evenSum = 0;
        for (let i = 1; i < n; i++) {
            const xi = a + i * h;
            const fxi = f(xi);
            points.push({ x: xi, y: fxi });
            
            if (i % 2 === 1) {
                oddSum += fxi;
            } else {
                evenSum += fxi;
            }
            
            if (i <= 4) {
                steps.push({
                    desc: `Titik x${i} (${i % 2 === 1 ? 'ganjil' : 'genap'})`,
                    formula: `f(x_{${i}}) = f(${xi.toFixed(4)}) = ${fxi.toFixed(6)}`
                });
            } else if (i === 5) {
                steps.push({ desc: '...', formula: '' });
            }
        }
        
        points.push({ x: b, y: f(b) });
        sum += 4 * oddSum + 2 * evenSum;

        const result = (h / 3) * sum;
        steps.push({
            desc: 'Hasil akhir',
            formula: `I = \\frac{h}{3} \\left[ f(a) + 4\\sum_{ganjil} + 2\\sum_{genap} + f(b) \\right] = ${result.toFixed(6)}`
        });

        return { result, steps, points, h, adjustedN: n };
    },

    // =====================================================
    // SIMPSON 3/8
    // =====================================================
    simpson38: function(f, a, b, n) {
        // n must be multiple of 3
        if (n % 3 !== 0) n = Math.ceil(n / 3) * 3;
        
        const h = (b - a) / n;
        let sum = f(a) + f(b);
        const steps = [];
        const points = [{ x: a, y: f(a) }];

        steps.push({
            desc: 'Hitung lebar partisi h (n harus kelipatan 3)',
            formula: `h = \\frac{b - a}{n} = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`
        });

        for (let i = 1; i < n; i++) {
            const xi = a + i * h;
            const fxi = f(xi);
            points.push({ x: xi, y: fxi });
            
            if (i % 3 === 0) {
                sum += 2 * fxi;
            } else {
                sum += 3 * fxi;
            }
            
            if (i <= 4) {
                const multiplier = i % 3 === 0 ? 2 : 3;
                steps.push({
                    desc: `Titik x${i} (koefisien ${multiplier})`,
                    formula: `f(x_{${i}}) = f(${xi.toFixed(4)}) = ${fxi.toFixed(6)}`
                });
            } else if (i === 5) {
                steps.push({ desc: '...', formula: '' });
            }
        }
        
        points.push({ x: b, y: f(b) });

        const result = (3 * h / 8) * sum;
        steps.push({
            desc: 'Hasil akhir',
            formula: `I = \\frac{3h}{8} \\left[ f(x_0) + 3f(x_1) + 3f(x_2) + 2f(x_3) + ... + f(x_n) \\right] = ${result.toFixed(6)}`
        });

        return { result, steps, points, h, adjustedN: n };
    },

    // =====================================================
    // ROMBERG INTEGRATION
    // =====================================================
    romberg: function(f, a, b, maxK = 4) {
        const R = [];
        const steps = [];

        steps.push({
            desc: 'Metode Romberg',
            formula: 'Menggunakan ekstrapolasi Richardson pada aturan trapesium'
        });

        for (let k = 0; k < maxK; k++) {
            R[k] = [];
            const n = Math.pow(2, k);
            const trap = this.trapezoidal(f, a, b, n);
            R[k][0] = trap.result;

            steps.push({
                desc: `R[${k}][0] dengan n=${n}`,
                formula: `T_{${n}} = ${R[k][0].toFixed(6)}`
            });
        }

        for (let j = 1; j < maxK; j++) {
            for (let k = j; k < maxK; k++) {
                const factor = Math.pow(4, j);
                R[k][j] = (factor * R[k][j-1] - R[k-1][j-1]) / (factor - 1);
                
                if (k === maxK - 1) {
                    steps.push({
                        desc: `R[${k}][${j}] (ekstrapolasi)`,
                        formula: `R[${k}][${j}] = \\frac{4^${j} \\cdot R[${k}][${j-1}] - R[${k-1}][${j-1}]}{4^${j} - 1} = ${R[k][j].toFixed(6)}`
                    });
                }
            }
        }

        const result = R[maxK-1][maxK-1];
        steps.push({
            desc: 'Hasil akhir (aproksimasi terbaik)',
            formula: `I \\approx R[${maxK-1}][${maxK-1}] = ${result.toFixed(6)}`
        });

        return { result, steps, R };
    },

    // =====================================================
    // COMPARE ALL METHODS
    // =====================================================
    compareAll: function(f, a, b, n, exactValue = null) {
        const results = [];

        // Trapezoidal
        const trap = this.trapezoidal(f, a, b, n);
        results.push({
            method: 'Aturan Trapesium',
            result: trap.result,
            steps: trap.steps,
            points: trap.points
        });

        // Simpson 1/3
        const s13 = this.simpson13(f, a, b, n);
        results.push({
            method: 'Simpson 1/3',
            result: s13.result,
            steps: s13.steps,
            points: s13.points,
            note: s13.adjustedN !== n ? `(n disesuaikan ke ${s13.adjustedN})` : ''
        });

        // Simpson 3/8
        const s38 = this.simpson38(f, a, b, n);
        results.push({
            method: 'Simpson 3/8',
            result: s38.result,
            steps: s38.steps,
            points: s38.points,
            note: s38.adjustedN !== n ? `(n disesuaikan ke ${s38.adjustedN})` : ''
        });

        // Calculate errors if exact value is provided
        if (exactValue !== null) {
            results.forEach(r => {
                r.exactValue = exactValue;
                r.absError = Math.abs(r.result - exactValue);
                r.relError = (r.absError / Math.abs(exactValue)) * 100;
            });
        }

        return results;
    },

    // =====================================================
    // CALCULATE EXACT VALUE (for known functions)
    // =====================================================
    getExactValue: function(funcStr, a, b) {
        // Known exact integrals
        const knownIntegrals = {
            'x^2': (a, b) => (Math.pow(b, 3) - Math.pow(a, 3)) / 3,
            'x^3': (a, b) => (Math.pow(b, 4) - Math.pow(a, 4)) / 4,
            'x': (a, b) => (Math.pow(b, 2) - Math.pow(a, 2)) / 2,
            'sin(x)': (a, b) => -Math.cos(b) + Math.cos(a),
            'cos(x)': (a, b) => Math.sin(b) - Math.sin(a),
            'e^x': (a, b) => Math.exp(b) - Math.exp(a),
            'exp(x)': (a, b) => Math.exp(b) - Math.exp(a),
            '1': (a, b) => b - a,
            '1/x': (a, b) => Math.log(b) - Math.log(a),
            'sqrt(x)': (a, b) => (2/3) * (Math.pow(b, 1.5) - Math.pow(a, 1.5)),
            'log(x)': (a, b) => b * (Math.log(b) - 1) - a * (Math.log(a) - 1)
        };

        const normalized = funcStr.toLowerCase().replace(/\s/g, '');
        
        if (knownIntegrals[normalized]) {
            return knownIntegrals[normalized](a, b);
        }
        
        return null;
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
