var timer ='';

document.addEventListener('deviceready', function () {
    // Android customization
    cordova.plugins.backgroundMode.setDefaults({ text:'I will run in background to wake you.'});
    // Enable background mode
    cordova.plugins.backgroundMode.enable();

    // Called when background mode has been activated
    cordova.plugins.backgroundMode.onactivate = function () {
        setTimeout(function () {
            // Modify the currently displayed notification
            cordova.plugins.backgroundMode.configure({
                text:'Running in background now.'
            });
        }, 5000);
    }
}, false);


$( document ).on( "pagebeforeshow", "#map-screen", function() {

    $('#map_canvas').gmap().bind('init', function(event, map) { 

            $(map).click( function(event) {
                
                localStorage.removeItem("targetLat");
                localStorage.removeItem("targetLong");                
                $('#map_canvas').gmap('clear', 'markers');
                // console.log(event.latLng.lng() + ' ' + );

                localStorage.setItem("targetLat", event.latLng.lat());
                localStorage.setItem("targetLong", event.latLng.lng());

                $('#map_canvas').gmap('addMarker', {
                    'position': event.latLng, 
                    'draggable': true, 
                    'bounds': false
                }, function(map, marker) {
                    //do whatever you need with the maker utilizing this variable
                    marker.__gm_id
                });



            });
      
    });      

    if(localStorage.getItem("setting-radius") === null)
    {  
        localStorage.setItem("setting-radius", '100'); 
        localStorage.setItem("setting-vibrate", '5'); 
    }

    getCurrentLoc();
    $('.stopTrack').hide();

});

$('#map-screen').on('click','.startTrack',function(e) { 

     timer = setInterval(function(){
                    getCurrentLoc();
                    //console.log(localStorage.getItem("currentLong"));
            },1000);

    $('.startTrack').hide();
    $('.stopTrack').show();
});

$('#map-screen').on('click','.stopTrack',function(e) { 
    $('.startTrack').show();

    clearInterval(timer);
    $('.stopTrack').hide();
});



$('#map-screen').on('click','.showAll',function(e) { 
    localStorage.removeItem('selected-branch');
    window.location = "map.html";
});

$('#map-screen').on('click','.btn-back',function(e) { 
    
    var backLink = 'index.html';
    if(localStorage.getItem("reference-page") != null)
    {    
        backLink = localStorage.getItem("reference-page");
        localStorage.removeItem('reference-page');
    }
    window.location = backLink;
});



function getCurrentLoc(){
       var currentLoc = '';
    // Check for geolocation support
    if (navigator.geolocation) {
        // Use method getCurrentPosition to get coordinates
        
    
        navigator.geolocation.getCurrentPosition(function (position) {
            // Access them accordingly
            
            currentLoc = new google.maps.LatLng(position.coords.latitude,position.coords.longitude)

            localStorage.setItem("currentLat", position.coords.latitude);
            localStorage.setItem("currentLong", position.coords.longitude);

            $('#map_canvas').gmap('addMarker', { 'position':currentLoc, 'icon':'http://egmddemo.com/marker-icon.png'} );
            $('#map_canvas').gmap({'center': position.coords.latitude + ", " + position.coords.longitude, 'zoom': 8,'disableDefaultUI':true, });
            $('#map_canvas').gmap('get','map').panTo(currentLoc);
            $('#map_canvas').gmap('option', 'zoom', 16);

        });

        convertedVal = convertToMeter(localStorage.getItem("currentLong"), localStorage.getItem("currentLat"), localStorage.getItem("targetLong"), localStorage.getItem("targetLat") );
        console.log(convertedVal );

        if(localStorage.getItem("targetLong") != null)
        {
            if(convertedVal <= localStorage.getItem("setting-radius"))
            {
                window.navigator = window.navigator || {};


                if(localStorage.getItem("setting-vibrate") == '3')
                {
                    navigator.vibrate([1000, 500, 1000, 500, 2000]); 
                }                
                else if(localStorage.getItem("setting-vibrate") == '5')
                {
                    navigator.vibrate([1000, 500, 1000, 500, 1000, 500, 1000, 500, 2000]); 
                }                
                else
                {
                    navigator.vibrate([1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 2000]); 
                }

                               
                alert('you have arrived!');

                localStorage.removeItem("targetLat");
                localStorage.removeItem("targetLong");                    
               
                $('.startTrack').show();
                $('.stopTrack').hide();
                clearInterval(timer);
                $('#map_canvas').gmap('clear', 'markers');
            }
        }
        //$('#map_canvas').gmap('clear', 'markers');
        //$('#map_canvas').gmap({action:'clear', tag:'1'});
    } 
    else{
        alert('Your GPS is disable!');
    }
}



String.prototype.format = function() { a = this; for ( k in arguments ) { a = a.replace("{" + k + "}", arguments[k]); } return a; };
window.jgmap = { 
    'version': '3.0-rc1',
    'ga': '',
    'primaryUrl': 'http://code.google.com/p/jquery-ui-map/',
    'url': 'http://jquery-ui-map.googlecode.com/', 
    'forum': 'http://groups.google.com/group/jquery-ui-map-discuss/feed/rss_v2_0_msgs.xml', 
    'subscribe': 'http://groups.google.com/group/jquery-ui-map-discuss/boxsubscribe', 
    'exception': 'Unable to load due to either poor internet connection or some CDN\'s aren\'t as responsive as we would like them to be. Try refreshing the page :D.', 
    'init': function() {
        //window._gaq = [['_setAccount', this.ga], ['_trackPageview'], ['_trackPageLoadTime']];
        //Modernizr.load({ 'test': ( location.href.indexOf(this.url) > -1 ), 'yep': 'http://www.google-analytics.com/ga.js' });
        this.test('Backbone', function() {
            $('#forum').append('<h2>Forum</h2><ul id="forum_posts"></ul><h2>Subscribe</h2><form id="forum_subscribe" class="subscribe" action="#"><label for="email">E-mail:</label><input id="email" type="text" name="email" /><input type="submit" name="sub" value="Subscribe" /></form>');
            ForumCollection = Backbone.Collection.extend({ 'url': 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&callback=?&q={0}'.format(encodeURIComponent(jgmap.forum)), 'parse': function(response) { return response.responseData.feed.entries; } });
            ForumPost = Backbone.View.extend({ 'tagName': 'li', 'className': 'group-item', 'template': _.template('<a href="<%=link%>"><%=title%></a></h3>'), 'render': function() { $(this.el).html(this.template(this.model.toJSON())); return this; } }); 
            Forum = Backbone.View.extend({ 'el': $("#forum"), 'initialize': function() { this.col = new ForumCollection(); this.col.bind('reset', this.load, this); this.col.fetch(); }, 'add': function(post) { var view = new ForumPost({'model': post}); $('#forum_posts').append(view.render().el); }, 'load': function () { this.col.each(this.add); $('#forum_subscribe').attr('action', jgmap.subscribe); $(this.el).show(); } });
            var app = new Forum();
        });
        this.test('prettyPrint', function() { prettyPrint(); });
        $('#version').text(this.version);
    },
    'redirect': function(url) { alert('This page is deprecated. Please update your URL. Redirecting to new page.'); window.location = url; },
    'col': [], 
    'tests': [],
    'test': function(a, b) { if ( window[a] ) { b(); } },
    'add': function(a, b) { if (b) { this.col[a] = b; } else { this.col.push(a); } return this; },
    'load': function(a) { var self = this; if (a) { self.col[a](); } else { $.each(self.col, function(i,d) { try { d(); } catch (err) { alert(self.exception); } }); } },
    'timeStart': function(key, desc) { this.tests[key] = { 'start': new Date().getTime(), 'desc': desc }; },
    'timeEnd': function(key) { this.tests[key].elapsed = new Date().getTime(); },
    'report': function(id) { var i = 1; for ( var k in this.tests ) { var t = this.tests[k]; $(id).append('<div class="benchmark rounded"><div class="benchmark-result lt">' + (t.elapsed - t.start) + ' ms</div><div class="lt"><p class="benchmark-iteration">Benchmark case ' + i + '</p><p class="benchmark-title">' + t.desc + '</p></div></div>'); i++; }; }
};
    
jgmap.init();




function convertToMeter(currentLongitude, currentLatitude, long1, lat1) {
    erdRadius = 6371;

    currentLongitude = currentLongitude * (Math.PI / 180);
    currentLatitude = currentLatitude * (Math.PI / 180);
    long1 = long1 * (Math.PI / 180);
    lat1 = lat1 * (Math.PI / 180);

    x0 = currentLongitude * erdRadius * Math.cos(currentLatitude);
    y0 = currentLatitude * erdRadius;

    x1 = long1 * erdRadius * Math.cos(lat1);
    y1 = lat1 * erdRadius;

    dx = x0 - x1;
    dy = y0 - y1;

    d = Math.sqrt((dx * dx) + (dy * dy));


    return Math.round(d * 1000);
};


function getNearestBranch(currentLongitude, currentLatitude, targetRadius)
{
     var distanceObj = [],
        i = 0
        convertedVal = '';

    $.each(markers, function (a, marker) {
        var str = marker['position'];
        var res = str.split(",");

        convertedVal = convertToMeter(currentLongitude, currentLatitude,res[1], res[0]);

        if((convertedVal / 1000) <= targetRadius)
        {
            distanceObj[i] = { distance: convertedVal, location: marker['title'] };
            ++i;
        }
        
        
    });

    distanceObj.sort(function(a,b) {
        return parseInt(a.distance) - parseInt(b.distance)
    });

  

    return distanceObj;
}
