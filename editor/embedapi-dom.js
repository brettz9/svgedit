/* globals jQuery */
/**
* Attaches items to DOM for Embedded SVG support.
* @module EmbeddedSVGEditDOM
*/
import EmbeddedSVGEdit from './embedapi.js';
import {isChrome} from './browser.js';

const $ = jQuery;

let svgCanvas = null;

/**
* @param {string} data
* @param {string} error
* @returns {void}
*/
function handleSvgData (data, error) {
  if (error) {
    // Todo: This should be replaced with a general purpose dialog alert library call
    alert('error ' + error); // eslint-disable-line no-alert
  } else {
    // Todo: This should be replaced with a general purpose dialog alert library call
    alert('Congratulations. Your SVG string is back in the host page, do with it what you will\n\n' + data); // eslint-disable-line no-alert
  }
}

/**
* Set the canvas with an example SVG string.
* @returns {void}
*/
function loadSvg () {
  const svgexample = `<svg width="640" height="480" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
 <!-- Created with SVG-edit - http://svg-edit.googlecode.com/ -->
 <defs>
  <marker id="se_marker_start_svg_1" markerHeight="5" markerUnits="strokeWidth" markerWidth="5" orient="auto" refX="50" refY="50" viewBox="0 0 100 100">
   <path d="m54,51l45,39l-31,-40l31,-40l-45,41z" fill="#0070c0" id="svg_2" stroke="#0070c0" stroke-width="10"/>
  </marker>
  <marker id="se_marker_end_svg_1" markerHeight="5" markerUnits="strokeWidth" markerWidth="5" orient="auto" refX="50" refY="50" viewBox="0 0 100 100">
   <path d="m48,48l-50,42l30,-40l-30,-40l50,38z" fill="#0070c0" id="svg_5" stroke="#0070c0" stroke-width="10"/>
  </marker>
  <marker id="se_marker_mid_svg_3" markerHeight="10" markerUnits="strokeWidth" markerWidth="25" orient="359.50395" refY="50" viewBox="-1 -50 100 100">
   <text fill="#d40000" font-family="serif" font-size="50" id="svg_6" stroke="#000000" stroke-width="0" text-anchor="left" x="-20" xml:space="preserve" y="35"/>
  </marker>
  <path d="m113.33334,234.66667c0,0 180.00003,0 180.00003,0c0,0 -86.66669,-181.33334 -86.66669,-181.33334c0,0 -93.33334,181.33334 -93.33334,181.33334z" id="se_def_pathtrianglecount_svg_1" opacity="0.5"/>
 </defs>
 <g class="layer">
  <title>Main Layers</title>
 </g>
 <g class="layer">
  <title>Main Layers1</title>
  <polyline fill="none" id="svg_3" marker-end="url(#se_marker_end_svg_1)" marker-mid="url(#se_marker_mid_svg_3)" marker-start="url(#se_marker_start_svg_1)" opacity="0.5" points="82.68340020935683,278.89150165592025 98.73106639884574,278.7525608231108 114.77873258833463,278.6136199903014" stroke="#0070c0" stroke-width="1.5"/>
 </g>
 <g class="layer">
  <title>Layer 1</title>
 </g>
 <g class="layer">
  <title>Area - standard46115</title>
  <path d="m212.46237,145.20781l-0.56247,-83.52624l79.58898,0.56247l0,82.68254l0,0l-0.56247,31.49811l-78.18281,1.40617l0,0" fill="#00FFFF" fill-opacity="0.5" id="svg_4" opacity="0.5" stroke="#00FFFF" stroke-opacity="0.5" stroke-width="0.1"/>
 </g>
 <g class="layer">
  <title>Linear46116</title>
  <path d="m136.81065,145.48905l0,-80.99514l41.90374,-0.8437l-0.56247,82.68254l0,0" fill="#00FFFF" fill-opacity="0" id="svg_7" opacity="0.5" stroke="#0000FF" stroke-opacity="0.5" stroke-width="7.46431"/>
  <g id="svg_7Linear">
   <rect fill="#FFFFFF" height="3.42188" id="svg_15" stroke-width="0" width="17.3125" x="157.75" y="102.76563"/>
   <text fill="#000000" font-family="serif" font-size="3" id="svg_8" opacity="2" stroke="#000000" stroke-width="0" text-anchor="left" xml:space="preserve" y="104.99147">
    <tspan dy="0.2em" id="svg_9" x="157.76252">3 Ply @ 50.23</tspan>
   </text>
  </g>
 </g>
 <g class="layer">
  <title>Test Count1146117</title>
  <use fill="#FF1493" id="svg_10" stroke-width="0.1" transform="translate(190.295166015625,102.26551818847656) scale(0.05318322777748108) " xlink:href="#se_def_pathtrianglecount_svg_1"/>
  <use fill="#FF1493" id="svg_11" stroke-width="0.1" transform="translate(186.35789489746094,120.54566955566406) scale(0.05318322777748108) " xlink:href="#se_def_pathtrianglecount_svg_1"/>
  <use fill="#FF1493" id="svg_12" stroke-width="0.1" transform="translate(179.60830688476562,144.16925048828125) scale(0.05318322777748108) " xlink:href="#se_def_pathtrianglecount_svg_1"/>
  <use fill="#FF1493" id="svg_13" stroke-width="0.1" transform="translate(188.04530334472656,154.01242065429688) scale(0.05318322777748108) " xlink:href="#se_def_pathtrianglecount_svg_1"/>
  <use fill="#FF1493" id="svg_14" stroke-width="0.1" transform="translate(193.95118713378906,141.07568359375) scale(0.05318322777748108) " xlink:href="#se_def_pathtrianglecount_svg_1"/>
  <line fill="none" id="HorizontalLineCursorbottom" stroke="#000000" stroke-width="0.5" x1="149.37258" x2="640" y1="113.42847" y2="113.42847"/>
  <line fill="none" id="HorizontalLineCursortop" stroke="#000000" stroke-width="0.5" x1="0" x2="143.37258" y1="113.42847" y2="113.42847"/>
  <line fill="none" id="VerticalLineCursorbottom" stroke="#000000" stroke-width="0.5" x1="146.37258" x2="146.37258" y1="116.42847" y2="480"/>
  <line fill="none" id="VerticalLineCursortop" stroke="#000000" stroke-width="0.5" x1="146.37258" x2="146.37258" y1="0" y2="110.42847"/>
 </g>
</svg>`;
  svgCanvas.setSvgString(svgexample);
}

/**
*
* @returns {void}
*/
function saveSvg () {
  svgCanvas.getSvgString()(handleSvgData);
}

/**
* Perform a PNG export.
* @returns {void}
*/
function exportPNG () {
  svgCanvas.getUIStrings()(function (uiStrings) {
    const str = uiStrings.notification.loadingImage;
    let exportWindow;
    if (!isChrome()) {
      exportWindow = window.open(
        'data:text/html;charset=utf-8,' + encodeURIComponent('<title>' + str + '</title><h1>' + str + '</h1>'),
        'svg-edit-exportWindow'
      );
    }
    svgCanvas.rasterExport('PNG', null, exportWindow && exportWindow.name)();
  });
}

/**
* Perform a PDF export.
* @returns {void}
*/
function exportPDF () {
  svgCanvas.getUIStrings()(function (uiStrings) {
    const str = uiStrings.notification.loadingImage;

    /**
    // If you want to handle the PDF blob yourself, do as follows
    svgCanvas.bind('exportedPDF', function (win, data) {
      alert(data.output);
    });
    svgCanvas.exportPDF(); // Accepts two args: optionalWindowName supplied back to bound exportPDF handler and optional outputType (defaults to dataurlstring)
    return;
    */

    if (isChrome()) {
      // Chrome will open an extra window if we follow the approach below
      svgCanvas.exportPDF();
    } else {
      const exportWindow = window.open(
        'data:text/html;charset=utf-8,' + encodeURIComponent('<title>' + str + '</title><h1>' + str + '</h1>'),
        'svg-edit-exportWindow'
      );
      svgCanvas.exportPDF(exportWindow && exportWindow.name);
    }
  });
}

const frameBase = 'https://raw.githack.com/SVG-Edit/svgedit/master';
// const frameBase = 'http://localhost:8001';
const framePath = '/editor/xdomain-svg-editor-es.html?extensions=ext-xdomain-messaging.js';
const iframe = $('<iframe width="900px" height="600px" id="svgedit"></iframe>');
iframe[0].src = frameBase + framePath +
  (location.href.includes('?')
    ? location.href.replace(/\?(.*)$/, '&$1')
    : ''); // Append arguments to this file onto the iframe

iframe[0].addEventListener('load', function () {
  svgCanvas = new EmbeddedSVGEdit(frame, [new URL(frameBase).origin]);
  // Hide main button, as we will be controlling new, load, save, etc. from the host document
  let doc;
  try {
    doc = frame.contentDocument || frame.contentWindow.document;
  } catch (err) {
    console.log('Blocked from accessing document', err); // eslint-disable-line no-console
  }
  if (doc) {
    // Todo: Provide a way to get this to occur by `postMessage`
    const mainButton = doc.getElementById('main_button');
    mainButton.style.display = 'none';
  }

  // Add event handlers now that `svgCanvas` is ready
  $('#load').click(loadSvg);
  $('#save').click(saveSvg);
  $('#exportPNG').click(exportPNG);
  $('#exportPDF').click(exportPDF);
});
$('body').append(iframe);
const frame = document.getElementById('svgedit');
