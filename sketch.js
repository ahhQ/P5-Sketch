let data;
let selectMenu;
let barColors = [];
let column;
let backgroundImage;

function preload() {
  data = loadTable('Food Waste data and research - by country.csv', 'csv', 'header');
  backgroundImage = loadImage('world map.jpeg'); // Load the background image
}

function setup() {
  let canvas = createCanvas(5000, 800);
  canvas.parent('sketch-container');
  textAlign(CENTER, CENTER);

  // Create a drop-down menu
  selectMenu = createSelect();
  selectMenu.position(10, 10);
  selectMenu.option('Combined Figures');
  selectMenu.option('Household Estimate');
  selectMenu.option('Retail Estimate');
  selectMenu.option('Food Service Estimate');
  selectMenu.changed(drawChart);
  selectMenu.style('font-family', 'Cambria');

  // Base color
  let baseRed = 0;
  let baseGreen = 128;
  let baseBlue = 0;

  // Assign a different shade of green for each bar
  for (let i = 0; i < data.getRowCount(); i++) {
    let shade = map(i, 0, data.getRowCount(), 50, 200); // Adjust the green component
    barColors.push(color(baseRed, shade, baseBlue));
  }
}


function draw() {
  clear(); // Clear the canvas

  // Calculate aspect ratio of the image and the canvas
  let imgAspectRatio = backgroundImage.width / backgroundImage.height;
  let canvasAspectRatio = width / height;

  // Calculate the image size to maintain its aspect ratio
  let imgDrawWidth, imgDrawHeight;
  if (imgAspectRatio > canvasAspectRatio) {
    // Image is wider than the canvas
    imgDrawWidth = width;
    imgDrawHeight = width / imgAspectRatio;
  } else {
    // Image is taller than the canvas
    imgDrawHeight = height;
    imgDrawWidth = height * imgAspectRatio;
  }

  // Calculate position to center the image on the canvas
  let imgX = (width - imgDrawWidth) / 2;
  let imgY = (height - imgDrawHeight) / 2;

  // Display the background image
  image(backgroundImage, imgX, imgY, imgDrawWidth, imgDrawHeight);

  // Overlay a semi-transparent black rectangle to darken the image
  fill(0, 100); // Semi-transparent black
  rect(0, 0, width, height);

  drawChart();
  checkForHover();
}

function drawChart() {
  let selectedOption = selectMenu.value();

  // Determine the column to display based on the selected option
  switch (selectedOption) {
    case 'Combined Figures':
      column = 'combined figures (kg/capita/year)';
      break;
    case 'Household Estimate':
      column = 'Household estimate (kg/capita/year)';
      break;
    case 'Retail Estimate':
      column = 'Retail estimate (kg/capita/year)';
      break;
    case 'Food Service Estimate':
      column = 'Food service estimate (kg/capita/year)';
      break;
  }

  // Bar settings
  let barWidth = (width - 200) / data.getRowCount() / 2; // Adjust for spacing
  let maxBarHeight = height - 300; // Leave space for text

  // Draw the y-axis
  drawYAxis();

  // Draw the bar chart
  for (let i = 0; i < data.getRowCount(); i++) {
    let value = data.getNum(i, column);
    let country = data.getString(i, 'Country');
    let x = map(i, 0, data.getRowCount(), 60, width - 40); // Adjusted for y-axis
    let y = map(value, 0, 300, height - 50, 50);

    fill(barColors[i]); // Use the pre-assigned color for each bar

    rect(x - barWidth / 2, height - 50, barWidth, - (height - 50 - y));
  }
}

function checkForHover() {
  let barWidth = (width - 200) / data.getRowCount() / 2; // Match this with drawChart

  for (let i = 0; i < data.getRowCount(); i++) {
    let x = map(i, 0, data.getRowCount(), 60, width - 40);
    let value = data.getNum(i, column);
    let barHeight = map(value, 0, 300, 0, height - 150); // Bar height from top
    let barTop = height - 50 - barHeight;

    if (mouseX > x - barWidth / 2 && mouseX < x + barWidth / 2 && mouseY > barTop && mouseY < height - 50) {
      let country = data.getString(i, 'Country');
      drawLabel(mouseX, mouseY - 20, country + ": " + value.toFixed(2)); // Include value in the label
      break;
    }
  }
}

function drawLabel(x, y, labelText) {
  push();
  fill(255);
  noStroke();
  textSize(16);
  textFont('Cambria');
  textAlign(CENTER, BOTTOM);
  text(labelText, x, y); // labelText now includes country and value
  pop();
}

function drawYAxis() {
  let yAxisValues = 5; // Number of y-axis labels
  let yStep = max(300 / yAxisValues, 1);

  stroke(200); // Light gray color for grid lines
  strokeWeight(1); // Thin lines

  for (let i = 0; i <= yAxisValues; i++) {
    let yVal = i * yStep;
    let y = map(yVal, 0, 300, height - 50, 50);

    textFont('Cambria');
    fill(0);
    noStroke(); 
    text(yVal, 30, y);

    // Draw horizontal grid lines
    stroke(170);
    line(50, y, width - 40, y);
  }

  // Draw y-axis line
  stroke(0);
  line(50, 50, 50, height - 50);

  // Add unit label to y-axis
  push();
  translate(15, height / 2);
  rotate(-PI / 2);
  fill(0);
  noStroke();
  text('kg/capita/year', 0, 0);
  pop();
}