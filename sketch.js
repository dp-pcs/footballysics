let runner;
let tackler;

let runnerAngleSlider, tacklerAngleSlider, runnerMassSlider, tacklerMassSlider;
let runnerAngleValue, tacklerAngleValue, runnerMassValue, tacklerMassValue;
let startButton, resetButton;

let simulationStarted = false;
let outcomeMessage = "";

function setup() {
    const canvas = createCanvas(800, 400);
    canvas.parent('canvas-container');

    // UI Elements
    runnerAngleSlider = select('#runner-angle');
    tacklerAngleSlider = select('#tackler-angle');
    runnerMassSlider = select('#runner-mass');
    tacklerMassSlider = select('#tackler-mass');

    runnerAngleValue = select('#runner-angle-value');
    tacklerAngleValue = select('#tackler-angle-value');
    runnerMassValue = select('#runner-mass-value');
    tacklerMassValue = select('#tackler-mass-value');

    startButton = select('#start-button');
    resetButton = select('#reset-button');

    // Event Listeners
    runnerAngleSlider.input(() => runnerAngleValue.html(runnerAngleSlider.value()));
    tacklerAngleSlider.input(() => tacklerAngleValue.html(tacklerAngleSlider.value()));
    runnerMassSlider.input(() => runnerMassValue.html(runnerMassSlider.value()));
    tacklerMassSlider.input(() => tacklerMassValue.html(tacklerMassSlider.value()));

    startButton.mousePressed(() => simulationStarted = true);
    resetButton.mousePressed(resetSimulation);

    resetSimulation();
}

function draw() {
    background(100, 150, 100); // Green field color

    if (simulationStarted) {
        runner.update();
        tackler.update();
        checkCollision();
    }

    runner.show();
    tackler.show();

    if (outcomeMessage) {
        fill(255);
        textSize(32);
        textAlign(CENTER, CENTER);
        text(outcomeMessage, width / 2, height / 2);
    }
}

function resetSimulation() {
    simulationStarted = false;
    outcomeMessage = "";

    const runnerAngle = runnerAngleSlider.value();
    const tacklerAngle = tacklerAngleSlider.value();
    const runnerMass = runnerMassSlider.value();
    const tacklerMass = tacklerMassSlider.value();

    runner = new Player(width / 4, height / 2, runnerAngle, runnerMass, color(0, 0, 255), true);
    tackler = new Player(3 * width / 4, height / 2, tacklerAngle, tacklerMass, color(255, 0, 0), false);
}

class Player {
    constructor(x, y, angle, mass, c, isRunner) {
        this.pos = createVector(x, y);
        this.angle = radians(angle);
        this.vel = p5.Vector.fromAngle(this.angle, 2);
        this.mass = mass;
        this.radius = 10;
        this.color = c;
        this.isRunner = isRunner;
        this.collided = false;
    }

    update() {
        this.pos.add(this.vel);
    }

    show() {
        fill(this.color);
        noStroke();
        ellipse(this.pos.x, this.pos.y, this.radius * 2, this.radius * 2);

        // Draw a line to show direction
        stroke(255);
        strokeWeight(2);
        line(this.pos.x, this.pos.y, this.pos.x + this.vel.x * 10, this.pos.y + this.vel.y * 10);
    }
}

function checkCollision() {
    if (runner.collided || tackler.collided) {
        return;
    }
    let distance = dist(runner.pos.x, runner.pos.y, tackler.pos.x, tackler.pos.y);
    if (distance < runner.radius + tackler.radius) {
        handleCollision();
        runner.collided = true;
        tackler.collided = true;
    }
}

function handleCollision() {
    // Inelastic collision
    let totalMass = float(runner.mass) + float(tackler.mass);
    let newVelX = (runner.mass * runner.vel.x + tackler.mass * tackler.vel.x) / totalMass;
    let newVelY = (runner.mass * runner.vel.y + tackler.mass * tackler.vel.y) / totalMass;

    let newVel = createVector(newVelX, newVelY);

    runner.vel = newVel;
    tackler.vel = newVel;

    // Set outcome message
    if (newVel.mag() > 1.5) {
        outcomeMessage = "Broken Tackle!";
    } else if (newVel.mag() < 0.5) {
        outcomeMessage = "Big Hit!";
    } else {
        outcomeMessage = "Tackle!";
    }
}
