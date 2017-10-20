$(document).ready(function(){

    let type = '';

    $('a.list-group-item.list-group-item-action').on('click', function(){

        let id = $(this).attr('id');
        let url = '';
        switch (parseInt(id)){
            case 1:
                url = "/card/infor-user";
                break;
            case 2:
                url = '../card/withdrawal';
                break;
            case 3:
                url = '/card/intra-transfer';
                break;
            case 4:
                url = '/card/interbank-transfer';
                break;
            case 5:
                url = '/card/history';
                break;
            default:
                return;
                break;
        }

        console.log(url);
        $('.right-main-body').load(url);
    });

    $('body').on('click','a.dropdown-item', function(){

        let val = $(this).html(); //get value currency which user wanna withdrawal
        type = val;
        let currency = 'Please waitting....';
        let available_balance = $('.available_balance').html();
        let withdraw_money = $('#withdraw_money');
        switch(val){

            case '1 triệu':
                currency = '1,000,000.00';
                withdraw_money.val(1000000);
                break;
            case '2 triệu':
                currency = '2,000,000.00';
                withdraw_money.val(2000000);
                break;
            case '5 triệu':
                currency = '5,000,000.00';
                withdraw_money.val(5000000);
                break;
            case 'Giá trị khác':
                $('#another_val').prop('hidden', false);
                $('#another_val').autoNumeric('init');
                $('#another_val').attr('data-v-min', '50000');
                alert('Vui lòng nhập số tiền muốn rút...(bội số của 50,000)');
                break;
            default:
                break;
        }

        $('.withdraw_money').html(currency);
    });

    $('body').on('submit','#form_withdrawal', function(){

        let withdraw_money = $('#withdraw_money');
        let available_balance = $('strong.available_balance').html();

        switch(type){

            case '1 triệu':
                withdraw_money.val(1000000);
                break;
            case '2 triệu':
                withdraw_money.val(2000000);
                break;
            case '5 triệu':
                withdraw_money.val(5000000);
                break;
            case 'Giá trị khác':

                let another_val =  $('#another_val').autoNumeric('get');

                if(another_val % 50000 !== 0 || another_val < 50000)
                {
                    alert('Số tiền rút phải là bội số của 50,000');
                    return false;
                }
                withdraw_money.val(another_val);
                break;
            default:
                withdraw_money.val('');
                break;
        }

        if(parseInt(withdraw_money.val()) > parseInt(available_balance))
        {

            alert('Số tiền không đủ. Vui lòng chọn gía trị khác!');
            return false;
        }

        if(withdraw_money.val() === ''){

            alert('Vui lòng chọn số tiền muốn rút!');
            return false;
        }

    });
    
    $('body').on('focus', '#transfer_money', function(){

        $(this).autoNumeric('init');
    });
    
    $('body').on('submit', '#form_intra-transfer', function () {


        let available_balance = $('strong.available_balance').html();
        let transfer_money = $('#transfer_money').autoNumeric('get');
        let receiver = $('#receiver').val();

        if(parseInt(transfer_money) > parseInt(available_balance))
        {
            alert('Số tiền không đủ. Vui lòng chọn gía trị khác!');
            return false;
        }
        if(transfer_money % 50000 !== 0 || transfer_money < 50000)
        {
            alert('Số tiền rút phải là bội số của 50,000');
            return false;
        }

        $('#transfer_money').val(transfer_money);

        return confirm('Phí dịch vụ là 3300. Quý khách có muốn tiếp tục giao dịch?');

    });

    $('body').on('submit', '#form_interbank-transfer', function () {


        let available_balance = $('strong.available_balance').html();
        let transfer_money = $('#transfer_money').autoNumeric('get');
        let receiver = $('#receiver').val();

        if(parseInt(transfer_money) > parseInt(available_balance))
        {
            alert('Số tiền không đủ. Vui lòng chọn gía trị khác!');
            return false;
        }
        if(transfer_money % 50000 !== 0 || transfer_money < 50000)
        {
            alert('Số tiền rút phải là bội số của 50,000');
            return false;
        }

        $('#transfer_money').val(transfer_money);

        return confirm('Phí dịch vụ là 11000. Quý khách có muốn tiếp tục giao dịch?');

    });

    $('body').on('focus', '#date_start', function(){

        $('#date_start').datepicker({
            maxDate: new Date(),
        });
    });

    $('body').on('focus', '#date_end', function() {

        $('#date_end').datepicker({
            maxDate: new Date(),
        });
    });

    $('body').on('submit', '#form_history', function(){


        let date_start = Date.parse($('#date_start').datepicker('getDate'));
        let date_end = Date.parse($('#date_end').datepicker('getDate'));

        if(date_start > date_end){

            alert('Ngày kết thúc phải lớn hơn ngày bắt đầu!');
            return false;
        }

        const days = (date_end - date_start) / (1000 * 60 * 60 * 24);

        if(days > 60){
            alert('Khoảng cách tối đa là 60 ngày!');
            return false;
        }


        $.ajax({
            url: '/card/history',
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                date_start: $('#date_start').val(),
                date_end: $('#date_end').val()}),
            success: function(data) {
                $('#tbody_history').empty();
                for(i = 0; i < data.length; i++){

                    let tr = '<tr>' +
                        '<td>'+ data[i].id +'</td>' +
                        '<td>'+ data[i].content +'</td>' +
                        '<td>'+ data[i].value +'</td>' +
                        '<td>'+ moment.unix(data[i].date).format("MM/DD/YYYY H:mm") +'</td>' +
                        '</tr>';
                    $('#tbody_history').append(tr);
                }
            },
            error: function (error) {
            }
        });

        return false;

    });

    $('body').on('keyup', '#another_val', function(){

        let val = $('#another_val').val();
        $('strong.withdraw_money').html(val);
    });
});