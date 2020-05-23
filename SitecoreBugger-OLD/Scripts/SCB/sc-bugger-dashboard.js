﻿var SC_DASHBOARD = (function () {
    return {
        Config: {
            GetErrorUrl: "/sc-bugger/SCBDashBoard/GetError",
            GetErrorIdsUrl: "/sc-bugger/SCBApi/GetErrorIds",
            SaveErrorUrl: "/sc-bugger/SCBApi/SaveError",
            GetExcelReportUrl: "/sc-bugger/SCBApi/GetExcelReport",
        },
        Settings: {
            CSS: {}
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
                PageSize: 5,
                PageNumber: 1,
                TotalRecords: null,
                TotalNoOfPages: null,
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
               
            },
            //Selector : $(document)
            DocumentReadyEvent: function () {
                $(document).ready(function () {
                    SC_DASHBOARD.EventListeners.FormEvents.BootstrapSubmitFOrmValidationEvents();
                    SC_DASHBOARD.EventListeners.DashBoardEvents.NavigationEvents();
                    SC_DASHBOARD.EventListeners.FilterEvents();

                    SC_DASHBOARD.EventListeners.ListEvents();
                    SC_DASHBOARD.EventListeners.File.UploadScreenshot();                   
                });
            },
            DashBoardEvents: {
                NavigationEvents: function () {
                    $('#sidebarCollapse').on('click', function () {
                        $('#sidebar').toggleClass('active');
                    });

                    $("#log-out").click(function () {
                        SC_DASHBOARD.FunctionalMethods.Logout();
                    });
                }
            },
            FilterEvents: function () {
                // Disable all filter except project.
                $("#filter-error-list,#filter-myitems,#filter-error-type,#filter-error-severity,#filter-error-status,#filter-search,#filter-error-view,#filter-error-page-size,.card-pagination").attr("disabled", "disabled");

                //Project filter change event
                $('#filter-project-list').change(function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ProjectId = $(this).val();
                    SC_DASHBOARD.ApiMethods.GetErrorIds();
                    $("#filter-error-list,#filter-myitems,#filter-error-type,#filter-error-severity,#filter-error-status,#filter-search,#filter-error-view,#filter-error-page-size,.card-pagination").removeAttr("disabled");
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

                $('#filter-error-page-size').on('change', function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize = $(this).val();
                    // Reset page number counts logic
                    //Pagination calculations  
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber = 1;
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalNoOfPages = Math.ceil(SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalRecords / SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize); 

                    SC_DASHBOARD.ApiMethods.GetError();

                });

                $('#filter-error-view').on('change', function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.FilterView = this.value;

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.Meta.ViewTypeDisplayName = $("#filter-error-view option:selected").text();

                    SC_DASHBOARD.ApiMethods.GetError();

                });

                $('#filter-clear i').on('click', function () {
                    $('#filter-error-type,#filter-error-severity,#filter-error-status,#filter-main-search-issue,#filter-error-list').val("");
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorId = null;
                    $("#filter-myitems").prop("checked", false);
                });

                $('.card-pagination').on('click', function () {

                    var thisElement = $(this).attr("id");

                    switch (thisElement) {
                        case "prev-page":
                            if (SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber == 1) {
                                $(this).addClass("sc_bugger-disabled");
                                $(this).find("button").addClass("sc_bugger-disabled");
                            }
                            else {
                                SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber = SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber - 1;
                                SC_DASHBOARD.ApiMethods.GetError();
                                $(this).removeClass("sc_bugger-disabled");
                                $(this).find("button").removeClass("sc_bugger-disabled");
                            }
                            $("#next-page").removeClass("sc_bugger-disabled");
                            $("#next-page").find("button").removeClass("sc_bugger-disabled");
                            break;
                        case "next-page":
                            if (SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber == SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalNoOfPages) {
                                $(this).addClass("sc_bugger-disabled");
                                $(this).find("button").addClass("sc_bugger-disabled");
                            }
                            else {
                                SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber = SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber + 1;
                                SC_DASHBOARD.ApiMethods.GetError();
                                $(this).removeClass("sc_bugger-disabled");
                                $(this).find("button").removeClass("sc_bugger-disabled");
                            }
                            $("#prev-page").removeClass("sc_bugger-disabled");
                            $("#prev-page").find("button").removeClass("sc_bugger-disabled");
                            break;
                    }


                });


                $('#filter-search').on('click', function () {
                    SC_DASHBOARD.ApiMethods.GetError();
                });

                $(".export-error-excel").on('click', function () {
                    SC_DASHBOARD.ApiMethods.GetExcelReport($(this));
                });

                $("#sc_bugger-form-mark-error").submit(function (event) {

                    if (SC_DASHBOARD.EventListeners.FormEvents.ValidationEvents.ValidateMarkError()) {
                        if ($(this)[0].checkValidity() == true) {
                            var isUpdateScreenshot = ($("#sc_bugger-upload-screenshot").attr("is-updated-creenshot") == "true");
                            var inputModel = {
                                ErrorId: $("#errorID").val(),
                                ErrorTitle: $("#errorTitle").val(),
                                ErrorDetail: $("#errorDetail").val(),
                                ErrorSeverityId: $("#errorSeverity").val(),
                                ErrorTypeId: $("#errorType").val(),
                                ErrorStatusId: $("#errorStatus").val(),
                                AssigneeUserId: $("#filter-a-user-id").val(),
                                ScreenShotB64: (isUpdateScreenshot == true) ? $('#error-screen-shot').attr("src") : null,
                                UpdateScreenshot: isUpdateScreenshot
                            };

                            SC_DASHBOARD.ApiMethods.SaveError(inputModel);
                        }
                        else {
                            event.preventDefault();
                            event.stopPropagation();
                        }
                    }                 
                    else {
                        event.preventDefault();
                        event.stopPropagation();
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
                   

                    var parentCard = $(this).closest(".card").find(".all-values");
                    var parentCardImage = $(this).closest(".card").find("img");

                    $("#errorID").val(parentCard.attr("err-id"));
                    $("#errorTitle").val(parentCard.attr("err-title"));
                    $("#errorDetail").val(parentCard.attr("err-detail"));
                    $("#errorType").val(parentCard.attr("err-type"));
                    $("#errorSeverity").val(parentCard.attr("err-severity"));
                    $("#errorStatus").val(parentCard.attr("err-status"));
                    $("#error-screen-shot").attr("src", parentCardImage.attr("src"));
                    $("#filter-a-user-id").val(parentCard.attr("a-id"));
                    $("#filter-o-user-id").val(parentCard.attr("o-id"));

                    var tempPara = [];
                    $.each(JSON.parse(parentCard.attr("devide-detail")), function (name, value) {
                        if (name != "uaMatch") {
                            tempPara.push($("<p></p>").text(value.name + " : " + value.value + ".\n"));
                        }
                    });

                    $("#browser-detail").append(tempPara);
                     
                    // Disable [ErrorTitle, Description, Type, Severity , Screenshot] if not an owner
                    var disableElements = $("#errorTitle,#errorDetail,#errorType,#errorSeverity,#error-screen-shot,#sc_bugger-upload-screenshot");
                    if ($(this).closest(".card").attr("is-owner")=="True") {
                        disableElements.removeAttr("disabled");
                    }
                    else {
                        disableElements.attr("disabled", true);
                    }

                    $('.sc_bugger-element-modal.error-detail-modal').modal('show');

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
            Logout: function () {
                SC_DASHBOARD.UtilityMethods.DeleteCookie($("#user-info").attr("cookie-key"));
                window.location.reload();
            }
        },

        UtilityMethods: {
            DeleteCookie: function (name) {
                document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
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
                        $("#card-container").removeClass("sc_bugger-disabled");
                        $("#issue-list-card-details").html("");
                        $("#issue-list-card-details").html(response);

                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');

                        // Set focuss
                        $("#issue-list-card-details")[0].scrollIntoView();
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
                    //async: false,
                    //processData: false,
                    data: (inputModel),
                    success: function (response) {
                        if (response.IsSuccess) {
                           // SC_DASHBOARD.ApiMethods.GetError();
                            $('.sc_bugger-element-modal.error-detail-modal').modal('hide');
                        }

                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    },
                    error: function (response) {
                        alert(error);
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
                            $('#filter-error-list').append('<option selected="selected" value="">Search issue by Id.</option>');

                            $.each(SC_DASHBOARD.Issues.AllIds, function (key, value) {
                                $('#filter-error-list')
                                    .append($("<option></option>")
                                        .attr("value", value.ErrorId)
                                        .text(value.ErrorId));
                            });

                            //Pagination calculations
                            SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalRecords = SC_DASHBOARD.Issues.AllIds.length;
                            SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalNoOfPages = Math.ceil(SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalRecords / SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize); 
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
            GetExcelReport: function (elementThis) {
                $('.sc_bugger-element #pleaseWaitDialog').modal('show');
                var tempPageDetails = {
                    PageNumber: SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber,
                    PageSize: SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize
                };

                if (elementThis.attr("id") == "export-error-all") {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber = null;
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize = null;
                }

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

                    if (elementThis.attr("id") == "export-error-all") {
                        SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber = tempPageDetails.PageNumber;
                        SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize = tempPageDetails.PageSize;
                    }

                    $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                };
                xhr.send(JSON.stringify(SC_DASHBOARD.GlobalVariables.GlobalFilter));


            },
        }
    };
}());

SC_DASHBOARD.Init();



