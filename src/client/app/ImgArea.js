import React, {Component, PropTypes} from 'react';
import Gestures from './gestures';
// import './ImgArea.css';
import classNames from 'classnames';

export default class ImgArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pinch:1,
            angle:0,
            left:0,
            top:0,
            animating: false,
            scale: false
        };
        this.pinch = 1;
        this.left = 0;
        this.top = 0;
        this.angle = 0;
        this.doubleTapped = false;
        this.onPinch = this.onPinch.bind(this);
        this.onRotate = this.onRotate.bind(this);
        this.onMove = this.onMove.bind(this);
        this.onDoubleTap = this.onDoubleTap.bind(this);
        this.onLongPress = this.onLongPress.bind(this);
    }

    onPinch(event) {
        this.pinch += event.scale;
        this.setState({
            pinch: this.pinch
        })
    } 

    onRotate(event) {
        this.angle += event.angle
        this.setState({
          angle:this.angle
        });
    }

    onMove(event) {
        this.left += event.deltaX;
        this.top += event.deltaY;
        this.setState({
          left: this.left,
          top: this.top
        });
    }

    onLongPress() {
        console.log('longtap')
        this.setState({
            animating: true
        });
        setTimeout(()=>{
            this.setState({
                animating:false
            });
        }, 1000)
    }

      onDoubleTap() {
        if(this.doubleTapped) {
          this.pinch = 1;
          this.setState({
            scale: true,
            pinch: this.pinch
          });
          setTimeout(()=>{
            this.setState({
                scale: false
            })
          }, 500)
        } else {
          this.pinch = 2.5;
          this.setState({
            scale: true,
            pinch: this.pinch
          });
          setTimeout(()=> {
            this.setState({
                scale:false
            })
          }, 500)
        }
        this.doubleTapped = !this.doubleTapped;
      }

    render() {
        let { pinch,angle,left,top,animating, scale} = this.state;
        let imgStyle = {
            transform: `scale(${pinch}) rotateZ(${angle}deg)`,
            WebkitTransform: `scale(${pinch}) rotateZ(${angle}deg)`,
            left: `${left}px`,
            top: `${top}px`
        }
        let imgClasses = classNames('mi', 'flash', {animated:animating}, {scale:scale})
        return (
            <div>
                <Gestures onPinch={this.onPinch} onMove={this.onMove} onRotate={this.onRotate} onDoubleTap={this.onDoubleTap} onLongPress={this.onLongPress}>
                    <div className="wrapper">
                        <img className={imgClasses} style={imgStyle} src="mi.jpg" alt=""/>
                    </div>
                </Gestures>
                <div>
                    <label>放大</label> <span>{this.state.pinch}</span><br/>
                    <label>旋转</label> <span>{this.state.angle}</span>
                </div>
            </div>
            )
    }
}