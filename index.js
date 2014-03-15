//Create the deceased object
var deceased = {
    children: {},
    parents: {},
    siblings: {}
};


$('.heir-start').click(function (e) {
    e.preventDefault();
    var dName = $('#deceasedName').val();
    deceased.name = dName;
    console.log(deceased);
    var source   = $('#entry-template').html();
    var template = Handlebars.compile(source);
    $('.app-content').html(template({deceasedName: dName}));
});
