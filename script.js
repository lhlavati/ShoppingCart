const cartTotal = document.querySelector(".cart-total");
const cartContent = document.querySelector(".cart-content");
const cartContainer = document.querySelector(".container");
const clearCartBtn = document.querySelector(".clear-cart");
const cartDOM = document.querySelector(".cart");
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
        return { id, name, image, amount, currency, measureUnit };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  getButtons() {
    const buttons = [...document.querySelectorAll(".add-btn")];
    buttonsDOM = buttons;
    buttons.forEach(button => {
      let id = button.dataset.id;
      let inCart = cart.find(item => item.id == id);
      if (inCart) {
        button.innerText = "U košarici";
        button.disabled = true;
      }
      button.addEventListener("click", event => {
        event.target.innerText = "U košarici";
        event.target.disabled = true;
        let cartItem = { ...Storage.getProduct(id), count: 1 };
        cart = [...cart, cartItem];
        Storage.saveCart(cart);
        this.setCartValues(cart);
        this.addCartItem(cartItem);
      });
    });
  }
  setCartValues(cart) {
    let tempTotal = 0;
    cart.map(item => {
      tempTotal += item.amount * item.count;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2)) + " kn";
  }
  addCartItem(item) {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="product">
                    <div>
                        <h4>${item.name}</h4>
                        <h5>${item.amount} ${item.currency}</h5>
                        <span class="remove-item" data-id=${item.id}>Makni iz košarice</span>
                    </div>
                    <div class="product-count">
                        <i class="material-icons arrow_up" data-id=${item.id}>arrow_drop_up</i>
                        <p class="item-count">${item.count}</p>
                        <i class="material-icons arrow_down" data-id=${item.id}>arrow_drop_down</i>
                    </div>`;
    cartContent.appendChild(div);
  }
  cartLogic(){
      clearCartBtn.addEventListener("click", () => {
          this.clearCart();
      });
      cartContent.addEventListener("click", event => {
          if(event.target.classList.contains("remove-item")){
              let removeItem = event.target;
              let id = removeItem.dataset.id;
              cartContent.removeChild(removeItem.parentElement.parentElement);
              this.removeItem(id);
          } else if (event.target.classList.contains("arrow_up")){
              let addCount = event.target;
              let id = addCount.dataset.id;
              let tempItem = cart.find(item => item.id == id);
              tempItem.count = tempItem.count + 1;
              Storage.saveCart(cart);
              this.setCartValues(cart);
              addCount.nextElementSibling.innerText = tempItem.count;
          } else if (event.target.classList.contains("arrow_down")){
              let lowerCount = event.target;
              let id = lowerCount.dataset.id;
              let tempItem = cart.find(item => item.id == id);
              tempItem.count = tempItem.count - 1;
              if(tempItem.count > 0){
                Storage.saveCart(cart); 
                this.setCartValues(cart);
                lowerCount.previousElementSibling.innerText = tempItem.count;
              } else {
                cartContent.removeChild(lowerCount.parentElement.parentElement);
                this.removeItem(id);
              }
          }
      })
  }
  clearCart(){
      let cartItems = cart.map(item => item.id);
      cartItems.forEach(id => this.removeItem(id));
      while(cartContent.children.length > 0){
          cartContent.removeChild(cartContent.children[0]);
      }
  }
  removeItem(id){
    cart = cart.filter(item => item.id != id);
    this.setCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSingleButton(id);
    button.disabled = false;
    button.innerHTML = "Dodaj";
  }
  getSingleButton(id){
      return buttonsDOM.find(button => button.dataset.id == id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find(product => product.id == id);
  }
  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();
  const products = new Products();
  products.getProducts().then(products => {
      // ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getButtons();
      ui.cartLogic();
    });
});
