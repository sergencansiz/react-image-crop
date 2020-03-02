export const getPositionAfterDrag = (move , touch , croper, image) => {



    let x = move.x
    let y = move.y
    


    var iL = image.current.offsetLeft
    var iR = -((image.current.width - croper.current.offsetWidth) + image.current.offsetLeft + 2)
    var iT = image.current.offsetTop
    var iB = -((image.current.height - croper.current.offsetHeight) + image.current.offsetTop + 2)

    var iML = iL
    var iMR = iR
    var iMT = iT
    var iMB = iB


    var iW = image.current.offsetWidth
    var iH = image.current.offsetHeight
    var cW = croper.current.offsetWidth
    var cH = croper.current.offsetHeight
    
    // console.log(iL)
    // console.log(image)
    // console.log(image.current.offsetTop)
    // console.log(image.current.style.top)
    // console.log(image.current.offsetLeft)
    // console.log(image.current.style.left)
    // console.log((image.current.width - image.current.offsetParent.offsetWidth) + image.current.offsetLeft + 2)
    // console.log(image.current.style.right)
    // console.log((image.current.height - image.current.offsetParent.offsetHeight) + image.current.offsetTop + 2)
    // console.log(image.current.style.bottom)

    //If it first clicked
    if(iW > cW){
        
            var mW = x - touch.startX
            iML = iL + mW
            iMR = iR - mW

            // If image comes to croper left border
            if(iML > 0){
                iML = 0 // Stop moving right
                iMR = iR
            }

            // If iamge comes to croper right border
            if(iMR > 0 ) {
                iML = iL
                iMR = 0 // Stop moving left
            }
    }

    // It runs only if image height greater than croper height
    if(iH > cH){
        
            var mH = y - touch.startY
            iMT = iT + mH
            iMB = iB - mH

            // If image comes to croper left border
            if(iMT > 0){
                iMT = 0 // Stop moving right
                iMB = iB
            }

            // If iamge comes to croper right border
            if(iMB > 0 ) {
                iMT = iT
                iMB = 0 // Stop moving left
            }
    }
    

    return {
        imageMoveLeft   : iML,
        imageMoveRight  : iMR,
        imageMoveTop    : iMT,
        imageMoveBottom : iMB,
    }
    



}


export const wheelZoom = (e , croper, image) => {

    //console.log(e)
    let imageWidth = image.current.offsetWidth
    var x = e.offsetX
    var y = e.offsetY
    let newWidth = -(e.deltaY/4) + imageWidth       
    let newHeight = image.current.offsetHeight * (newWidth / image.current.offsetWidth)
    var gap = croper.current.offsetWidth - newWidth
    

    // Image Croper difference
    var dif = newHeight - image.current.offsetHeight
    var difW =  newWidth - image.current.offsetWidth

    // Cursor Points
    let xLeft = x
    let xRight = image.current.offsetWidth- x
    let yTop = y
    let yBottom = image.current.offsetHeight - y

    var xLeftP = image.current.offsetLeft
    var xRightP = -((image.current.width - croper.current.offsetWidth) + image.current.offsetLeft + 2)
    var yTopP = image.current.offsetTop
    var yBotP = -((image.current.height - croper.current.offsetHeight) + image.current.offsetTop + 2)



    // Define variables for new x,y position
    let newTop
    let newBottom
    let newLeft
    let newRight

    // If it is zoom in
    if(e.deltaY < 0){
            
        // Calculate position change for top and bottom according to cursor position
        let newTopDif = (dif*yTop) / (yTop + yBottom)
        let newBottomDif = dif - newTopDif 
        
        // Calculate position change for left and right according to cursor position
        let newLeftDif = (difW*xLeft) / (xLeft + xRight )
        let newRightDif = difW - newLeftDif


        let imCropHeDif = image.current.offsetHeight - croper.current.offsetHeight  
        let imCropWiDif = image.current.offsetWidth - croper.current.offsetWidth

        //console.log(imCropHeDif)
        // Create new positions for image
        newLeft = xLeftP  - newLeftDif
        newRight = xRightP - newRightDif
        newTop = yTopP - newTopDif 
        newBottom = yBotP - newBottomDif


        // Top and Bottom can't be less than cropper height
        // If top and bottom greater than 0 it shows the image height will be less than croper height
        // If top and bottom greater than 0 update bottom and top to 0


    }else{ //If it is zoomout
        

        // Calculate change amounts for top and bottom according the position stays outside of croper
        let newTopDif = (dif*yTopP) / (yTopP + yBotP)
        let newBottomDif = dif - newTopDif
        
        // Calculate change amounts for left and right according the position stays outside of croper
        let newLeftDif = (difW*xLeftP) / (xLeftP + xRightP)
        let newRightDif = difW - newLeftDif

        // Craete new positions for left, right, bottom and top
        newTop = yTopP - newTopDif 
        newBottom = yBotP  - newBottomDif
        newLeft = xLeftP - newLeftDif
        newRight = xRightP - newRightDif

        // Top and Bottom can't be less than cropper height
        // If top and bottom greater than 0 it shows the image height will be less than croper height
        // If top and bottom greater than 0 update bottom and top to 0
        // newTop = newTop >= 0 ? 0 : newTop
        // newBottom = newBottom >= 0 ? 0 : newBottom
    }        
    
    // If image with less than croper locate image center
    if(image.current.offsetWidth < croper.current.offsetWidth){
        newLeft = gap/2
        newRight = gap/2
    }


    if(newHeight > croper.current.offsetHeight){ 
        return {
            imageTop : newTop,
            imageBottom : newBottom,
            imageLeft : newLeft,
            imageRight : newRight,
            imageHeight : newHeight,
            imageWidth : newWidth,
        }
    }else{
        return {
            imageTop : 0,
            imageBottom :0,
            imageLeft : newLeft,
            imageRight : newRight,
            imageHeight : croper.current.offsetHeight,
        }
    }



}

export const getContainerPositionsToCroper = (gap , ratio, container) => {


    var conParentWidth = container.current.parentElement.offsetWidth
    let gapTop
    let gapRight
    let gapBottom
    let gapLeft


    console.log(typeof gap)
    if( typeof gap === 'object' ){
        if(gap.length === 4){
            
            gapTop = gap[0] 
            gapRight = this.state.gap[1]
            gapBottom = this.state.gap[2] 
            gapLeft = this.state.gap[3]

        }else{
            gapTop = 40 
            gapRight = 40 
            gapBottom = 40 
            gapLeft = 40
        }

    }else{
        gapTop = gap 
        gapRight = gap 
        gapBottom = gap 
        gapLeft = gap 
    }

    var croperWidth = conParentWidth - (gapLeft + gapRight)


    return {
        croperWidth : conParentWidth - (gapLeft + gapRight),
        croperHeight : (croperWidth * ratio) - (gapTop + gapBottom),
        containerWidth : conParentWidth,
        containerHeight : (croperWidth * ratio),
        croperRight : gapRight,
        croperBottom : gapBottom,
        croperTop : gapTop, 
        croperLeft : gapLeft,
    }


}
