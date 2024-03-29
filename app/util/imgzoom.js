(function (root, factory) {
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        root.ImageZoom = factory();
    }
}(this, function () {

    return function ImageZoom(container, options) {

        if (!container) {
            return;
        }
        var image;
        var originalImgWidth;
        var originalImgHeight;
        var div = document.createElement('div');
        var lensDiv = document.createElement('div');
        var zoomDiv;
        var zoomLens;
        var scaleX;
        var scaleY;
        var offset;
        var zoomLensWidth;
        var zoomLensHeight;

        function getOffset(el) {
            if (el) {
                var elRect = el.getBoundingClientRect();
                return {left: elRect.left, top: elRect.top};
            }
            return {left: 0, top: 0};
        }

        function leftLimit(min) {
            return options.width - min;
        }

        function topLimit(min) {
            return options.height - min;
        }

        function getValue(val, min, max) {
            if (val < min) {
                return min;
            }
            if (val > max) {
                return max;
            }
            return val;
        }

        function getPosition(v, min, max) {
            var value = getValue(v, min, max);
            return value - min;
        }

        function zoomLensLeft(left) {
            var leftMin = zoomLensWidth / 2;
            return getPosition(left, leftMin, leftLimit(leftMin));
        }

        function zoomLensTop(top) {
            var topMin = zoomLensHeight / 2;
            return getPosition(top, topMin, topLimit(topMin));
        }

        function setup() {

            // console.log("container, ",container)
            var img;
            if (options.img) {
                img = document.createElement('img');
                img.src = options.img;
                // here
                img.classList.add("img-thumbnail");
                image = container.appendChild(img);

            } else {
                image = container.children[0];
            }
            options = options || {};
            // console.log("Will setup with options, ",options)
            //container.style.position = 'absolute';
            //image.style.width = options.width + 'px' || 'auto';
            //image.style.height = options.height + 'px' || 'auto';
            zoomLens = container.appendChild(lensDiv);
            zoomLens.style.display = 'none';


            zoomDiv = container.appendChild(div);
            zoomDiv.style.width = options.zoomWidth + 'px';
            zoomDiv.style.height = options.height + 'px' || 'auto';
            zoomDiv.style.display = 'inline-block';

            //here
            zoomDiv.style.backgroundImage = 'url(' + options.imgzoom + ')';


            zoomDiv.style.backgroundRepeat = 'no-repeat';
            zoomDiv.style.display = 'none';

            image.onload = function () {
                originalImgWidth = image.naturalWidth;
                originalImgHeight = image.naturalHeight;
                zoomDiv.style.backgroundSize = originalImgWidth + 'px ' + originalImgHeight + 'px';

                scaleX = originalImgWidth / options.width;
                scaleY = originalImgHeight / options.height;
                offset = getOffset(image);
                zoomLensWidth = options.width / scaleX;
                zoomLensHeight = options.height / scaleY;
                //zoomLensWidth = originalImgWidth;
                //zoomLensHeight = originalImgHeight;

                zoomLens.style.width = zoomLensWidth + 'px';
                zoomLens.style.height = zoomLensHeight + 'px';
                zoomLens.style.position = 'absolute';
                zoomLens.style.background = 'white';
                zoomLens.style.opacity = 0.4;
                zoomLens.pointerEvents = 'none';

            };

            zoomDiv.classList.add("zoomDiv");
            zoomLens.classList.add("zoomLens");


            container.addEventListener('mousemove', events, false);
            container.addEventListener('mouseenter', events, false);
            container.addEventListener('mouseleave', events, false);
            container.addEventListener('scroll', events, false);
            window.addEventListener('scroll', events, false)
        }

        var events = {
            handleEvent: function(event) {
                switch(event.type) {
                    case 'mousemove': return this.handleMouseMove(event);
                    case 'mouseenter': return this.handleMouseEnter(event);
                    case 'mouseleave': return this.handleMouseLeave(event);
                    case 'scroll': return this.handleScroll(event);
                }
            },
            handleMouseMove: function(event) {
                var offsetX;
                var offsetY;
                var backgroundTop;
                var backgroundRight;
                var backgroundPosition;
                if (offset) {
                    offsetX = zoomLensLeft(event.clientX - offset.left);
                    offsetY = zoomLensTop(event.clientY - offset.top);
                    backgroundTop = offsetX * scaleX;
                    backgroundRight = offsetY * scaleY;
                    backgroundPosition = '-' + backgroundTop + 'px ' +  '-' + backgroundRight + 'px';
                    zoomDiv.style.backgroundPosition = backgroundPosition;
                    zoomLens.style.top = offsetY + 'px';
                    zoomLens.style.left = offsetX + 'px';
                }
            },
            handleMouseEnter: function() {
                zoomDiv.style.display  = 'inline-block';
                zoomLens.style.display = 'block';
            },
            handleMouseLeave: function() {
                zoomDiv.style.display  = 'none';
                zoomLens.style.display = 'none';
            },
            handleScroll: function() {
                offset = getOffset(image);
            }
        };
        setup();

        return {
            setup: function() {
                setup();
            },
            kill: function() {
                container.removeEventListener('mousemove', events, false);
                container.removeEventListener('mouseenter', events, false);
                zoomLens.removeEventListener('mouseleave', events, false);
                if (zoomLens && zoomDiv) {
                    container.removeChild(zoomLens);
                    container.removeChild(zoomDiv);
                }
                if (options.img) {
                    container.removeChild(image);
                }
            }
        }
    }
}));