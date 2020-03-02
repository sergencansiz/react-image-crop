import React, { Component } from 'react'
import {touchStart , touchEnd} from './toucStartEnd'
import {touchMove} from './touchMove'
import {getPositionAfterDrag , wheelZoom} from './helpers'

export class Cropper extends Component {


    constructor(props){
        super(props)
        this.image = React.createRef()
        this.croper = React.createRef()
        this.hasWindow = typeof window !== 'undefined'
        this.mousemoves = {
            mousedown : false,
            mouseup   : false,
            mousemove : false,
            mousedownOffsetX : null,
            mousedownOffsetY : null, 
            mousedownX : null,
            mousedownY : null,     
            mouseupOffsetX : null,         
            mouseupOffsetY : null,         
            mousemoveOffsetX : null,         
            mousemoveOffsetY : null,         
        }

        this.touches = {
            touchStart : false,
            touchEnd : false,
            touchMove  : false,
            touchStartX : null,
            touchStartY : null,
            touchEndX : null,
            touchEndY : null,
            touchmoveX : null,
            touchmoveY : null,
        }

        this.imageoffsets = {

        }
        this.state = {
            imageWidthHeight : this.imageWidthHeight.bind(this),
            file : null,
            ratio : this.props.ratio ? this.props.ratio : 10/16,
            maxWidth : this.props.maxWidth ? this.props.maxWidth : 600,
            scroll : 0,
            num : 3,
            posLines : null,
            croperHeight : null,
            croperWidth : null,
            imageHeight : null,
            imageWidth : null,
            naturalHeight : null,
            naturalWidth : null,
            mousemoves : this.mousemoves,
            touches : this.touches,
            imageTop : null,
            imageLeft : null,
            imageRight : null,
            imageBottom: null,
            imageOffsetLeft : null,
            imageOffsetRight : null,
            imageOffsetTop  : null,
            imageOffsetBottom : null,
        }
    }


    returnStyles = () => {
        let styles = {
            mainWraper : {

                position : 'relative',
                width: this.state.croperWidth,
                height: this.state.croperHeight,
                background : 'rgba(0,0,0,0.3)',
                overflow : 'hidden',
                padding: 40
            },
            cropWraper : {
                position: 'absolute',
                display: 'block',
                margin : '0 auto',
                width : this.state.croperWidth,
                maxWidth : this.state.maxWidth,
                maxHeight : this.state.maxHeight,
                height : this.state.croperHeight,
                background : 'transparent',
                border : '1px solid #999',
                borderRadius : '0px',
                // overflow : 'hidden',
            },
            cropInner : {
    
            },
            imageWraper : {

            },
            image : {
                position : 'absolute',
                left    : this.state.imageLeft,
                right   : this.state.imageRight,
                top     : this.state.imageTop,
                bottom  : this.state.imageBottom,
                width  : this.state.imageWidth,
                height : this.state.imageHeight,
                overflow : 'hidden',
                cursor:  'grab',
            }, 
            overlay : {
                position: 'absolute',
                top : 0,
                bottom: 0,
                left:0,
                right:0,
                textAlign:'left',
                border: '40px solid rgba(0,0,0,0.4)',
                pointerEvents: 'none',
              
    
            }           
        }

        return styles
    }

    // This function works in getDerivedStateFromProps function 
    // It create new Image and gets the natural dimensions
    imageWidthHeight = (file , state) => {

        var img = new Image();
        img.src  = file
        img.onload = () => {
            let naturalWidth = img.naturalWidth;
            let naturalHeight = img.naturalHeight;
            let ratio = state.croperHeight / naturalHeight  
            let newWidth = naturalWidth * ratio 
            let gap = (state.croperWidth - newWidth)

            this.setState({
                naturalHeight : naturalHeight,
                naturalWidth : naturalWidth,
                imageHeight : state.croperHeight,
                imageWidth  : newWidth,
                file        : file,
                imageLeft   : gap/2,
                imageRight  : gap/2,
                imageTop    : 0,
                imageBottom : 0,
            })
        }
    }

    static getDerivedStateFromProps = (props , state) => {

        if(props.file !== state.file ){
            // Update state with this function 
            state.imageWidthHeight(props.file , state)
            return null
        }else{
            return null
        }
    }
    

    componentDidMount(){
        var croper = document.getElementById('croper')
        var image = document.getElementById('image')
        
        if(window.innerWidth >= 600){
            var croperWidth = 600
        }else{
            var croperWidth = window.innerWidth
        }
        
        let croperHeight = croperWidth * this.state.ratio

        window.addEventListener('resize', this.handleResize);
        image.addEventListener('wheel', (e) => this.handleScroll(e));
        image.addEventListener('mousedown' , this.handleMouseDown)
        image.addEventListener('touchstart' , this.handleTouchStart)
        image.addEventListener('mousemove' , this.handleMouseMove)
        image.addEventListener('touchmove' , this.handleTouchMove)
        image.addEventListener('mouseup' , this.handleMouseUp)
        image.addEventListener('touchend' , this.handleTouchEnd)
        image.addEventListener('gesturestart' , this.handleGestureStart)
        image.addEventListener('ondrag' , this.handleOndrag)
        



        // Set Image Width and Height
        let ratio = this.state.naturalHeight / croperHeight
        let newWidth = this.state.naturalWidth * ratio  


        this.setState({
            croperHeight : croperHeight,
            croperWidth  : croperWidth,
            imageHeight : croperHeight,
            imageWidth  : newWidth,
            naturalHeight : this.state.naturalHeight,
            naturalWidth : this.state.naturalWidth,
            imageBottom : 0,
            imageTop: 0,
        }, () => {
            this.printPositionLines()
        })
    }

    handleResize = () => {
        let croperWidth

        if(window.innerWidth >= 600){
            croperWidth = 600
        }else{
            croperWidth = window.innerWidth
        }

        let croperHeight = croperWidth * this.state.ratio

        // When user resize restart dimonsions 
        let ratio = croperHeight / this.state.naturalHeight  
        let newWidth = this.state.naturalWidth * ratio 

        let gap = (croperWidth - newWidth)
        this.setState({
            //innerWidth : croperWidth,
            croperWidth: croperWidth,
            croperHeight : croperHeight,
            imageHeight : croperHeight,
            imageWidth  : newWidth,
            imageLeft : gap/2,
            imageRight : gap/2,
            imageTop : 0,
            imageBottom : 0,
            
        } , () => {
            this.printPositionLines()
        })
    }

    handleScroll = (e) => {
        e.preventDefault()
        //let imageHeight = this.state.imageHeight

        var Positions = wheelZoom(e, this.croper , this.image)


        if(Positions !== null){
            this.setState({
                imageTop : Positions.imageTop,
                imageBottom : Positions.imageBottom,
                imageLeft : Positions.imageLeft,
                imageRight : Positions.imageRight,
                imageHeight : Positions.imageHeight,
                imageWidth : Positions.imageWidth,
            })
        } 
    }

    static getMousePoint = (e) => ({
        x: Number(e.offsetX),
        y: Number(e.offsetY),
      })
    
    static getTouchPoint = (e) => {

        var rect = e.target.getBoundingClientRect();
        var bodyRect = document.body.getBoundingClientRect();
        var x = e.changedTouches[0].pageX - (rect.left - bodyRect.left);
        var y = e.changedTouches[0].pageY - (rect.top - bodyRect.top);

        return {
                 x: Number(x),
                 y: Number(y),
        }
    }


    handleMouseMove = (e) =>{
        console.log(e)
        var touch = {
            startX : this.state.mousemoves.mousedownOffsetX,
            startY : this.state.mousemoves.mousedownOffsetY,
        }
        //e.preventDefault()
        //When user moves image inside croper
        // It runs only if image width greater than croper width
        if(this.state.mousemoves.mousedown === true && this.mousemoves.mouseup === false){
            var moves = getPositionAfterDrag(Cropper.getMousePoint(e) , touch , this.croper, this.image)
            //console.log(moves)
            this.setState({
                imageLeft : moves.imageMoveLeft,
                imageRight : moves.imageMoveRight,
                imageTop : moves.imageMoveTop,
                imageBottom : moves.imageMoveBottom,
            })
        }


    }

    handleMouseDown = (e) => {
        e.preventDefault()
        console.log(e)
        this.mousemoves.mousedown = true
        this.mousemoves.mouseup = false
        this.mousemoves.mousedownOffsetX = e.offsetX
        this.mousemoves.mousedownOffsetY = e.offsetY
        this.setState({
            mousemoves : this.mousemoves
        })
    }

    handleMouseUp = (e) => {
        e.preventDefault()
        this.mousemoves.mousedown = false
        this.mousemoves.mouseup = true

        this.setState({
            mousemoves : this.mousemoves
        })
    }

    handleTouchStart = (e) => {
        e.preventDefault();
        var touches = e.changedTouches;

        var points = Cropper.getTouchPoint(e)
        this.touches.touchStart = true
        this.touches.touchEnd = false
        this.touches.touchStartX = points.x
        this.touches.touchStartY = points.y
        
        this.setState({
            touches : this.touches
        })
    }

    handleTouchEnd = (e) => {
        e.preventDefault();

        var points = Cropper.getTouchPoint(e)
        this.touches.touchStart = false
        this.touches.touchEnd = true
        this.touches.touchEndX = points.x
        this.touches.touchEndY = points.y
        
        this.setState({
            touches : this.touches
        })
    }


    handleTouchMove = (e) => {
        e.preventDefault()
        var touches = e.changedTouches
        
        if(touches.length === 1) {
            var touch = {
                startX : this.state.touches.touchStartX,
                startY : this.state.touches.touchStartY,
            }
            // It runs only if image width greater than croper width
            if(this.state.touches.touchStart === true && this.state.touches.touchEnd === false){
                var moves = getPositionAfterDrag(Cropper.getTouchPoint(e) , touch , this.croper, this.image)
                //console.log(moves)
                this.setState({
                    imageLeft : moves.imageMoveLeft,
                    imageRight : moves.imageMoveRight,
                    imageTop : moves.imageMoveTop,
                    imageBottom : moves.imageMoveBottom,
                })
            }
        }
    }

    handleGestureStart = (e) => {
        //e.preventDefault()

        //console.log(e)
    }

    handleOndrag = (e) => {

        console.log(e)

    }

    printPositionLines = () => {

        let result = []

        let left = (this.state.croperWidth / this.state.num) / 2
        let top = (this.state.croperHeight / this.state.num) / 2

        for(var i=0; i<this.state.num; i++){

            console.log('here')
            result.push(
                            <div key={i} style={{
                                position : 'absolute',
                                width: 1,
                                height : this.state.croperHeight,
                                left : left,
                                right : this.state.croperWidth - left,
                                background : '#eee',
                                // zIndex : -1000
                            }}></div>
                        )
            result.push(
                            <div key={i + 12} style={{
                                position : 'absolute',
                                width: this.state.croperWidth,
                                height : 1,
                                top : top,
                                bottom : this.state.croperHeight - top,
                                background : '#eee',
                                // zIndex : -1000
                            }}></div>
                        )

            left = left + (this.state.croperWidth / this.state.num)
            top = top + (this.state.croperHeight / this.state.num)
        }


        this.setState({
            posLines : result
        })

    }

    render() {
        return (
            <div style={this.returnStyles().mainWraper}>
                <div ref={this.croper} id="croper" style={this.returnStyles().cropWraper} className="photo-crop-wrapper">
                     <img ref={this.image} id="image" style={this.returnStyles().image} src={this.state.file} />
                </div>
                <div className="lineWraper" style={{userSselect: 'none'}}>
                        {this.state.posLines}
                </div>
                <div style={this.returnStyles().overlay}></div>
            </div>
        )
    }
}

export default Cropper
