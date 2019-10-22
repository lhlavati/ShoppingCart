const clearCartBtn = document.querySelector('.clear-cart');
const cartDOM = document.querySelector('.cart');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.cart-total');
const cartContent = document.querySelector('.cart-content');
const cartContainer = document.querySelector('.container');
const productsDOM = document.querySelector(".products-left");

let cart = [];

let buttonsDOM = [];

class Products {
    async getProducts() {
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.products;
            products = products.map(item => {
                const { id } = item;
                const { name } = item;
                const { image } = item;
                const { amount, currency, measureUnit } = item.price;
                return { id, name, image, amount, currency, measureUnit }
            })
            return products
        } catch (error) {
            console.log(error);
        }

    }
}

class UI {
    // displayProducts(products){
    //     let result = "";
    //     products.forEach(product => {
    //         result += `
    //         <article class="product">
    //             <div class="img-containter">
    //                 <img src=${product.image}
    //                     alt="product" class="product-img">
    //             </div>
    //             <h3>${product.name}</h3>
    //             <h4>${product.amount} ${product.currency}/${product.measureUnit}</h4>
    //             <a class="waves-effect waves-light red btn" id="dodaj" data-id=${product.id}><i
    //                     class="material-icons left">add_circle</i>Dodaj</a>
    //         </article>
    //         `;
    //     });
    //     productsDOM.innerHTML = result;
    // }
    getButtons() {
        const buttons = [...document.querySelectorAll(".add-btn")];
        buttonsDOM = buttons;
        buttons.forEach(button => {
            let id = button.dataset.id;
            console.log(id);
            let inCart = cart.find(item => item.id === id);
            console.log(inCart);
            if (inCart) {
                button.innerText = "U košarici";
                button.disabled = true;
            }
            button.addEventListener("click", event => {
                console.log(event);
                event.target.innerText = "U košarici";
                event.target.disabled = true;
                let cartItem = Storage.getProduct(id);
                console.log(cartItem);
            });
        });
    }
}

class Storage {
    static saveProducts(products) {
        localStorage.setItem("products", JSON.stringify(products));
    }
    static getProduct(id) {
        let products = JSON.parse(localStorage.getItem("products"));
        return products.find(product => product.id === id);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI();
    const products = new Products();
    products.getProducts().then(products => {
        // ui.displayProducts(products);
        Storage.saveProducts(products);
    }).then(() => {
        ui.getButtons();
    });
});