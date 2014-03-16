//Create the deceased object
var deceased = {
    children: {},
    parents: {},
    siblings: {}
};

//Abstracted questions
var nodes = {
    children : {type: 'multi', shortName: 'children', question: 'Name of Child', goTo: 'children', goToTrue: 'children', goToFalse: 'haveParnt'},
    parnt : {type: 'multi', shortName: 'parent', question: 'Name of parent', goTo: 'parnt'},
    sibling : {type: 'multi', shortName: 'sibling', question : 'Name of sibling', goTo: 'sibling'},
    married : {type: 'boolean', shortName: 'married', question : 'Was the  deceased married at time of death?', goToTrue: 'haveChildren', goToFalse: 'haveChildren', multi: false},
    haveChildren : {type: 'boolean', shortName: 'haveChildren', question : 'Did the deceased have children?', goToTrue: 'children', goToFalse: 'haveParnt', multi: false},
    haveParnt : {type: 'boolean', shortName: 'haveParnt', question : 'Did the deceased have any living parents?', goToTrue: 'parnt', goToFalse: 'haveSiblings', multi: false},
    haveSiblings : {type: 'boolean', shortName: 'haveSiblings', question : 'Did the deceased have living or predeceased siblings?', goToTrue: 'sibling', goToFalse: 'sibling', multi: false}
};


$('.heir-start').click(function (e) {
    e.preventDefault();
    var dName = $('#deceasedName').val();
    deceased.name = dName;
    var source   = $('#entry-template').html();
    var template = Handlebars.compile(source);
    $('.app-content').html(template({deceasedName: dName, nextNode: 'haveChildren'}));
});

$('.app-content').on('change', '.trigger', function () {

    var prop = $(this).attr('name');

    //Add data to our object
    if ($(this).attr('data-mulitple') === 'true'){
        var key = Math.floor((Math.random()*100)+1);
        deceased[prop][key] = $(this).val();

    } else {
        deceased[prop] = $(this).val();
    }

    //Proceed to next question
    var nextNode = $(this).attr('data-next');
    var nextq;
    var qtype;
    if ($(this).hasClass('boolean')){
        if ($(this).val() === 'true'){
            nextq = nodes[prop].goToTrue;
            qtype= nodes[nextq].type;
        } else {
            nextq = nodes[prop].goToFalse;
            qtype= nodes[nextq].type;
        }
    } else {
        nextq = nodes[nextNode].goTo;
        qtype = nodes[nextq].type;
    }
    var source = $('#' + qtype + '-template').html();
    var template = Handlebars.compile(source);
    $('form').append(template({
        questionText: nodes[nextq].question,
        shortName: nodes[nextq].shortName,
        nextNode: nextq
    }));
    console.log(deceased);
});

$('.app-content').on('keypress', '.form-group input', function (e) {
    if(e.which === 13) {
        e.preventDefault();
        $('.trigger').trigger('change');
    }
});
