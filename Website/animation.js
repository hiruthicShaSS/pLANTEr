var alias = project.activeLayer.children

function createCircle(center, rad) {
    var circle = new Path.Circle({
    center: center,
    radius: rad,
    strokeColor: Color.random()
});    
}
createCircle([80, 50], 30)
var numofCircles = 2

view.onMouseDown = function(event) {
   for(var i = 0; i < numofCircles; i++) {
 createCircle([event.point.x, event.point.y], Math.random() * 50)
} 
}

function onFrame(event) {
    for(var i = 0; i < alias.length; i++) {
        alias[i].position.y += alias[i].bounds.width / 20
        if (alias[i].data.shifted == true) {continue;}
        else if (Date.now() % 2 == 0) {
            alias[i].position.x -= 20
            alias[i].data.shifted = true
        } else if (Date.now() % 3 == 0) {
            alias[i].position.x += 20
            alias[i].data.shifted = true
        }
         else if (alias[i].bounds.top > view.size.height) {
           alias[i] == undefined
           console.log("removed")
       } 
      
}}
console.log(alias[0].position)

