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

//Child object
var child = {
    forcedHeir: false,
    renounced: false,
    predeceased: false,
    disinherited: false
};

//Sibling Object
var sibling = {
    oneSameParent: false,
    renounced: false,
    predeceased: false,
    unworthy: false
};

//Abstracted questions
var nodes = {
    children : {type: 'multi', shortName: 'children', question: 'Name of Child', goTo: 'children', goToTrue: 'children', goToFalse: 'haveParnt'},
    parnt : {type: 'multi', shortName: 'parnt', question: 'Name of parent', goTo: 'parnt'},
    sibling : {type: 'multi', shortName: 'sibling', question : 'Name of sibling', goTo: 'sibling'},
    married : {type: 'boolean', shortName: 'married', question : 'Was the  deceased married at time of death?', goToTrue: 'haveChildren', goToFalse: 'haveChildren', multi: false},
    haveChildren : {type: 'boolean', shortName: 'haveChildren', question : 'Did the deceased have children?', goToTrue: 'children', goToFalse: 'haveParnt', multi: false},
    haveParnt : {type: 'boolean', shortName: 'haveParnt', question : 'Did the deceased have any living parents?', goToTrue: 'parnt', goToFalse: 'haveSiblings', multi: false},
    haveSiblings : {type: 'boolean', shortName: 'haveSiblings', question : 'Did the deceased have living or predeceased siblings?', goToTrue: 'sibling', goToFalse: 'sibling', multi: false}
};



var buildObject = function(el,callback){

    var prop = el.attr('name');
    var nextNode = el.attr('data-next');
    var returnData = {};

    //Add data to our object
    if (el.attr('data-multiple') === 'true'){
        var key = Math.floor((Math.random()*100)+1);
        deceased[prop][key] = el.val();
    } else {
        deceased[prop] = el.val();
    }

    //Proceed to next question
    if (el.hasClass('boolean')){
        if (el.val() === 'true'){
            returnData.nextq = nodes[prop].goToTrue;
            returnData.qtype= nodes[returnData.nextq].type;
        } else {
            returnData.nextq = nodes[prop].goToFalse;
            returnData.qtype= nodes[returnData.nextq].type;
        }
    } else {
        returnData.nextq = nodes[nextNode].goTo;
        returnData.qtype = nodes[returnData.nextq].type;
    }

    callback(returnData);
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
