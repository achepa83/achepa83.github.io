document.addEventListener("DOMContentLoaded", function() {
    const tableDivs = document.querySelectorAll('.table');

    tableDivs.forEach(div => {
        const markdown = div.textContent.trim();
        const lines = markdown.split('\n');

        if (lines.length < 2) return; // Not enough lines for a table

        const headers = lines[0].split('|').map(header => header.trim()).filter(header => header);
        const separator = lines[1].split('|').map(sep => sep.trim()).filter(sep => sep);

        if (headers.length !== separator.length) return; // Invalid table format

        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create header row
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);

        // Create body rows
        for (let i = 2; i < lines.length; i++) {
            const row = document.createElement('tr');
            const cells = lines[i].split('|').map(cell => cell.trim()).filter(cell => cell);

            if (cells.length !== headers.length) continue; // Skip malformed rows

            cells.forEach(cell => {
                const td = document.createElement('td');
                td.textContent = cell;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        }

        table.appendChild(thead);
        table.appendChild(tbody);

        // Replace markdown with the generated table
        div.innerHTML = '';
        div.appendChild(table);
    });
});