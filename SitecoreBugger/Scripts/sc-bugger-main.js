
var SC_BUGGER = (function () {
    return {
        Config: {
            ProjectName: "Bugger",
            Html2CanvasProxyUrl: "/sc-bugger/bugger/ImageProxy",
        },
        Settings: {
            IsCompressScreenshot: true,
            Html2CanvasProxyUrl: "/sc-bugger/bugger/ImageProxy",
        },
        GlobalVariables: {
            Element: {
                CurrentBugElement: null,
                OldBugElement: null,
                ErrorGlobal: {
                    errorId: null,
                    errorTitle: null,
                    errorType: null,
                    errorSeverity: null,
                    errorDetail: null,
                    selector: null,
                    browserDetail: null,
                    url: null,
                    screenhot: null
                }
            },
            Browser: {
                BasicDetailsHtml: [],
                BasicDetails: []
            }
        },
        Init: function () {
            SC_BUGGER.ExtenionMethods.Init();
            SC_BUGGER.EventListeners.Init();

        },
        EventListeners: {
            Init: function () {
                SC_BUGGER.EventListeners.DocumentReadyEvent();
            },
            //Selector : $(document)
            DocumentReadyEvent: function () {
                $(document).ready(function () {
                    SC_BUGGER.EventListeners.BrowserInformationEvent();
                    SC_BUGGER.EventListeners.BugIconBarEvents();
                    SC_BUGGER.EventListeners.ModalEvents();
                    SC_BUGGER.EventListeners.File.UploadScreenshot();
                    //SC_BUGGER.UtilityMethods.StyleEvents.BuggerMainIconColorChangeInit();
                });
            },
            ModalEvents: function () {
                $(document).on('hide.bs.modal', '.sc_bugger-element-modal.error-detail-modal', function () {
                    $("#sc_bugger-save-error-confirm").addClass("sc_bugger-disabled");
                    $("#sc_bugger-icon-bar").removeClass("sc_bugger-hide");
                });

                $("#sc_bugger-settings-iscompressimage").change(function () {                   
                        SC_BUGGER.Settings.IsCompressScreenshot = $(this).is(":checked");                    
                });
                
            },
            //Selector : $("#sc_bugger-save-error")
            SaveErrorEvent: function () {
                $("#sc_bugger-save-error").unbind();

                $("#sc_bugger-save-error").click(function () {
                    //Get value from model
                    SC_BUGGER.GlobalVariables.Element.ErrorGlobal = {
                        errorId: SC_BUGGER.Config.ProjectName + SC_BUGGER.UtilityMethods.GetTimeStamp(),
                        errorTitle: $(".sc_bugger-element-modal.error-detail-modal #errorTitle").val(),
                        errorType: $(".sc_bugger-element-modal.error-detail-modal #errorType").val(),
                        errorSeverity: $(".sc_bugger-element-modal.error-detail-modal #errorSeverity").val(),
                        errorDetail: $(".sc_bugger-element-modal.error-detail-modal #errorDetail").val(),
                        selector: SC_BUGGER.GlobalVariables.Browser.CurrentBugElement.getPath(),
                        browserDetail: SC_BUGGER.GlobalVariables.Browser.BasicDetails,
                        url: window.location.href
                    };

                    SC_BUGGER.FunctionalMethods.MarkErrorwithPopup(SC_BUGGER.GlobalVariables.Element.ErrorGlobal);

                    $('.sc_bugger-element-modal.error-detail-modal').modal('hide');


                    SC_BUGGER.EventListeners.Body.UnbindBuggerBodyEvents();
                    $("#sc_bugger-save-error-confirm").removeClass("sc_bugger-disabled");
                });
            },
            //Selector : $("body")
            Body: {

                InitBuggerBodyEvents: function () {

                    $('body').css({ 'cursor': 'crosshair' });

                    //MOuse move event
                    $("body").on("sc_bugger.body.mousemove", function (event, evt) {                       
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {
                            $(evt.target).addClass("sc_bugger-bgm-re");
                            console.log($(evt.target).getPath());
                        }
                    });
                    $('body').mousemove(function (evt) {
                        $("body").trigger("sc_bugger.body.mousemove", evt);
                    });

                    //MOuse out event
                    $("body").on("sc_bugger.body.mouseout", function (event, evt) {
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {
                            $(evt.target).removeClass("sc_bugger-bgm-re");
                        }
                    });
                    $('body').mouseout(function (evt) {
                        $("body").trigger("sc_bugger.body.mouseout", evt);
                    });

                    //Click event
                    $("body").on("sc_bugger.body.click", function (event, evt) {
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {

                            $(".sc_bugger-screen-shot-div").addClass("sc_bugger-hide");

                            //Remove old element
                            if (SC_BUGGER.GlobalVariables.Browser.OldBugElement != null) {

                                SC_BUGGER.GlobalVariables.Browser.OldBugElement.popover('dispose');
                                SC_BUGGER.GlobalVariables.Browser.OldBugElement.removeClass("sc_bugger-popover red-tooltip sc_bugger-bgm-error");
                                SC_BUGGER.GlobalVariables.Browser.OldBugElement.removeAttr("data-toggle", "data-html", "data-placement", "title", "data-content");

                            }

                            $('.sc_bugger-element-modal.error-detail-modal').modal('show').css("z-index", $(".popover").css("z-index") + 1);;

                            SC_BUGGER.EventListeners.SaveErrorEvent();

                            SC_BUGGER.GlobalVariables.Browser.CurrentBugElement = $(evt.target);

                            SC_BUGGER.GlobalVariables.Browser.OldBugElement = SC_BUGGER.GlobalVariables.Browser.CurrentBugElement;
                        }
                    });
                    $('body').click(function (evt) {
                        $("body").trigger("sc_bugger.body.click", evt);
                    });
                },
                UnbindBuggerBodyEvents: function () {
                    $('body').css({ 'cursor': '' });
                    $('body').unbind('sc_bugger.body.mousemove');
                    $('body').unbind('sc_bugger.body.mouseout');
                    $('body').unbind('sc_bugger.body.click');
                }

            },
            //Selector : $("body")
            BugIconBarEvents: function () {

                $("#sc_bugger-icon-bar a").click(function () {
                    $('.sc_bugger-element-modal.modal').modal('hide');
                    SC_BUGGER.EventListeners.Body.UnbindBuggerBodyEvents();
                    $(".sc_bugger-screen-shot-div").addClass("sc_bugger-hide");
                    $("#sc_bugger-icon-bar .sc_bugger-icon-bar-active").removeClass("sc_bugger-icon-bar-active");
                    if (!$(this).hasClass("main-icon")) {
                        $(this).addClass("sc_bugger-icon-bar-active");
                    }

                });

                $("#sc_bugger-error-detail").click(function () {
                    // Show and hide action buttons
                    $("#sc_bugger-submit-error").addClass("sc_bugger-hide");
                    $("#sc_bugger-save-error").removeClass("sc_bugger-hide");                    
                    SC_BUGGER.EventListeners.Body.InitBuggerBodyEvents();
                });

                $("#sc_bugger-main").click(function () {
                    $('.sc_bugger-element-modal.main-modal').modal('show').css("z-index", $(".popover").css("z-index") + 1);;
                });

                $("#sc_bugger-save-error-confirm").click(function () {
                    $("#sc_bugger-icon-bar").addClass("sc_bugger-hide");
                    // Show and hide action buttons
                    $("#sc_bugger-submit-error").removeClass("sc_bugger-hide");
                    $("#sc_bugger-save-error").addClass("sc_bugger-hide");

                    SC_BUGGER.UtilityMethods.GetScreenShot();
                });

                $("#sc_bugger-settings").click(function () {
                    $('.sc_bugger-element-modal.settings-modal').modal('show');
                });

                $("#sc_bugger-icon-bar .main-icon").click(function () {
                    $("#sc_bugger-icon-bar .sub-icon").toggleClass("sc_bugger-hide");
                    $("#sc_bugger-icon-bar").removeClass("sc_bugger-hide");
                });

            },
            //Selector : $("#browser-detail")
            BrowserInformationEvent: function () {
                $(".sc_bugger-element-modal.error-detail-modal #browser-detail").append(SC_BUGGER.GlobalVariables.Browser.BasicDetailsHtml);
            },
            //Selector : $(".sc_bugger-popover")
            InitiateToolTip: function () {
                var tipElement = ($(".sc_bugger-popover").popover("show").data('bs.popover'));
                $(tipElement).addClass("sc_bugger-error-popover");
                $(".sc_bugger-popover").unbind();
            },
            File: {
                UploadScreenshot: function () {
                    $(function () {
                        $(document).on("change", "#sc_bugger-upload-screenshot", function () {
                            var uploadFile = $(this);
                            var files = !!this.files ? this.files : [];
                            if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

                            if (/^image/.test(files[0].type)) { // only image file
                                var reader = new FileReader(); // instance of the FileReader
                                reader.readAsDataURL(files[0]); // read the local file

                                reader.onloadend = function () { // set image data as background of div
                                    //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                                    //$("#error-screen-shot").css("background-image", "url(" + this.result + ")");
                                    $(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", this.result);
                                    SC_BUGGER.GlobalVariables.Element.ErrorGlobal.screenhot = this.result;
                                }
                            }

                        });
                    });
                }
            }
        },
        FunctionalMethods: {
            IsBuggerelement: function (elementTarget) {
                var result = ($(elementTarget).parents('.sc_bugger-element').length || $(elementTarget).hasClass('sc_bugger-element'));
                return $(elementTarget).parents('.sc_bugger-element').length;
            },
            MarkErrorwithPopup: function (errorObj) {
                $(errorObj.selector).addClass("sc_bugger-popover red-tooltip sc_bugger-bgm-error")
                    .attr({
                        "data-toggle": "popover",
                        "data-html": "true",
                        "data-placement": "bottom",
                        "title": "<span class='glyphicon glyphicon-remove'> <strong>" + errorObj.errorTitle + "</strong></span>",
                        "data-content": errorObj.errorDetail,
                    });

                SC_BUGGER.EventListeners.InitiateToolTip();
            }
        },
        UtilityMethods: {
            StyleEvents: {
                BuggerMainIconColorChangeInit: function () {
                    setInterval(SC_BUGGER.UtilityMethods.StyleEvents.GetRandomColor(document.getElementById('sc_bugger-bug-icon-b')), 500);
                },
                GetRandomColor: function (element) {
                    var color = '#' + (
                        '000000' + (Math.random() * 0x1000000).toString(16)
                    ).slice(-6);
                    element.style.color = color;
                }
            },
            GetTimeStamp: function () {
                return new Date().getTime();
            },
            GetScreenShot: function () {
                // window.scrollTo(0, 0);

                var target_container = document.body;
                var objJ = {
                    //allowTaint: true,
                    //useCORS: true,
                    proxy: SC_BUGGER.Config.Html2CanvasProxyUrl,
                    logging: true //Enable log (use Web Console for get Errors and Warings)

                };

                html2canvas(target_container, objJ).then(function (canvas) {
                    var img = canvas.toDataURL();

                    //var tempImage = $(".sc_bugger-element-modal.error-detail-modal #error-screen-shot")[0];

                    //tempImage.onload = function () {
                    //    alert(tempImage.width + ", " + tempImage.height);
                    //    var canvas = document.createElement("canvas");
                    //    var context = canvas.getContext("2d");
                    //    canvas.width = tempImage.width / 4;
                    //    canvas.height = tempImage.height / 4;
                    //    context.drawImage(tempImage,
                    //        0,
                    //        0,
                    //        tempImage.width,
                    //        tempImage.height,
                    //        0,
                    //        0,
                    //        canvas.width,
                    //        canvas.height
                    //    );

                    //    source_img_obj.src = canvas.toDataURL();
                    //};

                    //$(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", img);
                   

                    //SC_BUGGER.GlobalVariables.Element.ErrorGlobal.screenhot = (SC_BUGGER.Settings.IsCompressScreenshot) ?
                    //    SC_BUGGER.UtilityMethods.GetCompressedImage(tempImage, 50, 3000, "png") : img;

                    SC_BUGGER.GlobalVariables.Element.ErrorGlobal.screenhot = img;


                    $(".sc_bugger-screen-shot-div").removeClass("sc_bugger-hide");
                    $(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", SC_BUGGER.GlobalVariables.Element.ErrorGlobal.screenhot);
                    $('.sc_bugger-element-modal.error-detail-modal').modal('show');
                    $(".sc_bugger-element-modal.error-detail-modal").css("z-index", $(".popover").css("z-index") + 1);

                    //var image = new Image();
                    //image.src = img;
                    //var w = window.open("");
                    //w.document.write(image.outerHTML);

                });

                //  window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
            },
            ///quality 1 to 100
            GetCompressedImage: function (image, quality, maxWidth, output_format) {

                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                canvas.width = image.width / 4;
               
            }
        },
        ExtenionMethods: {
            Init: function () {
                SC_BUGGER.ExtenionMethods.Jquery.UniqueSelector();
                SC_BUGGER.ExtenionMethods.Jquery.Browserdetails();
            },
            Jquery: {
                UniqueSelector: function () { //Get unique selector extension

                    jQuery.fn.extend({
                        getPath: function () {
                            var pathes = [];

                            this.each(function (index, element) {
                                var path, $node = jQuery(element);

                                while ($node.length) {
                                    var realNode = $node.get(0), name = realNode.localName;
                                    if (!name) { break; }

                                    name = name.toLowerCase();
                                    var parent = $node.parent();
                                    var sameTagSiblings = parent.children(name);

                                    if (sameTagSiblings.length > 1) {
                                        var allSiblings = parent.children();
                                        var index = allSiblings.index(realNode) + 1;
                                        if (index > 0) {
                                            name += ':nth-child(' + index + ')';
                                        }
                                    }

                                    path = name + (path ? ' > ' + path : '');
                                    $node = parent;
                                }

                                pathes.push(path);
                            });

                            return pathes.join(',');
                        }
                    });
                },
                Browserdetails: function () {  //GEt browser details

                    (function (factory) {
                        if (typeof define === 'function' && define.amd) {
                            // AMD. Register as an anonymous module.
                            define(['jquery'], function ($) {
                                return factory($);
                            });
                        } else if (typeof module === 'object' && typeof module.exports === 'object') {
                            // Node-like environment
                            module.exports = factory(require('jquery'));
                        } else {
                            // Browser globals
                            factory(window.jQuery);
                        }
                    }(function (jQuery) {
                        "use strict";

                        function uaMatch(ua) {
                            // If an UA is not provided, default to the current browser UA.
                            if (ua === undefined) {
                                ua = window.navigator.userAgent;
                            }
                            ua = ua.toLowerCase();

                            var match = /(edge)\/([\w.]+)/.exec(ua) ||
                                /(opr)[\/]([\w.]+)/.exec(ua) ||
                                /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                                /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
                                /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) ||
                                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                                /(msie) ([\w.]+)/.exec(ua) ||
                                ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) ||
                                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                                [];

                            var platform_match = /(ipad)/.exec(ua) ||
                                /(ipod)/.exec(ua) ||
                                /(iphone)/.exec(ua) ||
                                /(kindle)/.exec(ua) ||
                                /(silk)/.exec(ua) ||
                                /(android)/.exec(ua) ||
                                /(windows phone)/.exec(ua) ||
                                /(win)/.exec(ua) ||
                                /(mac)/.exec(ua) ||
                                /(linux)/.exec(ua) ||
                                /(cros)/.exec(ua) ||
                                /(playbook)/.exec(ua) ||
                                /(bb)/.exec(ua) ||
                                /(blackberry)/.exec(ua) ||
                                [];

                            var browser = {},
                                matched = {
                                    browser: match[5] || match[3] || match[1] || "",
                                    version: match[2] || match[4] || "0",
                                    versionNumber: match[4] || match[2] || "0",
                                    platform: platform_match[0] || ""
                                };

                            if (matched.browser) {
                                browser[matched.browser] = true;
                                browser.version = matched.version;
                                browser.versionNumber = parseInt(matched.versionNumber, 10);
                            }

                            if (matched.platform) {
                                browser[matched.platform] = true;
                            }

                            // These are all considered mobile platforms, meaning they run a mobile browser
                            if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
                                browser.ipod || browser.kindle || browser.playbook || browser.silk || browser["windows phone"]) {
                                browser.mobile = true;
                            }

                            // These are all considered desktop platforms, meaning they run a desktop browser
                            if (browser.cros || browser.mac || browser.linux || browser.win) {
                                browser.desktop = true;
                            }

                            // Chrome, Opera 15+ and Safari are webkit based browsers
                            if (browser.chrome || browser.opr || browser.safari) {
                                browser.webkit = true;
                            }

                            // IE11 has a new token so we will assign it msie to avoid breaking changes
                            // IE12 disguises itself as Chrome, but adds a new Edge token.
                            if (browser.rv || browser.edge) {
                                var ie = "msie";

                                matched.browser = ie;
                                browser[ie] = true;
                            }

                            // Blackberry browsers are marked as Safari on BlackBerry
                            if (browser.safari && browser.blackberry) {
                                var blackberry = "blackberry";

                                matched.browser = blackberry;
                                browser[blackberry] = true;
                            }

                            // Playbook browsers are marked as Safari on Playbook
                            if (browser.safari && browser.playbook) {
                                var playbook = "playbook";

                                matched.browser = playbook;
                                browser[playbook] = true;
                            }

                            // BB10 is a newer OS version of BlackBerry
                            if (browser.bb) {
                                var bb = "blackberry";

                                matched.browser = bb;
                                browser[bb] = true;
                            }

                            // Opera 15+ are identified as opr
                            if (browser.opr) {
                                var opera = "opera";

                                matched.browser = opera;
                                browser[opera] = true;
                            }

                            // Stock Android browsers are marked as Safari on Android.
                            if (browser.safari && browser.android) {
                                var android = "android";

                                matched.browser = android;
                                browser[android] = true;
                            }

                            // Kindle browsers are marked as Safari on Kindle
                            if (browser.safari && browser.kindle) {
                                var kindle = "kindle";

                                matched.browser = kindle;
                                browser[kindle] = true;
                            }

                            // Kindle Silk browsers are marked as Safari on Kindle
                            if (browser.safari && browser.silk) {
                                var silk = "silk";

                                matched.browser = silk;
                                browser[silk] = true;
                            }

                            // Assign the name and platform variable
                            browser.name = matched.browser;
                            browser.platform = matched.platform;
                            return browser;
                        }

                        // Run the matching process, also assign the function to the returned object
                        // for manual, jQuery-free use if desired
                        window.jQBrowser = uaMatch(window.navigator.userAgent);
                        window.jQBrowser.uaMatch = uaMatch;

                        // Only assign to jQuery.browser if jQuery is loaded
                        if (jQuery) {
                            jQuery.browser = window.jQBrowser;
                        }

                        return window.jQBrowser;
                    }));

                    jQuery.each(window.jQBrowser, function (name, value) {
                        if (name != "uaMatch") {
                            SC_BUGGER.GlobalVariables.Browser.BasicDetailsHtml.push($("<p></p>").text(name + ": " + value + "\n"));
                            SC_BUGGER.GlobalVariables.Browser.BasicDetails.push({
                                name: name,
                                value: value
                            });
                        }
                    });
                }
            }
        }
    };
}());

SC_BUGGER.Init();

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

//var mokedData = null;

////usage:
//readTextFile("/MockedError.json", function (text) {
//    mokedData = JSON.parse(text);
//    // console.log(data);
//    MarkError();

//});

//function getQueryStringValue(key) {
//    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
//}

//function getError(key) {
//    return mokedData.filter(
//        function (data) {
//            if (data.errorId == key) {
//                return data;
//            }

//            return null;
//        }
//    );
//}

//function MarkError() {
//    var errorObj = getError(getQueryStringValue("sc-b-e-id"))[0];

//    SC_BUGGER.FunctionalMethods.MarkErrorwithPopup(errorObj);



//}


