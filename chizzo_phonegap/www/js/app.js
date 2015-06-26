
var preventBehavior = function(e){
	e.preventDefault();
};
document.addEventListener("touchmove", preventBehavior, false);

    var MOBILE_MODE = true;

    var backend_api_url = "";

    var loginInfo = {
        userId : 0,
        username : "",
        useremail : ""
    };

    var regInfo = {
        reg_username : "",
        reg_password : "",
        reg_email : "",
        reg_phonenum : ""
    };

$( document ).bind( "mobileinit", function() {
                   
   /// These two settings to make the browser happy with internal/localhost calls; sometimes required for Phonegap
   $.support.cors = true;
   $.mobile.allowCrossDomainPages = true;
   $.mobile.defaultPageTransition = 'slidefade';
});

document.addEventListener("deviceready", onDeviceReady, false);

function onDeviceReady() {
    
}

$(document).ready(function(){
    if(!MOBILE_MODE) {
        onDeviceReady();
    }

/***************************************************************
 *                                                              *
 *              Header Effect Page                              *
 *                                                              *
 ****************************************************************/

/*
    $(".ui-header #back_btn").live("vmousedown", function() {
        $(this).addClass("hover_back_btn");
    });
      
    $(".ui-header #back_btn").live("vmouseup", function() {
        $(this).removeClass("hover_back_btn");
    });
                  
    $(".ui-header h1").live("swipeleft", function() {
        alert("swipe");
    });
*/
});

/***************************************************************
 *                                                              *
 *              Login Page                                      *
 *                                                              *
 ****************************************************************/

$('#loginPage').live('pagecreate',function(event){
                    
    $('#loginPage #login_btn').live('vclick',function() {

         if($('#loginPage #user').val().length == 0){
             showMessage("Gelieve uw gebruikersnaam in te geven","");
         }
         else if($('#loginPage #pass').val().length == 0){
             showMessage("Gelieve uw wachtwoord in te geven","");
         }
         else{
             $.mobile.changePage( "#menuPage", {transition:"none"} );
/*
           $.mobile.showPageLoadingMsg();
         
            $.ajax({
                  url : backend_api_url + "login.php",
                  type: "POST",
                  dataType: "json",
                  data: {
                     "username" : $('#loginPage #user').val(),
                     "password" : $('#loginPage #pass').val()
                  },
                 success: function( data ) {
                 
                 dump(data);
                 if(data.status=="succ") {
                 
                 console.log("Success Login!");
                 
                 loginInfo.userId = data.value.userid;
                 loginInfo.username = data.value.username;
                 loginInfo.useremail = data.value.email;
                 
                 $.mobile.changePage( "#homePage", {transition:"none"} );
                 }else{
                 
                 console.log("Fail Login!");
                 
                 showMessage("Please Input Correct Data", "");
                 }
                 $.mobile.hidePageLoadingMsg();
                 },
                  error: function(xhr, ajaxOptions, thrownError) {
                  showAlert(xhr.statusText + "Login Error:(" + thrownError + ")");
                  console.log("error : " + xhr.statusText + "(" + thrownError + ")");
                  $.mobile.hidePageLoadingMsg();
                  }
            });
*/

         }
    });
    
    $('#loginPage #new_account_btn').live('vclick',function() {
        $.mobile.changePage( "#registerPage", {transition:"none"} );
    });

                     $('#loginPage #fotget_btn').live('vclick',function() {
        $.mobile.changePage( "#forgetPassPage", {transition:"none"} );
    });
});

/***************************************************************
 *                                                              *
 *              Forget Password Page                            *
 *                                                              *
 ****************************************************************/


$('#forgetPassPage').live('pagecreate',function(event){
                     
     $('#forgetPassPage #send_pass_btn').live('vclick',function() {
                                     
         if($('#forgetPassPage #user').val().length == 0){
             showMessage("Gelieve uw gebruikersnaam in te geven","");
         }
         else if($('#loginPage #email').val().length == 0){
             showMessage("Gelieve uw email adres in te geven","");
         }
         else{
              $.mobile.changePage( "#loginPage", {transition:"none"} );
                                              
/*
         $.mobile.showPageLoadingMsg();
         
         $.ajax({
                url : backend_api_url + "forget_pass.php",
                type: "POST",
                dataType: "json",
                data: {
                "username" : $('#forgetPassPage #user').val(),
                "password" : $('#forgetPassPage #email').val()
                },
                success: function( data ) {
                
                if(data.status=="succ") {
                
                console.log("New Password Send!");
                
               
                $.mobile.changePage( "#loginPage", {transition:"none"} );
                }else{
                
                console.log("Fail new password!");
                
                showMessage("Please retry new pasword", "");
                }
                $.mobile.hidePageLoadingMsg();
                },
                error: function(xhr, ajaxOptions, thrownError) {
                showAlert(xhr.statusText + "New Password Error:(" + thrownError + ")");
                console.log("error : " + xhr.statusText + "(" + thrownError + ")");
                $.mobile.hidePageLoadingMsg();
                }
          });
*/
         }
    });

     
    $('#forgetPassPage #back_btn').live('vclick',function() {
          $.mobile.changePage( "#loginPage", {transition:"none"} );
    });
});


/***************************************************************
 *                                                              *
 *              Register Page                                   *
 *                                                              *
 ****************************************************************/

$('#registerPage').live('pagecreate', function(){
    $("#registerPage #gsm_number").live("keydown", function(event) {
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
            // Allow: Ctrl+A
            (event.keyCode == 65 && event.ctrlKey === true) ||
            // Allow: home, end, left, right
            (event.keyCode >= 35 && event.keyCode <= 39)) {
            // let it happen, don't do anything
            return;
        }
        else {
        // Ensure that it is a number and stop the keypress
            if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
                event.preventDefault();
            }   
        }
    });
                        
  $("#registerPage #send_account_btn").live('vclick', function() {
                        
    var user = $("#registerPage #register_box #user").val(); 

    var pass = $("#registerPage #register_box #pass").val();
   
    var email = $("#registerPage #register_box #email").val();
    
    var gsm_number = $("#registerPage #register_box #gsm_number").val();
    
    if(user.length == 0){
        showMessage("Gelieve uw gebruikersnaam ingeven!","");
        $("#registerPage #register_box #user").focus();
        return;
    }
    else if(pass.length == 0){
        showMessage("Gelieve uw wachtwoord ingeven!","");
        $("#registerPage #register_box #pass").focus();
        return;
    }
    else if(email.length == 0){
        showMessage("Gelieve uw email adres ingeven!","");
        $("#registerPage #register_box #email").focus();
        return;
    }
    else if(gsm_number.length == 0){
        showMessage("Gelieve uw GSM nummer ingeven!","");
        $("#registerPage #register_box #gsm_number").focus();
        return;
    }
    //Gelieve uw persoonlijke 6-cijferige code ingeven!
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    
    if(email.length == 0) {
        showMessage("Please input your email!");
        $("#registerPage #register_box #email").focus();
        return;
    } else {
        if(reg.test(email) == false) {
            showAlert("Ongeldig email adres! Gelieve opnieuw te proberen!");
            $("#registerPage #register_box #email").val("");
            $("#registerPage #register_box #email").focus();
            return;
        }
    }
                                            
    regInfo.reg_username = user;
    regInfo.reg_password = pass;
    regInfo.reg_email = email;
    regInfo.reg_phonenum = gsm_number;
                                            
/*
    $.mobile.showPageLoadingMsg();
    $.ajax({
           url : backend_api_url + "register.php",
           type: "POST",
           dataType: "json",
           data: {
           "username"       :   user,
           "password"       :   pass,
           "email"      :   email,
           "gsm_number" :   gsm_number,
           },
           success: function( data ) {
               if(data.status=="succ") {
                   showMessage("Register is successed.");
                   $.mobile.changePage("#loginPage", {transition:"none"});
               } else {
                   showMessage(data.value);
               }
               $.mobile.hidePageLoadingMsg();
           },
           error: function(xhr, ajaxOptions, thrownError) {
               showAlert(xhr.statusText + "Register Error:(" + thrownError + ")");
               console.log("error : " + xhr.statusText + "(" + thrownError + ")");
               $.mobile.hidePageLoadingMsg();
           }
    });
*/
    $.mobile.changePage( "#phonenumConfirmPage", {transition:"none"} );
  });
                        
    $("#registerPage #back_btn").live('vclick', function() {
    $.mobile.changePage( "#loginPage", {transition:"none"} );
  });
});

$("#phonenumConfirmPage").live('pagecreate', function() {
                               
    $("#phonenumConfirmPage #gsm_number").live("keydown", function(event) {
        // Allow: backspace, delete, tab, escape, and enter
        if ( event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 27 || event.keyCode == 13 ||
        // Allow: Ctrl+A
        (event.keyCode == 65 && event.ctrlKey === true) ||
        // Allow: home, end, left, right
        (event.keyCode >= 35 && event.keyCode <= 39)) {
        // let it happen, don't do anything
            return;
        }
        else {
        // Ensure that it is a number and stop the keypress
        if (event.shiftKey || (event.keyCode < 48 || event.keyCode > 57) && (event.keyCode < 96 || event.keyCode > 105 )) {
            event.preventDefault();
        }
        }
    });
                               
    $("#phonenumConfirmPage #send_account_btn").live('vclick', function() {
         if($("#phonenumConfirmPage #gsm_number").val().length == 0) {
             showMessage("Gelieve uw GSM nummer ingeven!","");
             $("#phonenumConfirmPage #confirm_box #gsm_number").focus();
             return;
         }
/*
         if($("#phonenumConfirmPage #gsm_number").val() != regInfo.reg_phonenum) {
             showMessage("Gelieve uw GSM nummer valideren!","");
             $("#phonenumConfirmPage #confirm_box #gsm_number").val("");
             $("#phonenumConfirmPage #confirm_box #gsm_number").focus();
             return;
         }
*/
        /*
         $.mobile.showPageLoadingMsg();
         $.ajax({
         url : backend_api_url + "register.php",
         type: "POST",
         dataType: "json",
         data: {
         "username"       :   regInfo.reg_username,
         "password"       :   regInfo.reg_password,
         "email"      :   regInfo.reg_email,
         "gsm_number" :   regInfo.reg_phonenum,
         },
         success: function( data ) {
             if(data.status=="succ") {
                 showMessage("Register is successed.");
                 $.mobile.changePage("#loginPage", {transition:"none"});
             } else {
                 showMessage(data.value);
             }
             $.mobile.hidePageLoadingMsg();
         },
         error: function(xhr, ajaxOptions, thrownError) {
             showAlert(xhr.statusText + "New Account Error:(" + thrownError + ")");
             console.log("error : " + xhr.statusText + "(" + thrownError + ")");
             $.mobile.hidePageLoadingMsg();
         }
         });
         */
         $.mobile.changePage( "#loginPage", {transition:"none"} );
    });
                               
    $("#phonenumConfirmPage #back_btn").live('vclick', function() {
        $.mobile.changePage( "#registerPage", {transition:"none"} );
    });
});


/***************************************************************
 *                                                              *
 *              Menu Page                                       *
 *                                                              *
 ****************************************************************/
$(document).ready(function() {

});
/************************* Back Button End **********************/


$("#menuPage").live('pagecreate', function() {
    $("#menuPage .menu_box").live("vmousedown", function() {
        $(this).removeClass("back_btn_off").addClass("back_btn_on");
    });

    $("#menuPage .menu_box").live("vmouseup", function() {
        $(this).removeClass("back_btn_on").addClass("back_btn_off");
    });
                    
    $("#menuPage #search_menu").live("vclick", function() {
        $.mobile.changePage("#searchPage");
    });
                    
    $("#menuPage #adver_menu").live("vclick", function() {
       $.mobile.changePage("#adverListPage");
    });
});



/***************************************************************
 *                                                              *
 *              Search Page                                     *
 *                                                              *
 ****************************************************************/
$("#searchPage").live("pagecreate", function() {
    $("#searchPage #back_page_btn").live("vclick", function() {
         $("#menuPage").css("display", "none");
         $.mobile.changePage("#menuPage", {transition:"none"});
         $("#menuPage").slideDown("slow");
                                         
    });
                      
    $("#searchPage #footer #search_btn").live("vclick", function() {
       $.mobile.changePage("#adverListPage", {transition:"none"});
    });
                      
    $("#searchPage #open_flag_box.hover_off").click( function() {
       $("#searchPage .search_item").removeClass("hover_on").addClass("hover_off");
       $(this).parent().removeClass("hover_off").addClass("hover_on");
       
       $("#searchPage #open_flag_box").removeClass("hover_on").addClass("hover_off");
       $(this).removeClass("hover_off").addClass("hover_on");
                                                    
       $("#searchPage .search_content").slideUp('fast');
       $(this).parent().next(".search_content").slideDown('fast');
    });
                      
    $("#searchPage #back_page_btn").live("vmousedown", function() {
        $('#searchPage #back_page_btn').removeClass("hover_off").addClass("hover_on");
    });

    $("#searchPage #back_page_btn").live("vmouseup", function() {
        $('#searchPage #back_page_btn').removeClass("hover_on").addClass("hover_off");
    });
});

/***************************************************************
 *                                                              *
 *              Advertisement List Page                         *
 *                                                              *
 ****************************************************************/

var adve_index = 0;

$("#adverListPage").live("pagecreate", function() {
    $("#adverListPage #back_page_btn").live("vclick", function() {
        $.mobile.changePage("#menuPage");
    });

    $("#adverListPage #back_page_btn").live("vmousedown", function() {
        $('#adverListPage #back_page_btn').removeClass("hover_off").addClass("hover_on");
    });

    $("#adverListPage #back_page_btn").live("vmouseup", function() {
        $('#adverListPage #back_page_btn').removeClass("hover_on").addClass("hover_off");
    });
                         
    $("#adverListPage #footer #search_back_btn").live("click", function() {
        $.mobile.changePage("#searchPage", {transition:"none"});
    });
                         
    $("#adverListPage #adver_item_box").live("vclick", function() {
         adver_index = $(this).attr("adver_index");
         $.mobile.changePage("#adverDetailPage", {transition:"none"});
    });
});

/***************************************************************
 *                                                              *
 *              Advertisement Detail Page                       *
 *                                                              *
 ****************************************************************/

var IMG_WIDTH = 320;
var IMG_HEIGHT = 200;
var currentImg=0;

var maxImages=3;

var speed=500;
var imgs;

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
    
    $("#adverDetailPage .gallery_ctrl").css("background-image","url('css/img/adver_detail_slide_dis_active.png')");
    $("#adverDetailPage .gallery_ctrl").css("color", "#999");
    
    if(currentImg == 0) {
        $("#adverDetailPage #first_ctrl").css("background-image","url('css/img/adver_detail_slide_active.png')");
        $("#adverDetailPage #first_ctrl").css("color", "#FFF");
    } else if(currentImg == 1) {
        $("#adverDetailPage #second_ctrl").css("background-image","url('css/img/adver_detail_slide_active.png')");
        $("#adverDetailPage #second_ctrl").css("color", "#FFF");
    } else if(currentImg == 2) {
        $("#adverDetailPage #third_ctrl").css("background-image","url('css/img/adver_detail_slide_active.png')");
        $("#adverDetailPage #third_ctrl").css("color", "#FFF");
    }

}
function previousImage()
{
    currentImg = Math.max(currentImg-1, 0);
    scrollImages( IMG_WIDTH * currentImg, speed);
}
function nextImage()
{
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

$("#adverDetailPage").live("pagebeforeshow", function() {
                           
    imgs = $("#adverDetailPage #gallery_div");
                           
    maxImages = 3;
                           
    imgs.swipe( swipeOptions );
});

var slide_act_btn = false;
var slide_offset = 0;

$("#adverDetailPage").live("pagecreate", function() {
    $("#adverDetailPage #back_page_btn").live("vclick", function() {
        $.mobile.changePage("#menuPage");
    });
                           
    $("#adverDetailPage #deactive_btn").live("vclick", function() {
        $("#adverDetailPage #adver_detail_slider_btn").css("margin-left", "0px");
         
        $("#adverDetailPage #qrcode_page").css("display", "none");

    });
                       
    $("#adverDetailPage #adver_detail_slider_btn").live("swipeleft", function(event) {
        $(this).css("margin-left", "-160px");
                                                        
//        $("#adverDetailPage #qrcode_page").css("display", "block");
                                                        
        $.mobile.changePage("#verifyCodePage");
    });

});


/***************************************************************
 *                                                              *
 *              Verify Code Page                       *
 *                                                              *
 ****************************************************************/
//------------------------------------------------------------------------------
function scannerSuccess(result) {
    if (result.cancelled) {
        showAlert("the user cancelled the scan");
    }
    else {
        showAlert("we got a barcode: " + result.text);
    }
}

//------------------------------------------------------------------------------
function scannerFailure(error) {
    showAlert("scanning failed: " + error);
}



$("#verifyCodePage").live("pagebeforeshow", function() {
    $("#verifyCodePage #verify_code_btn").live("vclick", function() {
                                               
    });

    $("#verifyCodePage #verify_qrcode_btn").live("vclick", function() {
        window.plugins.barcodeScanner.scan( scannerSuccess, scannerFailure );
    });

});














//for utility

function makename(mediatype)
{
    var name = "";
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
    for( var i=0; i < 5; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    
    var id = device.uuid;
    name = id + '_' + mediatype;
    name += '_' + text;
    return name;
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










































