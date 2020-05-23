﻿var SC_DASHBOARD = (function () {
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
            //Selector : $sc_bugger_jq(document)
            DocumentReadyEvent: function () {
                $sc_bugger_jq(document).ready(function () {
                    SC_DASHBOARD.EventListeners.FormEvents.BootstrapSubmitFOrmValidationEvents();
                    SC_DASHBOARD.EventListeners.DashBoardEvents.NavigationEvents();
                    SC_DASHBOARD.EventListeners.FilterEvents();

                    SC_DASHBOARD.EventListeners.ListEvents();
                    SC_DASHBOARD.EventListeners.File.UploadScreenshot();                   
                });
            },
            DashBoardEvents: {
                NavigationEvents: function () {
                    $sc_bugger_jq('#sidebarCollapse').on('click', function () {
                        $sc_bugger_jq('#sidebar').toggleClass('active');
                    });
                }
            },
            FilterEvents: function () {
                // Disable all filter except project.
                $sc_bugger_jq("#filter-error-list,#filter-myitems,#filter-error-type,#filter-error-severity,#filter-error-status,#filter-search,#filter-error-view,#filter-error-page-size,.card-pagination").attr("disabled", "disabled");

                //Project filter change event
                $sc_bugger_jq('#filter-project-list').change(function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ProjectId = $sc_bugger_jq(this).val();
                    SC_DASHBOARD.ApiMethods.GetErrorIds();
                    $sc_bugger_jq("#filter-error-list,#filter-myitems,#filter-error-type,#filter-error-severity,#filter-error-status,#filter-search,#filter-error-view,#filter-error-page-size,.card-pagination").removeAttr("disabled");
                });

                //Issue id change event
                $sc_bugger_jq('#filter-error-list').change(function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorId = $sc_bugger_jq(this).val();
                });

                // Is my item, check event
                $sc_bugger_jq('#filter-myitems').change(function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.IsMyItem = this.checked;
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.UserId = $sc_bugger_jq("#user-info").attr("uid");
                });

                $sc_bugger_jq('#filter-error-type').on('change', function () {
                    var option_all = $sc_bugger_jq("#filter-error-type option:selected").map(function () {
                        return $sc_bugger_jq(this).val();
                    }).get().join(',');

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorType = option_all;
                });

                $sc_bugger_jq('#filter-error-severity').on('change', function () {
                    var option_all = $sc_bugger_jq("#filter-error-severity option:selected").map(function () {
                        return $sc_bugger_jq(this).val();
                    }).get().join(',');

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorSeverity = option_all;
                });

                $sc_bugger_jq('#filter-error-status').on('change', function () {
                    var option_all = $sc_bugger_jq("#filter-error-status option:selected").map(function () {
                        return $sc_bugger_jq(this).val();
                    }).get().join(',');

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorStatus = option_all;
                });

                $sc_bugger_jq('#filter-error-page-size').on('change', function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize = $sc_bugger_jq(this).val();
                    // Reset page number counts logic
                    //Pagination calculations  
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber = 1;
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalNoOfPages = Math.ceil(SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalRecords / SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize); 

                    SC_DASHBOARD.ApiMethods.GetError();

                });

                $sc_bugger_jq('#filter-error-view').on('change', function () {
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.FilterView = this.value;

                    SC_DASHBOARD.GlobalVariables.GlobalFilter.Meta.ViewTypeDisplayName = $sc_bugger_jq("#filter-error-view option:selected").text();

                    SC_DASHBOARD.ApiMethods.GetError();

                });

                $sc_bugger_jq('#filter-clear i').on('click', function () {
                    $sc_bugger_jq('#filter-error-type,#filter-error-severity,#filter-error-status,#filter-main-search-issue,#filter-error-list').val("");
                    SC_DASHBOARD.GlobalVariables.GlobalFilter.ErrorId = null;
                    $sc_bugger_jq("#filter-myitems").prop("checked", false);
                });

                $sc_bugger_jq('.card-pagination').on('click', function () {

                    var thisElement = $sc_bugger_jq(this).attr("id");

                    switch (thisElement) {
                        case "prev-page":
                            if (SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber == 1) {
                                $sc_bugger_jq(this).addClass("sc_bugger-disabled");
                                $sc_bugger_jq(this).find("button").addClass("sc_bugger-disabled");
                            }
                            else {
                                SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber = SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber - 1;
                                SC_DASHBOARD.ApiMethods.GetError();
                                $sc_bugger_jq(this).removeClass("sc_bugger-disabled");
                                $sc_bugger_jq(this).find("button").removeClass("sc_bugger-disabled");
                            }
                            $sc_bugger_jq("#next-page").removeClass("sc_bugger-disabled");
                            $sc_bugger_jq("#next-page").find("button").removeClass("sc_bugger-disabled");
                            break;
                        case "next-page":
                            if (SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber == SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalNoOfPages) {
                                $sc_bugger_jq(this).addClass("sc_bugger-disabled");
                                $sc_bugger_jq(this).find("button").addClass("sc_bugger-disabled");
                            }
                            else {
                                SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber = SC_DASHBOARD.GlobalVariables.GlobalFilter.PageNumber + 1;
                                SC_DASHBOARD.ApiMethods.GetError();
                                $sc_bugger_jq(this).removeClass("sc_bugger-disabled");
                                $sc_bugger_jq(this).find("button").removeClass("sc_bugger-disabled");
                            }
                            $sc_bugger_jq("#prev-page").removeClass("sc_bugger-disabled");
                            $sc_bugger_jq("#prev-page").find("button").removeClass("sc_bugger-disabled");
                            break;
                    }


                });


                $sc_bugger_jq('#filter-search').on('click', function () {
                    SC_DASHBOARD.ApiMethods.GetError();
                });

                $sc_bugger_jq(".export-error-excel").on('click', function () {
                    SC_DASHBOARD.ApiMethods.GetExcelReport($sc_bugger_jq(this));
                });

                $sc_bugger_jq("#sc_bugger-form-mark-error").submit(function (event) {

                    if (SC_DASHBOARD.EventListeners.FormEvents.ValidationEvents.ValidateMarkError()) {
                        if ($sc_bugger_jq(this)[0].checkValidity() == true) {
                            var isUpdateScreenshot = ($sc_bugger_jq("#sc_bugger-upload-screenshot").attr("is-updated-creenshot") == "true");
                            var inputModel = {
                                ErrorId: $sc_bugger_jq("#errorID").val(),
                                ErrorTitle: $sc_bugger_jq("#errorTitle").val(),
                                ErrorDetail: $sc_bugger_jq("#errorDetail").val(),
                                ErrorSeverityId: $sc_bugger_jq("#errorSeverity").val(),
                                ErrorTypeId: $sc_bugger_jq("#errorType").val(),
                                ErrorStatusId: $sc_bugger_jq("#errorStatus").val(),
                                ScreenShotB64: (isUpdateScreenshot == true) ? $sc_bugger_jq('#error-screen-shot').attr("src") : null,
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

                $sc_bugger_jq("#sc_bugger-submit-error").on('click', function () {

                    $sc_bugger_jq("#sc_bugger-form-mark-error").submit();


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
                                        $sc_bugger_jq(this).attr("is-valid-form", false);
                                    }
                                    else {
                                        $sc_bugger_jq(this).attr("is-valid-form", true);
                                    }

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
                },
                ValidationEvents: {
                    ValidateMarkError: function () {

                        $sc_bugger_jq('#sc_bugger-form-mark-error #hidden-submit').click();
                        return $sc_bugger_jq('#sc_bugger-form-mark-error').attr("is-valid-form");
                    }
                }
            },
            ListEvents: function () {
                $sc_bugger_jq(document).on("click", "#issue-list-card-details .card .card-header #edit-error", function () {
                    $sc_bugger_jq('.sc_bugger-element-modal.error-detail-modal').modal('show');

                    // var editableData = SC_DASHBOARD.Issues.All.filter(element => element.ErrorId == $sc_bugger_jq(this).closest(".card").attr("id"))[0];

                    var parentCard = $sc_bugger_jq(this).closest(".card").find(".all-values");
                    var parentCardImage = $sc_bugger_jq(this).closest(".card").find("img");

                    $sc_bugger_jq("#errorID").val(parentCard.attr("err-id"));
                    $sc_bugger_jq("#errorTitle").val(parentCard.attr("err-title"));
                    $sc_bugger_jq("#errorDetail").val(parentCard.attr("err-detail"));
                    $sc_bugger_jq("#errorType").val(parentCard.attr("err-type"));
                    $sc_bugger_jq("#errorSeverity").val(parentCard.attr("err-severity"));
                    $sc_bugger_jq("#errorStatus").val(parentCard.attr("err-status"));
                    $sc_bugger_jq("#error-screen-shot").attr("src", parentCardImage.attr("src"));

                    var tempPara = [];
                    $sc_bugger_jq.each(JSON.parse(parentCard.attr("devide-detail")), function (name, value) {
                        if (name != "uaMatch") {
                            tempPara.push($sc_bugger_jq("<p></p>").text(value.name + " : " + value.value + ".\n"));
                        }
                    });

                    $sc_bugger_jq("#browser-detail").append(tempPara);

                });

            }
            ,
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
                                    $sc_bugger_jq(".sc_bugger-element-modal.error-detail-modal #error-screen-shot").attr("src", this.result);

                                    $sc_bugger_jq("#sc_bugger-upload-screenshot").attr("is-updated-creenshot", true);
                                }
                            }

                        });
                    });
                }
            }
        },
        FunctionalMethods: {
          
        },
        UtilityMethods: {
      
        }
        ,
        ApiMethods: {
            GetError: function () {
                $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $sc_bugger_jq.ajax({
                    url: SC_DASHBOARD.Config.GetErrorUrl,
                    type: "post",
                    async: false,
                    data: (SC_DASHBOARD.GlobalVariables.GlobalFilter),
                    success: function (response) {
                        $sc_bugger_jq("#card-container").removeClass("sc_bugger-disabled");
                        $sc_bugger_jq("#issue-list-card-details").html("");
                        $sc_bugger_jq("#issue-list-card-details").html(response);

                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');

                        // Set focuss
                        $sc_bugger_jq("#issue-list-card-details")[0].scrollIntoView();
                    },
                    error: function (response) {
                        console.log(response);
                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    }


                });
            },
            SaveError: function (inputModel) {
                $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $sc_bugger_jq.ajax({
                    url: SC_DASHBOARD.Config.SaveErrorUrl,
                    type: "post",
                    //async: false,
                    //processData: false,
                    data: (inputModel),
                    success: function (response) {
                        if (response.IsSuccess) {
                           // SC_DASHBOARD.ApiMethods.GetError();
                            $sc_bugger_jq('.sc_bugger-element-modal.error-detail-modal').modal('hide');
                        }

                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    },
                    error: function (response) {
                        alert(error);
                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                    }


                });
            },
            GetErrorIds: function () {
                $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $sc_bugger_jq.ajax({
                    url: SC_DASHBOARD.Config.GetErrorIdsUrl,
                    type: "post",
                    async: false,
                    data: (SC_DASHBOARD.GlobalVariables.GlobalFilter),
                    success: function (response) {
                        SC_DASHBOARD.Issues.AllIds = response;
                        $sc_bugger_jq('#filter-error-list').empty();

                        if (SC_DASHBOARD.Issues.AllIds.length > 0) {
                            $sc_bugger_jq('#filter-error-list').append('<option selected="selected" value="">Search issue by Id.</option>');

                            $sc_bugger_jq.each(SC_DASHBOARD.Issues.AllIds, function (key, value) {
                                $sc_bugger_jq('#filter-error-list')
                                    .append($sc_bugger_jq("<option></option>")
                                        .attr("value", value.ErrorId)
                                        .text(value.ErrorId));
                            });

                            //Pagination calculations
                            SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalRecords = SC_DASHBOARD.Issues.AllIds.length;
                            SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalNoOfPages = Math.ceil(SC_DASHBOARD.GlobalVariables.GlobalFilter.TotalRecords / SC_DASHBOARD.GlobalVariables.GlobalFilter.PageSize); 
                        }
                        else {
                            $sc_bugger_jq('#filter-error-list').append('<option selected="selected">No values found.</option>')
                        }

                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');

                    },
                    error: function (response) {
                        $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                        console.log(response);
                    }
                });
            }
            ,
            GetExcelReport: function (elementThis) {
                $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('show');
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
                //$sc_bugger_jq.each(SERVER.authorization(), function (k, v) {
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

                    $sc_bugger_jq('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                };
                xhr.send(JSON.stringify(SC_DASHBOARD.GlobalVariables.GlobalFilter));


            },
        }
    };
}());

SC_DASHBOARD.Init();



