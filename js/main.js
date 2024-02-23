// event listener
document.querySelector('button').addEventListener('click', getDrink)

// can also search by hitting enter key and it will automatically turn that into a button click and run the getDrink function
document.querySelector('input').addEventListener('keypress', function(event) {
    if (event.key == 'Enter') {
        document.querySelector('button').click();
    }
})

let listOfDrinks, intervalID;   
let index = 0;

function getDrink(){
  let search = document.querySelector('input').value
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${search}`)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        document.querySelector('main').classList.remove('hidden');
        document.querySelector('#blurb').classList.add('hidden');
        console.log(data)

        // store list of all drinks that came up for the search result
        listOfDrinks = data.drinks;

        let index = 0;

        // display first drink
        displayDrink(listOfDrinks[index])

        // add event listeners to arrows
        const prevArrow = document.querySelector('.fa-arrow-left');
        const nextArrow = document.querySelector('.fa-arrow-right');
        prevArrow.addEventListener('click', () => {
            // do index this way so it 
            index = (index - 1 + listOfDrinks.length) % listOfDrinks.length;
            displayDrink(listOfDrinks[index])
        });
        nextArrow.addEventListener('click', () => {
            index = (index + 1) % listOfDrinks.length;
            displayDrink(listOfDrinks[index])
        });

        // remove arrows if there isn't more than one result
        if (listOfDrinks.length < 2) {
            prevArrow.classList.add('hidden');
            nextArrow.classList.add('hidden');
        } else {
            prevArrow.classList.remove('hidden');
            nextArrow.classList.remove('hidden');
        }
        
        // event listeners to start and stop carousel
        document.querySelector('.drink-container').addEventListener('mouseout', startCarousel);
        document.querySelector('.drink-container').addEventListener('mouseover', stopCarousel);

      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

// go to the next drink
function goToNext() {
    index = (index + 1) % listOfDrinks.length;
    displayDrink(listOfDrinks[index]);
}

function startCarousel() {
    clearInterval(intervalID)
    // interval to automatically go to next drink every 5 seconds
    intervalID = setInterval(goToNext, 5000);
}

function stopCarousel() {
    clearInterval(intervalID)
}

function displayDrink(drink) {
    displayDrinkName(drink)
    displayDrinkImage(drink)
    displayIngredients(drink)
    displayInstructions(drink)
}

function displayDrinkName(drink) {
    const drinkName = document.querySelector('.drink-name');        
    drinkName.innerText = drink.strDrink
}

function displayDrinkImage(drink) {
    const drinkImg = document.querySelector('#drink-img');
    drinkImg.src = drink.strDrinkThumb // place image into DOM
    drinkImg.alt = drink.strDrink // set alt for image ot name of drink
}

function displayIngredients(drink) {
    const ingredientList=document.querySelector('.ingredient-list');
    ingredientList.textContent = '';

    // use a for loop and change the number ending of the property (strIngredient1 through strIngredient15). If the value is null, don't print it otherwise do
    for (let i = 1; i < 16; i++) {
        if (drink[`strIngredient${i}`] !== null) {
            let li = document.createElement('li')
            
            // if the quantity of ingredient exists, add it to the text node, if not proceed as normal without quantity
            if (drink[`strMeasure${i}`] !== null) {
                li.appendChild(document.createTextNode(`${drink[`strIngredient${i}`]} (${drink[`strMeasure${i}`].trim()})`))
            } else {
                // create a list item with the ingredient name
                li.appendChild(document.createTextNode(drink[`strIngredient${i}`]))
            }
            // add item to ol
            ingredientList.appendChild(li)
        }
    }
}

function displayInstructions(drink) {
    // place to put instructions
    const instructionsParagraph = document.querySelector('.instructions-p')

    instructionsParagraph.innerText = drink.strInstructions
}