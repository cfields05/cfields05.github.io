/* global $ _ opspark */

$(document).ready(function () {
    $.getJSON('data.json', function (data) {
        // YOUR CODE BELOW HERE //

        // uncomment this to inspect all available data; delete when done //

        // EXAMPLE: Looping over top rated recordings; replace with your code //
        // let topRated = data.discography.topRated;
        // _.forEach(topRated, function(recording) {
        //     console.log(recording);
        // });

        $('#section-quotes').css('background-color', 'grey').css('border-radius', '4px');
        $('.heading-quotes').css('color', 'white').css('padding-left', '10px');
        $('.quote').css('color', 'white').css('font-style', 'italic');
        $('#quotes').css('padding-right', '10px').css('padding-left', '10px');
        $('#quotes:last-child').css('padding-bottom', '4px');
        $('#section-quotes').prependTo('#sections');
        $('#image-billy').attr('src', 'images/billy/billy-1.jpg');
        $('#section-bio p:last-child').remove();
        let $section = $('<section>').attr('id', 'section-rider');
        $section.append($('<h3>').text('Billy\'s Rider')).appendTo($('#sections'));

        // YOUR CODE ABOVE HERE //
    })
        .fail(function () { console.log('getJSON on discography failed!'); });
});
