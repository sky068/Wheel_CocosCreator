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