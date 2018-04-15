/**
Places a time remap keyframe at the playhead on the selected layer, and sets it to a time to make playback match the value of "speed" from the previous keyframe.
If the playhead is located before any keyframes, it will set the time to have playback from that point match the speed.
**/
function timeRemapKeyFromSpeed(speed) {
    var comp = app.project.activeItem;
    for(var i = 0; i < comp.selectedLayers.length; i++) {
        var layer = comp.selectedLayers[i];
        var remap = layer.timeRemap;
        if(layer.time < remap.keyTime(1)) {
            remap.setValueAtTime(layer.time, remap.keyValue(1) + speed * (layer.time - remap.keyTime(1)));
        } else {
            var curKey = remap.nearestKeyIndex(layer.time);
            if(layer.time < remap.keyTime(curKey)) {
                 curKey--;
            }
            remap.setValueAtTime(layer.time, remap.keyValue(curKey) + speed * (layer.time - remap.keyTime(curKey)));
        }
    }
}

// Initialize dialog box's UI
var dlg = new Window('dialog', 'Keyframe Prompt');
var slider = dlg.add('slider', undefined, 1, -5, 5);
var textNum = dlg.add('statictext', undefined, 'Speed: 1.0x');
var add = dlg.add('button', undefined, 'Add Keyframe');

// When user moves slider, will update the text.
slider.onChanging = function() {
    var speed = slider.value;
    if(speed >= 0) {
        textNum.text = "Speed: " + Math.floor(slider.value) + "." + Math.floor(Math.abs((slider.value * 10) % 10)) + "x";
    } else {
        textNum.text = "Speed: " + Math.ceil(slider.value) + "." + Math.ceil(Math.abs((10 - slider.value * 10) % 10)) + "x";
    }
}

// On pressing the "Add Keyframe" button, function timeRemapKeyFromSpeed is called using slider value, before closing the dialog box.
add.onClick = function() {
    timeRemapKeyFromSpeed(slider.value);
    dlg.close();
}

// Open dialog box in center of screen.
dlg.center();
dlg.show();