
$( document ).on( "pagebeforeshow", "#setting-screen", function() {

      
    if(localStorage.getItem("setting-radius") === null)
    {  
        localStorage.setItem("setting-radius", '100'); 
        localStorage.setItem("setting-vibrate", '5'); 
    }

    $('#txt-radius').val(localStorage.getItem("setting-radius"));   
    $('#txt-radius-button span').html($("#txt-radius option:selected").text());

    $('#txt-vibrate').val(localStorage.getItem("setting-vibrate"));   
    $('#txt-vibrate-button span').html($("#txt-vibrate option:selected").text());

    // var arr_str = [];   

    // arr_str.push('<ul>');
    //     arr_str.push('<li><a href="branch.html" data-ajax="false" data-icon="grid" class="ui-btn-active">Branch</a></li>');
    //     arr_str.push('<li><a href="map.html" data-ajax="false" data-icon="star">Map</a></li>');
    //     arr_str.push('<li><a href="#" data-icon="gear">Promos</a></li>');
    //     arr_str.push('<li><a href="#" data-icon="star">Reservation</a></li>');
    //     arr_str.push('<li><a href="#" data-icon="star">Fav</a></li>');
    // arr_str.push('</ul>');

    // $('#footer-nav-item').html(arr_str.join(''))).listview('refresh');

});


$('#setting-screen').on('click','.btn-save',function(e) { 

        localStorage.setItem("setting-radius", $('#txt-radius').val()); 
        localStorage.setItem("setting-vibrate", $('#txt-vibrate').val()); 


    // var backLink = 'index.html';
    // if(localStorage.getItem("reference-page") != null)
    // {    
    //     backLink = localStorage.getItem("reference-page");
    //     localStorage.removeItem('reference-page');
    // }
    window.location = "index.html";
});
