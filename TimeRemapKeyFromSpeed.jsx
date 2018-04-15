function timeRemapKeyFromSpeed(speed) {
    var layer = app.project.activeItem.selectedLayers[0];
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

var dlg = new Window('dialog', 'Keyframe Prompt');
var slider = dlg.add('slider', undefined, 1, -5, 5);
var textNum = dlg.add('statictext', undefined, 'Speed: 1.0x');
var add = dlg.add('button', undefined, 'Add Keyframe');

slider.onChanging = function() {
    var speed = slider.value;
    if(speed >= 0) {
        textNum.text = "Speed: " + Math.floor(slider.value) + "." + Math.floor(Math.abs((slider.value * 10) % 10)) + "x";
    } else {
        textNum.text = "Speed: " + Math.ceil(slider.value) + "." + Math.ceil(Math.abs((10 - slider.value * 10) % 10)) + "x";
    }
}

add.onClick = function() {
    timeRemapKeyFromSpeed(slider.value);
    dlg.close();
}

dlg.center();
dlg.show();