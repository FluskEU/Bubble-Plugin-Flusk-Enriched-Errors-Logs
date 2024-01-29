function(instance, properties) {

	if (properties.theme === 'light'){
        var inneraudioHtml = `<img src="https://meta-q.cdn.bubble.io/f1706046905395x925163850755039500/1_light.svg" alt="" srcset="" style="width:100%;height:100%;"/>`;
    }
    else {
        var inneraudioHtml = `<img src="https://meta-q.cdn.bubble.io/f1706046916623x615699398506102100/1_dark.svg" alt="" srcset="" style="width:100%;height:100%;"/>`;
    }
    var audio;
  audio = $(inneraudioHtml);
  instance.canvas.append(audio);

}