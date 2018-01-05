require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"AnimationCall":[function(require,module,exports){
"use strict";
cc._RFpush(module, 'c63af7l+zFDYo+lEkCd8Pk6', 'AnimationCall');
// Script/AnimationCall.js

cc.Class({
    'extends': cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
    },

    // use this for initialization
    onLoad: function onLoad() {},
    onRotate180: function onRotate180() {
        cc.log('.....ani callback');

        var HelloWorld = this.node.parent.getComponent('HelloWorld');
        cc.log(HelloWorld);
        HelloWorld.onRotate180();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

cc._RFpop();
},{}],"Config":[function(require,module,exports){
"use strict";
cc._RFpush(module, '14503Ztv4ZIQ7m7RhW0MXWg', 'Config');
// Script/Config.js

var Config = Config || {};
Config.gearInfo = ['2x', '6x', '2x', '4x', '5x', '4x', '8x', '4x', '3x', '5x', '3x', '10x', '6x', '2x', '2x', '3x', '10x', '8x'];

module.exports = Config;

cc._RFpop();
},{}],"HelloWorld":[function(require,module,exports){
"use strict";
cc._RFpush(module, '280c3rsZJJKnZ9RqbALVwtK', 'HelloWorld');
// Script/HelloWorld.js

cc.Class({
    'extends': cc.Component,

    properties: {
        label: {
            'default': null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!',
        cocosSp: {
            'default': null,
            type: cc.Sprite
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        this.label.string = this.text;

        // 动态创建
        var node = new cc.Node('nodenew');
        var sp = node.addComponent(cc.Sprite);
        sp.spriteFrame = new cc.SpriteFrame(cc.url.raw('resources/start0.png'));
        node.parent = this.node;
        // 销毁
        // this.node.getChildByName('nodenew').destroy();
    },

    // called every frame
    update: function update(dt) {},

    onPlayBtn: function onPlayBtn(event) {
        cc.log('.....event:' + event);
        var ani = this.cocosSp.getComponent(cc.Animation);
        ani.play('testAniClip');
    },

    onRotate180: function onRotate180() {
        cc.log('.....HelloWorld.js ani callback');
        var label = this.node.getChildByName('showLabel');
        label.getComponent(cc.Animation).play('labelClip');
    }
});

cc._RFpop();
},{}],"Wheel":[function(require,module,exports){
"use strict";
cc._RFpush(module, '5261c81JlpM0JY8b6TQZadt', 'Wheel');
// Script/Wheel.js

cc.Class({
    "extends": cc.Component,

    properties: {
        spinBtn: {
            "default": null, // The default value will be used only when the component attachin                    // to a node for the first time
            type: cc.Button, // optional, default is typeof default
            visible: true, // optional, default is true
            displayName: 'SpinBtn' },
        // optional
        wheelSp: {
            "default": null,
            type: cc.Sprite
        },
        maxSpeed: {
            "default": 5,
            type: cc.Float,
            max: 10,
            min: 2
        },
        duration: {
            "default": 3,
            type: cc.Float,
            max: 5,
            min: 1,
            tooltip: "减速前旋转时间"
        },
        acc: {
            "default": 0.1,
            type: cc.Float,
            max: 0.2,
            min: 0.01,
            tooltip: "加速度"
        },
        targetID: {
            "default": 0,
            type: cc.Integer,
            max: 17,
            min: 0,
            tooltip: "指定结束时的齿轮"
        },
        springback: {
            "default": true,
            tooltip: "旋转结束是否回弹"
        },
        effectAudio: {
            "default": null,
            url: cc.AudioClip
        }
    },

    // use this for initialization
    onLoad: function onLoad() {
        cc.log("....onload");
        this.wheelState = 0;
        this.curSpeed = 0;
        this.spinTime = 0; //减速前旋转时间
        this.gearNum = 18;
        this.defaultAngle = 360 / 18 / 2; //修正默认角度
        this.gearAngle = 360 / this.gearNum; //每个齿轮的角度
        this.wheelSp.node.rotation = this.defaultAngle;
        this.finalAngle = 0; //最终结果指定的角度
        this.effectFlag = 0; //用于音效播放

        if (!cc.sys.isBrowser) {
            cc.loader.loadRes('Sound/game_turntable', function (err, res) {
                if (err) {
                    cc.log('...err:' + err);
                }
            });
        }
        this.spinBtn.node.on(cc.Node.EventType.TOUCH_END, (function (event) {
            cc.log("begin spin");
            if (this.wheelState !== 0) {
                return;
            }
            this.decAngle = 2 * 360; // 减速旋转两圈
            this.wheelState = 1;
            this.curSpeed = 0;
            this.spinTime = 0;
            // var act = cc.rotateTo(10, 360*10);
            // this.wheelSp.node.runAction(act.easing(cc.easeSineInOut()));
        }).bind(this));
    },

    start: function start() {
        // cc.log('....start');
    },

    caculateFinalAngle: function caculateFinalAngle(targetID) {
        this.finalAngle = 360 - this.targetID * this.gearAngle + this.defaultAngle;
        if (this.springback) {
            this.finalAngle += this.gearAngle;
        }
    },
    editBoxDidBegin: function editBoxDidBegin(edit) {},
    editBoxDidChanged: function editBoxDidChanged(text) {},
    editBoxDidEndEditing: function editBoxDidEndEditing(edit) {
        var res = parseInt(edit.string);
        if (isNaN(res)) {
            if (cc.sys.isBrowser) {
                alert('please input a number!');
            } else cc.log(".....invalid input");
            this.targetID = Math.round(Math.random() * (this.gearNum - 1));
            return;
        }
        this.targetID = res;
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.wheelState === 0) {
            return;
        }
        // cc.log('......update');
        // cc.log('......state=%d',this.wheelState);

        this.effectFlag += this.curSpeed;
        if (!cc.sys.isBrowser && this.effectFlag >= this.gearAngle) {
            if (this.audioID) {}
            // cc.audioEngine.pauseEffect(this.audioID);

            // this.audioID = cc.audioEngine.playEffect(this.effectAudio,false);
            this.audioID = cc.audioEngine.playEffect(cc.url.raw('resources/Sound/game_turntable.mp3'));
            this.effectFlag = 0;
        }
        if (this.wheelState == 1) {
            // cc.log('....加速,speed:' + this.curSpeed);
            this.spinTime += dt;
            this.wheelSp.node.rotation = this.wheelSp.node.rotation + this.curSpeed;
            if (this.curSpeed <= this.maxSpeed) {
                this.curSpeed += this.acc;
            } else {
                if (this.spinTime < this.duration) {
                    return;
                }
                // cc.log('....开始减速');
                //设置目标角度
                this.finalAngle = 360 - this.targetID * this.gearAngle + this.defaultAngle;
                this.maxSpeed = this.curSpeed;
                if (this.springback) {
                    this.finalAngle += this.gearAngle;
                }
                this.wheelSp.node.rotation = this.finalAngle;
                this.wheelState = 2;
            }
        } else if (this.wheelState == 2) {
            // cc.log('......减速');
            var curRo = this.wheelSp.node.rotation; //应该等于finalAngle
            var hadRo = curRo - this.finalAngle;
            this.curSpeed = this.maxSpeed * ((this.decAngle - hadRo) / this.decAngle) + 0.2;
            this.wheelSp.node.rotation = curRo + this.curSpeed;

            if (this.decAngle - hadRo <= 0) {
                // cc.log('....停止');
                this.wheelState = 0;
                this.wheelSp.node.rotation = this.finalAngle;
                if (this.springback) {
                    //倒转一个齿轮
                    var act = new cc.rotateBy(0.6, -this.gearAngle);
                    var seq = cc.sequence(new cc.delayTime(0.2), act, cc.callFunc(this.showRes, this));
                    this.wheelSp.node.runAction(seq);
                } else {
                    this.showRes();
                }
            }
        }
    },
    showRes: function showRes() {
        var Config = require("Config");
        if (cc.sys.isBrowser) {
            alert('You have got ' + Config.gearInfo[this.targetID]);
        } else cc.log(Config.gearInfo[this.targetID]);
    }
});

cc._RFpop();
},{"Config":"Config"}]},{},["Config","HelloWorld","Wheel","AnimationCall"])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL0FwcGxpY2F0aW9ucy9Db2Nvc0NyZWF0b3IuYXBwL0NvbnRlbnRzL1Jlc291cmNlcy9hcHAuYXNhci9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiYXNzZXRzL1NjcmlwdC9BbmltYXRpb25DYWxsLmpzIiwiYXNzZXRzL1NjcmlwdC9Db25maWcuanMiLCJhc3NldHMvU2NyaXB0L0hlbGxvV29ybGQuanMiLCJhc3NldHMvU2NyaXB0L1doZWVsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJ2M2M2FmN2wrekZEWW8rbEVrQ2Q4UGs2JywgJ0FuaW1hdGlvbkNhbGwnKTtcbi8vIFNjcmlwdC9BbmltYXRpb25DYWxsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgLy8gZm9vOiB7XG4gICAgICAgIC8vICAgIGRlZmF1bHQ6IG51bGwsICAgICAgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluZ1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvIGEgbm9kZSBmb3IgdGhlIGZpcnN0IHRpbWVcbiAgICAgICAgLy8gICAgdXJsOiBjYy5UZXh0dXJlMkQsICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0eXBlb2YgZGVmYXVsdFxuICAgICAgICAvLyAgICBzZXJpYWxpemFibGU6IHRydWUsIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHRydWVcbiAgICAgICAgLy8gICAgdmlzaWJsZTogdHJ1ZSwgICAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgIC8vICAgIGRpc3BsYXlOYW1lOiAnRm9vJywgLy8gb3B0aW9uYWxcbiAgICAgICAgLy8gICAgcmVhZG9ubHk6IGZhbHNlLCAgICAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyBmYWxzZVxuICAgICAgICAvLyB9LFxuICAgICAgICAvLyAuLi5cbiAgICB9LFxuXG4gICAgLy8gdXNlIHRoaXMgZm9yIGluaXRpYWxpemF0aW9uXG4gICAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7fSxcbiAgICBvblJvdGF0ZTE4MDogZnVuY3Rpb24gb25Sb3RhdGUxODAoKSB7XG4gICAgICAgIGNjLmxvZygnLi4uLi5hbmkgY2FsbGJhY2snKTtcblxuICAgICAgICB2YXIgSGVsbG9Xb3JsZCA9IHRoaXMubm9kZS5wYXJlbnQuZ2V0Q29tcG9uZW50KCdIZWxsb1dvcmxkJyk7XG4gICAgICAgIGNjLmxvZyhIZWxsb1dvcmxkKTtcbiAgICAgICAgSGVsbG9Xb3JsZC5vblJvdGF0ZTE4MCgpO1xuICAgIH1cbiAgICAvLyBjYWxsZWQgZXZlcnkgZnJhbWUsIHVuY29tbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGFjdGl2YXRlIHVwZGF0ZSBjYWxsYmFja1xuICAgIC8vIHVwZGF0ZTogZnVuY3Rpb24gKGR0KSB7XG5cbiAgICAvLyB9LFxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICcxNDUwM1p0djRaSVE3bTdSaFcwTVhXZycsICdDb25maWcnKTtcbi8vIFNjcmlwdC9Db25maWcuanNcblxudmFyIENvbmZpZyA9IENvbmZpZyB8fCB7fTtcbkNvbmZpZy5nZWFySW5mbyA9IFsnMngnLCAnNngnLCAnMngnLCAnNHgnLCAnNXgnLCAnNHgnLCAnOHgnLCAnNHgnLCAnM3gnLCAnNXgnLCAnM3gnLCAnMTB4JywgJzZ4JywgJzJ4JywgJzJ4JywgJzN4JywgJzEweCcsICc4eCddO1xuXG5tb2R1bGUuZXhwb3J0cyA9IENvbmZpZztcblxuY2MuX1JGcG9wKCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5jYy5fUkZwdXNoKG1vZHVsZSwgJzI4MGMzcnNaSkpLblo5UnFiQUxWd3RLJywgJ0hlbGxvV29ybGQnKTtcbi8vIFNjcmlwdC9IZWxsb1dvcmxkLmpzXG5cbmNjLkNsYXNzKHtcbiAgICAnZXh0ZW5kcyc6IGNjLkNvbXBvbmVudCxcblxuICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLkxhYmVsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIGRlZmF1bHRzLCBzZXQgdmlzdWFsbHkgd2hlbiBhdHRhY2hpbmcgdGhpcyBzY3JpcHQgdG8gdGhlIENhbnZhc1xuICAgICAgICB0ZXh0OiAnSGVsbG8sIFdvcmxkIScsXG4gICAgICAgIGNvY29zU3A6IHtcbiAgICAgICAgICAgICdkZWZhdWx0JzogbnVsbCxcbiAgICAgICAgICAgIHR5cGU6IGNjLlNwcml0ZVxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICB0aGlzLmxhYmVsLnN0cmluZyA9IHRoaXMudGV4dDtcblxuICAgICAgICAvLyDliqjmgIHliJvlu7pcbiAgICAgICAgdmFyIG5vZGUgPSBuZXcgY2MuTm9kZSgnbm9kZW5ldycpO1xuICAgICAgICB2YXIgc3AgPSBub2RlLmFkZENvbXBvbmVudChjYy5TcHJpdGUpO1xuICAgICAgICBzcC5zcHJpdGVGcmFtZSA9IG5ldyBjYy5TcHJpdGVGcmFtZShjYy51cmwucmF3KCdyZXNvdXJjZXMvc3RhcnQwLnBuZycpKTtcbiAgICAgICAgbm9kZS5wYXJlbnQgPSB0aGlzLm5vZGU7XG4gICAgICAgIC8vIOmUgOavgVxuICAgICAgICAvLyB0aGlzLm5vZGUuZ2V0Q2hpbGRCeU5hbWUoJ25vZGVuZXcnKS5kZXN0cm95KCk7XG4gICAgfSxcblxuICAgIC8vIGNhbGxlZCBldmVyeSBmcmFtZVxuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKGR0KSB7fSxcblxuICAgIG9uUGxheUJ0bjogZnVuY3Rpb24gb25QbGF5QnRuKGV2ZW50KSB7XG4gICAgICAgIGNjLmxvZygnLi4uLi5ldmVudDonICsgZXZlbnQpO1xuICAgICAgICB2YXIgYW5pID0gdGhpcy5jb2Nvc1NwLmdldENvbXBvbmVudChjYy5BbmltYXRpb24pO1xuICAgICAgICBhbmkucGxheSgndGVzdEFuaUNsaXAnKTtcbiAgICB9LFxuXG4gICAgb25Sb3RhdGUxODA6IGZ1bmN0aW9uIG9uUm90YXRlMTgwKCkge1xuICAgICAgICBjYy5sb2coJy4uLi4uSGVsbG9Xb3JsZC5qcyBhbmkgY2FsbGJhY2snKTtcbiAgICAgICAgdmFyIGxhYmVsID0gdGhpcy5ub2RlLmdldENoaWxkQnlOYW1lKCdzaG93TGFiZWwnKTtcbiAgICAgICAgbGFiZWwuZ2V0Q29tcG9uZW50KGNjLkFuaW1hdGlvbikucGxheSgnbGFiZWxDbGlwJyk7XG4gICAgfVxufSk7XG5cbmNjLl9SRnBvcCgpOyIsIlwidXNlIHN0cmljdFwiO1xuY2MuX1JGcHVzaChtb2R1bGUsICc1MjYxYzgxSmxwTTBKWThiNlRRWmFkdCcsICdXaGVlbCcpO1xuLy8gU2NyaXB0L1doZWVsLmpzXG5cbmNjLkNsYXNzKHtcbiAgICBcImV4dGVuZHNcIjogY2MuQ29tcG9uZW50LFxuXG4gICAgcHJvcGVydGllczoge1xuICAgICAgICBzcGluQnRuOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogbnVsbCwgLy8gVGhlIGRlZmF1bHQgdmFsdWUgd2lsbCBiZSB1c2VkIG9ubHkgd2hlbiB0aGUgY29tcG9uZW50IGF0dGFjaGluICAgICAgICAgICAgICAgICAgICAvLyB0byBhIG5vZGUgZm9yIHRoZSBmaXJzdCB0aW1lXG4gICAgICAgICAgICB0eXBlOiBjYy5CdXR0b24sIC8vIG9wdGlvbmFsLCBkZWZhdWx0IGlzIHR5cGVvZiBkZWZhdWx0XG4gICAgICAgICAgICB2aXNpYmxlOiB0cnVlLCAvLyBvcHRpb25hbCwgZGVmYXVsdCBpcyB0cnVlXG4gICAgICAgICAgICBkaXNwbGF5TmFtZTogJ1NwaW5CdG4nIH0sXG4gICAgICAgIC8vIG9wdGlvbmFsXG4gICAgICAgIHdoZWVsU3A6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiBudWxsLFxuICAgICAgICAgICAgdHlwZTogY2MuU3ByaXRlXG4gICAgICAgIH0sXG4gICAgICAgIG1heFNwZWVkOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogNSxcbiAgICAgICAgICAgIHR5cGU6IGNjLkZsb2F0LFxuICAgICAgICAgICAgbWF4OiAxMCxcbiAgICAgICAgICAgIG1pbjogMlxuICAgICAgICB9LFxuICAgICAgICBkdXJhdGlvbjoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IDMsXG4gICAgICAgICAgICB0eXBlOiBjYy5GbG9hdCxcbiAgICAgICAgICAgIG1heDogNSxcbiAgICAgICAgICAgIG1pbjogMSxcbiAgICAgICAgICAgIHRvb2x0aXA6IFwi5YeP6YCf5YmN5peL6L2s5pe26Ze0XCJcbiAgICAgICAgfSxcbiAgICAgICAgYWNjOiB7XG4gICAgICAgICAgICBcImRlZmF1bHRcIjogMC4xLFxuICAgICAgICAgICAgdHlwZTogY2MuRmxvYXQsXG4gICAgICAgICAgICBtYXg6IDAuMixcbiAgICAgICAgICAgIG1pbjogMC4wMSxcbiAgICAgICAgICAgIHRvb2x0aXA6IFwi5Yqg6YCf5bqmXCJcbiAgICAgICAgfSxcbiAgICAgICAgdGFyZ2V0SUQ6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiAwLFxuICAgICAgICAgICAgdHlwZTogY2MuSW50ZWdlcixcbiAgICAgICAgICAgIG1heDogMTcsXG4gICAgICAgICAgICBtaW46IDAsXG4gICAgICAgICAgICB0b29sdGlwOiBcIuaMh+Wumue7k+adn+aXtueahOm9v+i9rlwiXG4gICAgICAgIH0sXG4gICAgICAgIHNwcmluZ2JhY2s6IHtcbiAgICAgICAgICAgIFwiZGVmYXVsdFwiOiB0cnVlLFxuICAgICAgICAgICAgdG9vbHRpcDogXCLml4vovaznu5PmnZ/mmK/lkKblm57lvLlcIlxuICAgICAgICB9LFxuICAgICAgICBlZmZlY3RBdWRpbzoge1xuICAgICAgICAgICAgXCJkZWZhdWx0XCI6IG51bGwsXG4gICAgICAgICAgICB1cmw6IGNjLkF1ZGlvQ2xpcFxuICAgICAgICB9XG4gICAgfSxcblxuICAgIC8vIHVzZSB0aGlzIGZvciBpbml0aWFsaXphdGlvblxuICAgIG9uTG9hZDogZnVuY3Rpb24gb25Mb2FkKCkge1xuICAgICAgICBjYy5sb2coXCIuLi4ub25sb2FkXCIpO1xuICAgICAgICB0aGlzLndoZWVsU3RhdGUgPSAwO1xuICAgICAgICB0aGlzLmN1clNwZWVkID0gMDtcbiAgICAgICAgdGhpcy5zcGluVGltZSA9IDA7IC8v5YeP6YCf5YmN5peL6L2s5pe26Ze0XG4gICAgICAgIHRoaXMuZ2Vhck51bSA9IDE4O1xuICAgICAgICB0aGlzLmRlZmF1bHRBbmdsZSA9IDM2MCAvIDE4IC8gMjsgLy/kv67mraPpu5jorqTop5LluqZcbiAgICAgICAgdGhpcy5nZWFyQW5nbGUgPSAzNjAgLyB0aGlzLmdlYXJOdW07IC8v5q+P5Liq6b2/6L2u55qE6KeS5bqmXG4gICAgICAgIHRoaXMud2hlZWxTcC5ub2RlLnJvdGF0aW9uID0gdGhpcy5kZWZhdWx0QW5nbGU7XG4gICAgICAgIHRoaXMuZmluYWxBbmdsZSA9IDA7IC8v5pyA57uI57uT5p6c5oyH5a6a55qE6KeS5bqmXG4gICAgICAgIHRoaXMuZWZmZWN0RmxhZyA9IDA7IC8v55So5LqO6Z+z5pWI5pKt5pS+XG5cbiAgICAgICAgaWYgKCFjYy5zeXMuaXNCcm93c2VyKSB7XG4gICAgICAgICAgICBjYy5sb2FkZXIubG9hZFJlcygnU291bmQvZ2FtZV90dXJudGFibGUnLCBmdW5jdGlvbiAoZXJyLCByZXMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXJyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNjLmxvZygnLi4uZXJyOicgKyBlcnIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3BpbkJ0bi5ub2RlLm9uKGNjLk5vZGUuRXZlbnRUeXBlLlRPVUNIX0VORCwgKGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICAgICAgY2MubG9nKFwiYmVnaW4gc3BpblwiKTtcbiAgICAgICAgICAgIGlmICh0aGlzLndoZWVsU3RhdGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmRlY0FuZ2xlID0gMiAqIDM2MDsgLy8g5YeP6YCf5peL6L2s5Lik5ZyIXG4gICAgICAgICAgICB0aGlzLndoZWVsU3RhdGUgPSAxO1xuICAgICAgICAgICAgdGhpcy5jdXJTcGVlZCA9IDA7XG4gICAgICAgICAgICB0aGlzLnNwaW5UaW1lID0gMDtcbiAgICAgICAgICAgIC8vIHZhciBhY3QgPSBjYy5yb3RhdGVUbygxMCwgMzYwKjEwKTtcbiAgICAgICAgICAgIC8vIHRoaXMud2hlZWxTcC5ub2RlLnJ1bkFjdGlvbihhY3QuZWFzaW5nKGNjLmVhc2VTaW5lSW5PdXQoKSkpO1xuICAgICAgICB9KS5iaW5kKHRoaXMpKTtcbiAgICB9LFxuXG4gICAgc3RhcnQ6IGZ1bmN0aW9uIHN0YXJ0KCkge1xuICAgICAgICAvLyBjYy5sb2coJy4uLi5zdGFydCcpO1xuICAgIH0sXG5cbiAgICBjYWN1bGF0ZUZpbmFsQW5nbGU6IGZ1bmN0aW9uIGNhY3VsYXRlRmluYWxBbmdsZSh0YXJnZXRJRCkge1xuICAgICAgICB0aGlzLmZpbmFsQW5nbGUgPSAzNjAgLSB0aGlzLnRhcmdldElEICogdGhpcy5nZWFyQW5nbGUgKyB0aGlzLmRlZmF1bHRBbmdsZTtcbiAgICAgICAgaWYgKHRoaXMuc3ByaW5nYmFjaykge1xuICAgICAgICAgICAgdGhpcy5maW5hbEFuZ2xlICs9IHRoaXMuZ2VhckFuZ2xlO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBlZGl0Qm94RGlkQmVnaW46IGZ1bmN0aW9uIGVkaXRCb3hEaWRCZWdpbihlZGl0KSB7fSxcbiAgICBlZGl0Qm94RGlkQ2hhbmdlZDogZnVuY3Rpb24gZWRpdEJveERpZENoYW5nZWQodGV4dCkge30sXG4gICAgZWRpdEJveERpZEVuZEVkaXRpbmc6IGZ1bmN0aW9uIGVkaXRCb3hEaWRFbmRFZGl0aW5nKGVkaXQpIHtcbiAgICAgICAgdmFyIHJlcyA9IHBhcnNlSW50KGVkaXQuc3RyaW5nKTtcbiAgICAgICAgaWYgKGlzTmFOKHJlcykpIHtcbiAgICAgICAgICAgIGlmIChjYy5zeXMuaXNCcm93c2VyKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoJ3BsZWFzZSBpbnB1dCBhIG51bWJlciEnKTtcbiAgICAgICAgICAgIH0gZWxzZSBjYy5sb2coXCIuLi4uLmludmFsaWQgaW5wdXRcIik7XG4gICAgICAgICAgICB0aGlzLnRhcmdldElEID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogKHRoaXMuZ2Vhck51bSAtIDEpKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnRhcmdldElEID0gcmVzO1xuICAgIH0sXG4gICAgLy8gY2FsbGVkIGV2ZXJ5IGZyYW1lLCB1bmNvbW1lbnQgdGhpcyBmdW5jdGlvbiB0byBhY3RpdmF0ZSB1cGRhdGUgY2FsbGJhY2tcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShkdCkge1xuICAgICAgICBpZiAodGhpcy53aGVlbFN0YXRlID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gY2MubG9nKCcuLi4uLi51cGRhdGUnKTtcbiAgICAgICAgLy8gY2MubG9nKCcuLi4uLi5zdGF0ZT0lZCcsdGhpcy53aGVlbFN0YXRlKTtcblxuICAgICAgICB0aGlzLmVmZmVjdEZsYWcgKz0gdGhpcy5jdXJTcGVlZDtcbiAgICAgICAgaWYgKCFjYy5zeXMuaXNCcm93c2VyICYmIHRoaXMuZWZmZWN0RmxhZyA+PSB0aGlzLmdlYXJBbmdsZSkge1xuICAgICAgICAgICAgaWYgKHRoaXMuYXVkaW9JRCkge31cbiAgICAgICAgICAgIC8vIGNjLmF1ZGlvRW5naW5lLnBhdXNlRWZmZWN0KHRoaXMuYXVkaW9JRCk7XG5cbiAgICAgICAgICAgIC8vIHRoaXMuYXVkaW9JRCA9IGNjLmF1ZGlvRW5naW5lLnBsYXlFZmZlY3QodGhpcy5lZmZlY3RBdWRpbyxmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLmF1ZGlvSUQgPSBjYy5hdWRpb0VuZ2luZS5wbGF5RWZmZWN0KGNjLnVybC5yYXcoJ3Jlc291cmNlcy9Tb3VuZC9nYW1lX3R1cm50YWJsZS5tcDMnKSk7XG4gICAgICAgICAgICB0aGlzLmVmZmVjdEZsYWcgPSAwO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLndoZWVsU3RhdGUgPT0gMSkge1xuICAgICAgICAgICAgLy8gY2MubG9nKCcuLi4u5Yqg6YCfLHNwZWVkOicgKyB0aGlzLmN1clNwZWVkKTtcbiAgICAgICAgICAgIHRoaXMuc3BpblRpbWUgKz0gZHQ7XG4gICAgICAgICAgICB0aGlzLndoZWVsU3Aubm9kZS5yb3RhdGlvbiA9IHRoaXMud2hlZWxTcC5ub2RlLnJvdGF0aW9uICsgdGhpcy5jdXJTcGVlZDtcbiAgICAgICAgICAgIGlmICh0aGlzLmN1clNwZWVkIDw9IHRoaXMubWF4U3BlZWQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1clNwZWVkICs9IHRoaXMuYWNjO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zcGluVGltZSA8IHRoaXMuZHVyYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvLyBjYy5sb2coJy4uLi7lvIDlp4vlh4/pgJ8nKTtcbiAgICAgICAgICAgICAgICAvL+iuvue9ruebruagh+inkuW6plxuICAgICAgICAgICAgICAgIHRoaXMuZmluYWxBbmdsZSA9IDM2MCAtIHRoaXMudGFyZ2V0SUQgKiB0aGlzLmdlYXJBbmdsZSArIHRoaXMuZGVmYXVsdEFuZ2xlO1xuICAgICAgICAgICAgICAgIHRoaXMubWF4U3BlZWQgPSB0aGlzLmN1clNwZWVkO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLnNwcmluZ2JhY2spIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5maW5hbEFuZ2xlICs9IHRoaXMuZ2VhckFuZ2xlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLndoZWVsU3Aubm9kZS5yb3RhdGlvbiA9IHRoaXMuZmluYWxBbmdsZTtcbiAgICAgICAgICAgICAgICB0aGlzLndoZWVsU3RhdGUgPSAyO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMud2hlZWxTdGF0ZSA9PSAyKSB7XG4gICAgICAgICAgICAvLyBjYy5sb2coJy4uLi4uLuWHj+mAnycpO1xuICAgICAgICAgICAgdmFyIGN1clJvID0gdGhpcy53aGVlbFNwLm5vZGUucm90YXRpb247IC8v5bqU6K+l562J5LqOZmluYWxBbmdsZVxuICAgICAgICAgICAgdmFyIGhhZFJvID0gY3VyUm8gLSB0aGlzLmZpbmFsQW5nbGU7XG4gICAgICAgICAgICB0aGlzLmN1clNwZWVkID0gdGhpcy5tYXhTcGVlZCAqICgodGhpcy5kZWNBbmdsZSAtIGhhZFJvKSAvIHRoaXMuZGVjQW5nbGUpICsgMC4yO1xuICAgICAgICAgICAgdGhpcy53aGVlbFNwLm5vZGUucm90YXRpb24gPSBjdXJSbyArIHRoaXMuY3VyU3BlZWQ7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmRlY0FuZ2xlIC0gaGFkUm8gPD0gMCkge1xuICAgICAgICAgICAgICAgIC8vIGNjLmxvZygnLi4uLuWBnOatoicpO1xuICAgICAgICAgICAgICAgIHRoaXMud2hlZWxTdGF0ZSA9IDA7XG4gICAgICAgICAgICAgICAgdGhpcy53aGVlbFNwLm5vZGUucm90YXRpb24gPSB0aGlzLmZpbmFsQW5nbGU7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3ByaW5nYmFjaykge1xuICAgICAgICAgICAgICAgICAgICAvL+WAkui9rOS4gOS4qum9v+i9rlxuICAgICAgICAgICAgICAgICAgICB2YXIgYWN0ID0gbmV3IGNjLnJvdGF0ZUJ5KDAuNiwgLXRoaXMuZ2VhckFuZ2xlKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlcSA9IGNjLnNlcXVlbmNlKG5ldyBjYy5kZWxheVRpbWUoMC4yKSwgYWN0LCBjYy5jYWxsRnVuYyh0aGlzLnNob3dSZXMsIHRoaXMpKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGVlbFNwLm5vZGUucnVuQWN0aW9uKHNlcSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaG93UmVzKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSxcbiAgICBzaG93UmVzOiBmdW5jdGlvbiBzaG93UmVzKCkge1xuICAgICAgICB2YXIgQ29uZmlnID0gcmVxdWlyZShcIkNvbmZpZ1wiKTtcbiAgICAgICAgaWYgKGNjLnN5cy5pc0Jyb3dzZXIpIHtcbiAgICAgICAgICAgIGFsZXJ0KCdZb3UgaGF2ZSBnb3QgJyArIENvbmZpZy5nZWFySW5mb1t0aGlzLnRhcmdldElEXSk7XG4gICAgICAgIH0gZWxzZSBjYy5sb2coQ29uZmlnLmdlYXJJbmZvW3RoaXMudGFyZ2V0SURdKTtcbiAgICB9XG59KTtcblxuY2MuX1JGcG9wKCk7Il19
