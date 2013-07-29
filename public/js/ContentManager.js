function ContentManager() {
    var ondownloadcompleted;
    var NUM_ELEMENTS_TO_DOWNLOAD = 8;
    this.SetDownloadCompleted = function (callbackMethod) {
        ondownloadcompleted = callbackMethod;
    }; 
    this.imgLinkWalkSouth = new Image();
	this.imgLinkIdleSouth = new Image();	
	this.imgLinkWalkNorth = new Image();
	this.imgLinkIdleNorth = new Image();	
	this.imgLinkWalkEast = new Image();
	this.imgLinkIdleEast = new Image();	
	this.imgLinkWalkWest = new Image();
	this.imgLinkIdleWest = new Image();
	    
    var numImagesLoaded = 0;
	
    this.StartDownload = function () {
        SetDownloadParameters(this.imgLinkWalkSouth, "img/link-walk-south.png", handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgLinkIdleSouth, "img/link-idle-south.png", handleImageLoad, handleImageError);
		
		SetDownloadParameters(this.imgLinkWalkNorth, "img/link-walk-north.png", handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgLinkIdleNorth, "img/link-idle-north.png", handleImageLoad, handleImageError);
		
		SetDownloadParameters(this.imgLinkWalkEast, "img/link-walk-east.png", handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgLinkIdleEast, "img/link-idle-east.png", handleImageLoad, handleImageError);
		
		SetDownloadParameters(this.imgLinkWalkWest, "img/link-walk-west.png", handleImageLoad, handleImageError);
		SetDownloadParameters(this.imgLinkIdleWest, "img/link-idle-west.png", handleImageLoad, handleImageError);

    }

    function SetDownloadParameters(imgElement, url, loadedHandler, errorHandler) {
        imgElement.src = url;
        imgElement.onload = loadedHandler;
        imgElement.onerror = errorHandler;
    }

    function handleImageLoad(e) {
        numImagesLoaded++
        if (numImagesLoaded == NUM_ELEMENTS_TO_DOWNLOAD) {
            numImagesLoaded = 0;
            ondownloadcompleted();
        }
    }
    function handleImageError(e) {
        console.log("Error Loading Image : " + e.target.src);
    }
}