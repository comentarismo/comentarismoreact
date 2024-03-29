import React from 'util/safe-react';
var createReactClass = require('create-react-class');

//The MIT License (MIT) Copyright (c) 2016 React Image Slider
export default createReactClass({
    getDefaultProps() {
        return {
            isInfinite: true,
            delay: 10000,
            visibleItems: 1
        }
    },
    getInitialState() {
        return {
            images: [],
            currentPosition: 0,
            interval: null
        };
    },
    componentDidMount() {
        this.animate();
        this.setVisibleItems(this.props.visibleItems);

        window.addEventListener('resize', this.setVisibleItems.bind(this, this.props.visibleItems));
    },
    componentWillMount() {
        const images = (this.props.images || []).map((image, count) => {
            return image
        });
        this.setState({images});
    },
    componentWillUnmount() {
        window.removeEventListener('resize', this.setVisibleItems.bind(this, this.props.visibleItems));
    },
    scrollLeft() {
        this.updatePosition(this.state.currentPosition - 1);
        this.animate();
    },
    scrollRight() {
        this.updatePosition(this.state.currentPosition + 1);
        this.animate();
    },
    updatePosition(position) {
        const whole = position + (this.state.visibleItems || this.props.visibleItems);

        if (this.props.isInfinite && position < 0) {
            this.setState({currentPosition: whole});
        }

        if (this.props.isInfinite && whole > this.state.images.length) {
            this.setState({currentPosition: 0});
        }

        if (whole > this.state.images.length || position < 0) {
            return;
        }

        this.setState({currentPosition: position});
    },
    calculateShift(offset, amount) {
        return offset * amount;
    },
    setVisibleItems(visibleItems) {
        const windowWidth = window.innerWidth;

        if (windowWidth < 720) {
            this.setState({visibleItems: 1});
        } else {
            this.setState({visibleItems});
        }
    },
    sliderStyle(classname) {
        const items = document.getElementsByClassName(classname);
        const itemWidth = (items[0]) ? items[0].offsetWidth : 0;
        const shift = this.calculateShift(itemWidth, this.state.currentPosition);
        const transform = `translateX(-${shift}px)`;

        return {transform};
    },
    isOpaque(key) {
        const nextPosition = (this.state.visibleItems || this.props.visibleItems) + this.state.currentPosition;
        const opaque = this.state.images.slice(this.state.currentPosition, nextPosition);

        return (opaque.indexOf(this.state.images[key]) !== -1);
    },
    animate() {
        if (this.state.interval) {
            clearInterval(this.state.interval);
        }

        if (!this.props.delay) {
            return false;
        }

        const interval = setInterval(this.scrollRight, this.props.delay);
        this.setState({interval});
    },
    render() {
        const sliderStyle = this.sliderStyle('rsc-slider-item');
        const images = this.state.images;


        if (typeof window !== 'undefined') {

            return (
                <div className="rsc-container">
                    <div className="rsc-slider" style={sliderStyle}>
                        {images.map((item, key) => {
                            const isOpaque = this.isOpaque(key);
                            const itemClass = (isOpaque) ? 'rsc-slider-item' : 'rsc-slider-item rsc-slider-item_transparent';
                            const imgWidth = 100 / (this.state.visibleItems || this.props.visibleItems);
                            const itemStyle = {'flex': `0 0 ${imgWidth}%`};

                            return <div className={itemClass} style={itemStyle} key={key}>
                                <img src={item} className="rsc-slider-item-img"/>
                            </div>
                        })}
                    </div>
                    {images.length > (this.state.visibleItems || this.props.visibleItems) ?
                        <div>
                            <div className="rsc-navigation rsc-navigation_left rsc-arrow_left"
                                 onClick={this.scrollLeft}></div>
                            <div className="rsc-navigation rsc-navigation_right rsc-arrow_right"
                                 onClick={this.scrollRight}></div>
                        </div>
                        : null}
                </div>
            );
        } else {
            return <div/>;
        }
    }
});
