// We use an "Immediate Function" to initialize the application to avoid leaving anything behind in the global scope
(function () {

    /* ---------------------------------- Local Variables ---------------------------------- */
	var slider = new PageSlider($('body'));
	var homeTpl = Handlebars.compile($("#home-tpl").html());
	var employeeLiTpl = Handlebars.compile($("#employee-li-tpl").html());
	var employeeTpl = Handlebars.compile($("#employee-tpl").html());
	var detailsURL = /^#employees\/(\d{1,})/;	
	var adapter = new MemoryAdapter();
	adapter.initialize().done(function () {
			route();
	});	

    /* --------------------------------- Event Registration -------------------------------- */
	document.addEventListener('deviceready', function () {
		if (navigator.notification) { // Override default HTML alert
			window.alert = function (message) {
				navigator.notification.alert(
					message,    // message
					null,       // callback
					"Workshop", // title
					'OK'        // buttonName
				);
			};
			FastClick.attach(document.body);
		}
	}, false);
	
	$(window).on('hashchange', route);
    
	/* ---------------------------------- Local Functions ---------------------------------- */
	function route() {
		var hash = window.location.hash;
		if (!hash) {
			slider.slidePage(new HomeView(adapter, homeTpl, employeeLiTpl).render().el);
			return;
		}
		var match = hash.match(detailsURL);
		if (match) {
			adapter.findById(Number(match[1])).done(function(employee) {
				slider.slidePage(new EmployeeView(adapter, employeeTpl, employee).render().el);
			});
		}
	}

}());