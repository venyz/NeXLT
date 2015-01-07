var Manager, prodToggle = true, releaseToggle = false, firstQuery = true;

function toggleProd() {
    //toggles ascending or descending prod sort
    prodToggle = !prodToggle;
    managerMaker("prod");
}

function toggleRelease() {
    //toggles ascending or descending release sort
    releaseToggle = !releaseToggle;
    managerMaker("release");
}

function startManager() {
    //keeps search from executing if people are trying to just set parameters
    if ($('#sLangSearch').val().length != 0){
        firstQuery = false;
        managerMaker();
    } else {
        //alert('please enter a value in the source language field');
        $('#alertBox').stop().show().css({opacity:1}).fadeOut(3000);
    }

}



function managerMaker(whichSort) {

	if (!(firstQuery)) {
        //console.log("Hello from MM!");
        Manager.init();
	    var langVal = $('#langSelect').val(), langQ = langVal + ':[* TO *]', searchIn = $('#sLangSearch').val(), rowsReturned = $('#numItemsSelect').val();
	    var searchVal = 'enu:"' + searchIn + '"';

        // var searchVal;
        //if more than one word was searched, split into strings
        // var res = searchIn.split(" ");
        // if (res.length <=1) {
        //     searchVal = 'enu:' + searchIn;
        // } else {
        //     searchVal = 'enu:';
        //     for (i = 0; i<res.length; i++) {
        //         searchVal += res[i];
        //         if (i < res.length - 1) {searchVal += ' OR ';}
        //     }
        // }

        console.log("searchVal = " + searchVal);

        Manager.store.addByValue('q', langQ);
        Manager.store.remove('fq');
	    Manager.store.addByValue('fq', searchVal);
        if ($('#tLangSearch').val() != "") {
            Manager.store.addByValue('fq', langVal + ':"' + $('#tLangSearch').val() + '"');
        }

        var prodSelect = 'product:', ps = $('#prodSelect').val();
        if (ps != "null") {
            //needs to be refactored to handle multiple product selection
            if (ps.length == 1) {
                prodSelect += '"' + $('#prodSelect').val() + '"';
            
            } else {
                prodSelect += '(';
                for (i = 0; i < ps.length; i++) {
                    prodSelect += '"' + ps[i] + '"';
                    prodSelect += (i < ps.length - 1 ? ' OR ':'');
                }
                prodSelect += ')';
            }
        }
        console.log("prodSelect: " + prodSelect);
        Manager.store.addByValue('fq', prodSelect);

        //filter by resource
        if ($('#filterByResource').val() != "null") {
            var fbr = 'resource:' + $('#filterByResource').val();
            Manager.store.addByValue('fq', fbr);
        }

        //sort by product or release
	    switch (whichSort) {
            case "prod":
                var sortVar = "product " + (prodToggle ? "asc" : "desc");
                break;
            case "release":
                var sortVar = "release " + (releaseToggle ? "asc" : "desc");
                //flipflop("#release");
                break;
            default:
                break;
        }
        //console.log("sortVar: " + sortVar);
        if (whichSort == null) {
            sortVar = "enu asc";
        }
        Manager.store.addByValue('sort', sortVar);

        Manager.store.addByValue('rows', rowsReturned);
	    Manager.store.addByValue('fl', 'product enu resource release ' + langVal);
	    Manager.doRequest();
        //firstQuery = true;
    }
}


(function ($) {

  $(function () {
    Manager = new AjaxSolr.Manager({
      solrUrl: 'http://ls-lb-solr-stg-1645894167.us-west-1.elb.amazonaws.com:8983/solr/'
    });

    Manager.addWidget(new AjaxSolr.ResultWidget({
    	id:'result',
    	target:'#docs'
    }));

    Manager.addWidget(new AjaxSolr.PagerWidget({
    	id: 'pager',
    	target: '#pager',
    	prevLabel: 'Previous',
    	nextLabel: 'Next',
    	innerWindow: 1,
    	renderHeader: function (perPage, offset, total) {
    		$('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
    		$('#rResults').text("Total results: " + total);
            $('#rResults').show();
    	}

    }));
  });

})(jQuery);

