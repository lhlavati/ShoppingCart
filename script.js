const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const cartContainer = document.querySelector('.container')
const productsDOM = document.querySelector(".products-center");

let cart = [];
class Products{
    async getProducts(){
        try {
            let result = await fetch("products.json");
            let data = await result.json();
            let products = data.products;
            products = products.map(item => {
                const {id} = item;
                const {name} = item;
                const {image} = item;
                const {amount} = item.price;
                const {currency} = item.price;
                const {measureUnit} = item.price;
                return {id, name, image, amount, currency, measureUnit}
            })
            return products
        } catch (error) {
            console.log(error);
        }
        
    }
}

class UI{
    displayProducts(products){
        let result = "";
        products.forEach(product => {
            result += `
            <article class="product">
                <div class="img-containter">
                    <img src=${product.image}
                        alt="product" class="product-img">
                </div>
                <h3>${product.name}</h3>
                <h4>${product.amount} ${product.currency}/${product.measureUnit}</h4>
                <a class="waves-effect waves-light red btn" data-id=${product.id} id="dodaj"><i
                        class="material-icons left">add_circle</i>Dodaj</a>
            </article>
            `;
        });
        productsDOM.innerHTML = result;
    }
}

class Storage{

}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI()
    const products = new Products();
    products.getProducts().then(products => ui.displayProducts(products));
});