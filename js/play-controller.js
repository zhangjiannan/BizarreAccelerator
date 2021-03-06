var stage = 0;
var utils;
var runTimerID = 0;

function requestStage(stageNum) {
    var stageCreator = (stageNum == 0);
    $.ajax({
        "type": "POST",
        "url" : "stage-loader.php",
        "data": {s: stageNum}, // add cookie here ???
        "dataType": "json",
        "success": function(json) {
            if (json.eligible) {
            
                var setup = function() {
                    stage = new Stage(json, stageCreator);
                    stage.setup();
                    
                    // disable the play
                    $("#play").attr("src", "img/web/r-play.png").on("click", function(){return false});
                    // $("#play").attr("disabled", "true");
                    
                    setTimeout(function() {
                        if (runTimerID != 0) clearTimeout(runTimerID);
                        runTimerID = 0;
                        
                        // enable play
                        $("#play").attr("src", "img/web/b-play.png").on("click", stage.play);
                        // $("#play").removeAttr("disabled"); // enable play
                    }, 2000);
                }
                
                if (json.intro) {
                    setTimeout(setup, 100);
                    $("#intro").introduction({
                        images: json.intro.images,
                        texts: json.intro.texts//,
                        // onclose: setup
                    });
                } else {
                    setup();
                }
                
            }
            else {
                alert("Please pass the previous stages first");
                loadPage("stage-selection.html");
            }
        },
        "error": function(a,b,c){console.log(a,b,c);}
    });
}

function goToNextStage(stageName) {
    var stageNum = parseInt(stageName);
    if (!isNaN(stageNum)) {
        var nextStage = stageNum + 1;
        if (nextStage == 17) {
            alert("You have successfully completed all stages! Congratulations!");
            loadPage("stage-selection.html");
        }
        else {
            loadPage("play.html?s=" + nextStage.toString());
        }
    }
    else {
        // loadPage("stage-selection.html");
    }
}
