var preventBehavior = function(e){
    e.preventDefault();
};
document.addEventListener("touchmove", preventBehavior, false);

var MOBILE_MODE = true;

var backend_api_url = "http://www.skippaper.com/MobileApi/";

var app_dc; //for mobile device

var camera_device; //for camera

var db;

var iabRef = null;



function checkConnection() {
    networkState = navigator.network.connection.type;
    
    var states = {};
    states[Connection.UNKNOWN]  = 'Unknown connection';
    states[Connection.ETHERNET] = 'Ethernet connection';
    states[Connection.WIFI]     = 'WiFi connection';
    states[Connection.CELL_2G]  = 'Cell 2G connection';
    states[Connection.CELL_3G]  = 'Cell 3G connection';
    states[Connection.CELL_4G]  = 'Cell 4G connection';
    states[Connection.NONE]     = 'NoConnection';
    
    if(networkState == Connection.NONE) {
        return states[networkState];
    }
}

$( document ).bind( "mobileinit", function() {
                   
    /// These two settings to make the browser happy with internal/localhost calls; sometimes required for Phonegap
    $.support.cors = true;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.defaultPageTransition = 'slidefade';
                   
    $.mobile.slider.prototype.options.initSelector = "#status";

});

function initbody() {

    document.addEventListener("deviceready", onDeviceReady, false);

}

var client;

function onDeviceReady() {
    app_dc = device;
/*
    navigator.splashscreen.hide();
    
    camera_device = navigator.camera;
    
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    
    db = window.openDatabase("reminder", "1.0", "reminder db", 100*1024*1024);
*/
}

/*************************************************************************************
 *
 * 								Login Page
 *
 ************************************************************************************/

var userinfo = {
    tbl_id : "",
    userid : "",
    password : "",
    username : "",
    car_number : "",
    model : "",
    tel : "",
    last_test : "",
    next_test : "",
    car_type : "",
    email : "",
    address : "",
    zipcode : ""
};

$("#loginPage").live("pageinit", function() {

    try {
        client = new WindowsAzure.MobileServiceClient(
            "https://eutest.azure-mobile.net/",
            "bRePeGddvgktkpCfrPKwXgtfxXNALB73"
        );
        userTable = client.getTable('Users');
    } catch (e) {
        //showAlert('Error: ' + e.description, "Login Page");
         showAlert(e.description, "Login Page");
    }
                     
    $("#loginPage #login_btn").on("click", function() {
        var username = $("#loginPage #username").val();
        if(!username) {
            showAlert("Please input your EU-Test ID for Login!", "Login Page");
            return;
        }

        var password = $("#loginPage #password").val();
        if(!password) {
            showAlert("Please input password", "Login Page");
            return;
        }
        try {
            $.mobile.showPageLoadingMsg();
            var query = userTable.where( { userid : username, password : password}).read().done(
                function (results) {
                    $.mobile.hidePageLoadingMsg();
                    if(results.length > 0) {
                        userinfo.tbl_id = results[0].id;
                        userinfo.userid = results[0].userid;
                        userinfo.password = results[0].password;
                        userinfo.username = results[0].username;
                        userinfo.car_number = results[0].car_number;
                        userinfo.model = results[0].model;
                        userinfo.tel = results[0].tel;
                                                                                                
                        userinfo.last_test = results[0].last_test;
                        userinfo.next_test = results[0].next_test;
                        userinfo.car_type = results[0].car_type;
                        
                        userinfo.address = results[0].address;
                        userinfo.email = results[0].email;
                        userinfo.zipcode = results[0].zipcode;

                        if(results[0].last_test == null  || results[0].last_test.getFullYear() == "1900") { userinfo.last_test = ""; }
                        if(results[0].next_test == null) { userinfo.next_test = ""; }


                        $.mobile.changePage( "#homePage", {transition:"none"} );
                    } else {
                        showAlert("Login ID and Password is incorrect!", "Login Page");
                    }

                }, function (err) {
                    $.mobile.hidePageLoadingMsg();
                    showAlert("System Error: " + err, "Login Page");
                }
            );
        } catch (e) {
            $.mobile.hidePageLoadingMsg();
            showAlert('Error: ' + e.description, "Login Page");
        }
        
    });
                     
    $("#loginPage #register_btn").on("click", function() {
        $.mobile.changePage( "#registerPage", {transition:"none"} );     
    });
                     
    $("#loginPage #forgot_btn").on("click", function() {
        $.mobile.changePage( "#forgotPage", {transition:"none"} );
    });
});

/*************************************************************************************
 *
 * 								Forgot Password Page
 *
 ************************************************************************************/

$("#forgotPage").live("pageinit", function() {
    $("#forgotPage #cancel_btn").on("click", function() {
        $.mobile.changePage( "#loginPage", {transition:"none"} );
    });
                      
    $("#forgotPage #getCode_btn").on("click", function() {
         var phone = $("#forgotPage #phone").val();
         var car_number = $("#forgotPage #carnumber").val();
         if(!phone) {
         showAlert("Please input phone number that you like to receive the SMS from EU-Test System");
         $("#forgotPage #phone").focus();
         return;
         }
         
         if(!car_number) {
         showAlert("Please input the your car number that you have registered in EU-Test System");
         $("#forgotPage #carnumber").focus();
         }

        $.mobile.showPageLoadingMsg();
        $.ajax({
            url : "http://eutest.azurewebsites.net/forgetpassword.php",
            type: "POST",
            dataType: "json",
            data: {
                "phone" : phone,
                "carnumber" : car_number
            },
            success: function( data ) {

                $.mobile.hidePageLoadingMsg();
                if(data.status=="success") {
                   showAlert("EU-Test System just have sent SMS with your account! Please check your SMS box!");
                }else{
                   showAlert("Phone Number and Car Number had not been registered in EU-Test System!");
                }
            },
            error: function(xhr, ajaxOptions, thrownError) {
                showAlert(xhr.statusText + " Forgot Account Error:(" + thrownError + ")");
                $.mobile.hidePageLoadingMsg();
            }
        });
 
    });
                      
});

/*************************************************************************************
 *
 * 								Register Page
 *
 ************************************************************************************/
$("#registerPage").live("pageinit", function() {
                     
    try {
        userTable = client.getTable('Users');
    } catch (e) {
        //showAlert('Error: ' + e.description, "Login Page");
        showAlert(e.description, "Register Page");
    }
                        
    $("#registerPage #back_btn").on("click", function() {
        $.mobile.changePage( "#loginPage", {transition:"none"} );                
    });
                     
    $("#registerPage #submit_btn").on("click", function() {
        var loginid = $("#registerPage #loginid").val();
        if(!loginid) {
            showAlert("Please input your EU-Test ID!", "Register Page");
            return;
        }

        var password = $("#registerPage #password").val();
        var repassword = $("#registerPage #repassword").val();
        if(!password) {
            showAlert("Please input password", "Register Page");
            return;
        }
                                        
        if(!repassword) {
            showAlert("Please input confirm password", "Register Page");
            return;
        }
                                        
        if(password != repassword) {
            showAlert("Confirm password is different with password!", "Register Page");
            $("#registerPage #repassword").val("");
            return;
        }
                                        
        var email = $("#registerPage #email").val();
        if(!email) {
            showAlert("Please input email", "Register Page");
            return;
        }

        var username = $("#registerPage #fullname").val();
        if(!username) {
            showAlert("Please input full name", "Register Page");
            return;
        }

        var tel = $("#registerPage #tel").val();
        if(!tel) {
            showAlert("Please input Tel number", "Register Page");
            return;
        }

                                        
        var car_number = $("#registerPage #car_number").val();
        if(!car_number) {
            showAlert("Please input car number", "Register Page");
            return;
        }

        var model = $("#registerPage #model").val();
        if(!model) {
            showAlert("Please input car model", "Register Page");
            return;
        }
                                        
        model = parseInt(model);
        if(model < 1990 || isNaN(model) == true) {
            showAlert("Please input valid Model Number! Mobile Number has to be greater than 1990!", "Register Page");
            $("#registerPage #model").val("");
            return;
        }
                                        
        var carType = $("#registerPage #car_type").val();
        if(!carType) {
            showAlert("Please input car type", "Register Page");
            return;
        }
                                        
        var addr = $("#registerPage #address").val();

        var zipcode = $("#registerPage #zipcode").val();
                                        
                                        
        var next_test = get_test_date(model, car_number);

        try {
            $.mobile.showPageLoadingMsg();
            var query = userTable.where( { userid : loginid}).read().done(
                function (results) {
                    if(results.length > 0) {
                        $.mobile.hidePageLoadingMsg();
                        showAlert("There is same User ID already. Please input other id.", "Register Page");
                        $("#registerPage #loginid").val("");
                        return;
                    } else {
                                                                          
                        query = userTable.where( { car_number : car_number}).read().done(
                            function (results) {
                                if(results.length > 0) {
                                    $.mobile.hidePageLoadingMsg();
                                    showAlert("There is same Car number already. Please input your car number.", "Register Page");
                                    $("#registerPage #car_number").val("");
                                    return;
                                } else {
                                                                          
                                    query = userTable.insert({
                                        userid : loginid,
                                        password : password,
                                        email : email,
                                        username: username,
                                        tel: tel,
                                        car_number : car_number,
                                        model: model,
                                        car_type : carType,
                                        last_test: "",
                                        next_test: next_test,
                                        address : addr,
                                        zipcode : zipcode
                                                             
                                    }).then(
                                        function (results) {
                                            $.mobile.hidePageLoadingMsg();

                                            if(results) {
                                                userinfo.tbl_id = results.id;
                                                userinfo.userid = results.userid;
                                                userinfo.password = results.password;
                                                userinfo.username = results.username;
                                                userinfo.car_number = results.car_number;
                                                userinfo.model = results.model;
                                                userinfo.tel = results.tel;
                                                if(results.last_test) {
                                                    userinfo.last_test = results.last_test;
                                                } else {
                                                   userinfo.last_test = "";
                                                }
                                                if(results.next_test) {
                                                    userinfo.next_test = results.next_test;
                                                } else {
                                                    userinfo.next_test = "";
                                                }
                                                userinfo.car_type = results.car_type;
                                            
                                                userinfo.email = results.email;
                                                userinfo.address = results.address;
                                                userinfo.zipcode = results.zipcode;
                                            
                                                $.mobile.changePage( "#homePage", {transition:"none"} );     
                                            } else {
                                                showAlert("Failed to register!", "Register Page");
                                            }

                                        }, function (err) {
                                            $.mobile.hidePageLoadingMsg();
                                            showAlert("Error: " + err, "Register Page");
                                        }
                                    );
                                                                                         
                                }

                            }, function (err) {
                                $.mobile.hidePageLoadingMsg();
                                showAlert("Error: " + err, "Register Page");
                            }
                        );
                    }
                }, function (err) {
                    $.mobile.hidePageLoadingMsg();
                    showAlert("Error: " + err, "Register Page");
                }
            );
        } catch (e) {
            $.mobile.hidePageLoadingMsg();
            showAlert('Error: ' + e.description, "Register Page");
        }

    });
});

function get_test_date (model, number){
    var year = parseInt(model);
    year += 4;

    var last_num = number.substring(number.length-1);
    last_num = parseInt(last_num);
    
    if(last_num == 0) { last_num = 10; }
    else if(last_num == 1) { last_num = 1; }
    else if(last_num == 2) { last_num = 2; }
    else if(last_num == 3) { last_num = 3; }
    else if(last_num == 4) { last_num = 4; }
    else if(last_num == 5) { last_num = 5; }
    else if(last_num == 6) { last_num = 6; }
    else if(last_num == 7) { last_num = 11; }
    else if(last_num == 8) { last_num = 8; }
    else if(last_num == 9) { last_num = 9; }
    else { last_num = 6; }
    
    var lastDay = new Date(year, last_num, 0);
    
    var date = new Date();
    var curYear = date.getFullYear();
    while(lastDay < date) {
        year += 2;
        lastDay = new Date(year, last_num, 0);
    }


    
    return lastDay;
}

function dateStr(a) {
    var dateStr = padStr(1 + a.getMonth()) + '/' +
    padStr(a.getDate()) + '/' +
    padStr(a.getFullYear()) + ' ' +
    padStr(a.getHours()) + ':' +
    padStr(a.getMinutes()) + ':' +
    padStr(a.getSeconds());
    
    return dateStr;
}

function padStr(i) {
    return (i < 10) ? "0" + i : "" + i;
}


/*************************************************************************************
 *
 * 								Button
 *
 ************************************************************************************/

$(".button.deactive").on("touchstart", function() {
   $(this).removeClass("deactive").addClass("active");
});

$(".button.active").on("touchend", function() {
   $(this).removeClass("active").addClass("deactive");
});


/*************************************************************************************
 *
 * 								Menu
 *
 ************************************************************************************/
$(".footer_btn.deactive").on("click", function() {
    $(".footer_btn").removeClass("active").addClass("deactive");
    $(this).removeClass("deactive").addClass("active");
});


/*************************************************************************************
 *
 * 								Galley
 *
 ************************************************************************************/

var IMG_WIDTH = 320;
var IMG_HEIGHT = 165;
var currentImg=0;

var maxImages=2;

var speed=500;
var imgs;

var slideTimer;

var swipeOptions=
{
    triggerOnTouchEnd : true,
    swipeStatus : swipeStatus,
    allowPageScroll:"vertical",
    threshold:75
}

/**
 * Catch each phase of the swipe.
 * move : we drag the div.
 * cancel : we animate back to where we were
 * end : we animate to the next image
 */

function swipeStatus(event, phase, direction, distance)
{
    //If we are moving before swipe, and we are going Lor R in X mode, or U or D in Y mode then drag.
    if( phase=="move" && (direction=="left" || direction=="right") )
    {
        var duration=0;
        if (direction == "left")
            scrollImages((IMG_WIDTH * currentImg) + distance, duration);
        else if (direction == "right")
            scrollImages((IMG_WIDTH * currentImg) - distance, duration);
        
        if(currentImg == 0) {
            
        }
    }
    else if ( phase == "cancel")
    {
        scrollImages(IMG_WIDTH * currentImg, speed);
    }
    else if ( phase =="end" )
    {
        if (direction == "right")
            previousImage()
        else if (direction == "left")
            nextImage()
    }
}

function previousImage()
{
    currentImg = Math.max(currentImg-1, 0);
    scrollImages( IMG_WIDTH * currentImg, speed);
}

function nextImage()
{

    if(currentImg == maxImages-1) {
        currentImg = -1;
    }
    
    currentImg = Math.min(currentImg+1, maxImages-1);
    scrollImages( IMG_WIDTH * currentImg, speed);
}
/**
 * Manuallt update the position of the imgs on drag
 */
function scrollImages(distance, duration)
{
    imgs.css("-webkit-transition-duration", (duration/1000).toFixed(1) + "s");
    //inverse the number we set in the css
    var value = (distance<0 ? "" : "-") + Math.abs(distance).toString();
    imgs.css("-webkit-transform", "translate3d("+value +"px,0px,0px)");
}
/*************************************************************************************
 *
 * 								Home Page
 *
 ************************************************************************************/
$("#homePage").live("pageinit", function() {
    imgs = $("#homePage #gallery_div");

    maxImages = 2;

    imgs.swipe( swipeOptions );
                    
    slideTimer = setInterval(function() {sliding()}, 5000);
});

function sliding() {
    nextImage();
}

/*************************************************************************************
 *
 * 								About Page
 *
 ************************************************************************************/
$("#aboutPage").live("pageinit", function() {
    $("#aboutPage #cancel_btn").on("click", function() {
    $.mobile.changePage( "#homePage", {transition:"none"} );
    });

    $("#aboutPage #book_now_btn").on("click", function() {
    $.mobile.changePage( "#bookingPage", {transition:"none"} );
    });
});

/*************************************************************************************
 *
 * 								Booking Page
 *
 ************************************************************************************/
$("#bookingPage").live("pageinit", function() {
    $("#bookingPage #book_now_btn").on("click", function() {
        $.mobile.changePage( "#bookDetailPage", {transition:"none"} );
    });

    $("#bookingPage #cancel_btn").on("click", function() {
        $.mobile.changePage( "#homePage", {transition:"none"} );
    });

                       
    $("#bookingPage #extra_btn").on("click", function() {
        $("#bookingPage .extra_info").toggle();
    });

});

$("#bookingPage").live("pagebeforeshow", function() {
    $("#bookingPage #car_num").html(userinfo.car_number);
    $("#bookingPage #car_type").html(userinfo.car_type);
    $("#bookingPage #car_model").html(userinfo.model);
                       
    var last_date = userinfo.last_test;
    var next_date = userinfo.next_test;
                       
    if(last_date) {
        last_date = dateStr(last_date);
        last_date = last_date.substring(0, 10);
    }

    if(next_date) {
        next_date = dateStr(next_date);
        next_date = next_date.substring(0, 10);
    }

    $("#bookingPage #last_date").html(last_date);
    $("#bookingPage #next_date").html(next_date);
});


/*************************************************************************************
 *
 * 								Booking Detail Page
 *
 ************************************************************************************/

var bookTable;
var bookData = {
    bookid : "",
    user_tbl_id : "",
    book_date : "",
    comment : "",
    sms : 0,
    email : 0,
    state : 0 // 0 : booked, 1 : done, 2 : cancel(sold car, some reason), 3 : expire
};

var update_date = 3;

$("#bookDetailPage").live("pagebeforeshow", function() {
    bookData = {};
    $("#bookDetailPage #book_date_info").hide();
    $("#bookDetailPage #booking_btn").html("Book Now");
    $("#bookDetailPage #username").html(userinfo.username);

    $("bookDetailPage #book_date").val("");
    $("#bookDetailPage #comment").val("");
    $("#bookDetailPage #next_book").html("");

    try {
        bookTable = client.getTable('Book');
        var query = bookTable.where( { user_tbl_id : userinfo.tbl_id}).read().done(
            function (results) {
                if(results.length > 0) {
                    bookData.bookid = results[0].id;
                    bookData.user_tbl_id = results[0].user_tbl_id;
                    bookData.book_date = new Date(results[0].book_date);
                    bookData.comment = results[0].comment;
                    bookData.state = results[0].state;

                    $("#bookDetailPage #book_date_info").show();

                    var n = dateStr(bookData.book_date);

                    $("#bookDetailPage #book_date").val(n);

                    n = n.substring(0, 10);
                    $("#bookDetailPage #next_book").html(n);


                    $("#bookDetailPage #comment").val(bookData.comment);

                    $("#bookDetailPage #booking_btn").html("Update");
                }
                $.mobile.hidePageLoadingMsg();
            }, function (err) {
                $.mobile.hidePageLoadingMsg();
                showAlert("Error: " + err, "Book Detail Page");
            }
        );
    } catch (e) {
        //showAlert('Error: ' + e.description, "Login Page");
        showAlert(e.description, "Booking Detail Page");
    }
});

$("#bookDetailPage").live("pageinit", function() {
    $("#bookDetailPage #booking_btn").on("click", function() {
        var curDate = new Date();

        if(bookData.book_date) {
            var timeDiff = Math.abs(curDate.getTime() - bookData.book_date.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 

            if(diffDays <  update_date) {
                showAlert("You can update the book date by 3 days before the current book date.", "Book Detail Page");
                return;
            }
        }

        if(!$("#bookDetailPage #book_date").val()) {
            showAlert("Please input booking date and time!", "Book Detail Page");
            return;
        }
        var datetime = new Date($("#bookDetailPage #book_date").val());

        if(datetime < curDate) {
            showAlert("Booking date is available by after than current date.", "Book Detail Page");
            $("#bookDetailPage #book_date").val("");
            return;
        }
                                           

        var cmt = $("#bookDetailPage #comment").val();
        if(!cmt) {
            showAlert("Please input your comment for booking!", "Book");
            return;
        }
                                           
        try {
            $.mobile.showPageLoadingMsg();
            if(!bookData.bookid) {

                var query = bookTable.insert({
                    user_tbl_id : userinfo.tbl_id,
                    book_date : datetime,
                    comment : cmt,
                    sms : 0,
                    email : 1,
                    state : 0
                }).then(
                    function (results) {
                        $.mobile.hidePageLoadingMsg();

                        if(results) {
                            bookData.bookid = results.id;
                            bookData.user_tbl_id = results.user_tbl_id;

                            bookData.comment = results.comment;
                            bookData.state = results.state;
                            bookData.email = results.email;
                            bookData.sms = results.sms;
                            if(bookData.book_date) {
                                bookData.book_date = results.book_date;
                            } else {
                                bookData.book_date = "";
                            }

                            showAlert("Thank you for booking time. We will be waiting for you.", "EU-TEST");
                            $.mobile.changePage( "#homePage", {transition:"none"} );
                        } else {
                            showAlert("Booking has been failed!", "Book Detail Page");
                        }

                    }, function (err) {
                        $.mobile.hidePageLoadingMsg();
                        showAlert("Error: " + err, " Book Detail Page");
                    }
                );
            } else {
                var query = bookTable.update({
                    id : bookData.bookid,
                    book_date : datetime,
                    comment : cmt
                }).done(function (results) {
                    $.mobile.hidePageLoadingMsg();
                    if(results) {
                        bookData.bookid = results.id;
                        bookData.user_tbl_id = results.user_tbl_id;

                        bookData.comment = results.comment;
                        bookData.state = results.state;
                        if(bookData.book_date) {
                            bookData.book_date = results.book_date;
                        } else {
                            bookData.book_date = "";
                        }
                        showAlert("Your next EU-Test has been updated successfully!", "Book Detail Page");
                        $.mobile.changePage( "#homePage", {transition:"none"} );
                    } else {
                        showAlert("Update has been failed!", "Book Detail Page");
                    }

                }, function (err) {
                    $.mobile.hidePageLoadingMsg();
                    showAlert("Error: " + err, " Book Detail Page");
                });
            }

        } catch (e) {
            $.mobile.hidePageLoadingMsg();
            showAlert('Error: ' + e.description, "Book Detail Page");
        }
    });
                          
                          
    $("#bookDetailPage #cancel_btn").on("click", function() {
        $.mobile.changePage( "#bookingPage", {transition:"none"} );
    });
});

$("#bookDetailPage").live("pagebeforeshow", function() {
    $("#bookingDetailPage #comment").val("");
    $("#bookingDetailPage #book_date").val("");
    $("#bookDetailPage #car_num").html(userinfo.car_number);
});

/*************************************************************************************
 *
 * 								Sos Page
 *
 ************************************************************************************/
var map;
function getLocation() {
    var onSuccess = function(position) {
        var mapBounds = new google.maps.LatLngBounds();
        mylat = position.coords.latitude;
        mylong = position.coords.longitude;
//        alert("Your current location is got!");
        
        var pin = new google.maps.MarkerImage('img/pin.png',
                                              // This marker is 129 pixels wide by 42 pixels tall.
                                              new google.maps.Size(129, 42),
                                              // The origin for this image is 0,0.
                                              new google.maps.Point(0,0),
                                              // The anchor for this image is the base of the flagpole at 18,42.
                                              new google.maps.Point(18, 42)
                                              );
        
        var latitudeAndLongitude = new google.maps.LatLng(mylat, mylong);
        
        var marker = new google.maps.Marker({
                                            position: latitudeAndLongitude,
                                            map: map,
                                            icon: pin
                                            });
        
        google.maps.event.addListener(marker, 'click', function() {
                                      infowindow1.open(map, marker);
                                      });
        
        // Add information window
        var infowindow1 = new google.maps.InfoWindow({
                                                     content: createInfo('Your Place.', 'You are here <a title="Click to view our website" href="#">AppBusinesStore</a>')
                                                     });
        
        // Create information window
        function createInfo(title, content) {
            return '<div class="infowindow"><strong>'+ title +'</strong><br />'+content+'</div>';
        }
        
        mapBounds.extend(latitudeAndLongitude);
        
        map.fitBounds(mapBounds);
        
    };
    
    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
};

window.getLocationData = function(param, callback) {
    console.log("Location data getting plugin" + param);
    cordova.exec(callback, function(err) {
                 callback('Nothing to echo.');
                 }, "GeoPosition", "getPositionDatas", []);
};

$("#sosPage").live("pageinit", function() {
    map = new GoogleMap();
    map.initialize();
    getLocation();
                   
    $("#sosPage #back_btn").on("touchstart", function() {
        $.mobile.changePage( "#homePage", {transition:"none"} );
    });

    $("#sosPage #request_btn").on("touchstart", function() {
        $.mobile.changePage( "#sosSendPage", {transition:"none"} );
    });

});


function GoogleMap(){
    
    this.initialize = function(){
        var map = showMap();
    }

    var showMap = function(){
        var mapOptions = {
        zoom: 4,
        center: new google.maps.LatLng(62, 10),
        mapTypeId: google.maps.MapTypeId.ROADMAP //HYBRID
        }
        
        map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
        //map.setTilt(0);
        return map;
    }
}

/*************************************************************************************
 *
 * 								Sos Send Page
 *
 ************************************************************************************/
var Latitude;
var Longitude;
function getSosLocation() {
    var onSuccess = function(position) {
        var mapBounds = new google.maps.LatLngBounds();
        Latitude = position.coords.latitude;
        Longitude = position.coords.longitude;

        var coor = 'N ' + Latitude + ' E ' + Longitude;        
        $("#sosSendPage #coor").val(coor);
        
    };
    
    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }
    
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
};

$("#sosSendPage").live("pageinit", function() {
                 
    getSosLocation();
    var tel = userinfo.tel;
    
    $("#sosSendPage #coor").val(coor);
    $("#sosSendPage #tel").val(tel);
                       
    $("#sosSendPage #cancel_btn").on("touchstart", function() {
        $.mobile.changePage( "#sosPage", {transition:"none"} );
    });
                       
    $("#sosSendPage #send_btn").on("touchstart", function() {
        var tel = $("#sosSendPage #tel").val();
        var cmt = $("#sosSendPage #comment").val();
        try {
            sosTable = client.getTable('Sos');
            var query = sosTable.insert({
                user_tbl_id : userinfo.tbl_id,
                lat : Latitude,
                long : Longitude,
                comment : cmt,
                tel : tel,
                sos_date : new Date(),
                state : 0
            }).then(
                function (results) {
                    $.mobile.hidePageLoadingMsg();

                    if(results) {
                        showAlert("Thank you for request. Our manager will contact with you as soon as possible.", "EU-TEST");
                        $.mobile.changePage( "#homePage", {transition:"none"} );
                    } else {
                        showAlert("Sorry! SOS has been failed!", "Book Detail Page");
                    }

                }, function (err) {
                    $.mobile.hidePageLoadingMsg();
                    showAlert("Error: " + err, " Book Detail Page");
                }
            );
        } catch (e) {
            //showAlert('Error: ' + e.description, "Login Page");
            showAlert(e.description, "Booking Detail Page");
        }
    });

});

/*************************************************************************************
 *
 * 								Utility
 *
 ************************************************************************************/
/*
$(".button").on("click", function(e) {cw(e);});
$(".footer_btn").on("click", function(e) {cw(e);});

function cw(event) { // click wall
    try {
        click_time_cw = (new Date()).getTime();
        if (click_time_cw && (click_time_cw - last_click_time_cw) < 100) {
            event.stopImmediatePropagation();
            event.preventDefault();
            console.log('prevented misclick [CW] '+(click_time_cw - last_click_time_cw));
            return true;
        }
        last_click_time_cw = click_time_cw;
        event.stopImmediatePropagation();
        event.stopPropagation();
        return false;
    } catch(e){ console.log("stpr"); }
}
*/

function makename()
{
    var name = "";
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    var id = app_dc.uuid;
    var timestamp = new Date().getTime();
    name = id + '_' + timestamp + '_' + text;
    return name;
}

function currentDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    
    var yyyy = today.getFullYear();
    if(dd<10){dd='0'+dd;}
    if(mm<10){mm='0'+mm;}
    
    today = yyyy + '-' + mm + '-' + dd;
    return today;
}

function trim (str) {
    var	str = str.replace(/^\s\s*/, ''),
    ws = /\s/,
    i = str.length;
    while (ws.test(str.charAt(--i)));
    return str.slice(0, i + 1);
}

function checkemail(str){
    var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
    if (filter.test(str))
        testresults=true
    else{
        testresults=false
    }
    return (testresults)
}

function showAlert(msg) {
    
    if(MOBILE_MODE) {
        navigator.notification.alert(
            msg,  // message
            alertDismissed,         // callback
            'Alert',            // title
            'Done'                  // buttonName
        );
    }else{
        alert(msg);
    }
    
}

function showMessage(msg, title) {
    
    if(MOBILE_MODE) {
        navigator.notification.alert(
            msg,  // message
            alertDismissed,         // callback
            title,            // title
            'Done'                  // buttonName
        );
    }else{
        alert(msg);
    }
    
}
// alert dialog dismissed
function alertDismissed() {
    // do something
}

function nl2br(str) {
    return str.replace(/\n/g, "<br>");
}

function dump(obj) {
    console.log(JSON.stringify(obj));
}

function showWebPage(url){
    window.plugins.childBrowser.showWebPage(url);
}


function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + '</a>';
    })
    // or alternatively
    // return text.replace(urlRegex, '<a href="$1">$1</a>')
}


