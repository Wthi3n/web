(function ($) {
	"use strict";

	var $html = $("html"),
		$body = $("body");

	openPanel();

	function openPanel() {
		var $demosIcon = $(".deo-preview-bar__icon-themes"),
			$overlay = $(".deo-preview-bar-overlay");

		$demosIcon.on("click", function (e) {
			e.preventDefault();
			$(this).addClass("deo-preview-bar__icon-themes--is-open");
			$html.addClass("deo-preview-bar--is-open");
		});

		$demosIcon.one("click", function (e) {
			renderContent();
		});

		$overlay.on("click", function (e) {
			e.preventDefault();
			$html.removeClass("deo-preview-bar--is-open");
		});

		$(".deo-preview-bar__close").on("click", function () {
			$html.removeClass("deo-preview-bar--is-open");
		});

		document.addEventListener("keyup", function (e) {
			if (27 === e.keyCode) {
				$html.removeClass("deo-preview-bar--is-open");
			}
		});
	}

	function renderContent() {
		var $container = $("#deo-preview-bar__panel-items");

		$.ajax({
			dataType: 'json',
			url: 'https://deothemes.com/wp-json/envato-themes/v1/posts',
			beforeSend: function (xhr) {
				$container
					.addClass("eversor-loading")
					.append('<div class="loader"><div></div></div>');
			},
			success: function (response) {
				response.forEach(element => {
					$container.append(
						`<li class="deo-preview-bar__panel-item">
							<a href="${element.url}" class="deo-preview-bar__panel-item-url">
								<figure class="deo-preview-bar__panel-img-holder">
									<img src="${element.image}" alt="${element.title}" class="deo-preview-bar__panel-img" />
								</figure>
								<h3 class="deo-preview-bar__panel-title">${element.name}</h3>
							</a>
						</li>`
					);
				});

				$container.find(".loader").remove();
			},
		});
	}
})(jQuery);
