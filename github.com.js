var expanded = false;

$(".file:contains('spec/fixtures/vcr_cassettes')").remove();

function byAllMeansDoExpand() {
	if (expanded) return;
	expanded = true;
  var interval = setInterval(expand, 2000);
	var $throbber = $('<div style="width: 100%; height: 100%; background: rgba(199, 152, 56, 0.7); position: fixed; top: 0px; padding: 100px 0 0; text-align: center;"><img src="http://media.giphy.com/media/2FmmbTZMl6lQQ/giphy.gif" style="width: 28%; height: auto; background: rgba(199,86,152, 0.8); border: 30px solid rgba(86, 199, 133, 0.8); padding: 30px;"/></div>');

	$('body').append($throbber);

  function expand() {
      var expandPoints = $(".octicon.octicon-unfold");
      if (expandPoints.length > 0) {
				expandPoints.click();
			} else {
				clearInterval(interval);
				$throbber.remove();
			}
  }
}

var stack = [];

function vizChanges() {
	var winTop =  $('body').scrollTop();
	var winBottom = winTop + $(window).innerHeight();
	var $els = $('.blob-code-addition, .blob-code-deletion');
	return $els.filter(function() { var elTop = $(this).offset().top; return elTop > winTop && elTop < winBottom });
}

function lastVizChange() {
	return vizChanges().last();
}

function firstVizChange() {
	return vizChanges().first();
}

function scrollToNextViz() {
	var winTop =  $('body').scrollTop();
	var $els = $('.blob-code-addition, .blob-code-deletion');
	var $lastViz = lastVizChange();
	var lastVizIndex = $els.index($lastViz);
	var $nextViz = $els.eq(lastVizIndex + 1);

	stack.push(winTop);
	$('html,body').animate({ scrollTop: $nextViz.offset().top - 150 });
}

$(document).on('keyup', function(e) { 
	if (e.keyCode == 39) {
		e.stopPropagation();
		e.preventDefault();
		scrollToNextViz();
	} else if (e.keyCode == 37) {
		if (stack.length > 0) {
  		var winTop = stack.pop();
  		$('html,body').animate({scrollTop: winTop});
  		e.stopPropagation();
  		e.preventDefault();
		}
	} else if (e.keyCode == 88) {
		byAllMeansDoExpand();
		e.stopPropagation();
		e.preventDefault();
	}
})

$('.repo-list-item').each(function() {
	var $repo = $(this);
	var $repoLink = $repo.find('.repo-list-name a').first();
	var repoHref = $repoLink.attr('href');
	var dayOfWeekToday = new Date().toString().substr(0, 3)
	var compareDays = dayOfWeekToday === 'Mon' ? 3 : 1;
	var compareHref = repoHref + '/compare/master@{'+compareDays+'.day.ago}...master';
	var $compareLink = $('<a>daily diff</a>');
	var $programmingLanguageStat = $repo.find('.repo-list-stats').children().first();
	$compareLink.attr('href', compareHref).addClass('repo-list-stat-item');
	$programmingLanguageStat.after($compareLink);
});

$(window).on('scroll', function() {
	$('.file-header').attr('style', '');
	$('.file').attr('style', '');
	var $firstViz = firstVizChange();
	var $currentFile = $firstViz.parents('.file');
	var $fileHeader = $currentFile.find('.file-header');

	$fileHeader.css({
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100%',
		zIndex: '1'
	});

	$currentFile.css({
		boxShadow: 'rgb(255, 240, 90) 0px 0px 4px 2px'
	});
});

