/**
 * NumIntegral - Mathematical Expression Parser
 * Modul untuk parsing dan evaluasi ekspresi matematika
 */

/**
 * Parse ekspresi matematika menjadi fungsi JavaScript
 * Menggunakan library math.js
 * 
 * @param {string} expr - Ekspresi matematika (contoh: "x^2 + sin(x)")
 * @returns {Function|null} - Fungsi JavaScript atau null jika gagal
 */
function parseExpression(expr) {
    try {
        // Compile ekspresi menggunakan math.js
        const compiled = math.compile(expr);
        
        // Return fungsi yang bisa dievaluasi
        return function(x) {
            try {
                return compiled.evaluate({ x: x });
            } catch (e) {
                console.error(`Error evaluating at x=${x}:`, e);
                return NaN;
            }
        };
    } catch (e) {
        console.error('Error parsing expression:', e);
        return null;
    }
}

/**
 * Validasi ekspresi matematika
 * 
 * @param {string} expr - Ekspresi yang akan divalidasi
 * @returns {object} - { valid: boolean, error: string|null }
 */
function validateExpression(expr) {
    if (!expr || expr.trim() === '') {
        return { valid: false, error: 'Ekspresi tidak boleh kosong' };
    }
    
    try {
        const compiled = math.compile(expr);
        // Test evaluasi dengan x = 1
        compiled.evaluate({ x: 1 });
        return { valid: true, error: null };
    } catch (e) {
        return { valid: false, error: e.message };
    }
}

/**
 * Hitung nilai eksak integral (untuk fungsi-fungsi standar)
 * 
 * @param {string} funcExpr - Ekspresi fungsi
 * @param {number} a - Batas bawah
 * @param {number} b - Batas atas
 * @returns {number|null} - Nilai eksak atau null jika tidak tersedia
 */
function calculateExactValue(funcExpr, a, b) {
    // Definisi antiturunan untuk fungsi-fungsi umum
    const antiderivatives = {
        'x^2': (x) => Math.pow(x, 3) / 3,
        'x^3': (x) => Math.pow(x, 4) / 4,
        'x^4': (x) => Math.pow(x, 5) / 5,
        'x^2+2*x+1': (x) => Math.pow(x, 3) / 3 + Math.pow(x, 2) + x,
        'sin(x)': (x) => -Math.cos(x),
        'cos(x)': (x) => Math.sin(x),
        'exp(x)': (x) => Math.exp(x),
        '1/(1+x^2)': (x) => Math.atan(x),
        'sqrt(x)': (x) => (2/3) * Math.pow(x, 1.5),
        'x': (x) => Math.pow(x, 2) / 2,
        '1': (x) => x,
        'ln(x)': (x) => x * Math.log(x) - x,
        'log(x)': (x) => x * Math.log(x) - x
    };
    
    // Normalisasi ekspresi (hilangkan spasi)
    const normalizedExpr = funcExpr.replace(/\s/g, '');
    
    if (antiderivatives[normalizedExpr]) {
        const F = antiderivatives[normalizedExpr];
        return F(b) - F(a);
    }
    
    return null;
}

/**
 * Hitung error (galat)
 * 
 * @param {number} exact - Nilai eksak
 * @param {number} approx - Nilai aproksimasi
 * @returns {object} - { trueError, relativeError, percentError }
 */
function calculateError(exact, approx) {
    const trueError = Math.abs(exact - approx);
    const relativeError = exact !== 0 ? trueError / Math.abs(exact) : 0;
    const percentError = relativeError * 100;
    
    return {
        trueError: trueError,
        relativeError: relativeError,
        percentError: percentError
    };
}

/**
 * Format angka untuk tampilan
 * 
 * @param {number} num - Angka yang akan diformat
 * @param {number} decimals - Jumlah desimal
 * @returns {string} - Angka terformat
 */
function formatNumber(num, decimals = 8) {
    if (Math.abs(num) < 0.0001 && num !== 0) {
        return num.toExponential(4);
    }
    return num.toFixed(decimals);
}

// Export ke window object
window.ExpressionParser = {
    parseExpression,
    validateExpression,
    calculateExactValue,
    calculateError,
    formatNumber
};
