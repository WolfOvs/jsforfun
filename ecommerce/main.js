$( document ).ready(function() {
    console.log( "ready!" );
});


module = function(){
    var init = function(){

    };
    var show = function(){
        console.log('show');
    };
    var hide = function(){
        console.log('hide');
    };
    return{init:init, show:show, hide:hide}
}();
module.init();
