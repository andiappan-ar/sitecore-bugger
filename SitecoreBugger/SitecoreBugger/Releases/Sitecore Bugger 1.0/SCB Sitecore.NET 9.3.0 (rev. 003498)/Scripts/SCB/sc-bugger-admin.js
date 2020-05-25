var actions = `<a class="add" title="Add" data-toggle="tooltip"><i class="fa fa-plus-circle"></i></a>
                            <a class="edit" title="Edit" data-toggle="tooltip"><i
                                    class="fa fa-pencil"></i></a>`;

        var actionsDelete = `<a class="delete" title="Delete" data-toggle="tooltip"><i
                                    class="fa fa-trash-o"></i></a>`;

        var submittedData = [];

        $(document).ready(function () {
            $('[data-toggle="tooltip"]').tooltip();

            // Append table with add row form on add new button click
            $(".add-new").click(function () {
                $(this).attr("disabled", "disabled");
                var index = $("table tbody tr:last-child").index();

                var tempDataItem = {
                        ProjectId: "",
                    IsbuggerActivated: false,
                        ProjectName: "",
                        ProjectUrl: ""
                };

                var masterSiteDefintionDD = $("#master-sitedefintion-dd").clone().removeClass('sc_bugger-hide').prop('outerHTML');

                var _row = '<tr>' +
                        '<td type="text"><input disabled type="text" class="p-id form-control" name="pid" id="pid" value="' + tempDataItem.ProjectId + '"></td>' +                       
                    '<td type="text"><input  type="text" class="p-pname form-control" name="pname" id="pname" value="' + tempDataItem.ProjectName + '"></td>' +
                    '<td type="select">' + masterSiteDefintionDD + '</td>' +
                    '<td type="textarea"><textarea  type="text" class="p-url form-control" name="purl" id="purl" >' + tempDataItem.ProjectUrl + '</textarea>' +
                    '<td type="checkbox"><input  type="checkbox" class="p-isactive form-control" name="activate" id="activate"/></td>' +
                    '<td type="checkbox"><input disabled type="checkbox" class="p-isarchived form-control" name="activate" id="activate"/></td>' +
                    '<td></td>'+
                        '<td>' + actions +actionsDelete+ '</td>' +
                        '</tr>';

               
                $("table").append(_row);
                $("table tbody tr").eq(index + 1).find(".add, .edit").toggle();
                $('[data-toggle="tooltip"]').tooltip();
            });
            // Add row on add button click
            $(document).on("click", ".add", function () {
                var empty = false;
                var input = $(this).parents("tr").find('input,textarea').not(".p-id");

                input.each(function () {
                    if (!$(this).val()) {
                        $(this).addClass("error");
                        empty = true;
                    } else {
                        $(this).removeClass("error");
                    }
                });
                $(this).parents("tr").find(".error").first().focus();

                if (!empty) {
                    $(this).parents("tr").find('input,textarea').each(function () {
                        $(this).attr("disabled", true);
                    });

                    $(this).parents("tr").find(".add, .edit").toggle();
                    $(".add-new,#submit-project").removeAttr("disabled");

                    ModifyCleanUrl($(this));

                    //Add submittedData
                    var tempData = {
                        ProjectId: $(this).parents("tr").find('.p-id').val(),
                        IsbuggerActivated: $(this).parents("tr").find('.p-isactive').prop("checked"),
                        ProjectName: $(this).parents("tr").find('.p-pname').val(),
                        SiteDefintionName: $(this).parents("tr").find('.p-sname').val(),
                        Url: $(this).parents("tr").find('.p-url').val(),
                        IsArchieved: $(this).parents("tr").find('.p-isarchived').prop("checked"),
                        Type: null
                    };

                    var result = RemoveProjectByProjectName(submittedData, tempData.ProjectName);
                    submittedData = result.CleanedResult;

                    tempData.Type = ($(this).hasClass("already-add")) ? "update" : "add";
                                      
                    submittedData.push(tempData);                  
                    
                }
                else {
                    $(".add-new,#submit-project").attr("disabled", true);
                }
            });

            // Archieve project
            $(document).on("click", ".archieve-project", function () {
                var r = confirm(`***** CRITICAL **********\n\n This operation is very very expensive operation.\nBefore you do this please see the documentation.\nThis may take few minutes.\nOnce you want to close the project activities then proceed.`);
                if (r == true) {

                    var empty = false;
                    var input = $(this).parents("tr").find('input,textarea').not(".p-id");

                    input.each(function () {
                        if (!$(this).val()) {
                            $(this).addClass("error");
                            empty = true;
                        } else {
                            $(this).removeClass("error");
                        }
                    });
                    $(this).parents("tr").find(".error").first().focus();

                    if (!empty) {
                        $(this).parents("tr").find('input,textarea').each(function () {
                            $(this).attr("disabled", true);
                        });

                        $(this).parents("tr").find(".add, .edit").toggle();
                        $(".add-new,#submit-project").removeAttr("disabled");

                        ModifyCleanUrl($(this));

                        //Get archieved submittedData
                        var tempData = {
                            ProjectId: $(this).parents("tr").find('.p-id').val(),
                            IsbuggerActivated: $(this).parents("tr").find('.p-isactive').prop("checked"),
                            ProjectName: $(this).parents("tr").find('.p-pname').val(),
                            Url: $(this).parents("tr").find('.p-url').val(),
                            IsArchieved: $(this).parents("tr").find('.p-isarchived').prop("checked"),
                            Type: null
                        };

                        $('.sc_bugger-element #pleaseWaitDialog').modal('show');

                        $.ajax({
                            url: "/sc-bugger/SCBDashBoard/ArchieveProject",
                            type: "post",
                            async: false,
                            //contentType: "application/json; charset=utf-8",
                            data: (tempData),
                            success: function (response) {

                                $('.sc_bugger-element #pleaseWaitDialog').modal('hide');

                                $("table tbody").html("");
                                $("table tbody").html(response);

                                submittedData = [];

                            },
                            error: function (response) {
                                $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                                console.log(response);
                            }
                        });

                    }
                    else {
                        $(".add-new,#submit-project").attr("disabled", true);
                    }


                } else {

                }

            
            });

            function ModifyCleanUrl(currentElement) {
                if (currentElement.parents("tr").find('.p-url').val() != "") {
                    var modifiedProjUrl = currentElement.parents("tr").find('.p-url').val().replace(/\/\s*$/, "").trim();
                    modifiedProjUrl = modifiedProjUrl + "/";
                    currentElement.parents("tr").find('.p-url').val(modifiedProjUrl);
                }                
            }

            function isValidURL(str) {
                var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
                    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
                    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
                    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
                    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
                    '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
                return pattern.test(str);
            }

            //ProjectName focusout event
            $(document).on('focusout', '.p-url', function () {
                var currentElement = $(this);
                ModifyCleanUrl($(this));

                // Empty check
                if (currentElement.val() != "") {
                    // Valid Url check
                    if (isValidURL(currentElement.val())) {
                        $.each($(".p-url").not(this), function (i, item) {
                            if ($(item).val() == currentElement.val()) {
                                alert("Project url '" + $(item).val() + "' already available. Please choose different url.");                                
                                currentElement.addClass("error");
                                return false;
                            }
                            else {
                                currentElement.removeClass("error");
                            }
                        });
                    }
                    else {
                        alert("Please enter valid Url.");                       
                        currentElement.addClass("error");
                    }
                   
                }                 
               
            });

            //ProjectName focusout event
            $(document).on('focusout', '.p-pname', function () {
                var currentElement = $(this);              

                if (currentElement.val() != "") {
                    $.each($(".p-pname").not(this), function (i, item) {
                        if ($(item).val() == currentElement.val()) {
                            alert("Project name '" + $(item).val() + "' already available. Please choose different name.");
                            currentElement.val("");
                            currentElement.addClass("error");
                            return false;
                        }
                        else {
                            currentElement.removeClass("error");
                        }
                    });
                }

            });
           
            // Edit row on edit button click
            $(document).on("click", ".edit", function () {
                $(this).parents("tr").find("td:not(:last-child)").each(function () {
                    $(this).children().not(".p-id").not(".p-isarchived").removeAttr("disabled");
                });
                $(this).parents("tr").find(".add, .edit").toggle();
                $(".add-new").attr("disabled", "disabled");
            });

            // Delete row on delete button click
            $(document).on("click", ".delete", function () {
                var r = confirm("Do you want to really delete the project?\nThis action cannot be undo.");
                if (r == true) {
                    $(this).parents("tr").remove();
                    $(".add-new,#submit-project").removeAttr("disabled");

                    ModifyCleanUrl($(this));

                    var tempData = {
                        ProjectId: $(this).parents("tr").find('.p-id').val(),
                        IsbuggerActivated: $(this).parents("tr").find('.p-isactive').prop("checked"),
                        ProjectName: $(this).parents("tr").find('.p-pname').val(),
                        Url: $(this).parents("tr").find('.p-url').val(),
                        IsArchieved: $(this).parents("tr").find('.p-isarchived').prop("checked"),
                        Type:"delete"
                    };

                    var result = RemoveProjectByProjectName(submittedData, tempData.ProjectName);

                    submittedData = result.CleanedResult;

                    submittedData.push(tempData);
                   

                } else {

                }


            });

            $(document).on("click", "#submit-project", function () {

                $('.sc_bugger-element #pleaseWaitDialog').modal('show');
                $.ajax({
                    url: "/sc-bugger/SCBDashBoard/SaveProject",
                    type: "post",
                    async: false,
                    contentType: "application/json; charset=utf-8",
                    data: JSON.stringify(submittedData),
                    success: function (response) {                     

                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');

                        $("table tbody").html("");
                        $("table tbody").html(response);

                        submittedData = [];

                    },
                    error: function (response) {
                        $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                        console.log(response);
                    }
                });

            });

            function RemoveProjectByProjectName(data, key_ProjectName) {
                var result = {
                    CleanedResult : null,
                    isAlreadyPresent : false
                };

                var cleaned = [];
                var isAlreadyPresent = false;
                data.forEach(function (itm) {
                    if (itm.ProjectName != key_ProjectName) {
                        cleaned.push(itm);
                    }
                    else {
                        result.isAlreadyPresent = true;
                    }
                });

                result.CleanedResult = cleaned;

                return result;
            }


            $("#updatepassword-form").on("submit", function () {

                $('.sc_bugger-element #pleaseWaitDialog').modal('show');
                if ($("#Password").val() != "") {
                    $.ajax({
                        url: "/sc-bugger/SCBAccount/ResetPassword",
                        type: "post",
                        async: false,
                        contentType: "application/json; charset=utf-8",
                        data: JSON.stringify({ "UserId": $("#filter-a-user-id").val(), "PasswordHash": $("#Password").val() }),
                        success: function (response) {
                            if (response) {
                                $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                                alert("Password reset completed.");
                            }
                            else {
                                alert("Password reset failed.");
                            }

                        },
                        error: function (response) {
                            $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                            console.log(response);
                        }
                    });
                }
                $('.sc_bugger-element #pleaseWaitDialog').modal('hide');
                return false;
            });
          
        });