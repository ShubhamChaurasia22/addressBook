(function getData() {
    $.ajax({
        url: 'http://localhost:3000/user',
        type: 'GET',
        dataType: 'json'
    })
    .done(function (response) {
        $.getJSON("./API/db.json", function(posts) {
            posts.user.forEach(items => {
                document.querySelector('tbody').innerHTML += `
                    <tr>
                        <td class="w-25"><input type="text" id="name-${items.id}" value="${items.name}" name="name" class="outline"/></td>
                        <td class="w-25"><input type="text" id="last-${items.id}" value="${items.last}" name="last" class="outline"/></td>
                        <td class="w-25"><input type="tel" id="tel-${items.id}" value="${items.Contact}" name="contact" class="outline"/></td>
                        <td class="w-25">
                            <button id="edit-${items.id}" class="button-click btn btn-outline-primary" onclick="editCol('${items.id}')">Edit</button>
                            <button id="save-${items.id}" class="button-click btn btn-outline-success d-none" onclick="updateCol('${items.id}')">Save</button>
                            <button class="button-click btn btn-outline-danger" onclick="deleteCol('${items.id}')" >Delete</button>
                        </td>
                    </tr>
                `;
            });
        });
    })
    .fail(function (e) {
        console.log(e);
    })
})();
    
function deleteCol(id) {
    $.ajax({
        url: 'http://localhost:3000/user/'+id,
        method: 'DELETE',
        success: function () {
            alert('record deleted');
        },
        error: function () {
            alert('error deleting record');
        }

    })
}
    
function editCol(id) {
    var getID = id;
    $.ajax({
        url: 'http://localhost:3000/user/'+getID,
        method: 'GET',
        dataType: 'json',
        success: function (data) {
            $("#edit-"+getID).addClass('d-none');
            $('#save-'+getID).removeClass('d-none');
            $('#name-'+getID).removeClass('outline');
            $('#last-'+getID).removeClass('outline');
            $('#tel-'+getID).removeClass('outline');
            $('#name-'+getID).val(data.name);
            $('#last-'+getID).val(data.last);
            $('#tel-'+getID).val(data.Contact);
        },
        error: function (e) {
            console.log(e);
        }
    })
}

function updateCol(id) {
    var data = {};
    var name = $('#name-'+id).val();
    var last = $('#last-'+id).val();
    var contact = $('#tel-'+id).val(); 

    var regex_name = new RegExp("^[a-zA-Z]*$").test(name);
    var regex_last = new RegExp("^[a-zA-Z]*$").test(last);
    var regex_contact = new RegExp("^[6-9]{1}[0-9]{9}$").test(contact);

    // inputVal(id);

    if(name.length > 0 && last.length > 0 && contact.length > 0) {
        if(regex_name && regex_last && regex_contact) {
            data.name = name;
            data.last = last;
            data.Contact = contact;
            var dataObj = JSON.stringify(data);
            $("#save-"+id).addClass('d-none');
            $("#edit-"+id).removeClass('d-none');
            $('#name-'+id).addClass('outline');
            $('#last-'+id).addClass('outline');
            $('#tel-'+id).addClass('outline');
            $.ajax({
            url: "http://localhost:3000/user/"+id,
            method: "PUT",
            data: dataObj,
            contentType: 'application/json; charset=utf-8',
            success: function (){
                alert('Successfully updated');
            },
            error: function (e) {
                console.log(e);
            }
            })
        } else {
            alert("Fill Right Information");
            var check = {};
            check.name = regex_name;
            check.last = regex_last;
            check.contact = regex_contact;

            Object.entries(check).forEach(([key, value]) => {
                if(`${key}` === 'name'){
                    if(`${value}` === 'true'){
                        $('#name-'+id).removeClass('error-outline');
                    }else {
                        $('#name-'+id).addClass('error-outline');
                    }
                }else if(`${key}` === 'last'){
                    if(`${value}` === 'true'){
                        $('#last-'+id).removeClass('error-outline');
                    }else {
                        $('#last-'+id).addClass('error-outline');
                    }
                } else if(`${key}` === 'contact'){
                    if(`${value}` === 'true'){
                        $('#tel-'+id).removeClass('error-outline');
                    }else {
                        $('#tel-'+id).addClass('error-outline');
                    }
                }else {
                    return 0;
                }
            });
        }
    }else {
        alert("Fill the Information");
    }
}

function addCol() {
    $.ajax({
        url: "./",
        success: function (){
            $('.address_popup').removeClass('d-none');
            $('.address_heading').addClass('blur_bg');
            $('.address_details').addClass('blur_bg');
            $('.button-click').attr("disabled", "disabled");
        },
        error: function (e) {
            console.log(e);
        }
    })
}

function cancelPopUp() {
    $.ajax({
        url: "./",
        success: function (){
            $('.address_popup').addClass('d-none');
            $('.address_heading').removeClass('blur_bg');
            $('.address_details').removeClass('blur_bg');
            $('.button-click').removeAttr('disabled');
        },
        error: function (e) {
            console.log(e);
        }
    })
}

function submitPopUp() {
    var data = {};
    var name = $('#form_name').val();
    var last = $('#form_last').val();
    var contact = $('#form_contact').val(); 

    data.name = name;
    data.last = last;
    data.Contact = contact;
    var dataObj = JSON.stringify(data);
    var regex_name = new RegExp("^[a-zA-Z]*$").test(name);
    var regex_last = new RegExp("^[a-zA-Z]*$").test(last);
    var regex_contact = new RegExp("^[6-9]{1}[0-9]{9}$").test(contact);
    if(name.length > 0 && last.length > 0 && contact.length > 0) {
        if(regex_name && regex_last && regex_contact) {
            $.ajax({
                url: "http://localhost:3000/user",
                method: "POST",
                data: dataObj,
                contentType: 'application/json; charset=utf-8',
                success: function(){
                    $('.address_popup').addClass('d-none');
                    alert("Successfull Added");
                },
                error: function (e) {
                    console.log(e);
                }
            });
        } else {
            alert("Fill Right Information");
        }
    }else {
        alert("Fill the Information");
    }
}

function validation() {
    jQuery.validator.addMethod("lettersonly", function(value, element) {
        return this.optional(element) || /^[a-zA-Z]*$/i.test(value);
    }, "Letters only please");

    jQuery.validator.addMethod("number", function(value, element) {
        return this.optional(element) || /^[6-9]{1}[0-9]{9}$/i.test(value);
    }, "Phone number must be starting with 6 or 7 or 9"); 


    $("#modal-form").validate({
        rules: {
            name: {
                required: true,
                maxlength: 15,
                lettersonly: true,
            },
            last: {
                required: true,
                maxlength: 15,
                lettersonly: true,
            },
            contact: {
                required: true,
                number: true,
            }
        },
        highlight: function(element) {
            $(element).addClass("is-invalid");
        },
        unhighlight: function(element) {
            $(element).removeClass("is-invalid");
        },
        messages: {
            name: {
                required: "First Name field must be filled",
                maxlength: "First Name field must be only 15 characters",
                lettersonly: "Letters only",
            },
            last: {
                required: "Last Name field must be filled",
                minlength: "Last Name field must be only 15 characters",
                lettersonly: "Letters only",
            },
            contact: {
                required: "Contact field must be filled",
                number: "Only numbers allowed",
                minlength: "Number field must be at least 10 characters",
                maxlength: "Number field must be at most 10 characters",
            }
        }
    });
    submitPopUp();
}

// function inputVal(id) {
//     $('#name-'+id).validate({
//         rules: {
//             update_name: {
//                 required: true,
//                 maxlength: '15',
//                 add: {
//                     regularExpression: "^[a-zA-Z]*$"
//                 }
//             }
//         },  
//         messages: {
//             update_name: {
//                 required: "Please check your input."
//             }
//         }  
//     });
//     $('#last-'+id).validate({
//         rules: {
//             update_last: {
//                 required: true,
//                 maxlength: '15',
//                 add: {
//                     regularExpression: "^[a-zA-Z]*$"
//                 }
//             }
//         },  
//         messages: {
//             update_name: {
//                 required: "Please check your input."
//             }
//         }  
//     });
//     $('#tel-'+id).validate({
//         rules: {
//             update_contact: {
//                 required: true,
//                 number: true,
//                 maxlength: '10',
//                 add: {
//                     regularExpression: "^[6-9]{1}[0-9]{9}$"
//                 }
//             }
//         },  
//         messages: {
//             update_name: {
//                 required: "Please check your input."
//             }
//         }  
//     })
// }
