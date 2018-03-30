module = function () {
    var product =  JSON.parse(localStorage.getItem("product"));
    var init = function(){
        const gallery = product.gallery;
        if(gallery != undefined){
           const html =  gallery.map(gallery => {
                return `<img class="img-responsive" src="${gallery}" />
                `;
            }).join('');
            document.querySelector(".product-gallery").innerHTML = html;
            $('.product-gallery').slick({
                infinite: true,
                slidesToShow: 1,
                slidesToScroll: 1
              });
        }
        document.querySelector("#product").innerHTML = `
        <div class="card mx-auto" style="width:400px; margin: 50px; overflow: hidden;">
              <img class="card-img-top" src="${product.img}" alt="Product Image" style="width:100%">
              <div class="card-body">
                <h4 class="card-title">${product.name}</h4>
                <p class="card-text">${product.description}</p>
              </div>
              <div class="card-footer bg-light">
                <b>Price: ${product.price}&dollar;</b>
              </div>
            </div>`;
    }
    return { init: init }
}();
module.init();