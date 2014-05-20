var mode = "&&";
$(function() {

	$('input:radio[name="appendMod"]').change(function() {
		if ($(this).val() == 'AND') {
			mode = "&&";
		} else {
			mode = "||";
		}
		updateCount();
	});

	$.getJSON("/gettags", function(data) {
		for (var i = 0; i < data.length; i++) {
			$("#tagContainer").append(
					'<li><input name="tag" type="checkbox" value="' + data[i]
							+ '" />' + data[i] + '</li>');
		}

		$("input:checkbox[name=tag]").change(function() {
			updateCount();
		});
	});

	$('#createBook').click(function() {
		var tagString = "";
		var firstRound = true;
		$("input:checkbox[name=tag]:checked").each(function() {
			if (firstRound) {
				tagString += $(this).val();
				firstRound = false;
			} else {
				tagString += " " + mode + " " + $(this).val();
			}
		});
		window.open("/getbook/" + tagString, "_blank");
	});

});

function updateCount() {
	var tagString = "";
	var firstRound = true;
	$("input:checkbox[name=tag]:checked").each(function() {
		if (firstRound) {
			tagString += $(this).val();
			firstRound = false;
		} else {
			tagString += " " + mode + " " + $(this).val();
		}
	});
	$.getJSON("/getcount/" + tagString, function(data) {
		$("#docCount").html(data.count);
	});
}
