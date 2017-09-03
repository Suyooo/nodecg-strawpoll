$(document).ready(()=>{
	$('#strawpoll-show').click(function() { showPolls(); });
	$('#strawpoll-hide').click(function() { nodecg.sendMessage('strawpoll-hide','');});

	function showPolls() {
		nodecg.sendMessage('strawpoll-show',{id: $('#strawpoll-id').val(), mode: $('input[name="strawpoll-mode"]:checked').val()});
	}
});
