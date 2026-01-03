/**
 * NumIntegral - Numerical Integration Methods
 * Implementasi 4 metode integrasi numerik
 */

/**
 * Metode Trapesium (Trapezoidal Rule)
 * Rumus: h/2 * [f(x0) + 2*f(x1) + 2*f(x2) + ... + 2*f(xn-1) + f(xn)]
 * 
 * @param {Function} f - Fungsi yang akan diintegrasikan
 * @param {number} a - Batas bawah
 * @param {number} b - Batas atas
 * @param {number} n - Jumlah partisi
 * @returns {object} - { result, steps, h }
 */
function trapezoidalMethod(f, a, b, n) {
    const h = (b - a) / n;
    let sum = f(a) + f(b);
    const steps = [];
    
    steps.push({ x: a, fx: f(a), coefficient: 1, label: 'x₀' });
    
    for (let i = 1; i < n; i++) {
        const x = a + i * h;
        const fx = f(x);
        sum += 2 * fx;
        steps.push({ x: x, fx: fx, coefficient: 2, label: `x${i}` });
    }
    
    steps.push({ x: b, fx: f(b), coefficient: 1, label: `x${n}` });
    
    return {
        result: (h / 2) * sum,
        steps: steps,
        h: h,
        formula: 'I ≈ (h/2) × [f(x₀) + 2Σf(xᵢ) + f(xₙ)]'
    };
}

/**
 * Metode Simpson 1/3
 * Rumus: h/3 * [f(x0) + 4*f(x1) + 2*f(x2) + 4*f(x3) + ... + f(xn)]
 * Syarat: n harus genap
 * 
 * @param {Function} f - Fungsi yang akan diintegrasikan
 * @param {number} a - Batas bawah
 * @param {number} b - Batas atas
 * @param {number} n - Jumlah partisi (harus genap)
 * @returns {object} - { result, steps, h, adjustedN, warning }
 */
function simpson13Method(f, a, b, n) {
    let adjustedN = n;
    let warning = null;
    
    if (n % 2 !== 0) {
        adjustedN = n + 1;
        warning = `n harus genap. Disesuaikan: ${n} → ${adjustedN}`;
    }
    
    const h = (b - a) / adjustedN;
    let sum = f(a) + f(b);
    const steps = [];
    
    steps.push({ x: a, fx: f(a), coefficient: 1, label: 'x₀' });
    
    for (let i = 1; i < adjustedN; i++) {
        const x = a + i * h;
        const fx = f(x);
        const coef = (i % 2 === 0) ? 2 : 4;
        sum += coef * fx;
        steps.push({ x: x, fx: fx, coefficient: coef, label: `x${i}` });
    }
    
    steps.push({ x: b, fx: f(b), coefficient: 1, label: `x${adjustedN}` });
    
    return {
        result: (h / 3) * sum,
        steps: steps,
        h: h,
        adjustedN: adjustedN,
        warning: warning,
        formula: 'I ≈ (h/3) × [f(x₀) + 4Σf(xᵢ ganjil) + 2Σf(xᵢ genap) + f(xₙ)]'
    };
}

/**
 * Metode Simpson 3/8
 * Rumus: 3h/8 * [f(x0) + 3*f(x1) + 3*f(x2) + 2*f(x3) + ...]
 * Syarat: n harus kelipatan 3
 * 
 * @param {Function} f - Fungsi yang akan diintegrasikan
 * @param {number} a - Batas bawah
 * @param {number} b - Batas atas
 * @param {number} n - Jumlah partisi (harus kelipatan 3)
 * @returns {object} - { result, steps, h, adjustedN, warning }
 */
function simpson38Method(f, a, b, n) {
    let adjustedN = n;
    let warning = null;
    
    if (n % 3 !== 0) {
        adjustedN = Math.ceil(n / 3) * 3;
        warning = `n harus kelipatan 3. Disesuaikan: ${n} → ${adjustedN}`;
    }
    
    const h = (b - a) / adjustedN;
    let sum = f(a) + f(b);
    const steps = [];
    
    steps.push({ x: a, fx: f(a), coefficient: 1, label: 'x₀' });
    
    for (let i = 1; i < adjustedN; i++) {
        const x = a + i * h;
        const fx = f(x);
        const coef = (i % 3 === 0) ? 2 : 3;
        sum += coef * fx;
        steps.push({ x: x, fx: fx, coefficient: coef, label: `x${i}` });
    }
    
    steps.push({ x: b, fx: f(b), coefficient: 1, label: `x${adjustedN}` });
    
    return {
        result: (3 * h / 8) * sum,
        steps: steps,
        h: h,
        adjustedN: adjustedN,
        warning: warning,
        formula: 'I ≈ (3h/8) × [f(x₀) + 3Σf(xᵢ) + 2Σf(x₃ₖ) + f(xₙ)]'
    };
}

/**
 * Metode Midpoint (Titik Tengah)
 * Rumus: h * Σf(x_mid) untuk setiap interval
 * 
 * @param {Function} f - Fungsi yang akan diintegrasikan
 * @param {number} a - Batas bawah
 * @param {number} b - Batas atas
 * @param {number} n - Jumlah partisi
 * @returns {object} - { result, steps, h }
 */
function midpointMethod(f, a, b, n) {
    const h = (b - a) / n;
    let sum = 0;
    const steps = [];
    
    for (let i = 0; i < n; i++) {
        const xLeft = a + i * h;
        const xRight = a + (i + 1) * h;
        const xMid = (xLeft + xRight) / 2;
        const fx = f(xMid);
        
        sum += fx;
        steps.push({ 
            x: xMid, 
            fx: fx, 
            coefficient: 1, 
            label: `x_mid${i}`,
            interval: [xLeft, xRight]
        });
    }
    
    return {
        result: h * sum,
        steps: steps,
        h: h,
        formula: 'I ≈ h × Σf(x_mid)'
    };
}

/**
 * Jalankan semua metode dan bandingkan hasilnya
 * 
 * @param {string} funcExpr - Ekspresi fungsi
 * @param {number} a - Batas bawah
 * @param {number} b - Batas atas
 * @param {number} n - Jumlah partisi
 * @param {object} enabledMethods - Metode yang diaktifkan
 * @returns {object} - { results, exactValue, bestMethod }
 */
function calculateAll(funcExpr, a, b, n, enabledMethods) {
    const f = ExpressionParser.parseExpression(funcExpr);
    
    if (!f) {
        return { error: 'Gagal memparse ekspresi fungsi' };
    }
    
    const results = {};
    const exactValue = ExpressionParser.calculateExactValue(funcExpr, a, b);
    
    if (enabledMethods.trapezoidal) {
        const r = trapezoidalMethod(f, a, b, n);
        results.trapezoidal = {
            name: 'Trapesium',
            ...r,
            error: exactValue !== null ? ExpressionParser.calculateError(exactValue, r.result) : null
        };
    }
    
    if (enabledMethods.simpson13) {
        const r = simpson13Method(f, a, b, n);
        results.simpson13 = {
            name: 'Simpson 1/3',
            ...r,
            error: exactValue !== null ? ExpressionParser.calculateError(exactValue, r.result) : null
        };
    }
    
    if (enabledMethods.simpson38) {
        const r = simpson38Method(f, a, b, n);
        results.simpson38 = {
            name: 'Simpson 3/8',
            ...r,
            error: exactValue !== null ? ExpressionParser.calculateError(exactValue, r.result) : null
        };
    }
    
    if (enabledMethods.midpoint) {
        const r = midpointMethod(f, a, b, n);
        results.midpoint = {
            name: 'Midpoint',
            ...r,
            error: exactValue !== null ? ExpressionParser.calculateError(exactValue, r.result) : null
        };
    }
    
    // Tentukan metode terbaik berdasarkan error
    let bestMethod = null;
    let lowestError = Infinity;
    
    if (exactValue !== null) {
        for (const [key, result] of Object.entries(results)) {
            if (result.error && result.error.percentError < lowestError) {
                lowestError = result.error.percentError;
                bestMethod = {
                    key: key,
                    name: result.name,
                    error: result.error.percentError
                };
            }
        }
    }
    
    return {
        results: results,
        exactValue: exactValue,
        bestMethod: bestMethod,
        functionExpression: funcExpr,
        bounds: { a, b },
        partitions: n
    };
}

// Export ke window object
window.NumericalMethods = {
    trapezoidalMethod,
    simpson13Method,
    simpson38Method,
    midpointMethod,
    calculateAll
};
