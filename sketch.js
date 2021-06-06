var dog,sadDog,happyDog, database;
var foodS,foodStock;
var addFood;
var foodObj;

var bgImg;

//var time;

//create feed and lastFed variable here
var lastfed;
var feed;

function preload(){
  sadDog=loadAnimation("Dog.png");
  happyDog=loadAnimation("happy dog.png");
  bgImg = loadImage("bedroom.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,310,150,150);
  dog.addAnimation("sad",sadDog);
  dog.addAnimation("happy",happyDog);
  dog.scale=0.15;

  //create feed the dog button here
  feed = createButton("Feed Buster");
  feed.position(610,173)
  feed.mousePressed(foodS = foodS - 1)
  feed.mousePressed(feedDog)

  addFood=createButton("Add milk");
  addFood.position(740,173);
  addFood.mousePressed(addFoods);

}

function draw() {
  background(bgImg);
  foodObj.display();
  //time = hour();

  //write code to read fedtime value from the database 
  fedTime = database.ref('hour');
  fedTime.on("value",function(data){
    lastfed = data.val();
  });
 
  //write code to display text lastFed time here

  textAlign(CENTER)
  fill("white");
  textFont("Algerian")
  textSize(15)
  text("Food left: " + foodS,510,175)

  fill("lightgreen")
  textFont("Castellar")
  textAlign(CENTER)
  textSize(15); 
  if(lastfed>=12){ 
    text("Last fed: "+ lastfed % 12 + " pm", 510,200); 
  }else if(lastfed === 0){ 
    text("Last fed: 12 am",510,200); 
  }else{ 
    text("Last fed: " + lastfed + " am", 510,225);
  }

  if(foodS <= 0){
    dog.changeAnimation("sad",sadDog)
  }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


function feedDog(){ 
  dog.changeAnimation("happy",happyDog); 
  foodObj.updateFoodStock(foodObj.getFoodStock()-1); 
  database.ref('/').update({ 
    Food:foodObj.getFoodStock(),
    lastfed:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
