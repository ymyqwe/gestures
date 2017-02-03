import React, {PropTypes, Component} from 'react';

export default class Gestures extends Component {
    constructor(props) {
        super(props);
        this._onTouchStart = this._onTouchStart.bind(this);
        this._onTouchMove = this._onTouchMove.bind(this);
        this._onTouchCancel = this._onTouchCancel.bind(this);
        this._onTouchEnd = this._onTouchEnd.bind(this);
        this._emitEvent = this._emitEvent.bind(this);
        this.startX = this.startY = this.moveX = this.moveY = null;
        this.previousPinchScale = 1;
        this.longTapTimeout = null;
    }
    _emitEvent(eventType, e) {
        let eventHandler = this.props[eventType];
        if (!eventHandler) return;
        eventHandler(e);
    }
    _getTime() {
        return new Date().getTime();
    }
    _getDistance(x,y) {
        return Math.sqrt(x * x + y * y);
    }
    _getRotateDirection(v1, v2) {
        return v1.x * v2.y - v2.x * v1.y;
    }
    _getRoateAngle(v1, v2) {
        let direction = this._getRotateDirection(v1, v2);
        direction = direction > 0 ? -1 : 1;
        let l1 = this._getDistance(v1.x, v1.y);
        let l2 = this._getDistance(v2.x, v2.y);
        let mr = l1*l2;
        if (mr === 0) return 0;
        let dot = v1.x * v2.x + v1.y * v2.y;
        let r = dot / mr;
        if (r>1) r = 1;
        if (r<-1) r = -1;
        return Math.acos(r) * direction * 180 / Math.PI;
    }
    _onTouchStart(e) {
        let point = e.touches ? e.touches[0] : e;
        this.startX = point.pageX;
        this.startY = point.pageY;
        window.clearTimeout(this.longTapTimeout);
        if(e.touches.length > 1) {
            let point2 = e.touches[1];
            let xLen = Math.abs(point2.pageX - this.startX);
            let yLen = Math.abs(point2.pageY - this.startY);
            this.touchDistance = this._getDistance(xLen, yLen);
            this.touchVector = {
                x: point2.pageX - this.startX,
                y: point2.pageY - this.startY
            };
        } else {
            this.startTime = this._getTime();
            this.longTapTimeout = setTimeout(()=>{
                this._emitEvent('onLongPress');
            }, 800);
            if (this.previousTouchPoint) {
                if(Math.abs(this.startX - this.previousTouchPoint.startX) < 10 && Math.abs(this.startY - this.previousTouchPoint.startY) < 10 &&
                    Math.abs(this.startTime - this.previousTouchTime) < 300) {
                    this._emitEvent('onDoubleTap');
                }
            }
            this.previousTouchTime = this.startTime;
            this.previousTouchPoint = {
                startX : this.startX,
                startY : this.startY
            };
        }
    }
    _onTouchMove(e) {
        let timestamp = this._getTime();
        if (e.touches.length > 1) {
            let xLen = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
            let yLen = Math.abs(e.touches[1].pageY - e.touches[1].pageY);
            let touchDistance = this._getDistance(xLen,yLen);
            if (this.touchDistance) {
                let pinchScale = touchDistance / this.touchDistance;
                this._emitEvent('onPinch', {scale:pinchScale - this.previousPinchScale});
                this.previousPinchScale = pinchScale;
            }
            if (this.touchVector) {
                let vector = {
                    x: e.touches[1].pageX - e.touches[0].pageX,
                    y: e.touches[1].pageY - e.touches[0].pageY
                }
                let angle = this._getRoateAngle(vector, this.touchVector)
                this._emitEvent('onRotate', {angle});
                this.touchVector.x = vector.x;
                this.touchVector.y = vector.y;
            } 
        } else {
            window.clearTimeout(this.longTapTimeout);
            let point = e.touches ? e.touches[0]:e;
            let deltaX = this.moveX === null ? 0 : point.pageX - this.moveX;
            let deltaY = this.moveY === null ? 0 : point.pageY - this.moveY;
            this._emitEvent('onMove', {deltaX, deltaY});
            this.moveX = point.pageX;
            this.moveY = point.pageY;
        }
        e.preventDefault();
    }
    _onTouchCancel(e) {
        this._onTouchEnd();
    }
    _onTouchEnd(e) {
        window.clearTimeout(this.longTapTimeout);
        let timestamp = this._getTime();
        if (this.moveX !== null && Math.abs(this.moveX - this.startX) > 10 || this.moveY !== null && Math.abs(this.moveY - this.startY) > 10) {
            if (timestamp - this.startTime < 500) {
                this._emitEvent('onSwipe');
            } 
        } else if (timestamp - this.startTime < 2000) {
            if (timestamp - this.startTime < 500) {
                this._emitEvent('onTap');
            }
            if (timestamp - this.startTime > 500) {
                this._emitEvent('onLongPress');
            }
        }
        this.startX = this.startY = this.moveX = this.moveY = null;
        this.previousPinchScale = 1;
    }
    render() {
        return React.cloneElement(React.Children.only(this.props.children), {
            onTouchStart: this._onTouchStart.bind(this),
            onTouchMove: this._onTouchMove.bind(this),
            onTouchCancel: this._onTouchCancel.bind(this),
            onTouchEnd: this._onTouchEnd.bind(this)
        });
    }
}

Gestures.propTypes = {
    onMove: PropTypes.func
}