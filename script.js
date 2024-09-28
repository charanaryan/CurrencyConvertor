const baseURL = "https://api.exchangerate-api.com/v4/latest"
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector(".button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input"); // Get the amount input field

// Populate currency dropdowns
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    // Set default selections
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

// Update flag based on selection
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

// Function to fetch exchange rates
const fetchExchangeRates = async (baseCurrency) => {
  try {
    const response = await fetch(`${baseURL}/${baseCurrency}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    console.log(data.rates)
    return data.rates; // Return the rates
  } catch (error) {
    console.error("Error fetching exchange rates:", error);
    msg.innerText = "Error fetching exchange rates. Please try again.";
    throw error; // Rethrow the error
  }
};

// Function to get the exchange rate and display it
const getExchangeRate = async () => {
  const amount = parseFloat(amountInput.value);
  const fromCurrency = fromCurr.value;
  const toCurrency = toCurr.value;

  if (isNaN(amount) || amount <= 0) {
    msg.innerText = "Please enter a valid amount.";
    return;
  }

  try {
    const rates = await fetchExchangeRates(fromCurrency);
    const exchangeRate = rates[toCurrency];
    const convertedAmount = (amount * exchangeRate).toFixed(2);
    msg.innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
  } catch (error) {
    msg.innerText = "Could not retrieve exchange rate.";
  }
};

// Event listener for the button click
btn.addEventListener("click", (event) => {
  event.preventDefault(); // Prevent form submission
  getExchangeRate(); // Call the function to get the exchange rate
});
