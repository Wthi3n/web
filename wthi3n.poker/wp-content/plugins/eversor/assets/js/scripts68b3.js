(function ($) {
	"use strict";

	var $window = $(window);
	var $document = $(document);

	window.eversor = {};
	eversor.windowWidth = $window.width();

	$window.resize(function () {
		eversor.windowWidth = $window.width();
	});

	/* Check if in viewport
	-------------------------------------------------------*/
	eversor.isInViewport = {
		check: function ($element, callback, onlyOnce) {
			if ($element.length) {
				var offset =
					typeof $element.data("viewport-offset") !== "undefined"
						? $element.data("viewport-offset")
						: 0.15; // When item is 15% in the viewport
				var observer = new IntersectionObserver(
					function (entries) {
						// isIntersecting is true when element and viewport are overlapping
						// isIntersecting is false when element and viewport don't overlap
						if (entries[0].isIntersecting === true) {
							callback.call($element);
							// Stop watching the element when it's initialize
							if (onlyOnce !== false) {
								observer.disconnect();
							}
						}
					},
					{ threshold: [offset] }
				);
				observer.observe($element[0]);
			}
		},
	};

	function initStickySidebar() {
		var $stickyCol = $('.eversor-sticky-col');
		var $mainWrapper = $('.main-wrapper');
		if ($stickyCol.length) {
			$mainWrapper.css( { 'overflow': 'visible' });
		}
	}

	/* Load More
	-------------------------------------------------------*/
	function initLoadMore() {
		$(".eversor-load-more__button").on("click", function (e) {
			var button = $(this);

			if (!button.is(".clicked")) {
				button.addClass("clicked");

				e.preventDefault();
				e.stopPropagation();

				var widget = button
					.parent(".eversor-load-more")
					.siblings(".eversor-load-more-container");
				var widgetRow = widget.find(".row");
				var page = widget.data("page");
				var newPage = page + 1;
				var settings = widget.data("settings");

				var data = {
					action: "eversor_widget_load_more",
					security: eversor_elementor_data.ajax_nonce,
					data: {
						page: page,
						settings: settings,
					},
				};

				$.ajax({
					type: "POST",
					url: eversor_elementor_data.ajax_url,
					data: data,
					beforeSend: function (xhr) {
						button.addClass("eversor-loading");
						button.append('<div class="loader"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" class="animate-spin"><path fill="none" d="M0 0h24v24H0z"/><path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z"/></svg></div>');
					},
					success: function (response) {
						if (response) {
							button.removeClass("eversor-loading clicked");
							button.find(".loader").remove();

							widget.data("page", newPage);

							var $items = $(response).hide();
							widgetRow.append($items);

							// recalc masonry items
							widgetRow.imagesLoaded(function () {
								$items.show();
								if (widgetRow.data("isotope")) {
									widgetRow.isotope("appended", $items);
								}
							});

							if (widget.data("page_max") == widget.data("page")) {
								button.parent(".eversor-load-more").remove();
							}
						} else {
							button.parent(".eversor-load-more").remove();
						}
					},
				});
			}

			return false;
		});
	}

	/* Masonry / filter
	-------------------------------------------------------*/
	function initMasonry($el, $scope, type) {
		var $grid = $el,
			id = $scope.data("id"),
			$gridID = $(".masonry-grid__" + type + "-" + id),
			$filter = $(".isotope-filter-" + id);

		$grid.imagesLoaded(function () {
			$grid.isotope({
				itemSelector: ".masonry-item",
				masonry: {
					columnWidth: ".grid-sizer",
				},
				percentPosition: true,
				stagger: 30,
				hiddenStyle: {
					transform: "translateY(100px)",
					opacity: 0,
				},
				visibleStyle: {
					transform: "translateY(0px)",
					opacity: 1,
				},
			});

			$grid.isotope();
		});

		// Filter
		$filter.on("click", "a", function (e) {
			e.preventDefault();
			var filterValue = $(this).attr("data-filter");
			$gridID.isotope({ filter: filterValue });
			$filter.find("a").removeClass("active");
			$(this).closest("a").addClass("active");
		});

		// Watch the changes of spacing control
		if (elementorFrontend.isEditMode()) {
			elementor.channels.editor.on("change", function (view) {
				let changed = view.container.settings.changed;

				if (changed.grid_style_rows_gap || changed.box_height) {
					$grid.isotope();
				}
			});
		}
	}

	/* Sticky Header
	-------------------------------------------------------*/
	function initStickyHeader() {
		var $stickyHeader = $(".eversor-header--is-sticky");

		if ( $window.scrollTop() > 0 ) {
			$stickyHeader.addClass("eversor-header--is-stuck");
		} else {
			$stickyHeader.removeClass("eversor-header--is-stuck");
		}
	}

	/* Sticky Header Placeholder
	-------------------------------------------------------*/
	function initStickyHeaderPlaceholder() {
		var $editor = $(".elementor-editor-active");
		if ( $editor.length ) return;
		var $header = $(".eversor-header");
		var $stickyHeader = $(".eversor-header--is-sticky");

		if ( !$stickyHeader.hasClass("eversor-header--is-transparent")) {
			$header.css("min-height", $stickyHeader.height() + "px" )

			setTimeout(() => {
				$header.css("min-height", $stickyHeader.height() + "px" )
			}, 2000);
		}
	}

	/* Masonry Grid
	-------------------------------------------------------*/
	var eversorMasonryGrid = function ($scope, $) {
		let widgetType = $scope
			.find(".eversor-load-more-container")
			.data("settings").post_type;

		if (widgetType === "post") {
			widgetType = "blog";
		}

		let $grid = $(".masonry-grid__" + widgetType);

		if ($grid.length > 0) {
			initMasonry($grid, $scope, widgetType);
		}
	};

	/* Product Class
	-------------------------------------------------------*/
	var eversorWooPostClass = function ($scope, $) {
		var $container = $(".eversor-woocommerce-template .elementor");
		if (!$container.hasClass("product")) {
			$container.addClass("product");
		}
	};

	$document.ready(function () {
		initLoadMore();
		initStickySidebar();
		initStickyHeaderPlaceholder();
	});

	$window.on("scroll", function () {
		initStickyHeader();
	});

	$window.on("elementor/frontend/init", function () {
		elementorFrontend.hooks.addAction(
			"frontend/element_ready/deo-projects.default",
			eversorMasonryGrid
		);

		elementorFrontend.hooks.addAction(
			"frontend/element_ready/deo-blog-posts.default",
			eversorMasonryGrid
		);

		/*
		 * WooCommerce
		 * Add class product to Elementor post.
		 */
		var wooWidgets = [
			"deo-woo-product-breadcrumbs",
			"deo-woo-product-add-to-cart",
			"deo-woo-product-additional-information",
			"deo-woo-product-image",
			"deo-woo-product-meta",
			"deo-woo-product-price",
			"deo-woo-product-rating",
			"deo-woo-product-related",
			"deo-woo-product-short-description",
			"deo-woo-product-stock",
			"deo-woo-product-tabs",
			"deo-woo-product-title",
			"deo-woo-product-upsell",
			"deo-woo-notices",
		];

		for (var i = 0; i < wooWidgets.length; i++) {
			elementorFrontend.hooks.addAction(
				"frontend/element_ready/" + wooWidgets[i] + ".default",
				eversorWooPostClass
			);
		}
	});
})(jQuery);
