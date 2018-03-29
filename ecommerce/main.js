module = function () {
    const server = "http://localhost:3000/db";
    const serverAdd = "http://localhost:3000/cart";
    const defaultProduct = [{ name: "No Products Found" }];
    const defaultCart = [{total: 0}];
    var products = [];
    var cartUnique = [];
    var init = function () {
        fetch(server)
            .then(blob => blob.json())
            .then(data => {
                products = data.products;
                show(data.products);
                cartUnique = data.cart;
                showCart(data.cart);
            });
    };
    var show = function (array) {
        const productsList = document.querySelector("#products");
        array = Array.isArray(array) ? array : defaultProduct;
        const html = array.map(product => {
            return `
              <div class="card mx-auto" style="width:400px; margin: 50px;">
              <img class="card-img-top" src="${product.img}" alt="Product Image" style="width:100%">
              <div class="card-body">
                <h4 class="card-title">${product.name}</h4>
                <p class="card-text">${product.description}</p>
              </div>
              <div class="card-footer bg-light">
                <b>Price: ${product.price}&dollar;</b>
                <button style="margin-left: 100px;"  ${product.avaiability ? '' : 'disabled'} onclick="module.addToCart(${product.id})" class="btn btn-primary">Buy Product</button>
              </div>
            </div>
            `;

        }).join('');
        productsList.innerHTML = html;
    };
    var showCart = function(array, total){
        const cart = document.querySelector("#cart");
        const totalDom = document.querySelector("#total");
        array = Array.isArray(array) ? array : defaultCart;
        const html = array.map(product => {
            return `<div class="panel-body">
                    <i onclick="module.removeProduct(${product.id})" class="fas fa-trash-alt"></i>
                    <h1>${product.name}</h1>
                    <b>Price: ${product.price}</b>
                    </div>
            `;
        }).join('');
        cart.innerHTML = "";
        cart.innerHTML = cart.innerHTML + html;
    };
    var addToCart = function (id) {
        var total = 0;
        const productAdded = products.filter(product => {
            return product.id == id;
        });
        var found = false;
        for(var i = 0; i < cartUnique.length; i++) {
        if (cartUnique[i].id == id) {
            found = true;
            break;
        }
        }
        if (!found) {
            cartUnique.push(productAdded[0]);
            fetch(serverAdd, { method: "POST",
            headers: {
              'Accept': 'application/json, text/plain, */*',
              'Content-Type': 'application/json'
            },
             body: JSON.stringify(productAdded[0])})
            .catch((errore) => {
                console.log(errore);
            });
        }
        const totalArray = cartUnique.map(product => {
            return product.price;
        });
        totalArray.forEach(productTotal => {
            total = total + productTotal;
        });
        showCart(cartUnique, total);
        $(window).scrollTop(0);
    };
    var removeProduct = function(id){
            var total = 0;
            const productAdded = products.filter(product => {
                return product.id != id;
            });
            cartUnique.pop(productAdded[0]);
            const totalArray = cartUnique.map(product => {
                return product.price;
            });
            totalArray.forEach(productTotal => {
                total = total + productTotal;
            });
            let body = {
                "cart": cartUnique
            };
            fetch(serverAdd+"/"+id, { method: "DELETE"});
            showCart(cartUnique, total);
        };
        var filter = function(){
            const categoria = document.querySelector("#filter").value;
            if(categoria != "ALL"){
            const productFilter = products.filter(product => {
                return product.category == categoria;
            });
            show(productFilter);
            }
            else {
                show(products);
            }
        }
    return { init: init, show: show, addToCart: addToCart, showCart:showCart, removeProduct:removeProduct, filter:filter }
}();
module.init();