// Define generateShade function
function generateShade(baseColor, layer) {
  let color = parseInt(baseColor.substring(1), 16); // Convert baseColor from hex to integer
  let adjustment = layer * 819; // Apply layer-based adjustment
  color = (color + adjustment) & 0xffffff; // Ensure the color stays in a valid hex range
  return "#" + color.toString(16).padStart(6, "0"); // Convert back to hex string
}

function adjustColor(color, amount) {
  let useHash = false;

  if (color[0] == "#") {
    color = color.slice(1);
    useHash = true;
  }

  var num = parseInt(color, 16),
    r = (num >> 16) + amount,
    b = ((num >> 8) & 0x00ff) + amount,
    g = (num & 0x0000ff) + amount,
    newColor = g | (b << 8) | (r << 16);
  return (useHash ? "#" : "") + newColor.toString(16).padStart(6, "0");
}

function generateRandomEnso(containerId, layers) {
    const container = document.getElementById(containerId);
    container.innerHTML = ""; // Clear the container

    for (let i = 0; i < layers; i++) {
        const svgNS = "http://www.w3.org/2000/svg";
        let svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("style", "position: absolute; top: 0; left: 0; width: 100%; height: 100%");
        svg.setAttribute("viewBox", "0 0 400 400");

        // Gradient setup
        let defs = document.createElementNS(svgNS, "defs");
        let gradient = document.createElementNS(svgNS, "linearGradient");
        let gradientId = `fadeGradient${i}`;
        gradient.setAttribute("id", gradientId);
        gradient.setAttribute("gradientUnits", "userSpaceOnUse");
        gradient.setAttribute("x1", "0%");
        gradient.setAttribute("y1", "0%");
        gradient.setAttribute("x2", "100%");
        gradient.setAttribute("y2", "0%");

        // Adjust color for each layer
        let baseColor = "#cc0000"; // Your base red color
        let layerColor = adjustColor(baseColor, i * 10 - (layers / 2) * 10); // Lighten/Darken based on layer

        // Define gradient stops with adjusted color
        let stops = [
            {offset: "5%", opacity: "0"},
            {offset: "25%", opacity: "1"},
            {offset: "75%", opacity: "1"},
            {offset: "95%", opacity: "0"}
        ];

        stops.forEach(({offset, opacity}) => {
            let stop = document.createElementNS(svgNS, "stop");
            stop.setAttribute("offset", offset);
            stop.setAttribute("stop-color", layerColor); // Use adjusted color here
            stop.setAttribute("stop-opacity", opacity);
            gradient.appendChild(stop);
        });

        defs.appendChild(gradient);
        svg.appendChild(defs);

        // Path setup remains the same
        let path = document.createElementNS(svgNS, "path");
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", `url(#${gradientId})`);
        path.setAttribute("stroke-width", Math.random() * 4 + 2); 

        // Generate path data
        const opening = Math.random() * 0.2 + 0.1;
        const startAngle = Math.PI * opening;
        const endAngle = Math.PI * (2 - opening);
        const pathData = describeArc(200, 200, 100, startAngle * (180 / Math.PI), endAngle * (180 / Math.PI));
        path.setAttribute("d", pathData);

        svg.appendChild(path);
        container.appendChild(svg);
    }
}

// Helper function to describe an arc for SVG path
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(x, y, radius, startAngle, endAngle) {
  var start = polarToCartesian(x, y, radius, endAngle);
  var end = polarToCartesian(x, y, radius, startAngle);
  var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  var d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(" ");
  return d;
}

window.addEventListener("load", () => generateRandomEnso("ensoContainer", 25));
