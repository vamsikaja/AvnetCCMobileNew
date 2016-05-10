
/* JavaScript content from app/shared/plugins/ShopWebViewOverlayPlugin.js in folder common */
function ShopWebViewOverlayPlugin() {};

ShopWebViewOverlayPlugin.prototype.close = function() {
	cordova.exec(null, null, 'ShopWebViewOverlayPlugin', 'close', []);
};

ShopWebViewOverlayPlugin.prototype.goBack = function() {
	cordova.exec(null, null, 'ShopWebViewOverlayPlugin', 'goBack', []);
};

ShopWebViewOverlayPlugin.prototype.goForward = function() {
	cordova.exec(null, null, 'ShopWebViewOverlayPlugin', 'goForward', []);
};

ShopWebViewOverlayPlugin.prototype.goToPage = function(url) {
	cordova.exec(null, null, 'ShopWebViewOverlayPlugin', 'goToPage', [url]);
};

window.shopWebViewOverlay = new ShopWebViewOverlayPlugin();
