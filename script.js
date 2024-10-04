let items = [];
let currentLanguage = 'ru';

const translations = {
    ru: {
        title: 'Управление товарами',
        addItem: 'Добавить товар',
        savedItems: 'Сохранённые товары:',
        deleteAll: 'Удалить все товары',
        totalSum: 'Общая сумма',
        category: 'Категория:',
        price: 'Цена:',
        quantity: 'Количество:',
        totalPrice: 'Полная цена:',
        languages: ['Русский', 'Английский', 'Молдавский']
    },
    en: {
        title: 'Product Management',
        addItem: 'Add Product',
        savedItems: 'Saved Products:',
        deleteAll: 'Delete All Products',
        totalSum: 'Total Sum',
        category: 'Category:',
        price: 'Price:',
        quantity: 'Quantity:',
        totalPrice: 'Total Price:',
        languages: ['Russian', 'English', 'Moldovan']
    },
    md: {
        title: 'Gestionarea produselor',
        addItem: 'Adăugați produs',
        savedItems: 'Produse salvate:',
        deleteAll: 'Ștergeți toate produsele',
        totalSum: 'Sumă totală',
        category: 'Categorie:',
        price: 'Preț:',
        quantity: 'Cantitate:',
        totalPrice: 'Preț total:',
        languages: ['Rusă', 'Română', 'Moldovenească']
    }
};

if (localStorage.getItem('items')) {
    items = JSON.parse(localStorage.getItem('items'));
    displayCategoryItems();
    displaySavedItems();
}

function switchLanguage(language) {
    currentLanguage = language;
    translatePage();
}

function translatePage() {
    document.title = translations[currentLanguage].title;
    document.querySelector('h1').innerText = translations[currentLanguage].title;
    document.getElementById('add-item-button').innerText = translations[currentLanguage].addItem;
    document.getElementById('saved-items-title').innerText = translations[currentLanguage].savedItems;
    document.getElementById('delete-all-button').innerText = translations[currentLanguage].deleteAll;
    document.getElementById('total-sum-title').innerHTML = `${translations[currentLanguage].totalSum}: <span id="total-sum">0</span> MDL.`;

    // Изменяем названия кнопок выбора языка
    let languageButtons = document.querySelectorAll('.language-button');
    languageButtons[0].innerText = translations[currentLanguage].languages[0];
    languageButtons[1].innerText = translations[currentLanguage].languages[1];
    languageButtons[2].innerText = translations[currentLanguage].languages[2];

    displayCategoryItems();
    displaySavedItems();
}

function addItem() {
    let nameInput = document.getElementById('gocon-name');
    let priceInput = document.getElementById('gocon-price');
    let quantityInput = document.getElementById('gocon-quantity');

    let name = nameInput.value;
    let price = parseFloat(priceInput.value);
    let quantity = quantityInput.value;

    if (name && !isNaN(price) && quantity) {
        let newItem = {
            name: name,
            price: price,
            quantity: calculateQuantity(quantity)
        };

        items.push(newItem);
        displayCategoryItems();
        displaySavedItems();

        // Сохранение в LocalStorage
        localStorage.setItem('items', JSON.stringify(items));

        // Очищаем поля ввода
        nameInput.value = '';
        priceInput.value = '';
        quantityInput.value = '';
    } else {
        alert("Пожалуйста, заполните все поля.");
    }
}

function calculateQuantity(quantityStr) {
    return quantityStr.split('+').reduce((sum, val) => sum + parseInt(val), 0);
}

function displayCategoryItems() {
    let ul = document.getElementById('gocon-items');
    ul.innerHTML = '';  // Очищаем список для обновления

    items.forEach((item, index) => {
        let li = document.createElement('li');
        let totalPrice = item.price * item.quantity;
        li.innerHTML = `${index + 1}. ${item.name} — ${translations[currentLanguage].price} ${item.price}, ${translations[currentLanguage].quantity} ${item.quantity}, ${translations[currentLanguage].totalPrice} ${totalPrice}`;

        let buttonContainer = document.createElement('div');
        buttonContainer.classList.add('button-container');

        let editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Редактировать';
        editButton.onclick = () => editItem(index);

        let deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Удалить';
        deleteButton.onclick = () => deleteItem(index);

        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);

        li.appendChild(buttonContainer);
        ul.appendChild(li);
    });

    updateTotalSum();
}

function editItem(index) {
    let editedName = prompt("Введите новое название товара:", items[index].name);
    let editedPrice = prompt("Введите новую цену товара:", items[index].price);
    let editedQuantity = prompt("Введите новое количество товара (например, 10+5):", items[index].quantity);

    if (editedName !== null && editedPrice !== null && editedQuantity !== null) {
        items[index].name = editedName;
        items[index].price = parseFloat(editedPrice);
        items[index].quantity = calculateQuantity(editedQuantity);

        displayCategoryItems();
        displaySavedItems();

        localStorage.setItem('items', JSON.stringify(items));
    }
}

function deleteItem(index) {
    items.splice(index, 1);
    displayCategoryItems();
    displaySavedItems();

    localStorage.setItem('items', JSON.stringify(items));
}

function deleteAllItems() {
    if (confirm("Вы уверены, что хотите удалить все товары?")) {
        items = [];
        displaySavedItems();
        displayCategoryItems();

        localStorage.setItem('items', JSON.stringify(items));
    }
}

function displaySavedItems() {
    let savedItemsList = document.getElementById('saved-items');
    savedItemsList.innerHTML = '';

    items.forEach((item) => {
        let li = document.createElement('li');
        let totalPrice = item.price * item.quantity;
        li.innerHTML = `${translations[currentLanguage].category} GoCon — ${item.name}, ${translations[currentLanguage].price} ${item.price}, ${translations[currentLanguage].quantity} ${item.quantity}, ${translations[currentLanguage].totalPrice} ${totalPrice}`;
        savedItemsList.appendChild(li);
    });
}

function updateTotalSum() {
    let totalSum = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('total-sum').innerText = totalSum;
}
