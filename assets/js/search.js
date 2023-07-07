const input = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const citySearch = document.querySelector('#city-input')
const cityForm = document.querySelector('#city-form')

// elements can have more than one class. Toggle will add class to element's class list if it's not there, and remove it if it is there.
const expand = () => {
  searchBtn.classList.toggle("close");
  input.classList.toggle("square");
};

/*
const to_red = () => {
  citySearch.style.color="#FF0000";
  citySearch.classList.add("red-placeholder")
  console.log("click_detected");
};
*/
const city_form_change = (event) => {
  //citySearch.style.color="#FF0000";
  event.preventDefault();
  console.log("submit_detected");
  change_city(event.target.elements.city.value);
  
};

searchBtn.addEventListener("click", expand);
input.addEventListener("click", expand);
//citySearch.addEventListener("click", to_red);
cityForm.addEventListener("submit", city_form_change);