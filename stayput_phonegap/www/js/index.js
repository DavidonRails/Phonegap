var preventBehavior = function(e){
    e.preventDefault();
};
document.addEventListener("touchmove", preventBehavior, false);

var MOBILE_MODE = true;

var backend_api_url = "http://yourloyaltyapps.com/Backend/";

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

});

function initbody() {

    document.addEventListener("deviceready", onDeviceReady, false);

}

function onDeviceReady() {
    app_dc = device;

//    navigator.splashscreen.hide();
    
    camera_device = navigator.camera;
    
    pictureSource=navigator.camera.PictureSourceType;
    destinationType=navigator.camera.DestinationType;
    
//    db = window.openDatabase("reminder", "1.0", "reminder db", 100*1024*1024);

}

$(".button.deactive").live("touchstart", function() {
    $(this).removeClass("deactive").addClass("active");
});

$(".button.active").live("touchend", function() {
    $(this).removeClass("active").addClass("deactive");
});


/*************************************************************************************
 *
 * 								Login Page
 *
 ************************************************************************************/

var userinfo = {
    id : 0,
    username : "",
    password : "",
    email : "",
    gender : 0,
    birthday : "",
    phone : "",
    stamp1 : 4,
    stamp2 : "",
    stamp3 : "",
    total_stamp : "",
    total_redeem : ""
};

$("#loginPage").live("pagebeforeshow", function() {
//    $("#loginPage #username").val("");
//    $("#loginPage #password").val("");
                     
});

$("#loginPage").live("pageinit", function() {
                     
    $("#loginPage #login_btn").live("vclick", function() {

        var username = $("#loginPage #username").val();
        if(!username) {
            showAlert("Please input your username");
            $("#loginPage #username").focus();
            return;
        }

        var password = $("#loginPage #password").val();
        if(!password) {
            showAlert("Please input password");
            $("#loginPage #password").val();
            return;
        }

        $.mobile.showPageLoadingMsg();

        $.ajax({
            url : backend_api_url + "login.php",
            type: "POST",
            dataType: "json",
            data: {
                "method" : "login",
                "username" : username,
                "password" : password,
            },
            success: function( data ) {
                $.mobile.hidePageLoadingMsg();
                if(data.status=="succ") {
                    userinfo.id             =   data.value.id;
                    userinfo.username       =   data.value.username;
                    userinfo.password       =   data.value.password;
                    userinfo.email          =   data.value.email;
                    userinfo.gender         =   data.value.gender;
                    userinfo.birthday       =   data.value.birthday;
                    userinfo.phone          =   data.value.phone;
                    userinfo.stamp1         =   data.value.stamp1;
                    userinfo.stamp2         =   data.value.stamp2;
                    userinfo.stamp3         =   data.value.stamp3;
                    userinfo.total_stamp    =   data.value.total_stamp;
                    userinfo.total_redeem   =   data.value.total_redeem;
//               alert(JSON.stringify(data));
                    $.mobile.changePage( "#homePage", {transition:"none"} );
                }else{
                    console.log("Fail Login!");

                    showMessage(data.value, "Login");
                }

            },
            error: function(xhr, ajaxOptions, thrownError) {
                showAlert(xhr.statusText + "Login Error:(" + thrownError + ")");
                $.mobile.hidePageLoadingMsg();
            }
        });
        
    });
                     
    $("#loginPage #register_btn").live("vclick", function() {
        $.mobile.changePage( "#registerPage", {transition:"none"} );              
                                    
    });

});

/*************************************************************************************
 *
 * 								Register Page
 *
 ************************************************************************************/

$("#registerPage").live("pagebeforeshow", function() {
    $("#registerPage #username").val("");
    $("#registerPage #password").val("");
    $("#registerPage #repassword").val("");
    $("#registerPage #email").val("");
    $("#registerPage #gender").val(0).slider('refresh');
    $("#registerPage #phone").val("");
});

$("#registerPage").live("pageinit", function() {
    $("#registerPage #back_btn").live("vclick", function() {
        $.mobile.changePage( "#loginPage", {transition:"none"} );       
    });
                        
    $("#registerPage #register_btn").live("vclick", function() {
        var username = $("#registerPage #username").val();
        if(!username) {
            showAlert("Please input your username");
            $("#registerPage #username").focus();
            return;
        }

        var password = $("#registerPage #password").val();
        if(!password) {
            showAlert("Please input password");
            $("#registerPage #password").focus();
            return;
        }

        var repassword = $("#registerPage #repassword").val();
        if(!repassword) {
            showAlert("Please input confirm pasword");
            $("#registerPage #repassword").focus();
            return;
        }
                                          
        if(password != repassword) {
            showAlert("Please input confirm password again!");
            $("#registerPage #repassword").val("").focus();
            return;
        }
                                          
        var email = $("#registerPage #email").val();
        if(!email) {
            showAlert("Please input email");
            $("#registerPage #email").focus();
            return;
        }

        if(checkemail(email) == false) {
            showAlert("Please input valid email");
            $("#registerPage #email").val("").focus();
            return;
        }
                                          
        var gender = $("#registerPage #gender").val();

        var birthday = $("#registerPage #birthday").val();
        if(!birthday) {
            showAlert("Please input your birthday");
            return;
        }

        var phone = $("#registerPage #phone").val();
        if(!phone) {
            showAlert("Please input your phone number");
            $("#registerPage #phone").focus();
            return;
        }

        $.mobile.showPageLoadingMsg();

        $.ajax({
            url : backend_api_url + "register.php",
            type: "POST",
            dataType: "json",
            data: {
               "method" : "login",
               "username" : username,
               "password" : password,
               "email" : email,
               "gender" : gender,
               "birthday" : birthday,
               "phone" : phone
            },
            success: function( data ) {
                $.mobile.hidePageLoadingMsg();
                if(data.status=="succ") {
                userinfo.id             =   data.value.id;
                userinfo.username       =   data.value.username;
                userinfo.password       =   data.value.password;
                userinfo.email          =   data.value.email;
                userinfo.gender         =   data.value.gender;
                userinfo.birthday       =   data.value.birthday;
                userinfo.phone          =   data.value.phone;
                userinfo.stamp1         =   data.value.stamp1;
                userinfo.stamp2         =   data.value.stamp2;
                userinfo.stamp3         =   data.value.stamp3;
                userinfo.total_stamp    =   data.value.total_stamp;
                userinfo.total_redeem   =   data.value.total_redeem;

                $.mobile.changePage( "#loginPage", {transition:"none"} );
                }else{
                console.log("Fail Register!");

                showMessage(data.value, "Register");
                }

            },
            error: function(xhr, ajaxOptions, thrownError) {
                showAlert(xhr.statusText + "Register Error:(" + thrownError + ")");
                $.mobile.hidePageLoadingMsg();
            }
        });
                                          
    });

});

var reward_tag = 0;
/*************************************************************************************
 *
 * 								Home Page
 *
 ************************************************************************************/
var product_list = {};

var his_product_id = -1;
var his_count = 0;

$("#homePage").live("pageinit", function() {
    $.mobile.showPageLoadingMsg();
                    
    $.ajax({
        url : backend_api_url + "product.php",
        type: "POST",
        dataType: "json",
        data: {
            "action" : "getProduct"
        },
        success: function( data ) {
           
            $.mobile.hidePageLoadingMsg();

            for(var i = 0; i < data.value.length; i++) {
               product_list[i] = data.value[i];

//             $("#homePage #product_" + i + " #product_name").html(data.value[i].productname);
            }
        },
        error: function(xhr, ajaxOptions, thrownError) {
            showAlert(xhr.statusText + " Product Error:(" + thrownError + ")");
            $.mobile.hidePageLoadingMsg();
        }
    });
                    
    $("#homePage .reward_btn").live("vclick", function() {
        reward_tag = $(this).attr("tag");
//                                    showAlert(reward_tag);
        $.mobile.changePage("#rewardPage", {transition : "none"});
    });

    $("#homePage #history_btn").live("vclick", function() {
            his_product_id =  -1;
            his_count = 0;
        $.mobile.changePage("#historyPage", {transition : "none"});
    });
                    
    $("#homePage #setting_btn").live("vclick", function() {
        $.mobile.changePage("#settingPage", {transition : "none"});
    });
                    
    $("#homePage #scan_btn").live("vclick", clickScan);
                    
    $("#homePage #stamp_panel").live("vclick", function() {
        var temp = $(this).attr("tag");
//        his_product_id = product_list[temp].id;
            his_product_id = temp;

        if(temp == 0) {
            his_count = userinfo.stamp1;
        } else if (temp == 1) {
            his_count = userinfo.stamp2;
        } else if (temp == 2) {
            his_count = userinfo.stamp3;
        }
                                     
        $.mobile.changePage("#historyPage", {transition : "none"});
                                     
    });
                    
});



$("#homePage").live("pagebeforeshow", function() {
    reward_tag = 0;
    refresh_stampboard();
});

function refresh_stampboard() {
//    showAlert(userinfo.stamp1 + "--" + userinfo.stamp2 + "---" + userinfo.stamp3);
    var stamp1 = parseInt(userinfo.stamp1);
//    stamp1 = 10;
    if(stamp1 > 10) {
        stamp1 = 10;
    }
    $("#homePage #product_0 #number_box").html(10-stamp1);
    $("#homePage #product_0 #stamp_box").html("");
    
    if(stamp2 > 10) {
        stamp2 = 10;
    }
    var stamp2 = parseInt(userinfo.stamp2);
    $("#homePage #product_1 #number_box").html(10-stamp2);
    $("#homePage #product_1 #stamp_box").html("");
    
    if(stamp3 > 10) {
        stamp3 = 10;
    }
    var stamp3 = parseInt(userinfo.stamp3);
    $("#homePage #product_2 #number_box").html(10-stamp3);
    $("#homePage #product_2 #stamp_box").html("");

    
    if(stamp1 == 10) {
        $("#homePage #product_0 #stamp_panel").hide();
        $("#homePage #product_0 .reward_btn").show();
    } else if(stamp1 < 10) {
        $("#homePage #product_0 #stamp_panel").show();
        $("#homePage #product_0 .reward_btn").hide();
    }
    
    if(stamp2 == 10) {
        $("#homePage #product_1 #stamp_panel").hide();
        $("#homePage #product_1 .reward_btn").show();
    } else if(stamp1 < 10) {
        $("#homePage #product_0 #stamp_panel").show();
        $("#homePage #product_0 .reward_btn").hide();
    }
    
    if(stamp3 == 10) {
        $("#homePage #product_2 #stamp_panel").hide();
        $("#homePage #product_2 .reward_btn").show();
    } else if(stamp1 < 10) {
        $("#homePage #product_0 #stamp_panel").show();
        $("#homePage #product_0 .reward_btn").hide();
    }

    var widget1 = "";
    var widget2 = "";
    var widget3 = "";
    for(var i = 0; i < 10; i++) {

        widget1 += "<span id='stamp' class='" + (i < stamp1 ? "active" : "deactive") + "'></span>";
                    
        widget2 += "<span id='stamp' class='" + (i < stamp2 ? "active" : "deactive") + "'></span>";
                    
        widget3 += "<span id='stamp' class='" + (i < stamp3 ? "active" : "deactive") + "'></span>";


    }

    $("#homePage #product_0 #stamp_box").html(widget1);
    $("#homePage #product_1 #stamp_box").html(widget2);
    $("#homePage #product_2 #stamp_box").html(widget3);
    

}


/****************** Qr code Reader ***********************/
function clickScan() {

    window.plugins.barcodeScanner.scan(scannerSuccess, scannerFailure);
}

//------------------------------------------------------------------------------
function scannerSuccess(result) {

    console.log("scanSuccess: result: " + result.cancelled);


    if(!result.cancelled) {
        var qrcode = result.text;
        
        var column = "";
        var index = 0;

        if(qrcode.indexOf(product_list[0].productname) != -1) {
            column = "stamp1";
            index = 0;
        } else if(qrcode.indexOf(product_list[1].productname) != -1) {
            column = "stamp2";
            index = 1;
        } else if(qrcode.indexOf(product_list[2].productname) != -1) {
            column = "stamp3";
            index = 2;
        }
        
        if(index == 0) {
//            if(userinfo.stamp1 < 10) {
//                userinfo.stamp1 = parseInt(userinfo.stamp1) + 1;
//            } else {
            if(userinfo.stamp1 == 10) {
                showAlert("You have already got 10 stamps for " + product_list[0].productname);
                return;
            }
        }
    
        if (index == 1) {
//            if(userinfo.stamp2 < 10) {
//                userinfo.stamp2 = parseInt(userinfo.stamp2) + 1;
//            } else {
            if(userinfo.stamp2 == 10) {
                showAlert("You have already got 10 stamps for " + product_list[1].productname);
                return;
            }
        }

        if (index == 2) {
//            if(userinfo.stamp3 < 10) {
//                userinfo.stamp3 =  parseInt(userinfo.stamp3) + 1;
//            } else {
            if(userinfo.stamp3 == 10) {
                showAlert("You have already got 10 stamps for " + product_list[2].productname);
                return;
            }
        }

        var random_key = makename();
        $.mobile.showPageLoadingMsg();
//        showAlert(JSON.stringify(userinfo));
        $.ajax({
            url : backend_api_url + "stamp.php",
            type: "POST",
            dataType: "json",
            data: {
                "userid" : userinfo.id,
                "productid" : product_list[index].id,
                "column" : column,
                "random" : random_key
            },
            success: function( data ) {               
                $.mobile.hidePageLoadingMsg();

                if(data.status=="succ") {

                    userinfo.id             =   data.value.id;
                    userinfo.username       =   data.value.username;
                    userinfo.password       =   data.value.password;
                    userinfo.email          =   data.value.email;
                    userinfo.gender         =   data.value.gender;
                    userinfo.birthday       =   data.value.birthday;
                    userinfo.phone          =   data.value.phone;
                    userinfo.stamp1         =   data.value.stamp1;
                    userinfo.stamp2         =   data.value.stamp2;
                    userinfo.stamp3         =   data.value.stamp3;
                    userinfo.total_stamp    =   data.value.total_stamp;
                    userinfo.total_redeem   =   data.value.total_redeem;

               
                    showAlert("Great! You got new stamp for " + product_list[index].productname);
               
                    refresh_stampboard();

                }else{
                    console.log("Fail Stamp submition!");

                    showMessage(data.value, "Stamp");
                }

            },
            error: function(xhr, ajaxOptions, thrownError) {
                showAlert(xhr.statusText + "Stamp Error:(" + thrownError + ")");
                $.mobile.hidePageLoadingMsg();
            }
        });
     
    }

}

//------------------------------------------------------------------------------
function scannerFailure(message) {
    console.log("scanFailure: message: " + message)
    showAlert("failure: " + JSON.stringify(message));
}


/*************************************************************************************
 *
 * 								Reward Page
 *
 ************************************************************************************/

var create_qrcode = function(text, typeNumber, errorCorrectLevel, table) {
    
	var qr = qrcode(typeNumber || 8, errorCorrectLevel || 'M');
	qr.addData(text);
	qr.make();
    
    //	return qr.createTableTag();
	return qr.createImgTag();
};


$("#rewardPage").live("pageinit", function() {

    $("#rewardPage #back_btn").live("vclick", function() {
        $.mobile.changePage("#homePage", {transition:"none"})
    });

    $("#rewardPage #get_code_btn").live("vclick", function() {
        var password = $("#rewardPage #password").val();

        if(password == "") {
            showAlert("Please input password of your account!");
            return;
        }
                                        
        if(password != userinfo.password) {
            showAlert("Please input password of your account!");
            return;
        }
        text = userinfo.username + "-" + userinfo.password + "-" + product_list[reward_tag].productname;

        var qrCodeData = create_qrcode(text);
        
        $("#rewardPage #code_box").html($(qrCodeData));
        $("#rewardPage #pass_box").hide();
        $("#rewardPage #code_panel").show();
    });
                      
    $("#rewardPage #out_btn").live("vclick", function() {
        navigator.notification.confirm(
        'Will you remove all scans? If you remove all scans, you have to try to scan 10 code again for one free reward code.', // message
        onConfirm,            // callback to invoke with index of button pressed
        'Confirm',           // title
        ['Ok', 'Cancel']         // buttonLabels
        );

    });

});

$("#rewardPage").live("pagebeforeshow", function() {

//    $("#rewardPage #product_title").html("test");
                      
    $("#rewardPage #password").val("");
    $("#rewardPage #pass_box").show();
    $("#rewardPage #code_box").html("");
    $("#rewardPage #code_panel").hide();

});

function onConfirm(buttonIndex) {
    if( buttonIndex == 1) {
        $.mobile.showPageLoadingMsg();
        var column = "stamp" + (parseInt(reward_tag)+1);
        alert(column);
        $.ajax({
               url : backend_api_url + "reward.php",
               type: "POST",
               dataType: "json",
               data: {
                   "action" : "formatStamp",
                   "userid" : userinfo.id,
                   "column" : column
               },
               success: function( data ) {               
                   $.mobile.hidePageLoadingMsg();
                   
                   if(data.status=="succ") {
               
                       userinfo.id             =   data.value.id;
                       userinfo.username       =   data.value.username;
                       userinfo.password       =   data.value.password;
                       userinfo.email          =   data.value.email;
                       userinfo.gender         =   data.value.gender;
                       userinfo.birthday       =   data.value.birthday;
                       userinfo.phone          =   data.value.phone;
                       userinfo.stamp1         =   data.value.stamp1;
                       userinfo.stamp2         =   data.value.stamp2;
                       userinfo.stamp3         =   data.value.stamp3;
                       userinfo.total_stamp    =   data.value.total_stamp;
                       userinfo.total_redeem   =   data.value.total_redeem;
                       
                       showAlert("Reward Code for " + product_list[reward_tag].productname + " have been removed succefully! You can scan new code.");
                       
                       $.mobile.changePage("#homePage", {transition : "none"});
                   }else{
                       console.log("Fail Stamp submition!");
                       
                       showMessage(data.value, "Stamp");
                   }
               
               },
               error: function(xhr, ajaxOptions, thrownError) {
                   showAlert(xhr.statusText + "Remove Reward Error:(" + thrownError + ")");
                   $.mobile.hidePageLoadingMsg();
               }
               });
        

    } else {
        return;
    }
}


/*************************************************************************************
 *
 * 								History Page
 *
 ************************************************************************************/

$("#historyPage").live("pagebeforeshow", function() {
    var widget = '<div class="ui-loader ui-corner-all ui-body-a ui-loader-default" style="display : block;"><span class="ui-icon ui-icon-loading"></span><h1>loading</h1></div>';
    $("#historyPage #history_list").html(widget);
    $.mobile.showPageLoadingMsg();
                       alert(his_product_id + " : " + his_count);
    $.ajax({
        url : backend_api_url + "history.php",
        type: "POST",
        dataType: "json",
        data: {
            "action" : "getHistory",
            "userid" : userinfo.id,
            "productid" : his_product_id,
            "count" : his_count
        },
        success: function( data ) {

            $.mobile.hidePageLoadingMsg();
            if(data.status=="succ") {
                var widget = "";
                for(var i = 0; i < data.value.length; i++) {
                    var temp = data.value[i];

                    widget += '<li class="history_item">' +
                    '<h2 id="product_name">' + product_list[temp.productid].productname + '</h2>' +
                    '<p  id="history_date">' + temp.date + '</p>' +
                    '</li>';
                }

                $("#historyPage #history_list").html(widget).listview('refresh');

            } else {
                var wiget = "<div>There is no any scanning and reward history for you</div>";
                $("#historyPage #history_list").html(widget);
            }

        },
        error: function(xhr, ajaxOptions, thrownError) {
            showAlert(xhr.statusText + " History : (" + thrownError + ")");
            $.mobile.hidePageLoadingMsg();
        }
    });

});

$("#historyPage").live("pageinit", function() {
    $("#historyPage #back_btn").live("vclick", function() {
        $.mobile.changePage("#homePage", {transition : "none"});
    });

});

/*************************************************************************************
 *
 * 								Setting Page
 *
 ************************************************************************************/

$("#settingPage").live("pagebeforeshow", function() {
                       
    $("#settingPage #username").html(userinfo.username);

    $("#settingPage #email").html(userinfo.email);

    var gender = "male";
    if(userinfo.gender == 1) {
        gender = "female";
    }

    $("#settingPage #gender").html(gender);

    $("#settingPage #birthday").html(userinfo.birthday);

    $("#settingPage #phone").html(userinfo.phone);

    $("#settingPage #title1").html(product_list[0].productname);
    $("#settingPage #num1").html(userinfo.stamp1);

    $("#settingPage #title2").html(product_list[1].productname);
    $("#settingPage #num2").html(userinfo.stamp2);

    $("#settingPage #title3").html(product_list[2].productname);
    $("#settingPage #num3").html(userinfo.stamp3);

    $("#settingPage #total_stamp").html(userinfo.total_stamp);

    $("#settingPage #total_reward").html(userinfo.total_redeem);

                       
});

$("#settingPage").live("pageinit", function() {
    $("#settingPage #back_btn").live("vclick", function() {
        $.mobile.changePage("#homePage", {transition : "none"});
    });

});

/********** Utility **************/

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


