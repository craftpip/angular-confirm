if (typeof jQuery == "undefined") {throw new Error("Documentation needs the jQuery library to function.")};
$('body').scrollspy({
    target: '#my-nav',
    offset: 100
});
var bs = $('.footer').outerHeight()+10;
$("#my-nav").sticky({topSpacing:20, bottomSpacing: bs});
$("span.version").html(version || "");

$(document).ready(function () {
    prettyPrint();
    $("span.version").html(version || "");
});
function rs(){

}
$(window).resize(function(){
    rs();
})
rs();