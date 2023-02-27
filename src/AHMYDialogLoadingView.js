import React, {Component} from 'react';
import {Animated, Easing, TouchableOpacity, View, AHRNImageView, Text} from 'autohome-lib';

export class AHMYDialogLoadingView extends Component {
    constructor(props) {
        super(props);
        this.spinValue = new Animated.Value(0)
        this.state = {
            isShowing: false,
            msg: '加载中...'
        }
        this.isAnimation = true;
    }

    componentDidMount() {
        this.state.isShowing && this.startSpin();
    }

    componentWillUnmount() {
        this.stopSpin();
    }

    stopSpin() {
        this.isAnimation = true;
        this.animation && this.animation.stop();
    }

    startSpin() {
        if (!this.state.isShowing) {
            return
        }
        this.spinValue.setValue(0);
        this.animation = Animated.timing(this.spinValue, {
            toValue: 1, // 最终值 为1，这里表示最大旋转 360度
            duration: 800,
            easing: Easing.linear,
            useNativeDriver: false,
        }).start(() => {
            if (!this.isAnimation) {
                return
            }
            this.startSpin();
        })
    }

    show(msg = '加载中...') {
        this.setState({
            isShowing: true,
            msg
        }, () => {
            this.startSpin();
        })
    }

    dismiss() {
        this.setState({
            isShowing: false
        })
    }

    render() {
        if (!this.state.isShowing) {
            return null;
        }
        //映射 0-1的值 映射 成 0 - 360 度
        const spin = this.spinValue.interpolate({
            inputRange: [0, 1],//输入值
            outputRange: ['0deg', '360deg'] //输出值
        })

        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.outSideCloseable && this.dismiss();
                }}
                activeOpacity={1.0}
                style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 0, 0, 0.0)',
                }}>

                <View style={{
                    height: 100,
                    width: 100,
                    backgroundColor: 'rgba(0, 0, 0, 0.9)',
                    borderRadius: 8,
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <Animated.View
                        style={{transform: [{rotate: spin}]}}>
                        <AHRNImageView
                            style={{height: 20, width: 20}}
                            data={{
                                uri: 'sdcard://dialog_loading.png',
                            }}
                        />
                    </Animated.View>
                    <Text
                        numberOfLines={1}
                        style={{marginTop: 10,
                            fontSize: 14, fontWeight: '400', color: 'white', width: 90, textAlign: 'center',
                            alignItems: 'center', justifyContent: 'center', textAlignVertical: 'center',
                        }}
                    >{this.state.msg}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}