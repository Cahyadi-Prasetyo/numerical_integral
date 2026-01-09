/* =====================================================
   MAIN APPLICATION
   UI Logic dan Event Handlers
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {
    // =====================================================
    // ELEMENTS
    // =====================================================
    const elements = {
        // Navbar
        themeToggle: document.getElementById('themeToggle'),
        sidebarToggle: document.getElementById('sidebarToggle'),
        navLinks: document.querySelectorAll('.nav-link'),
        
        // Sidebar
        sidebar: document.getElementById('sidebar'),
        sidebarLinks: document.querySelectorAll('.sidebar-link'),
        
        // Main Content
        mainContent: document.getElementById('mainContent'),
        pages: document.querySelectorAll('.page'),
        
        // Calculator
        functionInput: document.getElementById('functionInput'),
        functionPreview: document.getElementById('functionPreview'),
        keyboardToggle: document.getElementById('keyboardToggle'),
        mathKeyboard: document.getElementById('mathKeyboard'),
        lowerBound: document.getElementById('lowerBound'),
        upperBound: document.getElementById('upperBound'),
        partitions: document.getElementById('partitions'),
        exactValueInput: document.getElementById('exactValue'),
        calculateBtn: document.getElementById('calculateBtn'),
        presetBtns: document.querySelectorAll('.preset-btn'),
        
        // Results
        resultsSection: document.getElementById('resultsSection'),
        resultsSummary: document.getElementById('resultsSummary'),
        resultsTableBody: document.getElementById('resultsTableBody'),
        stepsSection: document.getElementById('stepsSection'),
        stepsAccordion: document.getElementById('stepsAccordion')
    };

    // =====================================================
    // STATE
    // =====================================================
    let currentMethod = 'trapezoidal';
    let currentPage = 'calculator';

    // =====================================================
    // THEME TOGGLE
    // =====================================================
    function initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        Visualizer.updateTheme(savedTheme === 'dark');
    }

    function toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        Visualizer.updateTheme(newTheme === 'dark');
    }

    elements.themeToggle.addEventListener('click', toggleTheme);
    initTheme();

    // =====================================================
    // SIDEBAR TOGGLE
    // =====================================================
    function initSidebar() {
        if (window.innerWidth <= 768) {
            elements.sidebar.classList.add('collapsed');
            elements.mainContent.classList.add('expanded');
        }
    }

    function toggleSidebar() {
        elements.sidebar.classList.toggle('collapsed');
        elements.mainContent.classList.toggle('expanded');
    }

    elements.sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation(); // Mencegah event bubbling
        toggleSidebar();
    });
    
    // Inisialisasi sidebar saat load
    initSidebar();

    // Tutup sidebar saat klik di luar (mobile only)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 768 && 
            !elements.sidebar.contains(e.target) && 
            !elements.sidebarToggle.contains(e.target) && 
            !elements.sidebar.classList.contains('collapsed')) {
            toggleSidebar();
        }
    });

    // =====================================================
    // PAGE NAVIGATION
    // =====================================================
    function showPage(pageName) {
        elements.pages.forEach(page => page.classList.remove('active'));
        elements.navLinks.forEach(link => link.classList.remove('active'));

        const targetPage = document.getElementById(pageName + 'Page');
        const targetLink = document.querySelector(`[data-page="${pageName}"]`);

        if (targetPage) targetPage.classList.add('active');
        if (targetLink) targetLink.classList.add('active');

        currentPage = pageName;

        // Re-render MathJax for theory page
        if (pageName === 'theory' && window.MathJax) {
            MathJax.typesetPromise();
        }
    }

    elements.navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            showPage(page);
        });
    });

    // =====================================================
    // METHOD SELECTION
    // =====================================================
    function selectMethod(method) {
        elements.sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-method') === method) {
                link.classList.add('active');
            }
        });
        currentMethod = method;

        // Show calculator page if on different page
        if (currentPage !== 'calculator') {
            showPage('calculator');
        }
    }

    elements.sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const method = link.getAttribute('data-method');
            selectMethod(method);
        });
    });

    // =====================================================
    // MATH KEYBOARD
    // =====================================================
    function toggleKeyboard() {
        elements.mathKeyboard.classList.toggle('visible');
    }

    function insertToFunction(text) {
        const input = elements.functionInput;
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const value = input.value;
        
        input.value = value.substring(0, start) + text + value.substring(end);
        input.selectionStart = input.selectionEnd = start + text.length;
        input.focus();
        updateFunctionPreview();
    }

    function handleKeyboardAction(action) {
        const input = elements.functionInput;
        if (action === 'backspace') {
            const start = input.selectionStart;
            if (start > 0) {
                input.value = input.value.substring(0, start - 1) + input.value.substring(start);
                input.selectionStart = input.selectionEnd = start - 1;
            }
        } else if (action === 'enter') {
            calculate();
        }
        input.focus();
        updateFunctionPreview();
    }

    elements.keyboardToggle.addEventListener('click', toggleKeyboard);

    // Keyboard key events
    document.querySelectorAll('.key').forEach(key => {
        key.addEventListener('click', () => {
            const insert = key.getAttribute('data-insert');
            const action = key.getAttribute('data-action');
            
            if (insert) {
                insertToFunction(insert);
            } else if (action) {
                handleKeyboardAction(action);
            }
        });
    });

    // =====================================================
    // FUNCTION PREVIEW (LaTeX)
    // =====================================================
    function updateFunctionPreview() {
        const funcStr = elements.functionInput.value;
        if (!funcStr) {
            elements.functionPreview.innerHTML = '';
            return;
        }

        try {
            // Simple LaTeX conversion
            let latex = funcStr
                .replace(/\*/g, ' \\cdot ')
                .replace(/sqrt\(/g, '\\sqrt{')
                .replace(/sin\(/g, '\\sin(')
                .replace(/cos\(/g, '\\cos(')
                .replace(/tan\(/g, '\\tan(')
                .replace(/log\(/g, '\\ln(')
                .replace(/exp\(/g, 'e^{')
                .replace(/\^(\d+)/g, '^{$1}')
                .replace(/pi/g, '\\pi')
                .replace(/e\^/g, 'e^');

            elements.functionPreview.innerHTML = `\\(f(x) = ${latex}\\)`;
            
            if (window.MathJax) {
                MathJax.typesetPromise([elements.functionPreview]);
            }
        } catch (e) {
            elements.functionPreview.innerHTML = funcStr;
        }
    }

    elements.functionInput.addEventListener('input', updateFunctionPreview);

    // =====================================================
    // PRESET FUNCTIONS
    // =====================================================
    elements.presetBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.functionInput.value = btn.getAttribute('data-function');
            updateFunctionPreview();
        });
    });

    // =====================================================
    // CALCULATE
    // =====================================================
    function calculate() {
        const funcStr = elements.functionInput.value;
        const a = parseFloat(elements.lowerBound.value);
        const b = parseFloat(elements.upperBound.value);
        const n = parseInt(elements.partitions.value);

        // Validate
        const validation = Calculator.validateInputs(funcStr, a, b, n);
        if (!validation.valid) {
            alert(validation.error);
            return;
        }

        const f = validation.f;
        
        // Check for manual exact value first, then preset, then estimate
        const manualExactValue = elements.exactValueInput.value.trim();
        let exactValue;
        let isEstimatedExact = false;
        
        if (manualExactValue !== '' && !isNaN(parseFloat(manualExactValue))) {
            // Manual input
            exactValue = parseFloat(manualExactValue);
        } else {
            // Try preset
            exactValue = Calculator.getExactValue(funcStr, a, b);
            
            // If no preset, estimate using high-N Simpson
            if (exactValue === null) {
                exactValue = Calculator.estimateExactValue(f, a, b);
                isEstimatedExact = true;
            }
        }

        // Show loading state
        elements.calculateBtn.textContent = 'MENGHITUNG...';
        elements.calculateBtn.disabled = true;

        setTimeout(() => {
            try {
                let results;

                if (currentMethod === 'compare') {
                    // Compare all methods
                    results = Calculator.compareAll(f, a, b, n, exactValue);
                    displayResults(results, funcStr, a, b, n, exactValue, isEstimatedExact);
                    Visualizer.drawComparison(f, a, b, n);
                } else {
                    // Single method
                    let calcResult;
                    switch (currentMethod) {
                        // case 'riemann-left':
                        //     calcResult = Calculator.riemannLeft(f, a, b, n);
                        //     break;
                        // case 'riemann-right':
                        //     calcResult = Calculator.riemannRight(f, a, b, n);
                        //     break;
                        // case 'riemann-mid':
                        //     calcResult = Calculator.riemannMidpoint(f, a, b, n);
                        //     break;
                        case 'trapezoidal':
                            calcResult = Calculator.trapezoidal(f, a, b, n);
                            break;
                        case 'simpson13':
                            calcResult = Calculator.simpson13(f, a, b, n);
                            break;
                        case 'simpson38':
                            calcResult = Calculator.simpson38(f, a, b, n);
                            break;
                        // case 'romberg':
                        //     calcResult = Calculator.romberg(f, a, b, 4);
                        //     break;
                        default:
                            calcResult = Calculator.trapezoidal(f, a, b, n);
                    }

                    const methodNames = {
                        'riemann-left': 'Riemann Kiri',
                        'riemann-right': 'Riemann Kanan',
                        'riemann-mid': 'Riemann Titik Tengah',
                        'trapezoidal': 'Aturan Trapesium',
                        'simpson13': 'Simpson 1/3',
                        'simpson38': 'Simpson 3/8',
                        'romberg': 'Romberg'
                    };

                    results = [{
                        method: methodNames[currentMethod] || 'Trapesium',
                        result: calcResult.result,
                        steps: calcResult.steps,
                        points: calcResult.points,
                        exactValue: exactValue,
                        absError: exactValue !== null ? Math.abs(calcResult.result - exactValue) : null,
                        relError: exactValue !== null ? (Math.abs(calcResult.result - exactValue) / Math.abs(exactValue)) * 100 : null
                    }];

                    displayResults(results, funcStr, a, b, n, exactValue, isEstimatedExact);
                    Visualizer.draw(f, a, b, n, currentMethod);
                }
            } catch (e) {
                console.error('Calculation error:', e);
                alert('Terjadi kesalahan saat menghitung: ' + e.message);
            } finally {
                // Always reset button
                elements.calculateBtn.textContent = 'HITUNG';
                elements.calculateBtn.disabled = false;
            }
        }, 100);
    }

    elements.calculateBtn.addEventListener('click', calculate);

    // Enter key to calculate
    elements.functionInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') calculate();
    });

    // =====================================================
    // GENERATE SIMPLIFIED STEPS (for compare mode - faster)
    // =====================================================
    function generateSimplifiedSteps(method, funcStr, a, b, n, calcResult, exactValue) {
        const steps = [];
        const h = (b - a) / n;

        // Check if calcResult exists and has result property
        if (!calcResult || calcResult.result === undefined || calcResult.result === null) {
            steps.push({
                title: 'Error',
                desc: 'Hasil perhitungan tidak valid',
                formula: ''
            });
            return steps;
        }

        // Hanya tampilkan ringkasan hasil
        steps.push({
            title: 'Hasil Perhitungan',
            desc: `Metode ${method} dengan h = ${h.toFixed(6)}`,
            formula: `L \\approx \\mathbf{${calcResult.result.toFixed(10)}}`
        });

        // Error jika ada nilai eksak
        if (exactValue !== null && exactValue !== undefined) {
            const absError = Math.abs(calcResult.result - exactValue);
            const relError = (absError / Math.abs(exactValue)) * 100;
            
            steps.push({
                title: 'Perhitungan Error',
                desc: '',
                formula: `\\text{Error Mutlak} = ${absError.toFixed(10)}, \\quad \\text{Error Relatif} = ${relError.toFixed(6)}\\%`
            });
        } else {
            // Untuk fungsi custom tanpa nilai eksak
            steps.push({
                title: 'Step 5: Perhitungan Error (Validasi)',
                desc: 'Bandingkan hasil numerik dengan True Value.',
                html: '<p class="error-note"><em>⚠️ True value is unknown. See conclusion below the table for method comparison.</em></p>'
            });
        }

        return steps;
    }

    // =====================================================
    // GENERATE DETAILED STEPS
    // =====================================================
    function generateDetailedSteps(method, funcStr, a, b, n, calcResult, exactValue) {
        const steps = [];
        const h = (b - a) / n;

        // Langkah 1: Identifikasi Parameter
        steps.push({
            title: 'Langkah 1: Identifikasi Parameter',
            desc: 'Tentukan fungsi f(x), batas integrasi [a, b], dan jumlah pias N.',
            formula: `f(x) = ${funcStr}, \\quad a = ${a}, \\quad b = ${b}, \\quad N = ${n}`
        });

        // Langkah 2: Hitung Lebar Pias
        steps.push({
            title: 'Langkah 2: Hitung Lebar Pias (h)',
            desc: 'Hitung jarak antar titik (h).',
            formula: `h = \\frac{b - a}{N} = \\frac{${b} - ${a}}{${n}} = ${h.toFixed(6)}`
        });

        // Langkah 3: Tabel Nilai Fungsi
        if (calcResult.points && calcResult.points.length > 0) {
            let tableHTML = '<table class="function-table"><thead><tr><th>i</th><th>x<sub>i</sub></th><th>f(x<sub>i</sub>)</th></tr></thead><tbody>';
            calcResult.points.forEach((point, i) => {
                tableHTML += `<tr><td>${i}</td><td>${point.x.toFixed(4)}</td><td>${point.y.toFixed(4)}</td></tr>`;
            });
            tableHTML += '</tbody></table>';
            
            steps.push({
                title: 'Langkah 3: Tabel Nilai Fungsi',
                desc: 'Evaluasi f(x) pada setiap titik x<sub>i</sub> dengan mensubstitusi nilai x.',
                html: tableHTML
            });
        }

        // Langkah 4: Hitung Hasil Akhir
        let formulaName = '';
        let formulaDesc = '';
        
        if (method.includes('Trapesium')) {
            formulaName = 'L \\approx \\frac{h}{2} \\left[ f(x_0) + 2\\sum_{i=1}^{N-1} f(x_i) + f(x_N) \\right]';
            formulaDesc = 'Gunakan rumus metode trapezoidal untuk mendapatkan hasil.';
        } else if (method.includes('Simpson 1/3')) {
            formulaName = 'L \\approx \\frac{h}{3} \\left[ f(x_0) + 4\\sum_{ganjil} f(x_i) + 2\\sum_{genap} f(x_i) + f(x_N) \\right]';
            formulaDesc = 'Gunakan rumus Simpson 1/3 untuk mendapatkan hasil.';
        } else if (method.includes('Simpson 3/8')) {
            formulaName = 'L \\approx \\frac{3h}{8} \\left[ f(x_0) + 3f(x_1) + 3f(x_2) + 2f(x_3) + ... + f(x_N) \\right]';
            formulaDesc = 'Gunakan rumus Simpson 3/8 untuk mendapatkan hasil.';
        }

        steps.push({
            title: 'Langkah 4: Hitung Hasil Akhir',
            desc: formulaDesc,
            formula: formulaName
        });

        steps.push({
            title: '',
            desc: '',
            formula: `L \\approx \\mathbf{${calcResult.result.toFixed(10)}}`
        });

        // Langkah 5: Perhitungan Error (jika ada nilai eksak)
        if (exactValue !== null) {
            const absError = Math.abs(calcResult.result - exactValue);
            const relError = (absError / Math.abs(exactValue)) * 100;
            
            steps.push({
                title: 'Step 5: Error Calculation (Validation)',
                desc: 'Compare numerical result with True Value.',
                formula: `\\text{True Value} \\approx ${exactValue.toFixed(10)}`
            });
            
            steps.push({
                title: '',
                desc: '',
                formula: `\\text{Absolute Error} = |\\text{True} - \\text{Approx}| = |${exactValue.toFixed(6)} - ${calcResult.result.toFixed(6)}| = ${absError.toFixed(10)}`
            });
            
            steps.push({
                title: '',
                desc: '',
                formula: `\\text{Relative Error} = \\left| \\frac{\\text{Absolute Error}}{\\text{True}} \\right| \\times 100\\% = ${relError.toFixed(6)}\\%`
            });
        } else {
            // Untuk fungsi custom tanpa nilai eksak yang diketahui
            steps.push({
                title: 'Step 5: Error Calculation (Validation)',
                desc: 'Compare numerical result with True Value.',
                html: '<p class="error-note"><em>⚠️ True value is unknown for this function. Use preset functions or enter exact value manually.</em></p>'
            });
        }

        return steps;
    }

    // =====================================================
    // DISPLAY RESULTS
    // =====================================================
    function displayResults(results, funcStr, a, b, n, exactValue, isEstimatedExact = false) {
        // Show sections
        elements.resultsSection.style.display = 'block';
        elements.stepsSection.style.display = 'block';

        // Summary
        let summaryHTML = `
            <strong>Integral:</strong> ∫<sub>${a}</sub><sup>${b}</sup> ${funcStr} dx &nbsp;&nbsp;
            <strong>Partisi (n):</strong> ${n}
        `;
        if (exactValue !== null) {
            const exactLabel = isEstimatedExact ? 'Nilai Eksak (Estimasi)' : 'Nilai Eksak';
            summaryHTML += ` &nbsp;&nbsp;<strong>${exactLabel}:</strong> ${exactValue.toFixed(10)}`;
        }
        if (isEstimatedExact) {
            summaryHTML += `<br><small style="color: var(--text-secondary); font-style: italic;">⚠️ Nilai eksak diestimasi menggunakan metode Simpson dengan N=10000</small>`;
        }
        elements.resultsSummary.innerHTML = summaryHTML;

        // Table
        let tableHTML = '';
        results.forEach(r => {
            // Skip if result is invalid
            if (!r || r.result === undefined || r.result === null) {
                tableHTML += `
                    <tr>
                        <td>${r ? r.method : 'Unknown'}</td>
                        <td colspan="4">Error: Hasil tidak valid</td>
                    </tr>
                `;
                return;
            }
            tableHTML += `
                <tr>
                    <td>${r.method} ${r.note || ''}</td>
                    <td>${r.result.toFixed(10)}</td>
                    <td>${r.exactValue !== null && r.exactValue !== undefined ? r.exactValue.toFixed(10) : '-'}</td>
                    <td>${r.absError !== null && r.absError !== undefined ? r.absError.toFixed(10) : '-'}</td>
                    <td>${r.relError !== null && r.relError !== undefined ? r.relError.toFixed(6) + '%' : '-'}</td>
                </tr>
            `;
        });
        elements.resultsTableBody.innerHTML = tableHTML;

        // Kesimpulan untuk mode compare
        if (results.length > 1) {
            let conclusionHTML = '';
            
            if (results[0].exactValue !== null && results[0].exactValue !== undefined) {
                // Jika ada nilai eksak, tampilkan metode dengan error terkecil
                const sortedByError = [...results].filter(r => r.absError !== null && r.absError !== undefined).sort((a, b) => a.absError - b.absError);
                
                if (sortedByError.length > 0) {
                    const best = sortedByError[0];
                    const relErrorDisplay = best.relError !== null && best.relError !== undefined ? best.relError.toFixed(6) + '%' : 'N/A';
                    conclusionHTML = `
                        <div class="comparison-conclusion">
                            <h4>📊 Kesimpulan Perbandingan</h4>
                            <p>Berdasarkan hasil perhitungan dengan <strong>N = ${n}</strong> partisi:</p>
                            <div class="best-method">
                                <span class="trophy">🏆</span>
                                <div class="best-info">
                                    <strong>${best.method}</strong> adalah metode terbaik dengan error terkecil
                                    <br>
                                    <span class="error-value">Error Relatif: ${relErrorDisplay}</span>
                                </div>
                            </div>
                            <p class="conclusion-note">
                                <em>Catatan: Metode Simpson umumnya memberikan hasil lebih akurat karena menggunakan 
                                pendekatan parabola, sedangkan Trapesium menggunakan garis lurus.</em>
                            </p>
                        </div>
                    `;
                }
            } else {
                // Untuk fungsi custom, bandingkan hasil antar metode
                // Simpson 1/3 biasanya paling akurat, jadi gunakan sebagai referensi
                const simpsonResult = results.find(r => r.method.includes('Simpson 1/3'));
                const referenceValue = simpsonResult ? simpsonResult.result : results[0].result;
                
                // Hitung perbedaan dari referensi
                const comparisons = results.map(r => ({
                    method: r.method,
                    result: r.result,
                    diff: Math.abs(r.result - referenceValue)
                }));
                
                conclusionHTML = `
                    <div class="comparison-conclusion">
                        <h4>📊 Kesimpulan Perbandingan</h4>
                        <p>Berdasarkan hasil perhitungan dengan <strong>N = ${n}</strong> partisi:</p>
                        <div class="method-comparison-list">
                            ${comparisons.map((c, i) => `
                                <div class="method-item ${i === 0 ? 'reference' : ''}">
                                    <strong>${c.method}</strong>: ${c.result.toFixed(10)}
                                </div>
                            `).join('')}
                        </div>
                        <p class="conclusion-note">
                            <em>⚠️ True value is unknown for this function. Results above show 
                            perbandingan nilai dari setiap metode. Umumnya, metode Simpson memberikan 
                            hasil yang lebih akurat dibanding Trapesium.</em>
                        </p>
                    </div>
                `;
            }
            
            // Insert after table
            const tableContainer = elements.resultsTableBody.closest('.results-section');
            let conclusionEl = document.getElementById('comparisonConclusion');
            if (!conclusionEl) {
                conclusionEl = document.createElement('div');
                conclusionEl.id = 'comparisonConclusion';
                tableContainer.appendChild(conclusionEl);
            }
            conclusionEl.innerHTML = conclusionHTML;
        } else {
            // Remove conclusion if not in compare mode
            const conclusionEl = document.getElementById('comparisonConclusion');
            if (conclusionEl) conclusionEl.innerHTML = '';
        }

        // Steps accordion with detailed steps
        let stepsHTML = '';
        const isCompareMode = results.length > 1;
        
        results.forEach((r, idx) => {
            // For compare mode, use simplified steps with error handling
            let detailedSteps;
            try {
                detailedSteps = isCompareMode 
                    ? generateSimplifiedSteps(r.method, funcStr, a, b, n, r, r.exactValue)
                    : generateDetailedSteps(r.method, funcStr, a, b, n, r, r.exactValue);
            } catch (e) {
                console.error('Error generating steps:', e);
                detailedSteps = [{
                    title: 'Hasil',
                    desc: '',
                    formula: `L \\approx ${r.result.toFixed(10)}`
                }];
            }
            
            stepsHTML += `
                <div class="step-item ${idx === 0 ? 'open' : ''}">
                    <div class="step-header" onclick="this.parentElement.classList.toggle('open')">
                        <h3>${r.method}</h3>
                        <span class="step-toggle">▼</span>
                    </div>
                    <div class="step-content">
                        ${detailedSteps.map(step => `
                            <div class="step-formula">
                                ${step.title ? `<h4 class="step-title">${step.title}</h4>` : ''}
                                ${step.desc ? `<p class="step-desc">${step.desc}</p>` : ''}
                                ${step.formula ? `<div class="math-formula">\\[${step.formula}\\]</div>` : ''}
                                ${step.html ? step.html : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        elements.stepsAccordion.innerHTML = stepsHTML;

        // Render MathJax dengan delay untuk tidak block UI
        if (window.MathJax) {
            setTimeout(() => {
                MathJax.typesetPromise();
            }, 50);
        }

        // Scroll to results
        elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // =====================================================
    // INITIALIZE
    // =====================================================
    Visualizer.init('graphCanvas');
    
    // Initial draw with default function
    if (elements.functionInput.value) {
        updateFunctionPreview();
    }
});
