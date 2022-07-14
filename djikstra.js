//Dijkstra algorithm is used to find the shortest distance between two nodes inside a valid weighted graph. Often used in Google Maps, Network Router etc.

//helper class for PriorityQueue
class Node {
    constructor(val, priority) {
        this.val = val;
        this.priority = priority;
    }
}

class PriorityQueue {
    constructor() {
        this.values = [];
    }
    enqueue(val, priority) {
        let newNode = new Node(val, priority);
        this.values.push(newNode);
        this.bubbleUp();
    }
    bubbleUp() {
        let idx = this.values.length - 1;
        const element = this.values[idx];
        while (idx > 0) {
            let parentIdx = Math.floor((idx - 1) / 2);
            let parent = this.values[parentIdx];
            if (element.priority >= parent.priority) break;
            this.values[parentIdx] = element;
            this.values[idx] = parent;
            idx = parentIdx;
        }
    }
    dequeue() {
        const min = this.values[0];
        const end = this.values.pop();
        if (this.values.length > 0) {
            this.values[0] = end;
            this.sinkDown();
        }
        return min;
    }
    sinkDown() {
        let idx = 0;
        const length = this.values.length;
        const element = this.values[0];
        while (true) {
            let leftChildIdx = 2 * idx + 1;
            let rightChildIdx = 2 * idx + 2;
            let leftChild, rightChild;
            let swap = null;

            if (leftChildIdx < length) {
                leftChild = this.values[leftChildIdx];
                if (leftChild.priority < element.priority) {
                    swap = leftChildIdx;
                }
            }
            if (rightChildIdx < length) {
                rightChild = this.values[rightChildIdx];
                if (
                    (swap === null && rightChild.priority < element.priority) ||
                    (swap !== null && rightChild.priority < leftChild.priority)
                ) {
                    swap = rightChildIdx;
                }
            }
            if (swap === null) break;
            this.values[idx] = this.values[swap];
            this.values[swap] = element;
            idx = swap;
        }
    }
}

//Dijkstra's algorithm only works on a weighted graph.

class WeightedGraph {
    constructor() {
        this.adjacencyList = {};
    }
    addVertex(vertex) {
        if (!this.adjacencyList[vertex])
            this.adjacencyList[vertex] = [];
    }
    addEdge(vertex1, vertex2, weight) {
        this.adjacencyList[vertex1].push({
            node: vertex2,
            weight
        });
        this.adjacencyList[vertex2].push({
            node: vertex1,
            weight
        });
    }
    Dijkstra(start, finish) {
        const nodes = new PriorityQueue();
        const distances = {};
        const previous = {};
        let pathD = []; //to return at end
        let smallest;
        //build up initial state
        for (let vertex in this.adjacencyList) {
            if (vertex === start) {
                distances[vertex] = 0;
                nodes.enqueue(vertex, 0);
            } else {
                distances[vertex] = Infinity;
                nodes.enqueue(vertex, Infinity);
            }
            previous[vertex] = null;
        }
        // as long as there is something to visit
        while (nodes.values.length) {
            smallest = nodes.dequeue().val;
            if (smallest === finish) {
                //WE ARE DONE
                //BUILD UP pathD TO RETURN AT END
                while (previous[smallest]) {
                    pathD.push(smallest);
                    smallest = previous[smallest];
                }
                break;
            }
            if (smallest || distances[smallest] !== Infinity) {
                for (let neighbor in this.adjacencyList[smallest]) {
                    //find neighboring node
                    let nextNode = this.adjacencyList[smallest][neighbor];
                    //calculate new distance to neighboring node
                    let candidate = distances[smallest] + nextNode.weight;
                    let nextNeighbor = nextNode.node;
                    if (candidate < distances[nextNeighbor]) {
                        //updating new smallest distance to neighbor
                        distances[nextNeighbor] = candidate;
                        //updating previous - How we got to neighbor
                        previous[nextNeighbor] = smallest;
                        //enqueue in priority queue with new priority
                        nodes.enqueue(nextNeighbor, candidate);
                    }
                }
            }
        }
        return pathD.concat(smallest).reverse();
    }
}

// console.log(pathD);

//EXAMPLES=====================================================================

// var graph = new WeightedGraph();
// graph.addVertex("A");
// graph.addVertex("B");
// graph.addVertex("C");
// graph.addVertex("D");
// graph.addVertex("E");
// graph.addVertex("F");

// graph.addEdge("A", "B", 4);
// graph.addEdge("A", "C", 2);
// graph.addEdge("B", "E", 3);
// graph.addEdge("C", "D", 2);
// graph.addEdge("C", "F", 4);
// graph.addEdge("D", "E", 3);
// graph.addEdge("D", "F", 1);
// graph.addEdge("E", "F", 1);


//utility function to remove a Spot from openSet array
function removeFromArray(arr, ell) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == ell) {
            arr.splice(i, 1);
        }
    }
}

//function to find a distance from a Spot to the end using heuristic aproach(assumes there are no obstacles and taxi can move only up/down and left/right)
function heuristic(a, b) {
    var distance = abs(a.i - b.i) + abs(a.j - b.j); //manhatan/taxi cab distance
    return distance;
}

// Grid definition step 1
var cols = 15;
var rows = 15;
var grid = new Array(cols);
var graph;

//Global variables
var openSet = []; //array of possible next Spots in the Path
var closedSet = []; // visited and evaluated Spots
var start; //statring point
var end; //end point
var w, h; //width and height of a Spot
var path = []; //array of best Spots to go trough
var nosolution = false; //boolean true if there is no possible path from start to end

function show(col) {
    fill(col);
    if (this.wall) { //if the Node is an obstacle color it black
        fill(0);
    }
    stroke(0);
    rect(this.i * w, this.j * h, w - 1, h - 1); // Spot is a rectangle 
}
// Constructor function for a Spot Object
function Spot(i, j) {
    this.name = i + "_" + j;
    this.i = i; //position x on the grid
    this.j = j; //position y on the grid
    this.f = 0; //heuristic total distance from start to end through this Spot
    this.g = 0; //distance from start to this Spot
    this.h = 0; //heuristic distance from this Spot to the end 

    this.neighbors = []; //array of neighbors of a given Spot
    this.previous = undefined; //Spor visited before current Spot
    this.wall = false; //obstacle, Spot not possible to visit

    //Make random Spots an obstacle
    if (random(1) < 0.25) {
        this.wall = true;
    }

    //function displaing colored grid of Spots
    this.show = function (col) {
        fill(col);
        if (this.wall) { //if the Spot is an obstacle color it black
            fill(0);
        }
        stroke(0);
        rect(this.i * w, this.j * h, w - 1, h - 1); // Spot is a rectangle 
    }

    //function to add neighbors to each Spot
    this.addNeighbors = function (grid, graph) {
        var i = this.i;
        var j = this.j;

        //if statements prevent adding a neighbor outside the grid
        if (i < cols - 1) {
                this.neighbors.push(grid[i + 1][j]);
        }
        if (i > 0) {
                this.neighbors.push(grid[i - 1][j]);
        }
        if (j < rows - 1) {
                this.neighbors.push(grid[i][j + 1]);
        }
        if (j > 0) {
            this.neighbors.push(grid[i][j - 1]);
        }
    }
} //End Spot constructor function

//Setup function for a grid of Spots
function setup() {
    createCanvas(400, 400); //p5.js function to create canvas on which the grid will be displayed
    w = width / cols; //calculate width of a single Spot
    h = height / rows; //calculate height of a single Spot

    graph = new WeightedGraph();
    // graph.addVertex("A");
    // graph.addVertex("B");
    // graph.addVertex("C");
    // graph.addVertex("D");
    // graph.addVertex("E");
    // graph.addVertex("F");

    // graph.addEdge("A", "B", 4);
    // graph.addEdge("A", "C", 2);
    // graph.addEdge("B", "E", 3);
    // graph.addEdge("C", "D", 2);
    // graph.addEdge("C", "F", 4);
    // graph.addEdge("D", "E", 3);
    // graph.addEdge("D", "F", 1);
    // graph.addEdge("E", "F", 1);

    // Making a 2D array
    for (var i = 0; i < cols; i++) {
        grid[i] = new Array(rows);
    }

    // Filling the 2D grid with Spots(nodes)
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j] = new Spot(i, j);
        }
    }

    // Filling the graph with Spots(nodes)
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            graph.addVertex(grid[i][j].name);
        }
    }


    //adding a array of neighbors to each Spot
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].addNeighbors(grid, graph);
        }
    }

    //adding the edges to each node in the graph
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            //if statements prevent adding a neighbor outside the grid
            if (i < cols - 1) {
                if (!grid[i + 1][j].wall && !grid[i][j].wall) {
                    graph.addEdge(i + "_" + j, (i + 1) + "_" + j, 1);
                }
            }
            if (i > 0) {
                if (!grid[i - 1][j].wall && !grid[i][j].wall) {
                    graph.addEdge(i + "_" + j, (i - 1) + "_" + j, 1);
                }
            }
            if (j < rows - 1) {
                if (!grid[i][j + 1].wall && !grid[i][j].wall) {
                    graph.addEdge(i + "_" + j, i + "_" + (j + 1), 1);
                }
            }
            if (j > 0) {
                if (!grid[i][j - 1].wall && !grid[i][j].wall) {
                    graph.addEdge(i + "_" + j, i + "_" + (j - 1), 1);
                }
            }
        }
    }
    console.log(graph);
    console.log(grid);


    //define starting point
    start = grid[0][0];
    start.wall = false;
    openSet.push(start);
    //define end point
    end = grid[cols - 1][rows - 1];
    end.wall = false;

    //Dijkstra algorithm
    console.log(start.name);
    console.log(graph.Dijkstra(start.name, end.name));

} //end setup function

//p5.js function to draw in a loop - display working A* Algorithm
function draw() {


    // A* algorithm
    if (openSet.length > 0) { //it there are Spots in openSet we can keep going

        var winner = 0; //keeps the index of a Spot with the shortes distance to an end in the openSet array

        //checking if next Spot has shorter distance to an end than last Spot with shortes distance
        for (var i = 0; i < openSet.length; i++) {
            if (openSet[i].f < openSet[winner].f) {
                winner = i;
            }
        }

        var current = openSet[winner]; //Spot with shortes distance to an end

        //If end is reached stop redrawing a grid
        if (current === end) {

            noLoop(); //p5.js function to stop redrawing the page
            console.log("done");
        }

        //remove current Spot (last visited) from openSet
        removeFromArray(openSet, current);
        //add current Spot to closedSet of visited Spots
        closedSet.push(current);

        var neighbors = current.neighbors; //neighbors of a current Spot

        //loop trough all nighbors of a current Spot
        for (var i = 0; i < neighbors.length; i++) {
            var neighbor = neighbors[i];

            //only if a nighbor is not in closedSet and is not an obstacle
            if (!closedSet.includes(neighbor) && !neighbor.wall) {
                //increase g value of a current Spot (distance from start to this Spot)
                var tempG = current.g + 1;

                //if the given neighbor is in a openSet 
                if (openSet.includes(neighbor)) {
                    //and if this neighbor distance to the end is less than current distance +1
                    if (tempG < neighbor.g) {
                        //update the distance
                        neighbor.g = tempG;
                    }
                } else {
                    neighbor.g = tempG;
                    openSet.push(neighbor);
                }

                neighbor.h = heuristic(neighbor, end); // heuristic distance between neigbor and and end
                neighbor.f = neighbor.g + neighbor.h; //heuristic sistance from start to end through current Spot
                neighbor.previous = current; //current Spot become a previous Spot for a neighbor
            }
        }
    } else {
        //no solution
        nosolution = true;
        noLoop(); //stop redrawing a grid
    }
    //A* Algorithm end

    background(255);

    //initialize a grid with white background
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            grid[i][j].show(color(255));
        }
    }

    //closedSet - visited but not chosen Spots are marked Red
    for (var i = 0; i < closedSet.length; i++) {
        closedSet[i].show(color(255, 0, 0));
    }

    //openSet - possible next Spots to visit are marked Green
    for (var i = 0; i < openSet.length; i++) {
        openSet[i].show(color(0, 255, 0));
    }

    //Retrive a path from last visited Spot and each previous Spot(node)
    if (!nosolution) {
        path = [];
        var temp = current; //temp variable for last Spot
        path.push(temp); // Add end Spot to the best Path

        //Keep adding previously visited Spots to the Path
        while (temp.previous) {
            path.push(temp.previous);
            temp = temp.previous;
        }
    }

    //The best Path is marked Blue
    for (var i = 0; i < path.length; i++) {
        path[i].show(color(0, 0, 255));
    }
}