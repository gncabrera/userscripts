var KiriosHelper = {};

/**
 * Copy text to the clipboard
 * @param {string} text Text to copy
 */
KiriosHelper.copy = function(text) {
    var input = document.createElement('input');
    input.setAttribute('value', text);
    document.body.appendChild(input);
    input.select();
    var result = document.execCommand('copy');
    document.body.removeChild(input)
    return result;
 };

 /**
  * Given a text, invokes a file download to the browser
  * @param {string} filename Name of the file to download
  * @param {string} text Text to add to the file to be downloaded
  */
KiriosHelper.download = function(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

 window.KiriosHelper = KiriosHelper;