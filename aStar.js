//utility function to remove a Spot from openSet array
function removeFromArray(arr, ell) {
    for (var i = arr.length - 1; i >= 0; i--) {
        if (arr[i] == ell) {
            arr.splice(i, 1);
        }
    }
}

// Grid definition step 1
var cols = 50;
var rows = 50;
var grid = new Array(cols);
// Making a 2D array
for (var i = 0; i < cols; i++) {
    grid[i] = new Array(rows);
}





//local properties and functions for A* Pathfinding
let aStar = function (p) {

    //function to find a distance from a Spot to the end using heuristic aproach(assumes there are no obstacles and taxi can move only up/down and left/right)
    function heuristic(a, b) {
        var distance = p.abs(a.i - b.i) + p.abs(a.j - b.j); //manhatan/taxi cab distance
        return distance;
    }

    //Global variables
    var openSet = []; //array of possible next Spots in the Path
    var closedSet = []; // visited and evaluated Spots
    var start; //statring point
    var end; //end point
    var w, h; //width and height of a Spot
    var path = []; //array of best Spots to go trough
    var nosolution = false; //boolean true if there is no possible path from start to end

    // Constructor function for a Spot Object
    function Spot(i, j) {
        this.i = i; //position x on the grid
        this.j = j; //position y on the grid
        this.f = 0; //heuristic total distance from start to end through this Spot
        this.g = 0; //distance from start to this Spot
        this.h = 0; //heuristic distance from this Spot to the end 

        this.neighbors = []; //array of neighbors of a given Spot
        this.previous = undefined; //Spor visited before current Spot
        this.wall = false; //obstacle, Spot not possible to visit

        //Make random Spots an obstacle
        if (p.random(1) < 0.35) {
            this.wall = true;
        }

        //function displaing colored grid of Spots
        this.show = function (col) {
            p.fill(col);
            if (this.wall) { //if the Spot is an obstacle color it black
                p.fill(0);
            }
            p.stroke(0);
            p.rect(this.i * w, this.j * h, w - 1, h - 1); // Spot is a rectangle 
        }

        //function to add neighbors to each Spot
        this.addNeighbors = function (grid) {
            var i = this.i;
            var j = this.j;

            //if statements prevent adding a neighbor outside the grid
            if (i < cols - 1) {
                this.neighbors.push(grid[i + 1][j]);
            }
            if (i < cols - 1 && j < rows - 1){
                this.neighbors.push(grid[i + 1][j+1]);
            }
            if (i < cols - 1 && j > 0){
                this.neighbors.push(grid[i + 1][j-1]);
            }
            if (i > 0) {
                this.neighbors.push(grid[i - 1][j]);
            }
            if (i > 0 && j < rows - 1) {
                this.neighbors.push(grid[i - 1][j+1]);
            }
            if (i > 0 && j > 0) {
                this.neighbors.push(grid[i - 1][j-1]);
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
    p.setup = function () {
        p.createCanvas(400, 400); //p5.js function to create canvas on which the grid will be displayed
        w = p.width / cols; //calculate width of a single Spot
        h = p.height / rows; //calculate height of a single Spot
    
        // Filling the 2D grid with Spots(nodes)
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                grid[i][j] = new Spot(i, j);
            }
        }
    
        //adding a array of neighbors to each Spot
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                grid[i][j].addNeighbors(grid);
            }
        }
    
        //define starting point
        start = grid[0][0];
        start.wall = false;
        openSet.push(start);
        //define end point
        end = grid[cols - 1][rows - 1];
        end.wall = false;
    }

    //p5.js function to draw in a loop - display working A* Algorithm
    p.draw = function () {
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

                p.noLoop(); //p5.js function to stop redrawing the page
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
            p.noLoop(); //stop redrawing a grid
        }
        //A* Algorithm end

        // p.background(255);

        //initialize a grid with white background
        for (var i = 0; i < cols; i++) {
            for (var j = 0; j < rows; j++) {
                grid[i][j].show(p.color(255));
            }
        }

        

        //closedSet - visited but not chosen Spots are marked Red
        for (var i = 0; i < closedSet.length; i++) {
            closedSet[i].show(p.color(255, 0, 0));
        }

        //openSet - possible next Spots to visit are marked Green
        for (var i = 0; i < openSet.length; i++) {
            openSet[i].show(p.color(0, 255, 0));
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
            path[i].show(p.color(0, 0, 255));
        }
    }
    console.log(grid);

}
new p5(aStar, 'astar');
















// //second canvas

// //local properties and functions for A* Pathfinding
// let aStar2 = function (r) {
//     //function to find a distance from a Spot to the end using heuristic aproach(assumes there are no obstacles and taxi can move only up/down and left/right)
//     function heuristic(a, b) {
//         var distance = r.abs(a.i - b.i) + r.abs(a.j - b.j); //manhatan/taxi cab distance
//         return distance;
//     }

//     //Global variables
//     var openSet = []; //array of possible next Spots in the Path
//     var closedSet = []; // visited and evaluated Spots
//     var start; //statring point
//     var end; //end point
//     var w, h; //width and height of a Spot
//     var path = []; //array of best Spots to go trough
//     var nosolution = false; //boolean true if there is no possible path from start to end

//     // Constructor function for a Spot Object
//     function Spot(i, j) {
//         this.i = i; //position x on the grid
//         this.j = j; //position y on the grid
//         this.f = 0; //heuristic total distance from start to end through this Spot
//         this.g = 0; //distance from start to this Spot
//         this.h = 0; //heuristic distance from this Spot to the end 

//         this.neighbors = []; //array of neighbors of a given Spot
//         this.previous = undefined; //Spor visited before current Spot
//         this.wall = false; //obstacle, Spot not possible to visit

//         //Make random Spots an obstacle
//         if (r.random(1) < 0.35) {
//             this.wall = true;
//         }

//         //function displaing colored grid of Spots
//         this.show = function (col) {
//             r.fill(col);
//             if (this.wall) { //if the Spot is an obstacle color it black
//                 r.fill(0);
//             }
//             r.stroke(0);
//             r.rect(this.i * w, this.j * h, w - 1, h - 1); // Spot is a rectangle 
//         }

//         //function to add neighbors to each Spot
//         this.addNeighbors = function (grid) {
//             var i = this.i;
//             var j = this.j;

//             //if statements prevent adding a neighbor outside the grid
//             if (i < cols - 1) {
//                 this.neighbors.push(grid[i + 1][j]);
//             }
//             if (i > 0) {
//                 this.neighbors.push(grid[i - 1][j]);
//             }
//             if (j < rows - 1) {
//                 this.neighbors.push(grid[i][j + 1]);
//             }
//             if (j > 0) {
//                 this.neighbors.push(grid[i][j - 1]);
//             }
//         }
//     } //End Spot constructor function


//     //Setup function for a grid of Spots
//     r.setup = function () {

//         r.createCanvas(400, 400); //p5.js function to create canvas on which the grid will be displayed
//         w = r.width / cols; //calculate width of a single Spot
//         h = r.height / rows; //calculate height of a single Spot
    
//         // Filling the 2D grid with Spots(nodes)
//         for (var i = 0; i < cols; i++) {
//             for (var j = 0; j < rows; j++) {
//                 grid[i][j] = new Spot(i, j);
//             }
//         }
    
//         //adding a array of neighbors to each Spot
//         for (var i = 0; i < cols; i++) {
//             for (var j = 0; j < rows; j++) {
//                 grid[i][j].addNeighbors(grid);
//             }
//         }
    
//         //define starting point
//         start = grid[0][0];
//         start.wall = false;
//         openSet.push(start);
//         //define end point
//         end = grid[cols - 1][rows - 1];
//         end.wall = false;
//     }//end setup function

//     //p5.js function to draw in a loop - display working A* Algorithm
//     r.draw = function () {
//         // A* algorithm
//         if (openSet.length > 0) { //it there are Spots in openSet we can keep going

//             var winner = 0; //keeps the index of a Spot with the shortes distance to an end in the openSet array

//             //checking if next Spot has shorter distance to an end than last Spot with shortes distance
//             for (var i = 0; i < openSet.length; i++) {
//                 if (openSet[i].f < openSet[winner].f) {
//                     winner = i;
//                 }
//             }

//             var current = openSet[winner]; //Spot with shortes distance to an end

//             //If end is reached stop redrawing a grid
//             if (current === end) {

//                 r.noLoop(); //p5.js function to stop redrawing the page
//                 console.log("done");
//             }

//             //remove current Spot (last visited) from openSet
//             removeFromArray(openSet, current);
//             //add current Spot to closedSet of visited Spots
//             closedSet.push(current);

//             var neighbors = current.neighbors; //neighbors of a current Spot

//             //loop trough all nighbors of a current Spot
//             for (var i = 0; i < neighbors.length; i++) {
//                 var neighbor = neighbors[i];

//                 //only if a nighbor is not in closedSet and is not an obstacle
//                 if (!closedSet.includes(neighbor) && !neighbor.wall) {
//                     //increase g value of a current Spot (distance from start to this Spot)
//                     var tempG = current.g + 1;

//                     //if the given neighbor is in a openSet 
//                     if (openSet.includes(neighbor)) {
//                         //and if this neighbor distance to the end is less than current distance +1
//                         if (tempG < neighbor.g) {
//                             //update the distance
//                             neighbor.g = tempG;
//                         }
//                     } else {
//                         neighbor.g = tempG;
//                         openSet.push(neighbor);
//                     }

//                     neighbor.h = heuristic(neighbor, end); // heuristic distance between neigbor and and end
//                     neighbor.f = neighbor.g + neighbor.h; //heuristic sistance from start to end through current Spot
//                     neighbor.previous = current; //current Spot become a previous Spot for a neighbor
//                 }
//             }
//         } else {
//             //no solution
//             nosolution = true;
//             r.noLoop(); //stop redrawing a grid
//         }
//         //A* Algorithm end

//         r.background(255);

//         //initialize a grid with white background
//         for (var i = 0; i < cols; i++) {
//             for (var j = 0; j < rows; j++) {
//                 grid[i][j].show(r.color(255));
//             }
//         }

//         //closedSet - visited but not chosen Spots are marked Red
//         for (var i = 0; i < closedSet.length; i++) {
//             closedSet[i].show(r.color(255, 0, 0));
//         }

//         //openSet - possible next Spots to visit are marked Green
//         for (var i = 0; i < openSet.length; i++) {
//             openSet[i].show(r.color(0, 255, 0));
//         }

//         //Retrive a path from last visited Spot and each previous Spot(node)
//         if (!nosolution) {
//             path = [];
//             var temp = current; //temp variable for last Spot
//             path.push(temp); // Add end Spot to the best Path

//             //Keep adding previously visited Spots to the Path
//             while (temp.previous) {
//                 path.push(temp.previous);
//                 temp = temp.previous;
//             }
//         }

//         //The best Path is marked Blue
//         for (var i = 0; i < path.length; i++) {
//             path[i].show(r.color(0, 0, 255));
//         }
//     }
// }

// new p5(aStar2, 'astar2');