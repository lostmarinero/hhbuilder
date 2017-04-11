
/*
Helper Methods

These are functions that did not warrant the need for a separate object,
but are helpful methods to be able to perform many tasks
*/
function getFormValues(form) {
    var returnObj = [].reduce.call(form.elements, function(data, element) {
        var value = element.type === 'checkbox' ? element.checked : element.value;
        data[element.name] = value;
        return data;
    }, {});
    delete returnObj[''];
    return returnObj;
}

function setFormErrors(form) {
    var invalidFields = form.querySelectorAll(':invalid');
    for (var i = 0; i < invalidFields.length; i++) {
        invalidFields[i].classList.add('visited');
        invalidFields[i].setError();
    }
}

function sendJSONdata(householdArray, successCallback, errorCallback) {
    var xhr = new XMLHttpRequest();
    var data = JSON.stringify({householdInfo: householdArray});
    // request.open('POST', 'https://httpbin.org/status/400', true);
    xhr.open('POST', 'https://httpbin.org/post', true);
    xhr.data = data;
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');

    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            successCallback(xhr);
        } else {
            errorCallback(xhr);
        }
    };
    xhr.send(data);
}

function loadCss() {
    var documentHead = document.getElementsByTagName('head')[0];
    var linkTag = document.createElement('link');
    linkTag.href = './index.css';
    linkTag.type = 'text/css';
    linkTag.rel = 'stylesheet';
    linkTag.media = 'screen,print';

    var metaTag = document.createElement('meta');
    metaTag.setAttribute('name', 'viewport');
    metaTag.setAttribute('content', 'width=device-width');

    documentHead.appendChild(linkTag);
    documentHead.appendChild(metaTag);
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function capitalizeSentence(string) {
    var stringArray = string.split(' ');
    for (var i = 0; i < stringArray.length; i++) {
        stringArray[i] = capitalizeFirstLetter(stringArray[i]);
    }
    return stringArray.join(' ');
}

function capitalizeElementText(element, replacementText) {
    replacementText = replacementText || element.innerHTML;
    element.innerHTML = capitalizeSentence(replacementText);
}

function clearVisitedClasses() {
    var allElements = document.getElementsByClassName('visited');
    while (allElements.length) {
        allElements[0].classList.remove('visited');
    }
}


/*
Household Members Store

Created to store the data of the household members
separate from the view
*/
function HouseholdStore() {
    var self = this;
    var store = [];
    var triggerFunction = function() {};

    function findMax(array) {
        var max = 0;
        for (var counter = 0; counter < array.length; counter++) {
            if (array[counter] > max) {
                max = array[counter];
            }
        }
        return max;
    }

    function createNewId(listItems) {
        var allIds = [];
        for (var i = 0; i < listItems.length; i++) {
            allIds.push(listItems[i].id);
        }
        var maxId = findMax(allIds);
        return (maxId + 1);
    }

    self.addItemToStore = function(itemArguments) {
        itemArguments.id = createNewId(store);
        store.push(itemArguments);
        triggerFunction(self);
    };
    var findItemIndexById = function(itemId) {
        if (typeof itemId === 'string') {
            itemId = Number(itemId);
        }
        for (var i = 0; i < store.length; i++) {
            if (store[i].id === itemId) {
                return i;
            }
        }
        return null;
    };

    self.removeItemFromStore = function(itemId) {
        var itemIndex = findItemIndexById(itemId);
        store.splice(itemIndex, 1);
        triggerFunction(self);
    };

    self.getStore = function() {
        // should make immutable
        return store;
    };

    self.setTriggerFunction = function(outsideFunction) {
        triggerFunction = outsideFunction;
    };
}


/*
List Item Object

Created to simplify build html necessary to render the
household members in the view on a list, with a trigger
button to delete the member from the store (and therefore
the view)
*/
function ListItem(listItemArguments, removalFunction) {
    function createRemovalButton(itemId, removalFunction) {
        var button = document.createElement('button');
        button.textContent = 'Remove';
        button.setAttribute('class', 'delete-button');
        button.addEventListener('click', function(e) {
            e.preventDefault();
            removalFunction(itemId);
        });
        return button;
    }

    function createListText(listArguments) {
        var smokerText = listArguments.smoker ? 'Smoker' : 'Non-Smoker';
        var rel = listArguments.rel[0].toUpperCase() + listArguments.rel.slice(1);
        return (rel + ', Age ' + listArguments.age + ', ' + smokerText);
    }

    function createListItem(listItemArguments, removalFunction) {
        var li = document.createElement('li');
        var listItemId = listItemArguments.id;
        var removalButton = createRemovalButton(listItemId, removalFunction);
        var contentText = createListText(listItemArguments);
        var span = document.createElement('span');

        span.textContent = contentText;
        span.setAttribute('class', 'household-text');
        li.setAttribute('id', listItemId);
        li.setAttribute('class', 'household-list');

        li.appendChild(span);
        li.appendChild(removalButton);
        return li;
    }
    return createListItem(listItemArguments, removalFunction);
}


/*
List Display Helper Object

Object that helps clear/display household list
members based on store object data
*/

function ListDisplayHelper(storeObject) {
    var self = this;
    self.storeObject = storeObject;

    function clearDOMList() {
        var householdList = document.getElementsByClassName('household')[0];
        while (householdList.lastChild) {
            householdList.removeChild(householdList.lastChild);
        }
    }
    function displayDOMList() {
        var store = storeObject.getStore();
        var listParent = document.getElementsByClassName('household')[0];
        for (var i = 0; i < store.length; i++) {
            var listItemArguments = store[i];
            var listItem = new ListItem(listItemArguments, storeObject.removeItemFromStore);
            listParent.appendChild(listItem);
        }
    }

    self.resetDOMList = function() {
        clearDOMList();
        displayDOMList();
    };
}

/*
Helper Functions to Clear Errors

Functions that check for the existence of an errorfield
attached to an htmlElement object. If so, they then can
set an error or clear an error. These methods are available
on all htmlInputElements and htmlSelectElements
*/
function clearError(htmlElement) {
    if (typeof htmlElement.errorField !== 'undefined') {
        htmlElement.errorField.clearError();
    } else {
        console.log('Error: This element has no errorField');
    }
}

function setError(htmlElement, errorText) {
    errorText = errorText || htmlElement.validationMessage;

    if (typeof htmlElement.errorField !== 'undefined') {
        htmlElement.errorField.setError(errorText);
    } else {
        console.log('Error: This element has no errorField');
    }
}

HTMLInputElement.prototype.setError = function(errorText) {
    setError(this, errorText);
};

HTMLInputElement.prototype.clearError = function() {
    clearError(this);
};

HTMLSelectElement.prototype.setError = function(errorText) {
    setError(this, errorText);
};

HTMLSelectElement.prototype.clearError = function() {
    clearError(this);
};


function setErrorListeners(inputFields) {
    for (var i = 0; i < inputFields.length; i++) {
        var inputField = inputFields[i];

        inputField.addEventListener('change', function(e) {
            e.preventDefault();
            e.target.classList.add('visited');
            if (!e.target.checkValidity()) {
                e.target.setError();
            } else {
                e.target.clearError();
            }
        });
    }
}

/*
Error Field Object

Created to add the html necessary to display an error message
adjacent to the field. It also has methods that allow for
setting an error or clearing an error.
*/
function ErrorField(fieldElement) {
    var self = this;
    setFieldElement(fieldElement);

    function init(fieldElement) {
        var fieldParent = fieldElement.parentNode;
        var errorDiv = document.createElement('div');
        var errorText = document.createElement('p');

        errorDiv.setAttribute('class', 'error-div');
        errorDiv.style = 'display: hidden;';

        errorText.setAttribute('class', 'error-text');
        errorText.innerHTML = '';

        errorDiv.appendChild(errorText);
        fieldParent.appendChild(errorDiv);
    }

    self.clearError = function() {
        var errorDiv  = self.fieldElement.nextElementSibling;
        var errorText = errorDiv.firstChild;
        errorDiv.style.display = 'hidden';
        errorText.innerHTML = '';
    };

    self.setError = function(errorTextString) {
        var errorDiv  = self.fieldElement.nextElementSibling;
        var errorText = errorDiv.firstChild;

        errorDiv.style.display = 'block';
        errorText.innerHTML = errorTextString;
    };

    function setFieldElement(fieldElement) {
        self.fieldElement = fieldElement;
        init(fieldElement);
        fieldElement.errorField = self;
    }
}

/*
DOMContentLoaded Event Listener

This event listener is where all the action happens. It allows
for manipulation of the DOM and its elements, as well as setting
event listeners so that actions are performed when buttons or input
fields are interacted with.
*/

document.addEventListener('DOMContentLoaded', function() {
    // load the outside css file
    loadCss();

    // create store to hold household members and bind it to view
    var householdStore = new HouseholdStore();
    var listDisplayHelper = new ListDisplayHelper(householdStore);
    householdStore.setTriggerFunction(listDisplayHelper.resetDOMList);

    // get debug for later display of validated data - hidden by css
    var debug = document.getElementsByClassName('debug')[0];


    // capitalize styling of button letters
    var titleHeader = document.getElementsByTagName('h1')[0];
    var addButton = document.getElementsByClassName('add')[0];
    var submitButton = document.body.querySelector('button[type=submit]');
    capitalizeElementText(addButton, 'Add Person');
    capitalizeElementText(titleHeader);
    capitalizeElementText(submitButton);

    // get form for future validations
    var onlyForm = document.forms[0];
    onlyForm.noValidate = true;

    // suppress the default html5 validation bubbles
    onlyForm.addEventListener('invalid', function(e) {
        e.preventDefault();
    }, true );

    // add required and validators to fields
    var ageInput = document.body.querySelector('input[name=age]');
    var relInput = document.body.querySelector('select[name=rel]');
    ageInput.required = true;
    relInput.required = true;

    ageInput.type = 'number';
    ageInput.setAttribute('min', 1);
    ageInput.setAttribute('pattern', '[0-9]*');
    ageInput.autoFocus = true;

    // add error messages to fields and add event listeners to check validity on change
    new ErrorField(ageInput);
    new ErrorField(relInput);
    setErrorListeners([ageInput, relInput]);

    // create event listener for adding item to the list
    addButton.addEventListener('click', function(e) {
        e.preventDefault();
        if (onlyForm.checkValidity()) {
            var formValues = getFormValues(onlyForm);
            householdStore.addItemToStore(formValues);
            clearVisitedClasses();
            onlyForm.reset();
        } else {
            setFormErrors(onlyForm);
        }
    }, false);

    // create event listener for submitting form to server
    onlyForm.addEventListener('submit', function(e) {
        e.preventDefault();
        sendJSONdata(householdStore.getStore(),
            // success callback
            function(response) {
                debug.innerHTML = response.data;
                debug.setAttribute('style', 'display: block');
            },
            // error callback
            function(response) {
                debug.innerHTML = response.data;
                debug.setAttribute('style', 'display: block');
            });
    });
});


