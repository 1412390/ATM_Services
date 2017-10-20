const DOMAIN  = location.host;
$(document).ready(function () {

        //form Register
    $('#form_adduser').on('submit', function () {

        let password = $('#password').val();
        let cfm_password = $('#cfm_password').val();

        if(password !== cfm_password)
        {
          alert('Please check your password again!');
          return false;
        }

        let username = $('#username');
        let val_username = username.val().trim();
        let check = true;
        $.ajax({
            url: '/users/isUserExist',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({username: val_username}),
            success: function(data) {

                let count = data[0].count;

                if(count !== 0)
                {
                    console.log('This user is exist!');
                    check = false;
                }
            },
            error: function (error) {
            }
        });

        if(!check)
        {
            alert('This user is exist!');
            return false;
        }


    });
});


