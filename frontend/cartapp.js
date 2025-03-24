const userId = 1; // Example user ID. In a real application, you'd authenticate the user

document.addEventListener("DOMContentLoaded", function() {
    // Fetch books from the server and display them
    fetchBooks();
    // Fetch and display user's cart
    fetchCart();

    // Handle clear cart action
    document.getElementById("clear-cart").addEventListener("click", clearCart);
});

// Fetch books from the API and display them
function fetchBooks() {
    fetch("http://localhost:5000/api/books")
        .then(response => response.json())
        .then(data => {
            const booksContainer = document.getElementById("books-container");
            booksContainer.innerHTML = '';

            data.books.forEach(book => {
                const bookDiv = document.createElement('div');
                bookDiv.classList.add('book-item');
                bookDiv.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>${book.author}</p>
                    <p>$${book.price}</p>
                    <button onclick="addToCart(${book.id})">Add to Cart</button>
                `;
                booksContainer.appendChild(bookDiv);
            });
        })
        .catch(error => console.error('Error fetching books:', error));
}

// Add a book to the cart
function addToCart(bookId) {
    fetch("http://localhost:5000/cart/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            book_id: bookId,
            quantity: 1
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchCart(); // Update the cart display
    })
    .catch(error => console.error('Error adding book to cart:', error));
}

// Fetch and display the user's cart
function fetchCart() {
    fetch(`http://localhost:5000/cart/view?user_id=${userId}`)
        .then(response => response.json())
        .then(data => {
            const cartContainer = document.getElementById("cart-container");
            cartContainer.innerHTML = '';

            if (data.cart_items && data.cart_items.length > 0) {
                data.cart_items.forEach(item => {
                    const cartItemDiv = document.createElement('div');
                    cartItemDiv.classList.add('cart-item');
                    cartItemDiv.innerHTML = `
                        <p>${item.book_title} by ${item.book_author}</p>
                        <p>Price: $${item.book_price} x ${item.quantity}</p>
                        <button onclick="removeFromCart(${item.book_id})">Remove</button>
                    `;
                    cartContainer.appendChild(cartItemDiv);
                });
            } else {
                cartContainer.innerHTML = '<p>Your cart is empty.</p>';
            }
        })
        .catch(error => console.error('Error fetching cart:', error));
}

// Remove a book from the cart
function removeFromCart(bookId) {
    fetch("http://localhost:5000/cart/remove", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: userId,
            book_id: bookId
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchCart(); // Update the cart display
    })
    .catch(error => console.error('Error removing book from cart:', error));
}

// Clear the entire cart
function clearCart() {
    fetch("http://localhost:5000/cart/clear", {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            user_id: userId
        })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchCart(); // Update the cart display
    })
    .catch(error => console.error('Error clearing the cart:', error));
}
