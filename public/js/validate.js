$(document).ready(function(){
	$(".button_chagepassword").attr('disabled',true);
	
	$('#carouselHacked').carousel({ interval: 5000 });
	/** add comment **/	
	/*
	$('.comment_textbox').keypress(function(e) {
		if (e.which == 13) {
			if($(this).val().length > 0){
				var text_comment = $('.comment_textbox').val();
				$(".addperson_name").text("raulmobi");
				$(".addcomment").text(text_comment);
				$(".delete_comment").text("x");
				$(".comment_textbox").val("");
				//alert(text_comment);
			}else{
				alert("0");
			}	
		}
	}); */
	
	/** carousel**/
	
	$(".carousel_click").click(function(){
		//alert("hhh");
		
		$('.item').removeClass("active");
		$('#'+$(this).attr('id')+'content').addClass("active");
		//$('#'+$this.attr('id')+'content').show();
	});
	
	/** addlike and removelike **/	
	$(".add_heart_icon").click(function(){
		$(this).toggleClass("active");			
			var $this = $(this);
			var add_one = 1;
			var like = $('#'+$this.attr('id')+'content').text();		
			var added_like = parseInt(like.replace(',','')) + add_one;				
				if ($this.hasClass('active')) { 
					var addlike = $('#'+$this.attr('id')+'content').text(added_like.toLocaleString());
				} else {					
					var removelike = parseInt(like.replace(',','')) - add_one;
					$('#'+$this.attr('id')+'content').text(removelike.toLocaleString());
				}
		
	});	
	
	/** edit profile **/
	$(".list_edit").click(function(){
		$('.hide_profile').show();
		$('.list_edit').removeClass("active");
		$(this).addClass("active");
		$('.edit_detailprofiles').hide();
		$('#'+$(this).attr('id')+'content').show();		
		
	});
	
	$(".hideprofile").click(function(){
	 $('.hide_profile').hide();	
	});
	
	/** revoke**/
	$(".revokee").click(function(){		
		$('.revoke_popup_small').hide();
		$('#'+$(this).attr('id')+'content').show();
		$(".revokee").removeClass("disabled");
		$(this).addClass("disabled");
	});
	$(".revoke_cancel").click(function(){
		$('.revoke_popup_small').hide();
		$(".revokee").removeClass("disabled");
	});
	
	/** landing signup form **/
	$(".click_login").click(function(){		
		$(".hidedetails").hide();	
		$(".showdetails").show();	
	});
	$(".click_signup").click(function(){
		$(".showdetails").hide();	
		$(".hidedetails").show();
	});
	
	$(".signup_click").click(function(){
		
		if (!ValidateEmail($(".sign_validation").val())) {
            //alert("Invalid email address.");
			$(".sign_validation").siblings().removeClass("right"); 
			$(".sign_validation").siblings().addClass("error");
			$(".error_show").show();
			$(".error_email").show();
        }
        else {
            //alert("Valid email address.");
			$(".sign_validation").siblings().removeClass("error");
			$(".sign_validation").siblings().addClass("right");
			$(".error_show").hide();
			$(".error_email").hide();
        }		
		if($('.sign_validation1').val() != ''){
			$(".sign_validation1").siblings().removeClass("error");
			$(".sign_validation1").siblings().addClass("right");
			$(".error_show").hide();	
		 }else{
			$(".sign_validation1").siblings().removeClass("right"); 
			$(".sign_validation1").siblings().addClass("error"); 
			$(".error_show").show();	
		 }
		 if($('.sign_validation2').val() != ''){
			$(".sign_validation2").siblings().removeClass("error");
			$(".sign_validation2").siblings().addClass("right");
			$(".error_show").hide();	
		 }else{
			$(".sign_validation2").siblings().removeClass("right"); 
			$(".sign_validation2").siblings().addClass("error"); 
			$(".error_show").show();	
		 }
	});
	
	$(".login_click").click(function(){
		if($('.sign_validation3').val() != ''){
			$(".sign_validation3").siblings().removeClass("error");
			$(".sign_validation3").siblings().addClass("right");
			$(".error_show1").hide();			
		 }else{
			$(".sign_validation3").siblings().removeClass("right"); 
			$(".sign_validation3").siblings().addClass("error");
			$(".error_show1").show();
			
		 }
		 if($('.sign_validation4').val() != ''){
			$(".sign_validation4").siblings().removeClass("error");
			$(".sign_validation4").siblings().addClass("right");
			$(".error_show1").hide();			
		 }else{
			$(".sign_validation4").siblings().removeClass("right"); 
			$(".sign_validation4").siblings().addClass("error");
			$(".error_show1").show();
			
		 }
		
	});
	
	
	
 /**comment show**/
 $(".hide_commentts").click(function(){		
		$(this).hide();	
		$('#'+$(this).attr('id')+'content').show();	
    });
 
 });
 
 function ValidateEmail(email) {
        var expr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
        return expr.test(email);
    };
 
 function check_empty(){
	 if($('.text_password1').val() != '' && $('.text_password2').val() != ''){
		 if($('.text_password3').val() != '')
			 $(".button_chagepassword").attr('disabled',false);
	 }
	 
 else
	 $(".button_chagepassword").attr('disabled',true);
	 
 }