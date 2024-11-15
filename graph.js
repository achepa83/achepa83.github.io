// Example data with search volumes
const nodesData = [
    // Main nodes
    { id: 1, keyword: 'Jazz', value: 2000, label: 'Swing, Blues, Bebop, Latin, Fusion' },
    { id: 2, keyword: 'Blues', value: 2000, label: 'Jazz, Rock, Soul' },
    { id: 3, keyword: 'Latin', value: 2000, label: 'Jazz, Salsa, Reggaeton' },

    // Subcategories for Jazz
    { id: 5, keyword: 'Fusion', value: 400, label: 'Jazz, Rock' },
    { id: 6, keyword: 'Bebop', value: 600, label: 'Jazz' },
    { id: 7, keyword: 'Swing', value: 1000, label: 'Jazz, Blues' },

    // Subcategories for Blues
    { id: 8, keyword: 'Soul', value: 1300, label: 'Blues, Jazz' },
    { id: 9, keyword: 'Rhythm and Blues', value: 1000, label: 'Blues, Rock' },

    // Subcategories for Latin
    { id: 11, keyword: 'Salsa', value: 1100, label: 'Latin, Jazz' },
    { id: 12, keyword: 'Reggaeton', value: 400, label: 'Latin' },
    { id: 13, keyword: 'Bossa Nova', value: 800, label: 'Latin, Jazz' }

];



// Start Graph when it appears in the viewport
// Select the network container
const networkContainer = document.getElementById('network');

// Intersection Observer options
const observerOptions = {
    root: null, // Use the viewport as the root
    threshold: 0.2 // Trigger when 20% of the element is visible
};

// Callback function for the observer
function handleIntersection(entries, observer) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Initialize the graph when 20% of the div is visible
            initializeGraph();
            observer.unobserve(networkContainer); // Stop observing once initialized
        }
    });
}

// Create the observer
const observer = new IntersectionObserver(handleIntersection, observerOptions);
observer.observe(networkContainer);





// Select the specific element
const networkWrapper = document.getElementById('network-wrapper');

// Retrieve the CSS variable value from the specific element
const networkStyles = getComputedStyle(networkWrapper);
// const rootStyles = getComputedStyle(document.documentElement);
const textColor = networkStyles.getPropertyValue('--node-text').trim();
const nodeBg = networkStyles.getPropertyValue('--node-bg').trim();
const nodeBorder = networkStyles.getPropertyValue('--node-border').trim();
const nodeHover = networkStyles.getPropertyValue('--node-hover').trim();
const nodeHoverBorder = networkStyles.getPropertyValue('--node-hover-border').trim();
const nodeHighlight = networkStyles.getPropertyValue('--node-highlight').trim();
const nodeHighlightBorder = networkStyles.getPropertyValue('--node-highlight-border').trim();
const fontFamily = networkStyles.getPropertyValue('--font-family').trim();
const fontSize = parseInt(networkStyles.getPropertyValue('--node-font-size').trim(), 10); // Convert to number

const edgeColor = networkStyles.getPropertyValue('--edge-color').trim();
const edgeHover = networkStyles.getPropertyValue('--edge-hover').trim();
const edgeHighlight = networkStyles.getPropertyValue('--edge-highlight').trim();
const edgeWidth = parseInt(networkStyles.getPropertyValue('--edge-width').trim(), 10); // Convert to number





// Initialize the Graph
function initializeGraph() {
    // Create an empty network initially
    const nodes = new vis.DataSet(); // Start with an empty nodes dataset
    const edges = new vis.DataSet([
        // Connections between main nodes
        { from: 1, to: 2, length: 350 }, // Jazz to Blues
        { from: 1, to: 3, length: 500 }, // Jazz to Latin

        // Connections for Jazz subcategories
        { from: 1, to: 5 }, // Jazz to Fusion
        { from: 1, to: 6 }, // Jazz to Bebop
        { from: 1, to: 7 }, // Jazz to Swing

        // Connections for Blues subcategories
        { from: 2, to: 8 }, // Blues to Soul
        { from: 2, to: 9 }, // Blues to Rhythm and Blues

        // Connections for Latin subcategories
        { from: 3, to: 11 }, // Latin to Salsa
        { from: 3, to: 12 }, // Latin to Reggaeton
        { from: 3, to: 13 }, // Latin to Bossa Nova

    ]);

    const options = {
        nodes: {
        color: {
            background: nodeBg, // Node fill color
            border: nodeBorder,   // Node border color
            hover: {
                background: nodeHover, // Node fill color on hover
                border: nodeHoverBorder    // Node border color on hover
            },
            highlight: {
                background: nodeHighlight, // Node fill color on hover
                border: nodeHighlightBorder // Node border color on hover
            }
        },
        font: {
            face: fontFamily,
            color: textColor, // Set the font color
            size: fontSize, // Name font size
            }
    },
        physics: {
            enabled: true,
            solver: 'forceAtlas2Based',
            forceAtlas2Based: {
                gravitationalConstant: -150, //Modify gravitationalConstant: A more negative gravitational constant will push nodes further apart.
                centralGravity: 0.005, //Increase centralGravity: This can help pull nodes towards the center, but be careful as it might cause more overlap if too high.
                springLength: 150, // Increase springLength: This increases the natural length of the springs (edges), which can help spread out the nodes.
                springConstant: 0.1 //Adjust springConstant: A lower spring constant will make the springs more flexible, allowing nodes to move further apart.
            },
            maxVelocity: 30, //Adjust maxVelocity and minVelocity: These control the speed of node movement during stabilization. Lowering maxVelocity can help reduce jitter and overlap during the stabilization process.
            minVelocity: 0.1,
            stabilization: {
                enabled: true,
                iterations: 1500, // Increase stabilization.iterations: More iterations can help the network settle into a stable configuration with less overlap.
                updateInterval: 25, // Interval to show progress
                onlyDynamicEdges: false,
                fit: true
            }
        },
        interaction: {
            dragNodes: true, // Enable dragging of nodes
            hover: true,
            zoomView: true, // Disable zooming via scroll
            zoomSpeed: 0.3 // Adjust zoom speed if needed
        },
        edges: {
            smooth: false, // Set smooth to false for straight edges
            color: {
                color: edgeColor, // Default edge color
                highlight: edgeHighlight, // Edge color on hover
                hover: edgeHover // Edge color on hover
            },
            width: edgeWidth // Default edge width
        }
        
    };
    const network = new vis.Network(networkContainer, { nodes: nodes, edges: edges }, options);

// Set initial zoom level before adding nodes
network.moveTo({
    position: { x: 0, y: 0 }, // Center position
    scale: 0.5, // Adjust this value to set the initial zoom level - zoomOut < 1 < zoomIn
    animation: {
        duration: 0 // No animation for initial zoom
    }
});

// Function to add nodes one by one
function addNodesWithDelay(nodesData, delay, callback) {
    nodesData.forEach((node, index) => {
        setTimeout(() => {
            nodes.add(node);
            // Call the callback after the last node is added
            if (index === nodesData.length - 1 && callback) {
                callback();
            }
        }, index * delay);
    });
}

// Start adding nodes with a delay
addNodesWithDelay(nodesData.map(node => ({
    id: node.id,
    label: node.keyword,
    value: node.value,
    keyword: node.label,
    shape: 'dot',
    size: Math.sqrt(node.value) / 10 // Adjust size based on value
})), 100, () => {
    // Optionally adjust the view again after all nodes are added
    network.fit({
        nodes: nodes.getIds(),
        animation: {
            duration: 1000,
            easingFunction: 'easeInOutQuad'
        }
    });
});




// Tooltip element
const tooltip = document.getElementById('tooltip');

// Variable to track the currently selected node
let selectedNodeId = null;

// Show tooltip on hover
network.on('hoverNode', function (params) {
    const nodeId = params.node;
    const node = nodes.get(nodeId);
    tooltip.innerHTML = `Genre: ${node.label}<br>Connected: ${node.keyword}`;
    tooltip.style.display = 'block';
});

// Hide tooltip when not hovering, unless a node is selected
network.on('blurNode', function () {
    if (selectedNodeId === null) {
        tooltip.style.display = 'none';
    }
});

// Update tooltip position
network.on('mousemove', function (params) {
    tooltip.style.left = params.event.pageX + 10 + 'px';
    tooltip.style.top = params.event.pageY + 10 + 'px';
});

// Show tooltip when a node is selected
network.on('selectNode', function (params) {
    const nodeId = params.nodes[0];
    selectedNodeId = nodeId;
    const node = nodes.get(nodeId);
    tooltip.innerHTML = `Genre: ${node.label}<br>Connected: ${node.keyword}`;
    tooltip.style.display = 'block';
});

// Hide tooltip when a node is deselected
network.on('deselectNode', function () {
    selectedNodeId = null;
    tooltip.style.display = 'none';
});
}




