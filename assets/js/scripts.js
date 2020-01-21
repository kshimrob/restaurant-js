let restaurantItems = [
  {
    name: 'Hanbaobao',
    price: 80,
    image: './assets/img/burger.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    primaryOptions: ['Primary Option 1', 'Primary Option 2', 'Primary Option 3'],
    secondaryOptions: ['Secondary Option 1', 'Secondary Option 2', 'Secondary Option 3']
  },
  {
    name: 'Hot Diggity Dog',
    price: 90,
    image: './assets/img/burger.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit some item 2 description.',
    primaryOptions: ['Primary Option 1', 'Primary Option 2'],
    secondaryOptions: ['Secondary Option 1', 'Secondary Option 2', 'Secondary Option 3']
  },
  {
    name: 'Fries',
    price: 20,
    image: './assets/img/burger.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    primaryOptions: ['Primary Option 1', 'Primary Option 2', 'Primary Option 3'],
    secondaryOptions: ['Secondary Option 1', 'Secondary Option 2', 'Secondary Option 3']
  },
  {
    name: 'Chicken Nuggets',
    price: 55,
    image: './assets/img/burger.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    primaryOptions: ['Primary Option 1', 'Primary Option 2', 'Primary Option 3'],
    secondaryOptions: ['Secondary Option 1', 'Secondary Option 2', 'Secondary Option 3']
  },
  {
    name: 'Ice Cream',
    price: 105,
    image: './assets/img/burger.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    primaryOptions: ['Primary Option 1', 'Primary Option 2', 'Primary Option 3'],
    secondaryOptions: ['Secondary Option 1']
  },
  {
    name: 'Pizza',
    price: 111,
    image: './assets/img/burger.png',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    primaryOptions: ['Primary Option 1', 'Primary Option 2', 'Primary Option 3'],
    secondaryOptions: ['Secondary Option 1', 'Secondary Option 2', 'Secondary Option 3']
  },
]

let basketItems = [];

function hideModal() {
  $('.dark-overlay, #item-details-modal').hide();
  $('body').removeClass('overlay');
}

function showModal() {
  $('.dark-overlay, #item-details-modal').show();
  $('body').addClass('overlay');
}

function isBasketEmpty() {
  return basketItems.length === 0;
}

function updateCartEmptyStyles() {
  if (isBasketEmpty()) {
    $('#empty-basket-msg').show();
    $('#total').hide();
    $('#basket a').addClass('disabled');
  } else {
    $('#empty-basket-msg').hide();
    $('#total').show();
    $('#basket a').removeClass('disabled');
  }
}

function updateCartTotal(total) {
  $('#total span').html(total);
}

function calculateCartTotal() {
  return Object.keys(basketItems).reduce((total, item) => total + basketItems[item].price, 0);
}

function addItemToCart() {
  const newItem = basketItems[basketItems.length - 1];
  let newItemHtml = '';

  newItemHtml += `<div class="basket-item"><h3>${newItem.quantity} x ${newItem.name} HK$${newItem.originalPrice}</h3>`;
  newItemHtml += `<p>(${newItem.options.join(', ')})</p></div>`;

  $('#basket-items-container').append(newItemHtml);
  updateCartTotal(calculateCartTotal());
}

$(document).ready(() => {
  // Add Restaurant Items to the DOM
  let restaurantItemsHtml = "";

  restaurantItems.forEach((item, i) => {
    restaurantItemsHtml += `<div class="item" data-id="${i}">`;
    restaurantItemsHtml += `<div class="food-img" style="background-image: url(${item.image})"></div>`;
    restaurantItemsHtml += `<h2>${item.name}</h2>`;
    restaurantItemsHtml += `<p>${item.description}</p>`;
    restaurantItemsHtml += `<a class="btn-card">Add to Order</a>`;
    restaurantItemsHtml += `</div></div>`;
  });

  $('.items-container').html(restaurantItemsHtml);

  // When clicking "Add to Order" on item card, display popup modal with that item's information
  $('.item a').click(function() {
    const itemNumber = $(this).parent().data('id');
    const item = restaurantItems[itemNumber];

    // Create HTML elment of all primary options for item
    let primaryOptionsHtml = '';
    item.primaryOptions.forEach((option) => {
      primaryOptionsHtml += `<input type="radio" name="primary-option" value="${option}" required>${option}<br>`;
    });
    
    // Create HTML element of all secondary options for item
    let secondaryOptionsHtml = '';
    item.secondaryOptions.forEach((option) => {
      secondaryOptionsHtml += `<input type="checkbox" name="secondary-option" value="${option}">${option}<br>`;
    });

    // Update details in popup based on item ID
    $('#item-details-modal .food-img').css('background-image', 'url(' + item.image + ')');
    $('#item-details-modal h2').html(item.name);
    $('#item-details-modal .description').html(item.description);
    $('#item-details-modal #quantity').val(1);
    $('#item-details-modal #price').val(item.price);
    $('#item-details-modal #primary-options').html(primaryOptionsHtml);
    $('#item-details-modal #secondary-options').html(secondaryOptionsHtml);

    // Show popup and overlay
    showModal();
  });

  // Hide overlay and popup when clicking Cancel or overlay
  $('.dark-overlay, #item-details-modal .btn-cancel').click(hideModal);

  // Adding item to cart    
  $('#item-details-modal form').submit(function(e) {
    e.preventDefault();

    const name = $('#item-details-modal h2').html();
    const quantity = parseInt($('#quantity').val());
    const price = parseInt($('#price').val());
    const primaryOption = [$('input[name="primary-option"]:checked').val()];
    const secondaryOptions = [];
    $('input[name="secondary-option"]:checked').each(function() {
      secondaryOptions.push($(this).val());
    });

    let basketItem = {
      name,
      originalPrice: price,
      price: price * quantity,
      quantity,
      options: primaryOption.concat(secondaryOptions),
    } 

    basketItems.push(basketItem);

    addItemToCart();
    hideModal();
    updateCartEmptyStyles();
  });
});