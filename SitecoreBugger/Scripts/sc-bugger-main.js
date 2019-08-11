
var SC_BUGGER = (function () {
    return {
        Config: {
            ProjectName: "Bugger",
            Html2CanvasProxyUrl: "/sc-bugger/bugger/ImageProxy",
            SaveErrorUrl: "/sc-bugger/ApiScBugger/SaveError",
            GetErrorUrl: "/sc-bugger/ApiScBugger/GetError",
            LoginBuggerUrl: "/sc-bugger/ApiScBugger/LoginUser"
        },
        Settings: {
            IsCompressScreenshot: true,
            Html2CanvasProxyUrl: "/sc-bugger/bugger/ImageProxy",
            QueryString_SC_B_ID: "sc-b-eid"
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
            //Selector : $sc_bugger_jq(document)
            DocumentReadyEvent: function () {
                $sc_bugger_jq(document).ready(function () {
                    SC_BUGGER.EventListeners.BrowserInformationEvent();
                    SC_BUGGER.EventListeners.BugIconBarEvents();
                    SC_BUGGER.EventListeners.ModalEvents();
                    SC_BUGGER.EventListeners.File.UploadScreenshot();
                    SC_BUGGER.EventListeners.FormEvents.BootstrapSubmitFOrmValidationEvents();
                    //SC_BUGGER.UtilityMethods.StyleEvents.BuggerMainIconColorChangeInit();

                    if (SC_BUGGER.UtilityMethods.GetParameterByName("sc-b-eid") != ""
                        && SC_BUGGER.UtilityMethods.GetParameterByName("sc-b-eid") != null) {
                        var inputModel = {
                            ErrorId: SC_BUGGER.UtilityMethods.GetParameterByName(SC_BUGGER.Settings.QueryString_SC_B_ID),
                            ProjectId: $sc_bugger_jq(".sc_bugger-element #user-info").attr("pid")
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

                                        $sc_bugger_jq(this).attr("is-valid-form", false);
                                    }
                                    else {
                                        $sc_bugger_jq(this).attr("is-valid-form", true);
                                    }
                                    event.preventDefault();
                                    event.stopPropagation();
                                    form.classList.add('was-validated');
                                }, false);
                            });
                        }, false);
                    })();

                    // fiLEiNPUT BIND EVENTS
                    $sc_bugger_jq(".custom-file-input").on("change", function () {
                        var fileName = $sc_bugger_jq(this).val().split("\\").pop();
                        $sc_bugger_jq(this).siblings(".custom-file-label").addClass("selected").html(fileName);
                    });

                    //Login form submit
                    $sc_bugger_jq("#sc_bugger-login-form").submit(function (event) {
                        if ($sc_bugger_jq(this)[0].checkValidity() == true) {
                            var inputModel = {
                                UserName: $sc_bugger_jq("#sc_bugger-login-form #UserName").val(),
                                Password: $sc_bugger_jq("#sc_bugger-login-form #Password").val()
                            }
                            SC_BUGGER.ApiMethods.LoginBugger(inputModel);
                        }
                        else {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    });



                    $sc_bugger_jq('.modal').on("hidden.bs.modal", function (e) { //fire on closing modal box
                        if ($sc_bugger_jq('.modal:visible').length) { // check whether parent modal is opend after child modal close
                            $sc_bugger_jq('body').addClass('modal-open'); // if open mean length is 1 then add a bootstrap css class to body of the page
                        }
                    });

                }
            },
            ModalEvents: function () {
                $sc_bugger_jq(document).on('hide.bs.modal', '.sc_bugger-element-modal.error-detail-modal', function () {
                    $sc_bugger_jq("#sc_bugger-save-error-confirm").addClass("sc_bugger-disabled");
                    $sc_bugger_jq("#sc_bugger-icon-bar").removeClass("sc_bugger-hide");
                });

                $sc_bugger_jq("#sc_bugger-settings-iscompressimage").change(function () {
                    SC_BUGGER.Settings.IsCompressScreenshot = $sc_bugger_jq(this).is(":checked");
                });

            },
            //Selector : $sc_bugger_jq("#sc_bugger-save-error")
            MarkErrorEvent: function () {
                $sc_bugger_jq("#sc_bugger-save-error").unbind();

                $sc_bugger_jq("#sc_bugger-save-error").click(function () {

                    //Get value from model
                    SC_BUGGER.GlobalVariables.Element.ErrorGlobal = {
                        ProjectId: $sc_bugger_jq(".sc_bugger-element #user-info").attr("pid"),
                        ErrorTitle: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #errorTitle").val(),
                        OwnerUserId: $sc_bugger_jq(".sc_bugger-element #user-info").attr("uid"),
                        AssigneeUserId: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #filter-a-user-id").val(),
                        ErrorTypeId: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #errorType").val(),
                        ErrorSeverityId: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #errorSeverity").val(),
                        ErrorStatusId: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #filter-error-status").val(),
                        ErrorDetail: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #errorDetail").val(),
                        Selector: SC_BUGGER.GlobalVariables.Browser.CurrentBugElement.getPath(),
                        DeviceDetails: JSON.stringify(SC_BUGGER.GlobalVariables.Browser.BasicDetails),
                        Uri: SC_BUGGER.UtilityMethods.RemoveURLParameter(window.location.href, SC_BUGGER.Settings.QueryString_SC_B_ID),
                        //Uri: window.location.href,
                        //screenShotDetail: $sc_bugger_jq("#screenShotDetail").val()
                    };

                    // Validation
                    if (SC_BUGGER.ValidationEvents.ValidateMarkError() == "true") {

                        SC_BUGGER.FunctionalMethods.MarkErrorwithPopup(SC_BUGGER.GlobalVariables.Element.ErrorGlobal);

                        $sc_bugger_jq('.sc_bugger-element-modal.error-detail-modal').modal('hide');
                        SC_BUGGER.EventListeners.Body.UnbindBuggerBodyEvents();
                        $sc_bugger_jq("#sc_bugger-save-error-confirm").removeClass("sc_bugger-disabled");

                        // Make all save elements visible
                        $sc_bugger_jq(".sc_bugger-element #main-form-save-elements").removeClass("sc_bugger-hide");
                        $sc_bugger_jq(".form-group-screenshot-div").addClass("sc_bugger-hide");
                        // Make all save elements required
                        $sc_bugger_jq(".sc_bugger-element #main-form-save-elements #errorDetail,#errorType,#errorSeverity,#filter-error-status,#filter-a-user-id").attr("required", true);
                    }

                    $sc_bugger_jq("#sc_bugger-submit-error").unbind();

                    $sc_bugger_jq("#sc_bugger-submit-error").click(function () {

                        var isUpdateScreenshot = ($sc_bugger_jq("#sc_bugger-upload-screenshot").attr("is-updated-creenshot") == "true");

                        //Get value from model
                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal = {
                            ProjectId: $sc_bugger_jq(".sc_bugger-element #user-info").attr("pid"),
                            ErrorTitle: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #errorTitle").val(),
                            OwnerUserId: $sc_bugger_jq(".sc_bugger-element #user-info").attr("uid"),
                            AssigneeUserId: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #filter-a-user-id").val(),
                            ErrorTypeId: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #errorType").val(),
                            ErrorSeverityId: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #errorSeverity").val(),
                            ErrorStatusId: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #filter-error-status").val(),
                            ErrorDetail: $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #errorDetail").val(),
                            Selector: SC_BUGGER.GlobalVariables.Browser.CurrentBugElement.getPath(),
                            DeviceDetails: JSON.stringify(SC_BUGGER.GlobalVariables.Browser.BasicDetails),
                            Uri: SC_BUGGER.UtilityMethods.RemoveURLParameter(window.location.href, SC_BUGGER.Settings.QueryString_SC_B_ID),
                            //screenShotDetail: $sc_bugger_jq("#screenShotDetail").val()
                        };

                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShotB64 = (isUpdateScreenshot == true) ? $sc_bugger_jq('#error-screen-shot').attr("src") : null;
                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot = null;
                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.UpdateScreenshot = isUpdateScreenshot;


                        // Validation
                        if (SC_BUGGER.ValidationEvents.ValidateMarkError() == "true") {

                            SC_BUGGER.ApiMethods.SubmitError();
                            SC_BUGGER.EventListeners.RemoveMarkErrorEvent();
                            $sc_bugger_jq('.sc_bugger-element-modal.error-detail-modal').modal('hide');

                        }
                    });

                });
            },
            RemoveMarkErrorEvent: function () {

                // Make all save elements hide
                $sc_bugger_jq(".sc_bugger-element #main-form-save-elements").addClass("sc_bugger-hide");
                $sc_bugger_jq(".form-group-screenshot-div").removeClass("sc_bugger-hide");
                // Make all save elements non required
                $sc_bugger_jq(".sc_bugger-element #main-form-save-elements #errorDetail,#errorType,#errorSeverity,#filter-error-status,#filter-a-user-id").removeAttr("required");


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
            //Selector : $sc_bugger_jq("body")
            Body: {

                InitBuggerBodyEvents: function () {

                    $sc_bugger_jq('body').css({ 'cursor': 'crosshair' });

                    //MOuse move event
                    $sc_bugger_jq("body").on("sc_bugger.body.mousemove", function (event, evt) {
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {
                            $sc_bugger_jq(evt.target).addClass("sc_bugger-bgm-re");
                            // console.log($sc_bugger_jq(evt.target).getPath());
                        }
                    });
                    $sc_bugger_jq("body").on("mousemove touchstart", function (evt) {
                        $sc_bugger_jq("body").trigger("sc_bugger.body.mousemove", evt);
                    });

                    //MOuse out event
                    $sc_bugger_jq("body").on("sc_bugger.body.mouseout", function (event, evt) {
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {
                            $sc_bugger_jq(evt.target).removeClass("sc_bugger-bgm-re");
                        }
                    });
                    $sc_bugger_jq("body").on("mouseout touchend", function (evt) {
                        $sc_bugger_jq("body").trigger("sc_bugger.body.mouseout", evt);
                    });


                    //Click event
                    $sc_bugger_jq("body").on("sc_bugger.body.click", function (event, evt) {
                        if (!SC_BUGGER.FunctionalMethods.IsBuggerelement(evt.target)) {

                            $sc_bugger_jq(".sc_bugger-screen-shot-div").addClass("sc_bugger-hide");

                            SC_BUGGER.EventListeners.RemoveMarkErrorEvent();

                            $sc_bugger_jq('.sc_bugger-element-modal.error-detail-modal').modal('show').css("z-index", $sc_bugger_jq(".popover").css("z-index") + 1);;

                            SC_BUGGER.EventListeners.MarkErrorEvent();

                            SC_BUGGER.GlobalVariables.Browser.CurrentBugElement = $sc_bugger_jq(evt.target);

                            SC_BUGGER.GlobalVariables.Browser.OldBugElement = SC_BUGGER.GlobalVariables.Browser.CurrentBugElement;
                        }
                    });
                    $sc_bugger_jq('body').click(function (evt) {
                        $sc_bugger_jq("body").trigger("sc_bugger.body.click", evt);
                    });
                },
                UnbindBuggerBodyEvents: function () {
                    $sc_bugger_jq('body').css({ 'cursor': '' });
                    $sc_bugger_jq('body').unbind('sc_bugger.body.mousemove');
                    $sc_bugger_jq('body').unbind('sc_bugger.body.mouseout');
                    $sc_bugger_jq('body').unbind('sc_bugger.body.click');
                }

            },
            //Selector : $sc_bugger_jq("body")
            BugIconBarEvents: function () {

                $sc_bugger_jq("#sc_bugger-icon-bar a").click(function () {
                    $sc_bugger_jq('.sc_bugger-element-modal.modal').modal('hide');
                    SC_BUGGER.EventListeners.Body.UnbindBuggerBodyEvents();
                    $sc_bugger_jq(".sc_bugger-screen-shot-div").addClass("sc_bugger-hide");
                    $sc_bugger_jq("#sc_bugger-icon-bar .sc_bugger-icon-bar-active").removeClass("sc_bugger-icon-bar-active");
                    if (!$sc_bugger_jq(this).hasClass("main-icon")) {
                        $sc_bugger_jq(this).addClass("sc_bugger-icon-bar-active");
                    }

                });

                $sc_bugger_jq("#sc_bugger-error-detail").click(function () {
                    // Show and hide action buttons
                    $sc_bugger_jq("#sc_bugger-submit-error").addClass("sc_bugger-hide");
                    $sc_bugger_jq("#sc_bugger-save-error").removeClass("sc_bugger-hide");
                    SC_BUGGER.EventListeners.Body.InitBuggerBodyEvents();
                });

                $sc_bugger_jq("#sc_bugger-main").click(function () {
                    $sc_bugger_jq('.sc_bugger-element-modal.main-modal').modal('show').css("z-index", $sc_bugger_jq(".popover").css("z-index") + 1);;
                });

                $sc_bugger_jq("#sc_bugger-save-error-confirm").click(function () {
                    $sc_bugger_jq("#sc_bugger-icon-bar").addClass("sc_bugger-hide");
                    // Show and hide action buttons
                    $sc_bugger_jq("#sc_bugger-submit-error").removeClass("sc_bugger-hide");
                    $sc_bugger_jq("#sc_bugger-save-error").addClass("sc_bugger-hide");

                    SC_BUGGER.UtilityMethods.GetScreenShot();
                });

                $sc_bugger_jq("#sc_bugger-settings").click(function () {
                    $sc_bugger_jq('.sc_bugger-element-modal.settings-modal').modal('show');
                });

                $sc_bugger_jq("#sc_bugger-icon-bar .main-icon").click(function () {
                    //Check user logined
                    var isUserLogined = false;

                    if (SC_BUGGER.UtilityMethods.GetCookie($sc_bugger_jq("#user-info").attr("cookie-key")) != null) {

                        isUserLogined = true;

                    }

                    if (isUserLogined) {
                        $sc_bugger_jq("#sc_bugger-icon-bar .sub-icon").toggleClass("sc_bugger-hide");
                        $sc_bugger_jq("#sc_bugger-icon-bar").removeClass("sc_bugger-hide");
                    }
                    else {
                        // Login popup show
                        $sc_bugger_jq('.sc_bugger-element-modal.sc-bugger-login-modal').modal('show');
                    }

                });

            },
            //Selector : $sc_bugger_jq("#browser-detail")
            BrowserInformationEvent: function () {
                $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #browser-detail").append(SC_BUGGER.GlobalVariables.Browser.BasicDetailsHtml);
            },
            //Selector : $sc_bugger_jq(".sc_bugger-popover")
            InitiateToolTip: function () {
                var tipElement = ($sc_bugger_jq(".sc_bugger-popover").popover("show").data('bs.popover'));
                $sc_bugger_jq(tipElement).addClass("sc_bugger-error-popover");
                $sc_bugger_jq(".sc_bugger-popover").unbind();
            },
            File: {
                UploadScreenshot: function () {
                    $sc_bugger_jq(function () {
                        $sc_bugger_jq(document).on("change", "#sc_bugger-upload-screenshot", function () {
                            var uploadFile = $sc_bugger_jq(this);
                            var files = !!this.files ? this.files : [];
                            if (!files.length || !window.FileReader) return; // no file selected, or no FileReader support

                            if (/^image/.test(files[0].type)) { // only image file
                                var reader = new FileReader(); // instance of the FileReader
                                reader.readAsDataURL(files[0]); // read the local file

                                reader.onloadend = function () { // set image data as background of div
                                    //alert(uploadFile.closest(".upimage").find('.imagePreview').length);
                                    //$sc_bugger_jq("#error-screen-shot").css("background-image", "url(" + this.result + ")");

                                    var stringLength = this.result.length - 'data:image/png;base64,'.length;

                                    var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
                                    var sizeInKb = sizeInBytes / 1000;

                                    if (sizeInKb <= 700) {                                     

                                        $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", this.result);
                                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot = this.result;
                                        $sc_bugger_jq("#sc_bugger-upload-screenshot").attr("is-updated-creenshot", true);

                                    }
                                    else {
                                        alert("Uploaded image size is too big.its should be less than a 700 KB.");

                                        $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", null);
                                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot = null;
                                        //$sc_bugger_jq("#sc_bugger-upload-screenshot").attr("is-updated-creenshot", false);
                                    }

                                   
                                }
                            }

                        });
                    });
                }
            }
        },
        FunctionalMethods: {
            IsBuggerelement: function (elementTarget) {
                var result = ($sc_bugger_jq(elementTarget).parents('.sc_bugger-element').length || $sc_bugger_jq(elementTarget).hasClass('sc_bugger-element'));
                return $sc_bugger_jq(elementTarget).parents('.sc_bugger-element').length;
            },
            MarkErrorwithPopup: function (errorObj) {
                $sc_bugger_jq(errorObj.Selector).addClass("sc_bugger-popover red-tooltip sc_bugger-bgm-error")
                    .attr({
                        "data-toggle": "popover",
                        "data-html": "true",
                        "data-placement": "bottom",
                        "title": "<span class='glyphicon glyphicon-remove'> <strong>" + errorObj.ErrorTitle + "</strong></span>",
                        "data-content": errorObj.ErrorDetail,
                    });

                SC_BUGGER.EventListeners.InitiateToolTip();
            }
        },
        UtilityMethods: {
            GetCookie: function (name) {
                var dc = document.cookie;
                var prefix = name + "=";
                var begin = dc.indexOf("; " + prefix);
                if (begin == -1) {
                    begin = dc.indexOf(prefix);
                    if (begin != 0) return null;
                }
                else {
                    begin += 2;
                    var end = document.cookie.indexOf(";", begin);
                    if (end == -1) {
                        end = dc.length;
                    }
                }
                // because unescape has been deprecated, replaced with decodeURI
                //return unescape(dc.substring(begin + prefix.length, end));
                return decodeURI(dc.substring(begin + prefix.length, end));
            },
            GetParameterByName: function (name, url) {
                if (!url) url = window.location.href;
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
                    results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, ' '));
            },
            RemoveURLParameter: function (url, parameter) {
                //prefer to use l.search if you have a location/link object
                var urlparts = url.split('?');
                if (urlparts.length >= 2) {

                    var prefix = encodeURIComponent(parameter) + '=';
                    var pars = urlparts[1].split(/[&;]/g);

                    //reverse iteration as may be destructive
                    for (var i = pars.length; i-- > 0;) {
                        //idiom for string.startsWith
                        if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                            pars.splice(i, 1);
                        }
                    }

                    url = urlparts[0] + '?' + pars.join('&');
                    return url;
                } else {
                    return url;
                }
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



                var target_container = SC_BUGGER.GlobalVariables.Browser.CurrentBugElement.get(0);
                var objJ = {
                    //allowTaint: true,
                    //useCORS: true,
                    proxy: SC_BUGGER.Config.Html2CanvasProxyUrl,
                    //logging: true //Enable log (use Web Console for get Errors and Warings)

                };

                html2canvas(target_container, objJ).then(function (canvas) {
                    $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('show');
                    var img = canvas.toDataURL();

                    //var string = img;
                    //alert("Size of sample is: " + string.length);
                    //var compressed = LZString.compress(string);
                    //alert("Size of compressed sample is: " + compressed.length);
                    //string = LZString.decompress(compressed);
                    //alert("Size of decompressed sample is: "+string.length);

                    var stringLength = img.length - 'data:image/png;base64,'.length;

                    var sizeInBytes = 4 * Math.ceil((stringLength / 3)) * 0.5624896334383812;
                    var sizeInKb = sizeInBytes / 1000;

                    if (sizeInKb <= 700) {

                        SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot = img;

                        $sc_bugger_jq("#sc_bugger-upload-screenshot").attr("is-updated-creenshot", true);
                        $sc_bugger_jq(".sc_bugger-screen-shot-div").removeClass("sc_bugger-hide");
                        $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", SC_BUGGER.GlobalVariables.Element.ErrorGlobal.ScreenShot);
                        $sc_bugger_jq('.sc_bugger-element-modal.error-detail-modal').modal('show');
                        $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal").css("z-index", $sc_bugger_jq(".popover").css("z-index") + 1);                      

                    }
                    else {
                        alert("Generated image size is too big. Please mark single element instead of whole section.\n\n OR \n\nUpload ur own screen shot with size is less than a 700 KB.");
                        $sc_bugger_jq("#sc_bugger-upload-screenshot").attr("is-updated-creenshot", false);
                        $sc_bugger_jq(".sc_bugger-screen-shot-div").removeClass("sc_bugger-hide");
                        $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", null);
                        $sc_bugger_jq('.sc_bugger-element-modal.error-detail-modal').modal('show');
                        $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal").css("z-index", $sc_bugger_jq(".popover").css("z-index") + 1);
                    }

                    $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');

                  

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

                    $sc_bugger_jq.fn.extend({
                        getPath: function () {
                            var pathes = [];

                            this.each(function (index, element) {
                                var path, $node = $sc_bugger_jq(element);

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
                            factory(window.$sc_bugger_jq);
                        }
                    }(function ($sc_bugger_jq) {
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
                        if ($sc_bugger_jq) {
                            $sc_bugger_jq.browser = window.jQBrowser;
                        }

                        return window.jQBrowser;
                    }));

                    $sc_bugger_jq.each(window.jQBrowser, function (name, value) {
                        if (name != "uaMatch") {
                            SC_BUGGER.GlobalVariables.Browser.BasicDetailsHtml.push($sc_bugger_jq("<p></p>").text(name + ": " + value + "\n"));
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

                $sc_bugger_jq('#sc_bugger-form-mark-error #hidden-submit').click();
                return $sc_bugger_jq('#sc_bugger-form-mark-error').attr("is-valid-form");
            }
        }
        ,
        ApiMethods: {
            SubmitError: function () {

                $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('show');

                $sc_bugger_jq.ajax({
                    url: SC_BUGGER.Config.SaveErrorUrl,
                    type: "post",
                    async: false,
                    data: (SC_BUGGER.GlobalVariables.Element.ErrorGlobal),
                    success: function (result) {
                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    },
                    error: function (request, status, error) {
                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    }
                });
            },
            LoginBugger: function (inputModel) {
                $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $sc_bugger_jq.ajax({
                    url: SC_BUGGER.Config.LoginBuggerUrl,
                    type: "post",
                    async: false,
                    data: (inputModel),
                    success: function (result) {
                        if (result != "False") {
                            $sc_bugger_jq('.sc_bugger-element-modal.sc-bugger-login-modal').modal('hide');
                            $sc_bugger_jq("#invalid-user-alret").addClass("sc_bugger-hide");
                        }
                        else {
                            $sc_bugger_jq('.sc_bugger-element-modal.sc-bugger-login-modal').modal('show');
                            $sc_bugger_jq("#invalid-user-alret").removeClass("sc_bugger-hide");
                        }
                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    }
                });
            },
            GetError: function (inputModel) {
                $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $sc_bugger_jq.ajax({
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
                                ErrorDetail: response.ErrorDetail
                            };
                            SC_BUGGER.GlobalVariables.Browser.OldBugElement = $sc_bugger_jq(errorObj.Selector);
                            SC_BUGGER.FunctionalMethods.MarkErrorwithPopup(errorObj);
                            $sc_bugger_jq(errorObj.Selector)[0].scrollIntoView();
                        }
                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    },
                    error: function (response) {
                        console.log(response);
                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    }


                });
            },
        }
    };
}());

SC_BUGGER.Init();




