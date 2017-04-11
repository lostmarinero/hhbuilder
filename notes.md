


// What about the HTML5 required element? 
// 

// when add button is hit, the info is added as a li element to the <ol class="household"></ol> list
//  If a household member does not have some of the requirements, make it red to show it  style="background-color: red;"
//  If there is info in the fields that has not been added to the household list, send a warning
// There needs to be a way that when you click on the li element, the person is deleted from the household
// 
// On submission, put the serialized JSON in the provided "debug" DOM element and display that element.

/*<ol class="household"></ol>
            <form>
                <div>
                    <label>Age
                        <input type="text" name="age">
                <div>
                    <label>Relationship
                        <select name="rel">
                            <option value="">---</option>
                            <option value="self">Self</option>
                            <option value="spouse">Spouse</option>
                            <option value="child">Child</option>
                            <option value="parent">Parent</option>
                            <option value="grandparent">Grandparent</option>
                            <option value="other">Other</option>
                <div>
                    <label>Smoker?
                        <input type="checkbox" name="smoker">
                <div>
                    <button class="add">add</button>
                </div>
                <div>
                    <button type="submit">submit</button>
                </div>*/

// document.getElementById('name-error')
// 
// 
// 
// 
// You have been given an HTML page with a form and a placeholder for displaying a household.

// In the given index.js file, replace the "Your code goes here" comment with JavaScript that can:

// Validate data entry (age is required and > 0, relationship is required)
// Add people to a growing household list
// Remove a previously added person from the list
// Display the household list in the HTML as it is modified
// Serialize the household as JSON upon form submission as a fake trip to the server
// 
// "Assume the capabilities of a modern mainstream browser in wide use, i.e., no bleeding-edge features."
// with this, assumed we are talking about html5 so used the builtin features
// formAction, formEncType, formMethod, formTarget properties   (Yes)   4.0 (2) (Yes)   (Yes)   (Yes)
// formNoValidate, validationMessage, validity, willValidate properties and setCustomValidity() and checkValidity() methods.
// 
// 
// 
// 
// 
// 
// 

// function createListItems(storeArray) {
//     var listItems = [];
//     for (var i; i < storeArray.length; i++) {
//         var listItemArguments = storeArray[i];
//         listItems.push(createListItem(listItemArguments));
//     }
//     return listItems;
// }
// 
// 
// 
// 
// 
// 
// 
// 


// function validateValues(values, validatorsObject) {
//     var results = {}
//     for (var key in validatorsObject) {
//         results[key] = validatorsObject[key](values[key])
//     }
//     return results
// }

// function customValidator(formValues) {
//     var validators = {
//         age: isValidAge,
//         rel: isPresent
//     }
//     return validateValues(formValues, validators)
// }
// 
// 
// 
// 
// Dont like that it currently is setting a new error on every change if there is an error