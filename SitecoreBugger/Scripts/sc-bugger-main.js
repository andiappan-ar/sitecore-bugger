
var SC_BUGGER = (function () {
    return {
        Config: {
            ProjectName: "Bugger",
            Html2CanvasProxyUrl: "/sc-bugger/bugger/ImageProxy",
            SaveErrorUrl: "/sc-bugger/ApiScBugger/SaveError",
            GetErrorUrl: "/sc-bugger/ApiScBugger/GetError",
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
                    ErrorId: null,
                    ErrorTitle: null,
                    ErrorTypeId: null,
                    ErrorSeverityId: null,
                    ErrorStatusId: null,
                    ErrorDetail: null,
                    Selector: null,
                    browserDetail: null,
                    url: null,
                    ScreenShot: null
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
                    SC_BUGGER.EventListeners.FormEvents.BootstrapSubmitFOrmValidationEvents();
                    //SC_BUGGER.UtilityMethods.StyleEvents.BuggerMainIconColorChangeInit();

                    if (SC_BUGGER.UtilityMethods.GetParameterByName("sc-b-eid") != "") {
                        var inputModel = {
                            ErrorId: SC_BUGGER.UtilityMethods.GetParameterByName("sc-b-eid"),
                            ProjectId: $(".sc_bugger-element #user-info").attr("pid")
                        };
                        SC_BUGGER.ApiMethods.GetError(inputModel);
                    }
                });
            },
            FormEvents: {
                BootstrapSubmitFOrmValidationEvents: function () {
                    // Example starter JavaScript for disabling form submissions if there are invalid fields
                    (function () {
                        'use strict';
                        window.addEventListener('load', function () {
                            // Fetch all the forms we want to apply custom Bootstrap validation styles to
                            var forms = document.getElementsByClassName('sc_bugger-form-validator');
                            // Loop over them and prevent submission
                            var validation = Array.prototype.filter.call(forms, function (form) {
                                form.addEventListener('submit', function (event) {
                                    if (form.checkValidity() === false) {
                                        //event.preventDefault();
                                        //event.stopPropagation();
                                        $(this).attr("is-valid-form", false);
                                    }
                                    else {
                                        $(this).attr("is-valid-form", true);
                                    }
                                    form.classList.add('was-validated');
                                }, false);
                            });
                        }, false);
                    })();

                    // fiLEiNPUT BIND EVENTS
                    $(".custom-file-input").on("change", function () {
                        var fileName = $(this).val().split("\\").pop();
                        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
                    });
                }
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
            MarkErrorEvent: function () {
                $("#sc_bugger-save-error").unbind();

                $("#sc_bugger-save-error").click(function () {

                    //Get value from model
                    SC_BUGGER.GlobalVariables.Element.ErrorGlobal = {
                        ProjectId: $(".sc_bugger-element #user-info").attr("pid"),
                        ErrorTitle: $(".sc_bugger-element-modal.error-detail-modal #errorTitle").val(),
                        OwnerUserId: $(".sc_bugger-element #user-info").attr("uid"),
                        AssigneeUserId: $(".sc_bugger-element-modal.error-detail-modal #filter-a-user-id").val(),
                        ErrorTypeId: $(".sc_bugger-element-modal.error-detail-modal #errorType").val(),
                        ErrorSeverityId: $(".sc_bugger-element-modal.error-detail-modal #errorSeverity").val(),
                        ErrorStatusId: $(".sc_bugger-element-modal.error-detail-modal #filter-error-status").val(),
                        ErrorDetail: $(".sc_bugger-element-modal.error-detail-modal #errorDetail").val(),
                        Selector: SC_BUGGER.GlobalVariables.Browser.CurrentBugElement.getPath(),
                        DeviceDetails: JSON.stringify(SC_BUGGER.GlobalVariables.Browser.BasicDetails),
                        Uri: window.location.href,
                        screenShotDetail:$("#screenShotDetail").val()
                    };

                    // Validation
                    if (SC_BUGGER.ValidationEvents.ValidateMarkError() == "true") {

                        SC_BUGGER.FunctionalMethods.MarkErrorwithPopup(SC_BUGGER.GlobalVariables.Element.ErrorGlobal);
                      
                        $('.sc_bugger-element-modal.error-detail-modal').modal('hide');
                        SC_BUGGER.EventListeners.Body.UnbindBuggerBodyEvents();
                        $("#sc_bugger-save-error-confirm").removeClass("sc_bugger-disabled");

                        // Make all save elements visible
                        $(".sc_bugger-element #main-form-save-elements").removeClass("sc_bugger-hide");
                        $(".form-group-screenshot-div").addClass("sc_bugger-hide");
                        // Make all save elements required
                        $(".sc_bugger-element #main-form-save-elements #errorDetail,#errorType,#errorSeverity,#filter-error-status,#filter-a-user-id").attr("required", true);
                    }

                    $("#sc_bugger-submit-error").unbind();

                    $("#sc_bugger-submit-error").click(function () {

                        var isUpdateScreenshot = ($("#sc_bugger-upload-screenshot").attr("is-updated-creenshot") == "true");


                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShotB64 = (isUpdateScreenshot == true) ? $('#error-screen-shot').attr("src") : null;
                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot = null;
                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.UpdateScreenshot = isUpdateScreenshot;


                        // Validation
                        if (SC_BUGGER.ValidationEvents.ValidateMarkError() == "true") {

                            SC_BUGGER.ApiMethods.SubmitError();
                            SC_BUGGER.EventListeners.RemoveMarkErrorEvent();
                            $('.sc_bugger-element-modal.error-detail-modal').modal('hide');

                        }
                    });

                });
            },
            RemoveMarkErrorEvent: function () {

                // Make all save elements hide
                $(".sc_bugger-element #main-form-save-elements").addClass("sc_bugger-hide");
                $(".form-group-screenshot-div").removeClass("sc_bugger-hide");
                // Make all save elements non required
                $(".sc_bugger-element #main-form-save-elements #errorDetail,#errorType,#errorSeverity,#filter-error-status,#filter-a-user-id").removeAttr("required");
               

                //Remove old element
                if (SC_BUGGER.GlobalVariables.Browser.OldBugElement != null) {

                    SC_BUGGER.GlobalVariables.Browser.OldBugElement.popover('dispose');
                    SC_BUGGER.GlobalVariables.Browser.OldBugElement.removeClass("sc_bugger-popover red-tooltip sc_bugger-bgm-error");
                    SC_BUGGER.GlobalVariables.Browser.OldBugElement.removeAttr("data-toggle", "data-html", "data-placement", "title", "data-content");

                }
            },
            CompressImage: function (base64, maxWidth, maxHeight) {

                // Max size for thumbnail
                if (typeof (maxWidth) === 'undefined') var maxWidth = 500;
                if (typeof (maxHeight) === 'undefined') var maxHeight = 500;

                // Create and initialize two canvas
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                var canvasCopy = document.createElement("canvas");
                var copyContext = canvasCopy.getContext("2d");

                // Create original image
                var img = new Image();
                img.src = base64;

                // Determine new ratio based on max size
                var ratio = 1;
                if (img.width > maxWidth)
                    ratio = maxWidth / img.width;
                else if (img.height > maxHeight)
                    ratio = maxHeight / img.height;

                // Draw original image in second canvas
                canvasCopy.width = img.width;
                canvasCopy.height = img.height;
                copyContext.drawImage(img, 0, 0);

                // Copy and resize second canvas to first canvas
                canvas.width = img.width * ratio;
                canvas.height = img.height * ratio;
                ctx.drawImage(canvasCopy, 0, 0, canvasCopy.width, canvasCopy.height, 0, 0, canvas.width, canvas.height);

                return canvas.toDataURL();

            },
            //Selector : $("body")
            Body: {

                InitBuggerBodyEvents: function () {

                    $('body').css({ 'cursor': 'crosshair' });

                    //MOuse move event
                    $("body").on("sc_bugger.body.mousemove", function (event, evt) {
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {
                            $(evt.target).addClass("sc_bugger-bgm-re");
                            // console.log($(evt.target).getPath());
                        }
                    });
                    $("body").on("mousemove touchstart", function (evt) {
                        $("body").trigger("sc_bugger.body.mousemove", evt);
                    });

                    //MOuse out event
                    $("body").on("sc_bugger.body.mouseout", function (event, evt) {
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {
                            $(evt.target).removeClass("sc_bugger-bgm-re");
                        }
                    });
                    $("body").on("mouseout touchend", function (evt) {
                        $("body").trigger("sc_bugger.body.mouseout", evt);
                    });


                    //Click event
                    $("body").on("sc_bugger.body.click", function (event, evt) {
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {

                            $(".sc_bugger-screen-shot-div").addClass("sc_bugger-hide");

                            SC_BUGGER.EventListeners.RemoveMarkErrorEvent();

                            $('.sc_bugger-element-modal.error-detail-modal').modal('show').css("z-index", $(".popover").css("z-index") + 1);;

                            SC_BUGGER.EventListeners.MarkErrorEvent();

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
                                    SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot = this.result;
                                    $("#sc_bugger-upload-screenshot").attr("is-updated-creenshot", true);
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
                $(errorObj.Selector).addClass("sc_bugger-popover red-tooltip sc_bugger-bgm-error")
                    .attr({
                        "data-toggle": "popover",
                        "data-html": "true",
                        "data-placement": "bottom",
                        "title": "<span class='glyphicon glyphicon-remove'> <strong>" + errorObj.ErrorTitle + "</strong></span>",
                        "data-content": errorObj.screenShotDetail,
                    });

                SC_BUGGER.EventListeners.InitiateToolTip();
            }
        },
        UtilityMethods: {
            GetParameterByName:function(name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            },
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

                    //var string = img;
                    //alert("Size of sample is: " + string.length);
                    //var compressed = LZString.compress(string);
                    //alert("Size of compressed sample is: " + compressed.length);
                    //string = LZString.decompress(compressed);
                    //alert("Size of decompressed sample is: "+string.length);

                    SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot = img;

                    $("#sc_bugger-upload-screenshot").attr("is-updated-creenshot", true);
                    $(".sc_bugger-screen-shot-div").removeClass("sc_bugger-hide");
                    $(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot);
                    $('.sc_bugger-element-modal.error-detail-modal').modal('show');
                    $(".sc_bugger-element-modal.error-detail-modal").css("z-index", $(".popover").css("z-index") + 1);

                });

                //  window.scrollTo(0, document.body.scrollHeight || document.documentElement.scrollHeight);
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
        ,
        ValidationEvents: {
            ValidateMarkError: function () {

                $('#sc_bugger-form-mark-error #hidden-submit').click();
                return $('#sc_bugger-form-mark-error').attr("is-valid-form");
            }
        }
        ,
        ApiMethods: {
            SubmitError: function () {

                $.ajax({
                    url: SC_BUGGER.Config.SaveErrorUrl,
                    type: "post",
                    async: false,
                    data: (SC_BUGGER.GlobalVariables.Element.ErrorGlobal),
                    success: function (result) {
                        debugger;
                    }
                });
            },
            GetError: function (inputModel) {
                $.ajax({
                    url: SC_BUGGER.Config.GetErrorUrl,
                    type: "post",
                    async: false,
                    data: (inputModel),
                    success: function (response) {
                        if (response.length > 0) {
                            response = response[0];
                            var errorObj = {
                                Selector: response.Selector,
                                ErrorTitle: response.ErrorTitle,
                                screenShotDetail: response.ErrorDetail
                            };
                            SC_BUGGER.GlobalVariables.Browser.OldBugElement = $(errorObj);
                            SC_BUGGER.FunctionalMethods.MarkErrorwithPopup(errorObj);
                        }
                       
                    },
                    error: function (response) {
                        console.log(response);
                    }


                });
            },
        }
    };
}());

SC_BUGGER.Init();




