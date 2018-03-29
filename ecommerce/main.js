$( document ).ready(function() {
    console.log( "ready!!" );
});


module = function(){
    var init = function(){
        getProducts();
    };
    var getProducts = function(){
        const endpoint = 'http://localhost:3000/products';
        let productsArray = [];
        fetch(endpoint)
        .then(blob => blob.json())
        .then(data => {
            console.log('data', data);
            productsArray.push(data.data);
        });

        const productList = document.querySelector('.productList-container');

        const html = productsArray.map(place => {
            return `
              <li>
                <span>${place.name}, ${place.description}</span>
                <span>${place.price}</span>
              </li>
            `;
          }).join('');
          productList.innerHTML = html;
        console.log('products', productsArray, productList, html);
    }

    var show = function(){
        console.log('show');
    };
    var hide = function(){
        console.log('hide');
    };
    return{init:init, show:show, hide:hide, getProducts:getProducts}
}();
module.init();
