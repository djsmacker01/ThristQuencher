document.querySelectorAll('button').addEventListener('click', getDrink)

document.querySelector('input').addEventListener('keypress', function (event) {
  
    if (event.key == 'Enter') {
        document.querySelector('button').click()
    }
})




    