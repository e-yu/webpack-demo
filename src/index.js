import React from 'react';
import ReactDom from 'react-dom';

//css
require('./main.scss');

var imageDatas = require('./data/imageDatas.json');

imageDatas = (function (imageDatasArr) {
    for (var i = 0, j = imageDatasArr.length; i < j; i++) {
        var singleImageData = imageDatasArr[i];
        singleImageData.imageURL = require('./images/' + singleImageData.fileName);

        imageDatasArr[i] = singleImageData;
    }
    return imageDatasArr;
})(imageDatas);

/*
*获取区间的一个随机值
*/
function getRangeRandom(low, high) {
    return Math.ceil(Math.random() * (high - low) + low);
}

/*
 *获取0~30度之间的一个任意正负值
 */
function get30DegRandom() {
    return ((Math.random() > 0.5 ? '' : '-') + Math.ceil(Math.random() * 30));
}

class ImgFigure extends React.Component {

    handleClick = (e) => {
        if(this.props.arrange.isCenter)
            this.props.inverse();
        else
            this.props.center();

        e.stopPropagation();
        e.preventDefault();
    }

    render() {

        let styleObj = {};

        if (this.props.arrange.pos) {
            styleObj=Object.assign(styleObj,this.props.arrange.pos);
        }

        //旋转角度
        if (this.props.arrange.rotate) {
            (['MozTransform', 'msTransform', 'WebkitTransform', 'transform']).forEach(function (value) {
                styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
            }.bind(this));
        }

        if(this.props.arrange.isCenter)
            styleObj.zIndex = 11 ;

        let imgFigureClassName = "img-figure";
        imgFigureClassName += this.props.arrange.isInverse ? " is-inverse" : "";

        return (
            <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
                <img src={this.props.data.imageURL}
                    alt={this.props.data.title} />
                <figcaption>
                    <h2 className="img-title">{this.props.data.title}</h2>
                    <div className="img-back" onClick={this.handleClick}>
                        <p>
                            {this.props.data.desc}
                        </p>
                    </div>
                </figcaption>
            </figure>
        );
    }
}

class ControllerUnit extends React.Component{
    handleClick = (e) => {
        if(this.props.arrange.isCenter){
            this.props.inverse();
        }
        else{
            this.props.center();
        }

        e.preventDefault();
        e.stopPropagation();
    }

    render(){
        let controllerUnitClassName = "controller-unit";

        if(this.props.arrange.isCenter){
            controllerUnitClassName += " is-center";

            if(this.props.arrange.isInverse){
                controllerUnitClassName += " is-inverse";
            }
        }
        return (
            <span className = {controllerUnitClassName} onClick={this.handleClick}></span>
        );
    }
}

class GalleryByReactApp extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            imgsArrangeArr: [
                /*{
                    pos:{
                        left:0,
                        top:0
                    },
                    rotate:0,  //旋转角度
                    isInverse:false， //图片正反面
                    isCenter:false，  //图片是否居中
                }*/
            ]
        }
    }

    Constant = {
        centerPos: {
            left: 0,
            right: 0
        },
        hPosRange: { //水平方向的取值范围
            leftSecX: [0, 0],
            rightSecX: [0, 0],
            y: [0, 0]
        },
        vPosRange: { //垂直方向的取值范围
            x: [0, 0],
            topY: [0, 0]
        }
    }

    /*
     *翻转图片
     */
    inverse = (index) => () => {
        let imgsArrangeArr = this.state.imgsArrangeArr;

        imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }

    /*
    *利用rearrange函数，居中对应index的图片
    */

    center = (index) => () => {this.rearrange(index);}

    /*
    *重新布局所有图片
    *@param centerIndex 指定居中排布哪个图片
    */
    rearrange(centerIndex) {
        let imgsArrangeArr = this.state.imgsArrangeArr;
        let Constant = this.Constant;
        let centerPos = Constant.centerPos;
        let hPosRange = Constant.hPosRange;
        let vPosRange = Constant.vPosRange;
        let hPosRangeLeftSecX = hPosRange.leftSecX;
        let hPosRangeRightSecX = hPosRange.rightSecX;
        let hPosRangeY = hPosRange.y;
        let vPosRangeTopY = vPosRange.topY;
        let vPosRangeX = vPosRange.x;

        let imgsArrangeTopArr = [];
        let topImgNum = Math.ceil(Math.random());
        //取一个或者不取
        let topImgSpliceIndex = 0;

        let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

        //首先居中centerIndex的图片
        imgsArrangeCenterArr[0] = {
            pos: centerPos,
            rotate:0,
            isCenter:true
        };

        

        //取出要布局上侧的图片的状态信息
        topImgSpliceIndex = Math.floor(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

        //布局位于上侧的图片
        imgsArrangeTopArr.forEach(function (value, index) {
            imgsArrangeTopArr[index] = {
                pos: {
                    top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
                    left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
                },
                rotate: get30DegRandom(),
                isCenter:false
            };
        });

        //布局左右两侧的图片
        for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
            let hPosRangeLORX = null;

            //前半部分布局左边，右半部分布局右边
            if (i < k) {
                hPosRangeLORX = hPosRangeLeftSecX;
            }
            else {
                hPosRangeLORX = hPosRangeRightSecX;
            }

            imgsArrangeArr[i] = {
                pos: {
                    top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
                    left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
                },
                rotate: get30DegRandom(),
                isCenter:false
            }
        }

        if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
            imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

        this.setState({
            imgsArrangeArr: imgsArrangeArr
        });
    }




    //组件加载之后，为每张图片计算其位置的范围
    componentDidMount() {
        // 首先拿到舞台的大小
        let stageDom = ReactDom.findDOMNode(this.refs.stage);
        let stageW = stageDom.scrollWidth;
        let stageH = stageDom.scrollHeight;
        let halfStageW = Math.ceil(stageW / 2);
        let halfStageH = Math.ceil(stageH / 2);

        //拿到一个imageFigure的大小
        let imgFigureDom = ReactDom.findDOMNode(this.refs.imgFigure0);
        let imgW = imgFigureDom.scrollWidth;
        let imgH = imgFigureDom.scrollHeight;
        let halfImgW = Math.ceil(imgW / 2);
        let halfImgH = Math.ceil(imgH / 2);

        //计算中心图片的位置点
        this.Constant.centerPos = {
            left: halfStageW - halfImgW,
            top: halfStageH - halfImgH
        }
        // Constant = {
        //     centerPos: {
        //         left: 0,
        //         right: 0
        //     },
        //     hPosRange: { //水平方向的取值范围
        //         leftSecX: [0, 0],
        //         rightSecX: [0, 0],
        //         y: [0, 0]
        //     },
        //     vPosRange: { //垂直方向的取值范围
        //         x: [0, 0],
        //         topY: [0, 0]
        //     }
        // }
        //计算左侧，右侧区域图片排布位置的取值范围
        this.Constant.hPosRange.leftSecX[0] = -halfImgW;
        this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
        this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
        this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
        this.Constant.hPosRange.y[0] = -halfImgH;
        this.Constant.hPosRange.y[1] = stageH - halfImgH;

        //计算上侧区域图片排布位置的取值范围
        this.Constant.vPosRange.topY[0] = -halfImgH;
        this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
        this.Constant.vPosRange.x[0] = halfStageW - imgW;
        this.Constant.vPosRange.x[1] = halfStageW;

        this.rearrange(0);
    }


    render() {
        let controllerUnits = [];
        let imgFigures = [];

        for (let i in imageDatas) {
            if (!this.state.imgsArrangeArr[i]) {
                this.state.imgsArrangeArr[i] = {
                    pos: {
                        left: 0,
                        top: 0
                    },
                    rotate: 0,
                    isInverse: false,
                    isCenter:false
                };
            }

            imgFigures.push(<ImgFigure key={i} data={imageDatas[i]} ref={"imgFigure" + i} arrange={this.state.imgsArrangeArr[i]} inverse={this.inverse(i)} center={this.center(i)}/>);

            controllerUnits.push(<ControllerUnit key={i} arrange={this.state.imgsArrangeArr[i]} inverse={this.inverse(i)} center={this.center(i)}/>);
        }

        return (
            <section className="stage" ref="stage">
                <section className="img-sec">
                    {imgFigures}
                </section>
                <nav className="controller-nav">
                    {controllerUnits}
                </nav>
            </section>

        );
    }
};

ReactDom.render(
    <GalleryByReactApp />, document.getElementById('content'));

module.exports = GalleryByReactApp;