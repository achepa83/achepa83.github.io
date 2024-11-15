document.addEventListener('DOMContentLoaded', function() {
    const pieCharts = document.querySelectorAll('.pie-chart');
    let chartCounter = 1;

    pieCharts.forEach(pieChart => {
        const dataDiv = pieChart.querySelector('.pie-chart-data');
        const dataText = dataDiv.textContent.trim();
        const dataEntries = dataText.split(';').map(entry => {
            const parts = entry.trim().split(',, ');
            return [parts[0], parseFloat(parts[1])];
        }).filter(entry => entry[0] && !isNaN(entry[1])); // Filter out invalid entries

        console.log('Parsed data entries:', dataEntries);

        const totalValue = dataEntries.reduce((sum, entry) => sum + entry[1], 0);
        console.log('Total value:', totalValue);

        if (totalValue === 0) {
            console.error('Total value is zero, cannot create pie chart.');
            return;
        }

        let currentAngle = 0;

        // Function to generate a color palette based on the chart counter
        function generateColor(index, total) {
            let hueStart, hueEnd;
            switch ((chartCounter - 1) % 3) {
                            case 0: // Magenta to Orange (300 to 40)
                hueStart = 270;
                hueEnd = 60;
                const totalHueSpan = (360 - hueStart) + hueEnd; // Total span across the boundary

                // Calculate the proportion of the total span for each index
                const hueProportion = (index / total) * totalHueSpan;

                if (hueProportion <= (360 - hueStart)) {
                    // First part: 300 to 360
                    return `hsl(${hueStart + hueProportion}, 80%, 50%)`;
                } else {
                    // Second part: 0 to 40
                    return `hsl(${hueProportion - (360 - hueStart)}, 80%, 50%)`;
                }
                case 1: // Yellow to Cyan
                    hueStart = 60;
                    hueEnd = 230;
                    break;
                case 2: // Cyan to Magenta
                    hueStart = 160;
                    hueEnd = 300;
                    break;
            }
            const hue = hueStart + ((hueEnd - hueStart) * (index / total));
            return `hsl(${hue}, 80%, 50%)`; // Slightly desaturated and lighter colors
        }

        // Function to format numbers with dots and handle millions
function formatNumber(num) {
    if (num >= 100000) {
        let millionValue = (num / 1000000).toFixed(2);
        // Remove unnecessary trailing zeros
        millionValue = parseFloat(millionValue).toString();
        return millionValue + ' million';
    }
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

        const pieChartDiv = document.createElement('div');
        pieChartDiv.id = `pie-chart${chartCounter}`;
        pieChartDiv.className = 'pie-chart-chart';

        const gradient = 'conic-gradient(' + dataEntries.map((entry, index) => {
            const value = entry[1];
            const angle = (value / totalValue) * 360;
            const color = generateColor(index, dataEntries.length);
            const startAngle = currentAngle;
            currentAngle += angle;
            return `${color} ${startAngle}deg ${currentAngle}deg`;
        }).join(', ') + ')';

        console.log(`Pie chart ${chartCounter} gradient:`, gradient);

        // Apply the gradient as a background image
        pieChartDiv.style.backgroundImage = gradient;

        const legendDiv = document.createElement('div');
        legendDiv.id = `legend${chartCounter}`;
        legendDiv.className = 'legend';

        dataEntries.forEach((entry, index) => {
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            const color = generateColor(index, dataEntries.length);
            legendItem.style.setProperty('--legend-color', color);

            const nameDiv = document.createElement('div');
            nameDiv.className = 'legend-name';
            nameDiv.textContent = entry[0];

            const numberDiv = document.createElement('div');
            numberDiv.className = 'legend-number';
            numberDiv.textContent = formatNumber(entry[1]);

            const percentageDiv = document.createElement('div');
            percentageDiv.className = 'legend-percentage';
            const percentage = ((entry[1] / totalValue) * 100).toFixed(2);
            percentageDiv.textContent = `${percentage} %`;

            legendItem.appendChild(nameDiv);
            legendItem.appendChild(numberDiv);
            legendItem.appendChild(percentageDiv);
            legendDiv.appendChild(legendItem);
        });

        pieChart.appendChild(pieChartDiv);
        pieChart.appendChild(legendDiv);

        dataDiv.style.display = 'none'; // Hide the data div

        chartCounter++;
    });
});