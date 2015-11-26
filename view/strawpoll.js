$(document).ready(function () {
	nodecg.listenFor('strawpoll-show', showPolls);
	nodecg.listenFor('strawpoll-hide', function(data) {
	  hidePolls(false);
	});

	var pollID = 0;
	var pollTO;
	var pollReq;
	var pollMode = 0;
	var firstvote = 0;

	function showPolls(data) {
		clearTimeout(pollTO);
		if (pollReq) pollReq.abort();
		pollID = data.id;
		pollMode = data.mode;
		firstvote = 0;
		if ($('#pollheader').css('height') != 0) hidePolls(true);
		$('#pollid').html(pollID);
		$('#pollbar1').css("width","0%");
		$('#pollbar2').css("width","0%");
		$('#pollbarcontainer').removeClass("pbar2");
		$.ajax({url: "http://"+nodecg.config.host+":"+nodecg.config.port+"/strawpoll/"+pollID, data: {}, dataType: "json",
			success: function(data){
				if(data){
					pollTO = setTimeout(updatePoll,250);
					$('#polltitle').html(data.title);
					$('#pollid').html(pollID);

					var options = new Array();
					var c = 0;
					var votesum = 0;
					var highest = 0;
					for (var i = 0; i < data.options.length; i++) {
						options[c] = {name: data.options[i], votes: data.votes[i]};
						votesum += data.votes[i];
						if (data.votes[i]>highest) highest=data.votes[i];
						c++;
					}
					options.sort(function(a, b) {
						return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
					});
					if (c<2) return;

					if (pollMode==0) {
						console.log("a");
						$('#pollheader').delay(100).transition({
							'top': '285px'
						}, 0, '');
						$('#pollbody-two').delay(100).transition({
							'top': '315px'
						}, 0, '');
						$('#pollbody-multi').delay(100).transition({
							'top': '315px'
						}, 0, '');
						$('#pollbody-two').delay(400).transition({
							'height': '100px',
							'padding-top': '15px',
							'padding-bottom': '15px'
						}, 500, 'ease-out');

						$('#pollteam1').text(options[0].name);
						$('#pollteam2').text(options[1].name);
						$('#pollvotes1').text(options[0].votes+" vote"+((options[0].votes!=1) ? "s" : ""));
						$('#pollvotes2').text(options[1].votes+" vote"+((options[1].votes!=1) ? "s" : ""));
						$('#pollvotes2').css("left",665-$('#pollvotes2').width()-$('#pollteam2').width());

						votesum = options[0].votes+options[1].votes;
						if (votesum>0) {
							var vote1pct = options[0].votes/votesum*100;
							$('#pollpct1').text(Math.round(vote1pct)+"%");
							$('#pollpct2').text((100-Math.round(vote1pct))+"%");
						} else {
							$('#pollpct1').text("0%");
							$('#pollpct2').text("0%");
						}
						$('#pollpct2').css("left",590-$('#pollpct2').width());

						$('#pollbar1').transition({
							'width': vote1pct+'%'
						  }, 250);
						if (firstvote==0 && votesum>0) {
							firstvote=1;
							$('#pollbar2').transition({
								'width': (100-vote1pct)+'%'
							  }, 250);
							setTimeout("$('#pollbar2').css(\"width\",\"0%\");$('#pollbarcontainer').addClass(\"pbar2\");",250);
						}
					} else {
						var h = (c*30);
						$('#pollheader').delay(100).transition({
							'top': (335-h/2)+'px'
						}, 0, '');
						$('#pollbody-two').delay(100).transition({
							'top': (365-h/2)+'px'
						}, 0, '');
						$('#pollbody-multi').delay(100).transition({
							'top': (365-h/2)+'px'
						}, 0, '');
						$('#pollbody-multi').delay(400).transition({
							'height': h+'px',
							'padding-top': '15px',
							'padding-bottom': '15px'
						}, 500, 'ease-out');

						$("#multicontainer").html("");
						for (var oc = 0; oc<c; oc++) {
							var option = $("<tr>",{id:"option"+oc});
							option.html('<td style="width:1%" class="mlabel">'+options[oc].name+'</td><td style="width:2%">&nbsp;</td><td><div class="mbarcontainer1"><div id="pollbar" class="pollbar-multi mbar1"></div><div id="pollpct" class="pollpct-multi">0%</div><div id="pollvotes" class="pollvotes-multi">0 votes</div></div></td>');
							$("#multicontainer").append(option);
						}
						for (var oc = 0; oc<c; oc++) {
							var percent = options[oc].votes/votesum*100;
							if (votesum==0) percent=0;
							$("#option"+oc+" #pollpct").text(Math.round(percent)+"%");
							$("#option"+oc+" #pollvotes").text(options[oc].votes+" vote"+((options[oc].votes!=1) ? "s" : ""));
							$("#option"+oc+" #pollbar").transition({
								'width': percent+'%'
							}, 250);
							if (options[oc].votes==highest && highest!=0) {
								$("#option"+oc).transition({
									'background-color': 'rgba(255,255,255,0.1)'
								}, 250);
							} else {
								$("#option"+oc).transition({
									'background-color': 'rgba(255,255,255,0)'
								}, 250);
							}
						}
					}
					$('#pollheader').transition({
						'height': '30px'
					  }, 350, 'ease-out');
				}
			},
			error: function(x,y,z) {
				alert(y);
				alert(z);
			}
		});
	}

	function updatePoll() {
		if(pollID==0) return;
		if (pollReq) pollReq.abort();
		pollReq = $.getJSON("http://"+nodecg.config.host+":"+nodecg.config.port+"/strawpoll/"+pollID,
			function(data){
				pollTO = setTimeout(updatePoll,250);
				if(data){
					var options = new Array();
					var c = 0;
					var votesum = 0;
					var highest = 0;
					for (var i = 0; i < data.options.length; i++) {
						options[c] = {name: data.options[i], votes: data.votes[i]};
						votesum += data.votes[i];
						if (data.votes[i]>highest) highest=data.votes[i];
						c++;
					}
					options.sort(function(a, b) {
						return ((a.name < b.name) ? -1 : ((a.name == b.name) ? 0 : 1));
					});
					if (c<2) return;

					if (pollMode==0) {
						$('#pollvotes1').html(options[0].votes+" vote"+((options[0].votes!=1) ? "s" : ""));
						$('#pollvotes2').html(options[1].votes+" vote"+((options[1].votes!=1) ? "s" : ""));
						$('#pollvotes2').css("left",665-$('#pollvotes2').width()-$('#pollteam2').width());

						votesum = options[0].votes+options[1].votes;
						if (votesum>0) {
							var vote1pct = options[0].votes/votesum*100;
							$('#pollpct1').html(Math.round(vote1pct)+"%");
							$('#pollpct2').html((100-Math.round(vote1pct))+"%");
						} else {
							$('#pollpct1').html("0%");
							$('#pollpct2').html("0%");
						}
						$('#pollpct2').css("left",590-$('#pollpct2').width());

						$('#pollbar1').transition({
							'width': vote1pct+'%'
						  }, 250);
						if (firstvote==0 && votesum>0) {
							firstvote=1;
							$('#pollbar2').transition({
								'width': (100-vote1pct)+'%'
							  }, 250);
							setTimeout("$('#pollbar2').css(\"width\",\"0%\");$('#pollbarcontainer').addClass(\"pbar2\");",250);
						}
					} else {
						for (var oc = 0; oc<c; oc++) {
							var percent = options[oc].votes/votesum*100;
							if (votesum==0) percent=0;
							$("#option"+oc+" #pollpct").text(Math.round(percent)+"%");
							$("#option"+oc+" #pollvotes").text(options[oc].votes+" vote"+((options[oc].votes!=1) ? "s" : ""));
							$("#option"+oc+" #pollbar").transition({
								'width': percent+'%'
							}, 250);
							if (options[oc].votes==highest && highest!=0) {
								$("#option"+oc).transition({
									'background-color': 'rgba(255,255,255,0.1)'
								}, 400);
							} else {
								$("#option"+oc).transition({
									'background-color': 'rgba(255,255,255,0)'
								}, 400);
							}
						}
					}
				}
			}
		);
	}

	function hidePolls(fast) {
		if (!fast) {
			clearTimeout(pollTO);
			pollID = 0;
		}
		$('#pollheader').delay((fast) ? 50 : 320).transition({
			'height': '0px'
		  }, (fast) ? 50 : 150, 'ease-out');
		$('#pollbody-two').transition({
			'height': '0px',
			'padding-top': '0px',
			'padding-bottom': '0px'
		}, (fast) ? 50 : 300, 'ease-out');
		$('#pollbody-multi').transition({
			'height': '0px',
			'padding-top': '0px',
			'padding-bottom': '0px'
		}, (fast) ? 50 : 300, 'ease-out');
	}
});
