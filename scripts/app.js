"use strict";!function(document){var app=document.querySelector("#app");app.baseUrl="/",""===window.location.port&&(app.baseUrl="/MamasDelRioParser/"),app.displayInstalledToast=function(){Polymer.dom(document).querySelector("platinum-sw-cache").disabled||Polymer.dom(document).querySelector("#caching-complete").show()},app.addEventListener("dom-change",function(){console.log("Our app is ready to rock!")}),window.addEventListener("WebComponentsReady",function(){}),window.addEventListener("paper-header-transform",function(e){var appName=Polymer.dom(document).querySelector("#mainToolbar .app-name"),middleContainer=Polymer.dom(document).querySelector("#mainToolbar .middle-container"),bottomContainer=Polymer.dom(document).querySelector("#mainToolbar .bottom-container"),detail=e.detail,heightDiff=detail.height-detail.condensedHeight,yRatio=Math.min(1,detail.y/heightDiff),maxMiddleScale=.5,auxHeight=heightDiff-detail.y,auxScale=heightDiff/(1-maxMiddleScale),scaleMiddle=Math.max(maxMiddleScale,auxHeight/auxScale+maxMiddleScale),scaleBottom=1-yRatio;Polymer.Base.transform("translate3d(0,"+100*yRatio+"%,0)",middleContainer),Polymer.Base.transform("scale("+scaleBottom+") translateZ(0)",bottomContainer),Polymer.Base.transform("scale("+scaleMiddle+") translateZ(0)",appName)}),app.scrollPageToTop=function(){app.$.headerPanelMain.scrollToTop(!0)},app.closeDrawer=function(){app.$.paperDrawerPanel.closeDrawer()}}(document);