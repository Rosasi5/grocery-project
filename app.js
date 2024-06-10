//**************select items

const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');
const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');
const clearBtn = document.querySelector('.clear-btn');

//**********edit option
let editElement;
let editFlag = false;
let editId = "";

//**********event listeners
form.addEventListener('submit', addItem);
//clear items
clearBtn.addEventListener('click', clearItems);

//load items
window.addEventListener('DOMContentLoaded', setUpItems);

//**********functions
function addItem(e){
    e.preventDefault();
    const value = grocery.value; //grab the value from the input element
    const id = new Date().getTime().toString(); //get the time in millisecs as the id
    
    if(value && !editFlag){ //if the value is True and editflag is false 
        createListItem(id, value);
        //display alert function
        displayAlert("item added to the list", "success");
        // show container
        container.classList.add('show-container');

        //add to local storage
        addToLocalStorage(id, value);

        //set back to default
        setBackToDefault();
    }
    else if(value && editFlag) {
        editElement.innerHTML = value;
        displayAlert("value changed", "success");
        // edit local storage
        editLocalStorage(editId, value);
        setBackToDefault();

    } else {
        displayAlert("please enter value", "danger");
    }
}
// display alert
function displayAlert (text, action) {
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert after some time
    setTimeout(function(){
        alert.textContent = ""; //set to empty string to remove the message
        alert.classList.remove(`alert-${action}`); //remove the alert class
    }, 2000)
}

//function clear items
function clearItems() {
    const items = document.querySelectorAll('.grocery-item');
    if(items.length > 0){
        items.forEach(function (item) {
            list.removeChild(item); //use te parent(list) to remove the child
        });
    }
    container.classList.remove('show-container'); //remove the display container when items are cleared
    displayAlert("empty list", "danger");
    setBackToDefault();
    localStorage.removeItem('list');
}

//delete function
function deleteItem(e){
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id; //get id of item to be deleted
    list.removeChild(element);
    if(list.children.length === 0){
        container.classList.remove('show-container');
    }
    displayAlert("item removed", "danger");
    setBackToDefault();
    // remove from local storage
    removeFromLocalStorage(id);
}

//edit function
function editItem(e) {
    const element = e.currentTarget.parentElement.parentElement;
    //set edit item
    editElement = e.currentTarget.parentElement.previousElementSibling;
    // set form value
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editId = element.dataset.id;
    submitBtn.textContent = "edit";
}


//set back to default
function setBackToDefault() {
    grocery.value = "";
    editFlag = false;
    editId = "";
    submitBtn.textContent = "submit";
};

//**********local storage
function addToLocalStorage(id, value){
    const grocery = {id:id, value:value};
    let items = localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : [];
    //console.log(items);
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
};

function removeFromLocalStorage(id){
    let items = getLocalStorage();

    items = items.filter(function (item){
        if(item.id !== id) {
            return item;
        }
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function (item){
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}

function getLocalStorage(){
    return localStorage.getItem("list") ? JSON.parse(localStorage.getItem("list")) : []; //return whatever is in the local storage
}
//**********setup items
function setUpItems (){
 let items = getLocalStorage();
 if(items.length > 0) {
    items.forEach(function(item){
        createListItem(item.id, item.value)
    });
    container.classList.add('show-container');
 }
}

function createListItem (id, value) {
    const element = document.createElement('article');
    //add class
    element.classList.add('grocery-item');
    // add id
    const attr = document.createAttribute('data-id');
    attr.value = id;
    element.setAttributeNode(attr);
    element.innerHTML = `<p class="title">${value}</p>
                    <div class="btn-container">
                        <button type="button" class="edit-btn">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button type="button" class="delete-btn">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>`;

    const deleteBtn = element.querySelector('.delete-btn');
    const editBtn = element.querySelector('.edit-btn');

    deleteBtn.addEventListener('click', deleteItem);
    editBtn.addEventListener('click', editItem);

    // append child / element to the grocery list
    list.appendChild(element);
}