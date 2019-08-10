var SC_DASHBOARD = (function () {
    return {
        Config: {
            GetErrorUrl: "/sc-bugger/DashBoard/GetError",
            GetErrorIdsUrl: "/sc-bugger/ApiScBugger/GetErrorIds",
            SaveErrorUrl: "/sc-bugger/ApiScBugger/SaveError",
            GetExcelReportUrl: "/sc-bugger/ApiScBugger/GetExcelReport",
        },
        Settings: {
            CSS: {
                SeverityColor: {
                    Critical: "text-white bg-danger",
                    High: "text-white bg-dark",
                    Medium: "text-dark bg-warning",
                    Low: "text-secondary bg-light",
                }
            }
        },
        GlobalVariables: {
            GlobalFilter: {
                ProjectId: null,
                ErrorId: null,
                ErrorType: null,
                ErrorSeverity: null,
                IsMyItem: null,
                UserId: null,
                ErrorStatus: null,
                Date: null,
                PageSize: null,
                PageNumber: null,
                FilterView: "card",
                Meta: {
                    ViewTypeDisplayName: null
                }
            },
        },
        Issues: {
            All: null,
            AllIds: null
        },
        Init: function () {
            SC_DASHBOARD.EventListeners.Init();
        },
        EventListeners: {
            Init: function () {
                SC_DASHBOARD.EventListeners.DocumentReadyEvent();

                SC_DASHBOARD.FunctionalMethods.ActivateAutoComplete();
            },
            //Selector : $(document)
            DocumentReadyEvent: function () {
                $(document).ready(function () {
                    SC_DASHBOARD.EventListeners.FormEvents.BootstrapSubmitFOrmValidationEvents();
                    SC_DASHBOARD.EventListeners.DashBoardEvents.NavigationEvents();
                    SC_DASHBOARD.EventListeners.FilterEvents();
                   
                    SC_DASHBOARD.EventListeners.ListEvents();
                    SC_DASHBOARD.EventListeners.File.UploadScreenshot();
                    //SC_DASHBOARD.ApiMethods.GetError();
                });
            },
            DashBoardEvents: {
                NavigationEvents: function () {
                    $('#sidebarCollapse').on('click', function () {
                        $('#sidebar').toggleClass('active');
                    });
                }
            },
            FilterEvents: function () {
                // Disable all filter except project.
                $("#filter-error-list,#filter-myitems,#filter-error-type,#filter-error-severity,#filter-error-status,#filter-search").attr("disabled", "disabled");

                //Project filter change event
                $('#filter-project-list').change(function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ProjectId = $(this).val();
                    SC_DASHBOARD.ApiMethods.GetErrorIds();
                    $("#filter-error-list,#filter-myitems,#filter-error-type,#filter-error-severity,#filter-error-status,#filter-search").removeAttr("disabled");
                });

                //Issue id change event
                $('#filter-error-list').change(function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorId = $(this).val();
                });

                // Is my item, check event
                $('#filter-myitems').change(function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.IsMyItem = this.checked;
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.UserId = $("#user-info").attr("uid");
                });

                $('#filter-error-type').on('change', function () {
                    var option_all = $("#filter-error-type option:selected").map(function () {
                        return $(this).val();
                    }).get().join(',');

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorType = option_all;
                });

                $('#filter-error-severity').on('change', function () {
                    var option_all = $("#filter-error-severity option:selected").map(function () {
                        return $(this).val();
                    }).get().join(',');

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorSeverity = option_all;
                });

                $('#filter-error-status').on('change', function () {
                    var option_all = $("#filter-error-status option:selected").map(function () {
                        return $(this).val();
                    }).get().join(',');

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorStatus = option_all;
                });

                $('#filter-error-view').on('change', function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.FilterView = this.value;

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.Meta.ViewTypeDisplayName = $("#filter-error-view option:selected").text();                   

                });

                $('#filter-clear i').on('click', function () {
                    $('#filter-error-type,#filter-error-severity,#filter-error-status,#filter-main-search-issue,#filter-error-list').val("");
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorId = null;
                    $("#filter-myitems").prop("checked", false);
                });

                $('#filter-search').on('click', function () {
                    SC_DASHBOARD.ApiMethods.GetError();
                });

                $("#export-error").on('click', function () {
                    SC_DASHBOARD.ApiMethods.GetExcelReport();
                });

                $("#sc_bugger-form-mark-error").submit(function (event) {
                    if ($(this)[0].checkValidity() == true) {
                        var isUpdateScreenshot = ($("#sc_bugger-upload-screenshot").attr("is-updated-creenshot") == "true");

                        if (SC_DASHBOARD.EventListeners.FormEvents.ValidationEvents.ValidateMarkError() == "true") {
                            var inputModel = {
                                ErrorId: $("#errorID").val(),
                                ErrorTitle: $("#errorTitle").val(),
                                ErrorDetail: $("#errorDetail").val(),
                                ErrorSeverityId: $("#errorSeverity").val(),
                                ErrorTypeId: $("#errorType").val(),
                                ErrorStatusId: $("#errorStatus").val(),
                                ScreenShotB64: (isUpdateScreenshot == true) ? $('#error-screen-shot').attr("src") : null,
                                UpdateScreenshot: isUpdateScreenshot
                            };

                            SC_DASHBOARD.ApiMethods.SaveError(inputModel);
                        }

                    }
                 
                });

                $("#sc_bugger-submit-error").on('click', function () {

                    $("#sc_bugger-form-mark-error").submit();
                   

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
                                        event.preventDefault();
                                        event.stopPropagation();
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
                },
                ValidationEvents: {
                    ValidateMarkError: function () {

                        $('#sc_bugger-form-mark-error #hidden-submit').click();
                        return $('#sc_bugger-form-mark-error').attr("is-valid-form");
                    }
                }
            },
            ListEvents: function () {
                $(document).on("click", "#issue-list-card-details .card .card-header #edit-error", function () {
                    $('.sc_bugger-element-modal.error-detail-modal').modal('show');

                    // var editableData = SC_DASHBOARD.Issues.All.filter(element => element.ErrorId == $(this).closest(".card").attr("id"))[0];

                    var parentCard = $(this).closest(".card").find(".all-values");
                    var parentCardImage = $(this).closest(".card").find("img");

                    $("#errorID").val(parentCard.attr("err-id"));
                    $("#errorTitle").val(parentCard.attr("err-title"));
                    $("#errorDetail").val(parentCard.attr("err-detail"));
                    $("#errorType").val(parentCard.attr("err-type"));
                    $("#errorSeverity").val(parentCard.attr("err-severity"));
                    $("#errorStatus").val(parentCard.attr("err-status"));
                    $("#error-screen-shot").attr("src", parentCardImage.attr("src"));

                    var tempPara = [];
                    jQuery.each(JSON.parse(parentCard.attr("devide-detail")), function (name, value) {
                        if (name != "uaMatch") {
                            tempPara.push($("<p></p>").text(value.name + " : " + value.value + ".\n"));
                        }
                    });

                    $("#browser-detail").append(tempPara);

                });

            }
            ,
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

                                    $("#sc_bugger-upload-screenshot").attr("is-updated-creenshot", true);
                                }
                            }

                        });
                    });
                }
            }
        },
        FunctionalMethods: {
            ActivateAutoComplete: function () {
                /*initiate the autocomplete function on the "filter-main-search-issue" element, and pass along the countries array as possible autocomplete values:*/

                //SC_DASHBOARD.UtilityMethods.AutoCompleteEvents(document.getElementById("filter-main-search-issue"), SC_DASHBOARD.Issues.AllIds);
            },
            IssueList: {
                TempServerCall: function () {

                },
                GetIssueModel: function () {

                   

                },
                RefreshIssueList: function () {

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.FilterView = $('#filter-error-view').val();
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.Meta.ViewTypeDisplayName = $("#filter-error-view option:selected").text();


                    var currentIssueList = SC_DASHBOARD.Issues.All;

                    var listElement = [];

                    $.each(currentIssueList, function (i, _issue) {

                        // Frame json
                        var cardViewTemplateFields = {
                            id: _issue.ErrorId,
                            idFramed: " id='" + _issue.ErrorId + "' ",
                            ScreenShot: _issue.ScreenShot,
                            ErrorTitle: _issue.ErrorTitle,
                            ErrorDetail: _issue.ErrorDetail,
                            Date: _issue.Date,
                            SeverityColor: " " + SC_DASHBOARD.UtilityMethods.GetSeverityColor(_issue.ErrorSeverity) + " ",
                        };

                        var templateString = null;



                        switch (SC_DASHBOARD.GlobalVariables.GlobalFilter.FilterView) {
                            case "card":
                                templateString = `<div` + cardViewTemplateFields.idFramed + `class="card` + cardViewTemplateFields.SeverityColor + `">
                                                            <div class="card-header">` + cardViewTemplateFields.id + `
                                                        <a id="edit-error" href="javascript:void(0)" class="float-right text-primary" ><i class="fa fa-pencil-square-o fa-2x"></i></a>
                                                        <a id="remove-error" href="javascript:void(0)" class="float-right text-primary  mr-2" ><i class="fa fa-trash fa-2x"></i></a>
                                                        </div>
                                                                <img class="card-img-top" src="` + cardViewTemplateFields.ScreenShot + `">
                                                                <div class="card-body">
                                                                    <h5 class="card-title">` + cardViewTemplateFields.ErrorTitle + `</h5>
                                                                    <p class="">` + cardViewTemplateFields.ErrorDetail + `</p>
                                                                    <p class="card-text"><small class="text-muted">` + cardViewTemplateFields.Date + `</small></p>
                                                                </div>
                                                            </div>`;
                                break;
                            case "detail":
                                templateString = `<div ` + cardViewTemplateFields.idFramed + `class="card` + cardViewTemplateFields.SeverityColor + `w-2000">
                                                        <div class="card-header">` + cardViewTemplateFields.id + `
                                                         <a id="edit-error" href="javascript:void(0)" class="float-right text-primary" ><i class="fa fa-pencil-square-o fa-2x"></i></a>
                                                        <a id="remove-error" href="javascript:void(0)" class="float-right text-primary mr-2" ><i class="fa fa-trash fa-2x"></i></a>
                                                        </div>
                                                        <img class="card-img-top" src="` + cardViewTemplateFields.ScreenShot + `">
                                                        <div class="card-body">
                                                            <h5 class="card-title">` + cardViewTemplateFields.ErrorTitle + `</h5>
                                                            <p class="card-text">` + cardViewTemplateFields.ErrorDetail + `</p>
                                                            <p class="card-text"><small class="text-muted">` + cardViewTemplateFields.Date + `</small></p>
                                                        </div>
                                                    </div>`;
                                break;
                            case "mini":
                                templateString = `<div ` + cardViewTemplateFields.idFramed + `class="card text-white ` + cardViewTemplateFields.SeverityColor + ` ">
                                                        <div class="card-header">` + cardViewTemplateFields.id + `
                                                         <a id="edit-error" href="javascript:void(0)" class="float-right text-primary" ><i class="fa fa-pencil-square-o fa-2x"></i></a>
                                                        <a id="remove-error" href="javascript:void(0)" class="float-right text-primary mr-2" ><i class="fa fa-trash fa-2x"></i></a>
                                                        </div>
                                                        <div class="card-body">
                                                            <h5 class="card-title">` + cardViewTemplateFields.ErrorTitle + `</h5>
                                                            <p class="card-text">` + cardViewTemplateFields.ErrorDetail + `</p>
                                                        </div>
                                                    </div>`;
                                break;
                        }

                        listElement.push($(templateString));
                    });

                    // Heading
                    $("#issue-list-view-type-head").text(SC_DASHBOARD.GlobalVariables.GlobalFilter.Meta.ViewTypeDisplayName);
                    // List
                    $("#issue-list-card-details").html("");
                    $("#issue-list-card-details").append(listElement);

                    // Detailed view class
                    if (SC_DASHBOARD.GlobalVariables.GlobalFilter.FilterView == "detail") {
                        $("#issue-list-card-details").addClass("list-group");
                    }
                    else {
                        $("#issue-list-card-details").removeClass("list-group");
                    }


                }
            }

        },
        UtilityMethods: {
            AutoCompleteEvents: function (inp, arr) {
                /*the autocomplete function takes two arguments,
the text field element and an array of possible autocompleted values:*/
                var currentFocus;
                /*execute a function when someone writes in the text field:*/
                inp.addEventListener("input", function (e) {
                    var a, b, i, val = this.value;
                    /*close any already open lists of autocompleted values*/
                    closeAllLists();
                    if (!val) { return false; }
                    currentFocus = -1;
                    /*create a DIV element that will contain the items (values):*/
                    a = document.createElement("DIV");
                    a.setAttribute("id", this.id + "autocomplete-list");
                    a.setAttribute("class", "autocomplete-items");
                    /*append the DIV element as a child of the autocomplete container:*/
                    this.parentNode.appendChild(a);
                    /*for each item in the array...*/
                    for (i = 0; i < arr.length; i++) {
                        /*check if the item starts with the same letters as the text field value:*/

                        if (arr[i].ErrorId.substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                            /*create a DIV element for each matching element:*/
                            b = document.createElement("DIV");
                            /*make the matching letters bold:*/
                            b.innerHTML = "<strong>" + arr[i].ErrorId.substr(0, val.length) + "</strong>";
                            b.innerHTML += arr[i].ErrorId.substr(val.length);
                            /*insert a input field that will hold the current array item's value:*/
                            b.innerHTML += "<input type='hidden' value='" + arr[i].ErrorId + "'>";
                            /*execute a function when someone clicks on the item value (DIV element):*/
                            b.addEventListener("click", function (e) {
                                /*insert the value for the autocomplete text field:*/
                                inp.value = this.getElementsByTagName("input")[0].value;
                                /*close the list of autocompleted values,
                                (or any other open lists of autocompleted values:*/
                                closeAllLists();
                            });
                            a.appendChild(b);
                        }
                    }
                });
                /*execute a function presses a key on the keyboard:*/
                inp.addEventListener("keydown", function (e) {
                    var x = document.getElementById(this.id + "autocomplete-list");
                    if (x) x = x.getElementsByTagName("div");
                    if (e.keyCode == 40) {
                        /*If the arrow DOWN key is pressed,
                        increase the currentFocus variable:*/
                        currentFocus++;
                        /*and and make the current item more visible:*/
                        addActive(x);
                    } else if (e.keyCode == 38) { //up
                        /*If the arrow UP key is pressed,
                        decrease the currentFocus variable:*/
                        currentFocus--;
                        /*and and make the current item more visible:*/
                        addActive(x);
                    } else if (e.keyCode == 13) {
                        /*If the ENTER key is pressed, prevent the form from being submitted,*/
                        e.preventDefault();
                        if (currentFocus > -1) {
                            /*and simulate a click on the "active" item:*/
                            if (x) x[currentFocus].click();
                        }
                    }
                });
                function addActive(x) {
                    /*a function to classify an item as "active":*/
                    if (!x) return false;
                    /*start by removing the "active" class on all items:*/
                    removeActive(x);
                    if (currentFocus >= x.length) currentFocus = 0;
                    if (currentFocus < 0) currentFocus = (x.length - 1);
                    /*add class "autocomplete-active":*/
                    x[currentFocus].classList.add("autocomplete-active");
                }
                function removeActive(x) {
                    /*a function to remove the "active" class from all autocomplete items:*/
                    for (var i = 0; i < x.length; i++) {
                        x[i].classList.remove("autocomplete-active");
                    }
                }
                function closeAllLists(elmnt) {
                    /*close all autocomplete lists in the document,
                    except the one passed as an argument:*/
                    var x = document.getElementsByClassName("autocomplete-items");
                    for (var i = 0; i < x.length; i++) {
                        if (elmnt != x[i] && elmnt != inp) {
                            x[i].parentNode.removeChild(x[i]);
                        }
                    }
                }
                /*execute a function when someone clicks in the document:*/
                document.addEventListener("click", function (e) {
                    closeAllLists(e.target);
                });
            }
            ,
            GetSeverityColor: function (severity) {
                switch (severity) {
                    case "4":
                        return SC_DASHBOARD.Settings.CSS.SeverityColor.Critical;
                        break;
                    case "3":
                        return SC_DASHBOARD.Settings.CSS.SeverityColor.High;
                        break;
                    case "2":
                        return SC_DASHBOARD.Settings.CSS.SeverityColor.Medium;
                        break;
                    case "1":
                        return SC_DASHBOARD.Settings.CSS.SeverityColor.Low;
                        break;
                    default:
                        return SC_DASHBOARD.Settings.CSS.SeverityColor.Low;
                        break;
                }

            }
        }
        ,
        ApiMethods: {
            GetError: function () {
                $('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $.ajax({
                    url: SC_DASHBOARD.Config.GetErrorUrl,
                    type: "post",
                    async: false,
                    data: (SC_DASHBOARD.GlobalVariables.GlobalFilter),
                    success: function (response) {
                        $("#issue-list-card-details").html("");
                        $("#issue-list-card-details").html(response);    

                         $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    },
                    error: function (response) {
                        console.log(response);
                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    }


                });
            },
            SaveError: function (inputModel) {
                $('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $.ajax({
                    url: SC_DASHBOARD.Config.SaveErrorUrl,
                    type: "post",
                    async: false,
                    //processData: false,
                    data: (inputModel),
                    success: function (response) {
                        if (response.IsSuccess) {
                            SC_DASHBOARD.ApiMethods.GetError();
                            $('.sc_bugger-element-modal.error-detail-modal').modal('hide');
                        }

                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    },
                    error: function (response) {
                        console.log(response);
                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    }


                });
            },
            GetErrorIds: function () {
                $('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $.ajax({
                    url: SC_DASHBOARD.Config.GetErrorIdsUrl,
                    type: "post",
                    async: false,
                    data: (SC_DASHBOARD.GlobalVariables.GlobalFilter),
                    success: function (response) {
                        SC_DASHBOARD.Issues.AllIds = response;
                        $('#filter-error-list').empty();

                        if (SC_DASHBOARD.Issues.AllIds.length > 0) {
                            $('#filter-error-list').append('<option selected="selected" value="">Search issue by Id.</option>')
                            $.each(SC_DASHBOARD.Issues.AllIds, function (key, value) {
                                $('#filter-error-list')
                                    .append($("<option></option>")
                                        .attr("value", value.ErrorId)
                                        .text(value.ErrorId));
                            });
                        }
                        else {
                            $('#filter-error-list').append('<option selected="selected">No values found.</option>')
                        }

                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');

                    },
                    error: function (response) {
                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                        console.log(response);
                    }
                });
            }
            ,
            GetExcelReport: function () {
                $('.sc_bugger-element #pleaseWaitDialog').modal('show');
                var xhr = new XMLHttpRequest();
                xhr.open('POST', SC_DASHBOARD.Config.GetExcelReportUrl, true);
                xhr.responseType = 'blob';
                //$.each(SERVER.authorization(), function (k, v) {
                //    xhr.setRequestHeader(k, v);
                //});
                xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
                xhr.onload = function (e) {

                    if (this.status == 200) {
                        var blob = new Blob([this.response], { type: 'application/vnd.ms-excel' });
                        var downloadUrl = URL.createObjectURL(blob);
                        var a = document.createElement("a");
                        a.href = downloadUrl;
                        a.download = "data.xls";
                        document.body.appendChild(a);
                        a.click();
                    } else {
                        alert('Unable to download excel.')
                    }
                    $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                };
                xhr.send(JSON.stringify(SC_DASHBOARD.GlobalVariables.GlobalFilter));


            },
        }
    };
}());

SC_DASHBOARD.Init();



