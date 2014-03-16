//Create the deceased object
var deceased = {
    name: null,
    isMarried: null,
    haveChildren: null,
    haveParnt: null,
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

var buildObject = function(el,callback){

    var prop = el.attr('name'),
    nextNode = el.attr('data-next'),
    data = {};

    //Add data to our object
    if (el.attr('data-mulitple') === 'true'){
        var key = Math.floor((Math.random()*100)+1);
        deceased[prop][key] = $(this).val();
    } else {
        deceased[prop] = el.val();
    }

    //Proceed to next question
    if (el.hasClass('boolean')){
        if (el.val() === 'true'){
            data.nextq = nodes[prop].goToTrue;
            data.qtype= nodes[data.nextq].type;
        } else {
            data.nextq = nodes[prop].goToFalse;
            data.qtype= nodes[data.nextq].type;
        }
    } else {
        data.nextq = nodes[nextNode].goTo;
        data.qtype = nodes[data.nextq].type;
    }

    callback(data);
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
    buildObject($(this), function (data) {
        var source = $('#' + data.qtype + '-template').html();
        var template = Handlebars.compile(source);
        $('form').append(template({
            questionText: nodes[data.nextq].question,
            shortName: nodes[data.nextq].shortName,
            nextNode: data.nextq
        }));
        console.log(deceased);
    });
});

$('.app-content').on('keypress', '.form-group input', function (e) {
    if(e.which === 13) {
        e.preventDefault();
        $('.stop-adding').remove();
        buildObject($(this), function (data) {
            var source = $('#' + data.qtype + '-template').html();
            var template = Handlebars.compile(source);
            $('form').append(template({
                questionText: nodes[data.nextq].question,
                shortName: nodes[data.nextq].shortName,
                nextNode: data.nextq
            }));
            console.log(deceased);
        });
    }
});

$('.app-content').on('click', '.stop-adding', function (e){
    e.preventDefault();
    alert('stop');
});
