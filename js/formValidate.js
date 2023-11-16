/******w*************
    
    Project 2 Javascript
    Name: Khuong Mai
    Date:
    Description:

********************/

const itemDescription = [
  "MacBook",
  "The Razer",
  "WD My Passport",
  "Nexus 7",
  "DD-45 Drums",
];
const itemPrice = [1899.99, 79.99, 179.99, 249.99, 119.99];
const itemImage = [
  "mac.png",
  "mouse.png",
  "wdehd.png",
  "nexus.png",
  "drums.png",
];

const fields = [
  "fullname",
  "address",
  "city",
  "province",
  "postal",
  "email",
  "cardname",
  "month",
  "cardnumber",
];

let numberOfItemsInCart = 0;
let orderTotal = 0;

const DEFAULT_ERROR = "* Required field";

/*
 * Handles the submit event of the survey form
 *
 * param e  A reference to the event object
 * return   True if no validation errors; False if the form has
 *          validation errors
 */
function validate(e) {
  // Validate number of products
  if (numberOfItemsInCart <= 0) {
    // Invalid number of items in cart
    alert("You have no item in your cart.");
    return false;
  }

  if (formHasErrors()) {
    return false;
  }

  return true;
}

/*
 * Handles the reset event for the form.
 *
 * param e  A reference to the event object
 * return   True allows the reset to happen; False prevents
 *          the browser from resetting the form.
 */
function resetForm(e) {
  // Confirm that the user wants to reset the form.
  if (confirm("Clear order?")) {
    // Ensure all error fields are hidden
    hideErrors();

    // Set focus to the first text field on the page
    document.getElementById("qty1").focus();

    // When using onReset="resetForm()" in markup, returning true will allow
    // the form to reset
    return true;
  }

  // Prevents the form from resetting
  e.preventDefault();

  // When using onReset="resetForm()" in markup, returning false would prevent
  // the form from resetting
  return false;
}

/*
 * Does all the error checking for the form.
 *
 * return   True if an error was found; False if no errors were found
 */
function formHasErrors() {
  let isError = false;

  // Check required field errors
  fields.map((key) => {
    let fieldValue = document.getElementById(key).value;

    if (fieldValue == "" || fieldValue === null || fieldValue === "- Month -") {
      if (!isError) {
        document.getElementById(key).focus();
      }
      isError = true;
      document.getElementById(`${key}_error`).style.display = "inline";
    }
  });

  let cardTypeRadios = document.getElementsByName("cardtype");

  let cardType = null;
  for (let i = 0; i < cardTypeRadios.length; i++) {
    let element = cardTypeRadios[i];
    if (element.checked) {
      cardType = element.value;
      break;
    }
  }

  if (cardType === null) {
    if (!isError) {
      cardTypeRadios[0].focus();
    }
    isError = true;
    document.getElementById("cardtype_error").style.display = "inline";
  }

  // check postalformat_error

  let postalCode = document.getElementById("postal").value;
  let caPostalCodeRegex = new RegExp(
    /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVXY][ -]?\d[ABCEGHJKLMNPRSTVXY]\d$/i
  );

  if (postalCode !== "" && !caPostalCodeRegex.test(postalCode)) {
    if (!isError) {
      document.getElementById("postal").focus();
    }
    isError = true;
    document.getElementById("postalformat_error").style.display = "inline";
  }

  // check emailformat_error

  let email = document.getElementById("email").value;
  let emailRegex = new RegExp(
    "([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"
  );

  if (email !== "" && !emailRegex.test(email)) {
    // if (!isError) {
    //   document.getElementById("email").focus();
    // }
    isError = true;
    document.getElementById("emailformat_error").style.display = "inline";
  }

  // check expiry_error
  let month = document.getElementById("month").value;
  let year = document.getElementById("year").value;

  let today = new Date();
  let expiryDate = new Date();
  expiryDate.setFullYear(year, month, 1);

  if (expiryDate < today) {
    if (!isError) {
      document.getElementById("month").focus();
    }
    isError = true;
    document.getElementById("expiry_error").style.display = "inline";
  }

  // check invalidcard_error
  let cardNumber = document.getElementById("cardnumber").value;
  let isCardNumberError = false;
  if (!(1000000000 <= cardNumber && cardNumber <= 9999999999)) {
    isCardNumberError = true;
  } else {
    let checkingFactor = 432765432;
    let sum = 0;
    let inSumCardDigits = (cardNumber - (cardNumber % 10)) / 10;
    for (let factor = 1; factor <= 9; factor++) {
      sum += (checkingFactor % 10) * (inSumCardDigits % 10);
      inSumCardDigits = (inSumCardDigits - (inSumCardDigits % 10)) / 10;
      checkingFactor = (checkingFactor - (checkingFactor % 10)) / 10;
    }

    let compareDigit = 11 - (sum % 11);
    let lastDigit = cardNumber % 10;
    isCardNumberError = compareDigit !== lastDigit;
  }

  if (isCardNumberError) {
    if (!isError) {
      document.getElementById("cardnumber").focus();
    }
    isError = true;
    document.getElementById("invalidcard_error").style.display = "inline";
  }

  return isError;
}

/*
 * Adds an item to the cart and hides the quantity and add button for the product being ordered.
 *
 * param itemNumber The number used in the id of the quantity, item and remove button elements.
 */
function addItemToCart(itemNumber) {
  // Get the value of the quantity field for the add button that was clicked
  let quantityValue = trim(document.getElementById("qty" + itemNumber).value);
  // Determine if the quantity value is valid
  if (
    !isNaN(quantityValue) &&
    quantityValue != "" &&
    quantityValue != null &&
    quantityValue != 0 &&
    !document.getElementById("cartItem" + itemNumber)
  ) {
    // Hide the parent of the quantity field being evaluated
    document.getElementById("qty" + itemNumber).parentNode.style.visibility =
      "hidden";

    // Determine if there are no items in the car
    if (numberOfItemsInCart == 0) {
      // Hide the no items in cart list item
      document.getElementById("noItems").style.display = "none";
    }

    // Create the image for the cart item
    let cartItemImage = document.createElement("img");
    cartItemImage.src = "images/" + itemImage[itemNumber - 1];
    cartItemImage.alt = itemDescription[itemNumber - 1];

    // Create the span element containing the item description
    let cartItemDescription = document.createElement("span");
    cartItemDescription.innerHTML = itemDescription[itemNumber - 1];

    // Create the span element containing the quanitity to order
    let cartItemQuanity = document.createElement("span");
    cartItemQuanity.innerHTML = quantityValue;

    // Calculate the subtotal of the item ordered
    let itemTotal = quantityValue * itemPrice[itemNumber - 1];

    // Create the span element containing the subtotal of the item ordered
    let cartItemTotal = document.createElement("span");
    cartItemTotal.innerHTML = formatCurrency(itemTotal);

    // Create the remove button for the cart item
    let cartItemRemoveButton = document.createElement("button");
    cartItemRemoveButton.setAttribute("id", "removeItem" + itemNumber);
    cartItemRemoveButton.setAttribute("type", "button");
    cartItemRemoveButton.innerHTML = "Remove";
    cartItemRemoveButton.addEventListener(
      "click",
      // Annonymous function for the click event of a cart item remove button
      function () {
        // Removes the buttons grandparent (li) from the cart list
        this.parentNode.parentNode.removeChild(this.parentNode);

        // Deteremine the quantity field id for the item being removed from the cart by
        // getting the number at the end of the remove button's id
        let itemQuantityFieldId = "qty" + this.id.charAt(this.id.length - 1);

        // Get a reference to quanitity field of the item being removed form the cart
        let itemQuantityField = document.getElementById(itemQuantityFieldId);

        // Set the visibility of the quantity field's parent (div) to visible
        itemQuantityField.parentNode.style.visibility = "visible";

        // Initialize the quantity field value
        itemQuantityField.value = "";

        // Decrement the number of items in the cart
        numberOfItemsInCart--;

        // Decrement the order total
        orderTotal -= itemTotal;

        // Update the total purchase in the cart
        document.getElementById("cartTotal").innerHTML =
          formatCurrency(orderTotal);

        // Determine if there are no items in the car
        if (numberOfItemsInCart == 0) {
          // Show the no items in cart list item
          document.getElementById("noItems").style.display = "block";
        }
      },
      false
    );

    // Create a div used to clear the floats
    let cartClearDiv = document.createElement("div");
    cartClearDiv.setAttribute("class", "clear");

    // Create the paragraph which contains the cart item summary elements
    let cartItemParagraph = document.createElement("p");
    cartItemParagraph.appendChild(cartItemImage);
    cartItemParagraph.appendChild(cartItemDescription);
    cartItemParagraph.appendChild(document.createElement("br"));
    cartItemParagraph.appendChild(document.createTextNode("Quantity: "));
    cartItemParagraph.appendChild(cartItemQuanity);
    cartItemParagraph.appendChild(document.createElement("br"));
    cartItemParagraph.appendChild(document.createTextNode("Total: "));
    cartItemParagraph.appendChild(cartItemTotal);

    // Create the cart list item and add the elements within it
    let cartItem = document.createElement("li");
    cartItem.setAttribute("id", "cartItem" + itemNumber);
    cartItem.appendChild(cartItemParagraph);
    cartItem.appendChild(cartItemRemoveButton);
    cartItem.appendChild(cartClearDiv);

    // Add the cart list item to the top of the list
    let cart = document.getElementById("cart");
    cart.insertBefore(cartItem, cart.childNodes[0]);

    // Increment the number of items in the cart
    numberOfItemsInCart++;

    // Increment the total purchase amount
    orderTotal += itemTotal;

    // Update the total puchase amount in the cart
    document.getElementById("cartTotal").innerHTML = formatCurrency(orderTotal);
  }
}

/*
 * Hides all of the error elements.
 */
function hideErrors() {
  // Get an array of error elements
  let error = document.getElementsByClassName("error");

  // Loop through each element in the error array
  for (let i = 0; i < error.length; i++) {
    // Hide the error element by setting it's display style to "none"
    error[i].style.display = "none";
  }
}

/*
 * Handles the load event of the document.
 */
function load() {
  //	Populate the year select with up to date values
  let year = document.getElementById("year");
  let currentDate = new Date();
  for (let i = 0; i < 7; i++) {
    let newYearOption = document.createElement("option");
    newYearOption.value = currentDate.getFullYear() + i;
    newYearOption.innerHTML = currentDate.getFullYear() + i;
    year.appendChild(newYearOption);
  }

  // Add event listener for "Add" button of each item
  itemDescription.map((key, index) => {
    let itemNumber = index + 1;
    let quantityFieldDiv = document.getElementById(`item${itemNumber}`);
    let addButton = quantityFieldDiv.lastElementChild;
    addButton.addEventListener("click", () => {
      addItemToCart(itemNumber);
    });
  });

  hideErrors();

  //Add event listener to "submit" button
  document.getElementById("orderform").addEventListener("submit", (event) => {
    event.preventDefault();

    hideErrors();

    if (validate(event) === true) {
		alert("Submiting...")
    }
  });

  document.getElementById("orderform").addEventListener("reset", (event) => {
    resetForm(event);
  });
}

// Add document load event listener
document.addEventListener("DOMContentLoaded", load);
