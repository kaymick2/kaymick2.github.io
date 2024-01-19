function setFontSize(id, size) {
    document.getElementById(id).style.fontSize=size;
}

function setVisibility(id, visible) {
    let attrValue = '';
    if (visible) {
        attrValue = 'inline';
    } else {
        attrValue = 'none';
    }

    document.getElementById(id).style.display = attrValue;
}

function changeText(id, newText) {
    document.getElementById(id).innerHTML = newText;
}