const clearCartBtn = document.querySelector('.clear-cart')
const cartDOM = document.querySelector('.cart')
const cartItems = document.querySelector('.cart-items')
const cartTotal = document.querySelector('.cart-total')
const cartContent = document.querySelector('.cart-content')
const cartContainer = document.querySelector('.container')

let cart = [];
class Products{
    async getProducts(){
        try {
            let result = await fetch("products.json");
            return result;
        } catch (error) {
            console.log(error);
        }
        
    }
}

class UI{

}

class Storage{

}

document.addEventListener("DOMContentLoaded", ()=>{
    const ui = new UI()
    const products = new Products();
    products.getProducts().then(data => console.log(data));
})