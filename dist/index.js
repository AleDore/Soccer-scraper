var browserObject = require("./browser");
var scraperController = require("./pageController");
var browserInstance = browserObject.startBrowser();
scraperController(browserInstance);
