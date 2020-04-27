import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    ImageBackground,
    Image,
    TextInput,
    StyleSheet,
    AsyncStorage
} from 'react-native';
import { showMessage } from "react-native-flash-message";

import SplashScreen from "./SplashScreen";
// import Conference from "./Conference";

class Index extends Component {
    constructor(props){
        super(props);

        this.state = {
            userName: '',
            urlMeeting: '',
            loading: true
        }

        this.bootstrapAsync();
    }

    bootstrapAsync = async () => {
        var user = await AsyncStorage.getItem('UserHiStream');
        setTimeout(()=>{
            user = JSON.parse(user)
            this.setState({
                userName: user ? user.name : '',
                loading: false
            });
        }, 3000);
    };

    joinMeet = () => {
        if(this.state.urlMeeting && this.state.userName){
            if(this.state.userName.length >= 6){
                let user = {
                    name: this.state.userName
                }
                AsyncStorage.setItem('UserHiStream', JSON.stringify(user));
                this.props.navigation.navigate('Conference', {link: this.state.urlMeeting, user});
            }else{
                showMessage({
                    message: "Advertencia",
                    description: "Su nombre debe tener al menos 6 caractéres.",
                    type: "warning",
                    icon: "warning",
                });
            }
        }else{
            showMessage({
                message: "Ocurrío un error",
                description: "Debes completar los campos nombre y link de la reunión.",
                type: "danger",
                icon: "danger",
            });
        }
    }

    render(){
        if(this.state.loading){
            return(
                <SplashScreen />
            )
        }
        return (
            <View
              style={{
                flex: 1,
                height: '100%',
                width: '100%',
              }}
            >
                <ImageBackground source={require('../assets/images/background.jpg')} style={styles.image}>
                    <View style={styles.maskDark} />
                    <View style={{ alignItems: 'center', position: 'absolute', left: 0, right: 0, top: -30 }}>
                        <Image source={require('../assets/images/logo.png')} style={{ width: '70%', resizeMode: 'contain', }} />
                    </View>
                    <View style={{ marginHorizontal: 20, marginTop: 100 }}>
                        <View style={{ marginVertical: 10 }}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'rgba(255,255,255,0.3)'}
                                placeholder="Link de la reunión"
                                autoFocus={true}
                                onChangeText={text => this.setState({urlMeeting: text})}
                                value={this.state.urlMeeting}
                            />
                        </View>
                        <View style={{ marginVertical: 10 }}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'rgba(255,255,255,0.3)'}
                                placeholder="Nombre del participante"
                                onChangeText={text => this.setState({userName: text})}
                                value={this.state.userName}
                            />
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <Button title="Ingresar" onPress={this.joinMeet} />
                        </View>
                    </View>
                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center"
  },
  maskDark: {
    flex: 1,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.7)'
  },
  input: {
    height: 50,
    borderColor: 'white',
    color: 'white',
    borderBottomWidth: 2,
    fontSize: 18
}
});


export default Index;