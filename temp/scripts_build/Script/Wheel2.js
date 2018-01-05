"use strict";
cc._RFpush(module, '43655YKkbBBgZnejEy9xj3Y', 'Wheel2');
// Script/Wheel2.js

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
            "default": 3,
            type: cc.Float,
            max: 10,
            min: 2
        },
        duration: {
            "default": 3,
            type: cc.Float,
            max: 5,
            min: 1
        },
        acc: {
            "default": 0.1,
            type: cc.Float,
            max: 1,
            min: 0.01
        },
        targetID: {
            "default": 0,
            type: cc.Integer,
            max: 17,
            min: 0
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
        this.gearNum = 18; //齿轮数量
        this.defaultAngle = 360 / 18 / 2; //默认角度
        this.gearAngle = 360 / this.gearNum; //每个齿轮的角度
        this.effectFlag = 0; //用于音效播放控制
        this.finalAngle = 360 - this.targetID * this.gearAngle + this.defaultAngle; //最终结果指定的角度
        this.wheelSp.node.rotation = this.defaultAngle;

        this.spinBtn.node.on(cc.Node.EventType.TOUCH_END, (function (event) {
            cc.log("begin spin");
            if (this.wheelState != 0) {
                return;
            }
            this.decAngle = 2 * 360; // 减速旋转两圈
            this.wheelState = 1;
            this.curSpeed = 0;
            this.spinTime = 0;
        }).bind(this));
    },

    start: function start() {
        cc.log('....start');
    },
    // called every frame, uncomment this function to activate update callback
    update: function update(dt) {
        if (this.wheelState == 0) {
            return;
        }
        cc.log('......state=%d', this.wheelState);

        this.effectFlag += this.curSpeed;
        if (this.effectFlag >= this.gearAngle) {
            cc.audioEngine.playEffect(this.effectAudio, false);
            this.effectFlag = 0;
        }
        if (this.wheelState == 1) {
            cc.log('....开始旋转,speed:' + this.curSpeed);
            this.spinTime += dt;
            this.wheelSp.node.rotation = this.wheelSp.node.rotation + this.curSpeed;
            if (this.curSpeed <= this.maxSpeed) {
                this.curSpeed += this.acc;
            } else {
                if (this.spinTime < this.duration) {
                    return;
                }
                cc.log('....开始减速');
                //设置目标角度
                this.wheelSp.node.rotation = this.defaultAngle;
                this.wheelState = 2;
            }
        } else if (this.wheelState == 2) {
            cc.log('......减速');

            var curRo = this.wheelSp.node.rotation;
            var spd = (this.finalAngle - curRo) * 0.02;
            var finRo = this.finalAngle - curRo;
            if (spd > this.maxSpeed) {
                spd = this.maxSpeed;
            }
            curRo += spd;
            this.wheelSp.node.rotation = curRo;
            if (spd <= 0.1) {
                this.wheelSp.node.rotation = this.finalAngle;
                this.wheelState = 0;
            }
            // this.curSpeed = this.maxSpeed*(this.decAngle/(2*360)) + 0.3;
            // this.decAngle -= this.curSpeed;
            // this.wheelSp.node.rotation = this.wheelSp.node.rotation + this.curSpeed;

            // if(this.curSpeed <= 0.01 || this.decAngle<=0)
            // { 
            //     cc.log('....停止');
            //     this.wheelState = 0;
            //     this.wheelSp.node.rotation = this.finalAngle;
            //     cc.log('....rotation:'+ this.wheelSp.node.rotation);
            // }
        }
    }
});

cc._RFpop();