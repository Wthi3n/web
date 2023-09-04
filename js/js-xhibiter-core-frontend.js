var XHIBITER_CORE = XHIBITER_CORE || {};

(function ($) {
	XHIBITER_CORE.initialize = {
		init: function () {
			XHIBITER_CORE.initialize.socialShare();
		},

		socialShare: function () {
			var $socials = $(".entry__share-social");
			var $stickyCol = $(".sticky-col");
			var width = window.innerWidth;
			var height = window.innerHeight;

			if (!$socials) {
				return;
			}

			// Sticky Socials
			if ($stickyCol.length > 0) {
				$stickyCol.stick_in_parent({
					offset_top: 100,
				});
			}

			$socials.on("click", function (e) {
				if (700 < width && 500 < height) {
					let url = this.getAttribute("href");
					window.open(
						url,
						"",
						"width=700, height=500,left=" +
							(width / 2 - 350) +
							",top=" +
							(height / 2 - 250) +
							",scrollbars=yes"
					);
					e.preventDefault();
				}
			});
		},
	};

	XHIBITER_CORE.documentOnReady = {
		init: function () {
			XHIBITER_CORE.initialize.init();
		},
	};

	XHIBITER_CORE.windowOnResize = {
		init: function () {

		},
	};

	document.addEventListener(
		"DOMContentLoaded",
		XHIBITER_CORE.documentOnReady.init
	);
	window.addEventListener("resize", XHIBITER_CORE.windowOnResize.init);
})(jQuery);
