module = function () {
    const server = "http://localhost:3000/db";
    const serverAdd = "http://localhost:3000/cart";
    const serverProduct = "http://localhost:3000/products";
    const defaultProduct = [{ name: "No Products Found" }];
    const defaultCart = [{ total: 0 }];
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
              <div class="card mx-auto" style="width:400px; margin: 50px; overflow: hidden;">
              <img class="card-img-top" src="${product.img}" alt="Product Image" style="width:100%">
              <div class="card-body">
                <h4 class="card-title">${product.name}</h4>
                <p class="card-text">${product.description}</p>
              </div>
              <div class="card-footer bg-light">
                <b>Price: ${product.price}&dollar;</b>
                <button style="margin-left: 30px;"   ${product.avaiability ? '' : 'disabled'} onclick="module.addToCart(${product.id})" class="btn btn-primary">Buy Product</button>
                <button  onclick="module.preEditProduct(${product.id})" class="btn btn-primary">Edit Product</button>
              </div>
            </div>
            `;

        }).join('');
        productsList.innerHTML = html;
    };
    var showCart = function (array, total) {
        const cart = document.querySelector("#cart");
        const totalDom = document.querySelector("#total");
        array = Array.isArray(array) ? array : defaultCart;
        const html = array.map(product => {
            return `<li class="list-group-item">
                    <i style="float: right" onclick="module.removeProduct(${product.id})" class="fas fa-trash-alt"></i>
                    <h3 class="text-center">${product.name}</h3>
                    <p>Price: ${product.price}&dollar;</p>
                    </li>
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
        for (var i = 0; i < cartUnique.length; i++) {
            if (cartUnique[i].id == id) {
                found = true;
                break;
            }
        }
        if (!found) {
            cartUnique.push(productAdded[0]);
            fetch(serverAdd, {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productAdded[0])
            })
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
    var removeProduct = function (id) {
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
        fetch(serverAdd + "/" + id, { method: "DELETE" });
        showCart(cartUnique, total);
    };
    var filter = function () {
        const categoria = document.querySelector("#filter").value;
        if (categoria != "ALL") {
            const productFilter = products.filter(product => {
                return product.category == categoria;
            });
            show(productFilter);
        }
        else {
            show(products);
        }
    }
    var orderUp = function () {
        products.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        show(products);
    }
    var orderDown = function () {
        products.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        show(products);
    }
    var addProduct = function () {
        const id = document.querySelector("#idProduct").value;
        const name = document.querySelector("#nameProduct").value;
        const description = document.querySelector("#descriptionProduct").value;
        const img = document.querySelector("#imgProduct").value;
        const category = document.querySelector("#categoryProduct").value;
        const price = document.querySelector("#priceProduct").value;
        const quantity = document.querySelector("#quantityProduct").value;
        let body = {
            id: id,
            name: name,
            description: description,
            img: img,
            category: category,
            price: price,
            avaiability: true,
            quantity: quantity
        };
        products.push(body);
        let result = "Problems adding the product ";
        fetch(serverProduct, {
            method: "POST",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(function (response) {
            if (response.ok) {
                result = "Product added correctly";
                document.querySelector("#result").innerHTML =
                    `
                <div class="alert alert-success" role="alert">
                     ${result}
                </div>
                `;
            }
            else {
                document.querySelector("#result").innerHTML =
                    `
                <div class="alert alert-danger" role="alert">
                     ${result}
                </div>
                `;
            }
        })
            .catch((errore) => {
                console.log(errore);
            });
        show(products);
    }
    var preEditProduct = function (id) {
        const productEdited = products.filter(product => {
            return product.id == id;
        });
        document.querySelector("#idProductEdit").value = productEdited[0].id;
        document.querySelector("#nameProductEdit").value = productEdited[0].name;
        document.querySelector("#descriptionProductEdit").value = productEdited[0].description;
        document.querySelector("#imgProductEdit").value = productEdited[0].img;
        document.querySelector("#categoryProductEdit").value = productEdited[0].category;
        document.querySelector("#priceProductEdit").value = productEdited[0].price;
        document.querySelector("#quantityProductEdit").value = productEdited[0].quantity;
        document.querySelector("#avaiabilityProductEdit").value = productEdited[0].avaiability;
        $("#edit").modal()
    }
    var editProduct = function () {
        const id = document.querySelector("#idProductEdit").value;
        const name = document.querySelector("#nameProductEdit").value;
        const description = document.querySelector("#descriptionProductEdit").value;
        const img = document.querySelector("#imgProductEdit").value;
        const category = document.querySelector("#categoryProductEdit").value;
        const price = document.querySelector("#priceProductEdit").value;
        const quantity = document.querySelector("#quantityProductEdit").value;
        let avaiability = document.querySelector("#avaiabilityProductEdit").value;
        const productEdited = products.filter(product => {
            return product.id == id;
        });
        if(avaiability == "true"){
            avaiability = true;
        }
        else {
            avaiability = false;
        }
        let body = {
            name: name,
            description: description,
            img: img,
            category: category,
            price: price,
            avaiability: avaiability,
            quantity: quantity
        };
        let result = "Problems editing the product ";
        fetch(serverProduct+"/"+id, {
            method: "PUT",
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }).then(function (response) {
            if (response.ok) {
                result = "Product edited correctly";
                document.querySelector("#resultEdit").innerHTML =
                    `
                <div class="alert alert-success" role="alert">
                     ${result}
                </div>
                `;
            }
            else {
                document.querySelector("#resultEdit").innerHTML =
                    `
                <div class="alert alert-danger" role="alert">
                     ${result}
                </div>
                `;
            }
        })
            .catch((errore) => {
                console.log(errore);
            });
            window.setTimeout( location.reload(), 3000);
    }
    return { init: init, show: show, addToCart: addToCart, showCart: showCart, removeProduct: removeProduct, filter: filter, orderUp: orderUp, orderDown: orderDown, addProduct: addProduct, preEditProduct: preEditProduct, editProduct:editProduct }
}();
module.init();