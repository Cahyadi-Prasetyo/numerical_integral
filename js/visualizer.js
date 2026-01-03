/* =====================================================
   GRAPH VISUALIZER
   Visualisasi fungsi dan partisi integrasi
   Sesuai referensi: garis biru = fungsi, area merah = pendekatan
   ===================================================== */

const Visualizer = {
    chart: null,
    currentN: 0,
    
    // Colors sesuai referensi
    colors: {
        function: 'rgb(59, 130, 246)',      // Biru untuk kurva
        area: 'rgba(239, 68, 68, 0.3)',      // Merah transparan untuk area
        areaStroke: 'rgba(239, 68, 68, 0.6)', // Merah untuk stroke
        points: '#ef4444',                   // Merah untuk titik
        grid: 'rgba(0, 0, 0, 0.1)',
        verticalLine: 'rgba(150, 150, 150, 0.8)'
    },

    // Initialize the chart
    init: function(canvasId) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destroy existing chart if any
        if (this.chart) {
            this.chart.destroy();
        }

        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    intersect: false,
                    mode: 'nearest'
                },
                plugins: {
                    legend: {
                        display: false // Hide legend, will use custom caption
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function(context) {
                                if (context.dataset.label === 'Titik Partisi') {
                                    return `x = ${context.parsed.x.toFixed(4)}, f(x) = ${context.parsed.y.toFixed(6)}`;
                                }
                                return `f(${context.parsed.x.toFixed(2)}) = ${context.parsed.y.toFixed(4)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        grid: {
                            color: this.colors.grid,
                            drawBorder: true
                        },
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(2);
                            }
                        }
                    },
                    y: {
                        type: 'linear',
                        beginAtZero: true,
                        grid: {
                            color: this.colors.grid,
                            drawBorder: true
                        }
                    }
                }
            }
        });
    },

    // Generate points for function curve
    generateCurvePoints: function(f, a, b, numPoints = 200) {
        const points = [];
        // Extend range slightly for better visualization
        const extend = (b - a) * 0.1;
        const start = a - extend;
        const end = b + extend;
        const step = (end - start) / numPoints;
        
        for (let i = 0; i <= numPoints; i++) {
            const x = start + i * step;
            try {
                const y = f(x);
                if (isFinite(y) && !isNaN(y)) {
                    points.push({ x, y });
                }
            } catch (e) {
                // Skip invalid points
            }
        }
        
        return points;
    },

    // Draw function and visualization - sesuai referensi
    draw: function(f, a, b, n, method = 'trapezoidal') {
        if (!this.chart) {
            this.init('graphCanvas');
        }

        this.currentN = n;
        const datasets = [];
        const h = (b - a) / n;

        // 1. Area pendekatan numerik (trapesium/simpson) - MERAH
        const areaData = this.generateAreaData(f, a, b, n, h, method);
        datasets.push({
            label: 'Pendekatan Numerik',
            data: areaData,
            borderColor: this.colors.areaStroke,
            backgroundColor: this.colors.area,
            borderWidth: 1,
            pointRadius: 0,
            fill: true,
            tension: 0,
            order: 3
        });

        // 2. Garis vertikal di batas a dan b
        const yMax = Math.max(...this.generateCurvePoints(f, a, b, 50).map(p => p.y)) * 1.1;
        datasets.push({
            label: 'Batas a',
            data: [{ x: a, y: 0 }, { x: a, y: f(a) }],
            borderColor: this.colors.verticalLine,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            order: 2
        });
        datasets.push({
            label: 'Batas b',
            data: [{ x: b, y: 0 }, { x: b, y: f(b) }],
            borderColor: this.colors.verticalLine,
            borderWidth: 2,
            borderDash: [5, 5],
            pointRadius: 0,
            fill: false,
            order: 2
        });

        // 3. Function curve (smooth) - BIRU
        const curvePoints = this.generateCurvePoints(f, a, b);
        datasets.push({
            label: 'f(x)',
            data: curvePoints,
            borderColor: this.colors.function,
            borderWidth: 2.5,
            pointRadius: 0,
            fill: false,
            tension: 0.2,
            order: 1
        });

        // 4. Titik partisi - MERAH
        const partitionPoints = [];
        for (let i = 0; i <= n; i++) {
            const x = a + i * h;
            try {
                const y = f(x);
                if (isFinite(y)) {
                    partitionPoints.push({ x, y });
                }
            } catch (e) {}
        }
        datasets.push({
            label: 'Titik Partisi',
            data: partitionPoints,
            borderColor: this.colors.points,
            backgroundColor: this.colors.points,
            pointRadius: 6,
            pointStyle: 'circle',
            showLine: false,
            order: 0
        });

        this.chart.data.datasets = datasets;
        this.chart.update();

        // Update legend/caption
        this.updateLegend(n);
    },

    // Generate area data for filled polygon
    generateAreaData: function(f, a, b, n, h, method) {
        const data = [];
        
        // Start from bottom left
        data.push({ x: a, y: 0 });
        
        // Add points along the approximation
        for (let i = 0; i <= n; i++) {
            const x = a + i * h;
            const y = f(x);
            data.push({ x, y });
        }
        
        // Close polygon at bottom right
        data.push({ x: b, y: 0 });
        
        return data;
    },

    // Update legend/caption
    updateLegend: function(n) {
        const legendEl = document.getElementById('graphLegend');
        if (legendEl) {
            legendEl.innerHTML = `
                <div class="graph-caption">
                    <span class="legend-item">
                        <span class="legend-color" style="background-color: ${this.colors.function};"></span>
                        Garis biru adalah fungsi asli
                    </span>
                    <span class="legend-item">
                        <span class="legend-color" style="background-color: ${this.colors.area}; border: 1px solid ${this.colors.areaStroke};"></span>
                        Area merah adalah pendekatan numerik dengan N=${n}
                    </span>
                </div>
            `;
        }
    },

    // Draw comparison of all methods
    drawComparison: function(f, a, b, n) {
        // Same as regular draw for comparison
        this.draw(f, a, b, n, 'trapezoidal');
    },

    // Clear chart
    clear: function() {
        if (this.chart) {
            this.chart.data.datasets = [];
            this.chart.update();
        }
        const legendEl = document.getElementById('graphLegend');
        if (legendEl) legendEl.innerHTML = '';
    },

    // Update theme colors
    updateTheme: function(isDark) {
        if (!this.chart) return;

        const gridColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const textColor = isDark ? '#f1f5f9' : '#212529';

        this.chart.options.scales.x.grid.color = gridColor;
        this.chart.options.scales.y.grid.color = gridColor;
        this.chart.options.scales.x.ticks.color = textColor;
        this.chart.options.scales.y.ticks.color = textColor;

        this.chart.update();
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Visualizer;
}
