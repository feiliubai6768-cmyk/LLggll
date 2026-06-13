document.addEventListener('DOMContentLoaded', () => {
    
    // --- Navigation Logic ---
    const navItems = document.querySelectorAll('.nav-item');
    const screens = document.querySelectorAll('.screen');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            navItems.forEach(n => n.classList.remove('active'));
            screens.forEach(s => s.classList.remove('active'));

            // Add active class to clicked item and corresponding screen
            item.classList.add('active');
            const targetId = item.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    // --- Clock Logic ---
    const timeEl = document.getElementById('current-time');
    const dateEl = document.getElementById('current-date');

    function updateClock() {
        const now = new Date();
        const h = String(now.getHours()).padStart(2, '0');
        const m = String(now.getMinutes()).padStart(2, '0');
        const s = String(now.getSeconds()).padStart(2, '0');
        timeEl.textContent = `${h}:${m}:${s}`;
        
        const y = now.getFullYear();
        const mon = String(now.getMonth() + 1).padStart(2, '0');
        const d = String(now.getDate()).padStart(2, '0');
        dateEl.textContent = `${y}/${mon}/${d}`;
    }
    
    setInterval(updateClock, 1000);
    updateClock(); // Initial call

    // --- Range Slider Logic ---
    const rangeSliders = document.querySelectorAll('.range-slider');
    rangeSliders.forEach(slider => {
        const valSpan = slider.nextElementSibling;
        slider.addEventListener('input', (e) => {
            valSpan.textContent = e.target.value + '%';
        });
    });

    // --- Chart.js Initialization ---
    const ctx = document.getElementById('doseChart');
    if (ctx) {
        // Create gradient
        const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
        gradient.addColorStop(0, 'rgba(0, 229, 255, 0.5)');   
        gradient.addColorStop(1, 'rgba(0, 229, 255, 0.0)');

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['240', '210', '180', '150', '120', '90', '60', '30', '0'],
                datasets: [{
                    label: '剂量率 (μSv/h)',
                    data: [0.05, 0.06, 0.05, 0.08, 0.07, 0.09, 0.08, 0.08, 0.08],
                    borderColor: '#00e5ff',
                    backgroundColor: gradient,
                    borderWidth: 2,
                    pointBackgroundColor: '#0a0e17',
                    pointBorderColor: '#00e5ff',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    fill: true,
                    tension: 0.4 // Smooth curve
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(10, 14, 23, 0.8)',
                        titleColor: '#fff',
                        bodyColor: '#00e5ff',
                        borderColor: 'rgba(0, 255, 255, 0.2)',
                        borderWidth: 1,
                        padding: 10,
                        displayColors: false
                    }
                },
                scales: {
                    x: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94a3b8',
                            font: { size: 12 }
                        },
                        title: {
                            display: true,
                            text: '时间(秒)',
                            color: '#94a3b8',
                            font: { size: 12 }
                        }
                    },
                    y: {
                        grid: {
                            color: 'rgba(255, 255, 255, 0.05)',
                            drawBorder: false
                        },
                        ticks: {
                            color: '#00e5ff',
                            font: { size: 12 },
                            stepSize: 0.2,
                            callback: function(value) {
                                return value.toFixed(1);
                            }
                        },
                        min: 0.0,
                        max: 1.0,
                        position: 'right', // Put Y axis on the right like the original image
                        title: {
                            display: true,
                            text: '剂量率 (μSv/h)',
                            color: '#00e5ff',
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    // --- Modal and Transfer Logic ---
    const startBtn = document.getElementById('start-copy-btn');
    const cancelBtn = document.getElementById('cancel-copy-btn');
    const closeBtn = document.querySelector('.close-btn');
    const modal = document.getElementById('copy-modal');
    const copyProgress = document.getElementById('copy-progress');
    const copyPercentage = document.getElementById('copy-percentage');
    let copyInterval;

    if (startBtn && modal) {
        startBtn.addEventListener('click', () => {
            modal.classList.add('show');
            // Simulate progress
            let progress = 0;
            copyProgress.style.width = '0%';
            copyPercentage.textContent = '0%';
            
            clearInterval(copyInterval);
            copyInterval = setInterval(() => {
                progress += Math.random() * 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(copyInterval);
                    setTimeout(() => {
                        modal.classList.remove('show');
                    }, 1000); // Close shortly after finishing
                }
                copyProgress.style.width = progress + '%';
                copyPercentage.textContent = Math.floor(progress) + '%';
            }, 300);
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => {
            clearInterval(copyInterval);
            modal.classList.remove('show');
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            // Just return to monitoring screen
            document.querySelector('[data-target="monitoring"]').click();
        });
    }
});
