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

//Set incrementor value for multiples
var i = 0;

//Abstracted questions
var nodes = {
    children : {type: 'multi', shortName: 'children', question: 'Name of Child', goTo: 'children', goToTrue: 'children', goToFalse: 'haveParnt'},
    parents : {type: 'multi', shortName: 'parents', question: 'Name of parent', goTo: 'parents', goToFalse: 'haveSiblings'},
    siblings : {type: 'multi', shortName: 'siblings', question : 'Name of sibling', goTo: 'siblings', goToFalse: 'nextSection'},
    married : {type: 'boolean', shortName: 'married', question : 'Was the  deceased married at time of death?', goToTrue: 'haveChildren', goToFalse: 'haveChildren', multi: false},
    haveChildren : {type: 'boolean', shortName: 'haveChildren', question : 'Did the deceased have children?', goToTrue: 'children', goToFalse: 'haveParnt', multi: false},
    haveParnt : {type: 'boolean', shortName: 'haveParnt', question : 'Did the deceased have any living parents?', goToTrue: 'parents', goToFalse: 'haveSiblings', multi: false},
    haveSiblings : {type: 'boolean', shortName: 'haveSiblings', question : 'Did the deceased have living or predeceased siblings?', goToTrue: 'siblings', goToFalse: 'nextSection', multi: false},
    nextSection: {type: 'next', shortName: 'getDetails', question: 'Go to Next Section'}
};


//Creates a family tree
var buildFamilyObject = function(el,callback){

    var prop = el.attr('name');
    var nextNode = el.attr('data-next');
    var returnData = {};

    //Add data to our object
    if (el.attr('data-multiple') === 'true'){
        //var key = Math.floor((Math.random()*100)+1);
        deceased[prop][i] = {'name': el.val()};
        i++;
    } else {
        if (!el.hasClass('stop-adding')){
            deceased[prop] = el.val();
        }
        i = 0;
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
    } else if (el.hasClass('stop-adding')){
        returnData.nextq =  nodes[prop].goToFalse;
        returnData.qtype= nodes[returnData.nextq].type;
    } else {
        returnData.nextq = nodes[prop].goTo;
        returnData.qtype = nodes[returnData.nextq].type;
    }

    callback(returnData);
};

//Gets relevant status information for siblings/children
var getFamilyDetails = function() {

    if (Object.keys(deceased.siblings).length > 0){
        $.each(Object.keys(deceased.siblings), function (index, val){
            deceased.siblings[index].oneSameParent = false;
            deceased.siblings[index].renounced = false;
            deceased.siblings[index].predeceased = false;
            deceased.siblings[index].unworthy = false;
        });
    }

    if (Object.keys(deceased.children).length > 0){
        $.each(Object.keys(deceased.children), function (index, val){
            deceased.children[index].forcedHeir = false;
            deceased.children[index].renounced = false;
            deceased.children[index].predeceased = false;
            deceased.children[index].disinherited = false;
        });
    }

    if (Object.keys(deceased.parents).length > 0){
        console.log('there are ' + Object.keys(deceased.parents).length + ' parents');
    }
};

//Listeners
$('.heir-start').click(function (e) {
    e.preventDefault();
    var dName = $('#deceasedName').val();
    deceased.name = dName;
    var source   = $('#entry-template').html();
    var template = Handlebars.compile(source);
    $('.app-content').html(template({deceasedName: dName, nextNode: 'haveChildren'}));
});

$('.app-content').on('change', '.trigger', function () {
    $(this).prop('disabled', true);
    buildFamilyObject($(this), function (data) {
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
        $(this).prop('disabled', true);
        $('.stop-adding').remove();
        buildFamilyObject($(this), function (data) {
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
    $(this).parent().remove();
    buildFamilyObject($(this), function (data) {
        var source = $('#' + data.qtype + '-template').html();
        var template = Handlebars.compile(source);
        $('form').append(template({
            questionText: nodes[data.nextq].question,
            shortName: nodes[data.nextq].shortName,
            nextNode: data.nextq
        }));
    });
});

$('.app-content').on('click', '.next-section', function (e){
    e.preventDefault();
    getFamilyDetails();
});
