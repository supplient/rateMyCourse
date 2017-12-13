function setAnimations() {
  // Navbar animation settings
  collapseNavbar()
  $(window).scroll(collapseNavbar)

  //Dropdown style settings
  slideDropdown()
}

function collapseNavbar() {
  if ($("#mainNav").offset().top > 100) {
    $("#mainNav").addClass("navbar-shrink")
  } else {
    $("#mainNav").removeClass("navbar-shrink")
  }
}

function slideDropdown() {
  $('.dropdown').on('show.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
  });

  $('.dropdown').on('hide.bs.dropdown', function() {
    $(this).find('.dropdown-menu').first().stop(true, true).slideUp();
  });
}
