import React, { Component } from 'react';
import {
    View,
    Button,
    ImageBackground,
    Image,
    TextInput,
    StyleSheet,
    Keyboard,
    Linking,
    ActivityIndicator,
    AsyncStorage
} from 'react-native';
import { showMessage } from "react-native-flash-message";

import SplashScreen from "./SplashScreen";

// Si está usando la url del servidor USE_API debe ser true 
const USE_API = false;

class Index extends Component {
    constructor(props){
        super(props);

        this.state = {
            userName: '',
            userEmail: '',
            urlMeeting: '',
            urlMeetingReal: '',
            loading: true,
            urlFocus: true,
            joinStatus: false,
            showKeyboard: false
        }

        this.bootstrapAsync();
    }

    bootstrapAsync = async () => {
        var user = await AsyncStorage.getItem('UserHiStream');
        setTimeout(()=>{
            user = JSON.parse(user)
            this.setState({
                userName: user ? user.name : '',
                userEmail: user ? user.email : '',
                loading: false
            });
        }, 3000);

        Keyboard.addListener("keyboardDidShow", () => this.setState({showKeyboard : true}));
        Keyboard.addListener("keyboardDidHide", () => this.setState({showKeyboard : false}));
    };

    componentDidMount() {
        if (Platform.OS === 'android') {
            Linking.getInitialURL().then(url => {
                this.setState({
                    urlMeeting: url,
                    urlFocus: url ? false : true
                });
            });
        } else {
            // Linking.addEventListener('url', this.handleOpenURL);
        }
    }

    // componentWillUnmount() {
    //     Linking.removeEventListener('url', this.handleOpenURL);
    // }
        
    getMeet = () => {
        if(USE_API){
            this.joinMeet();
            return false;
        }
        
        if(this.state.urlMeeting){
            this.setState({joinStatus: true});
            let url_array = this.state.urlMeeting.split('/');
            let base_url = `https://${url_array[2]}`;
            let slug = url_array[url_array.length-1];
            fetch(`${base_url}/api/meet/info`, {
                method: 'POST',
                body: JSON.stringify({'slug': slug}),
                headers: {'Content-Type': 'application/json'}
            })
            .then(response => response.json())
            .then(res => {
                this.setState({joinStatus: false});
                if(res.data.error){
                    showMessage({
                        message: "Ocurrío un error",
                        description: "Reunión no encontrada.",
                        type: "danger", icon: "danger",
                    });
                }else{
                    this.setState({
                        urlMeetingReal: `${res.data.server}/${slug}`
                    });
                    let date = new Date();
                    let hora_actual = `${date.getHours().toString().padStart(2, 0)}:${date.getMinutes().toString().padStart(2, 0)}:00`
                    let meet_full = false;

                    if(res.data.max_person){
                        meet_full = res.data.participants_active >= res.data.max_person ? true : false;
                    }
                    
                    if(hora_actual <= res.data.start){
                        showMessage({
                            message: "La reunión no ha comenzado",
                            description: `La reunión está programada para las ${res.data.start}.`,
                            type: "warning", icon: "warning",
                        });
                    }else if(hora_actual >= res.data.finish){
                        showMessage({
                            message: "Reunión finalizada",
                            description: `La reunión finalizó a las ${res.data.finish}.`,
                            type: "warning", icon: "warning",
                        });
                    }else if(meet_full){
                        fetch(`${base_url}/conferencia/join/reject/${res.data.id}`);
                        showMessage({
                            message: "Reunión llena",
                            description: `La reunión no permite más participantes.`,
                            type: "warning", icon: "warning",
                        });
                    }else{
                        setTimeout(() => {
                            this.joinMeet();
                        }, 100);
                    }
                }
            })
            .catch(error => {
                this.setState({joinStatus: false});
                showMessage({
                    message: "Ocurrío un error",
                    description: "Ocurrión un error en nuestro servidor.",
                    type: "danger", icon: "danger",
                });
            });
        }else{
            showMessage({
                message: "Ocurrío un error",
                description: "Debes ingresar el link de la conferencia.",
                type: "danger", icon: "danger",
            });
        }
    }

    joinMeet = () => {
        if(this.state.userName){
            if(this.state.userName.length >= 4){
                let user = {
                    name: this.state.userName,
                    email: this.state.userEmail
                }
                AsyncStorage.setItem('UserHiStream', JSON.stringify(user));
                this.props.navigation.navigate('Conference', {link: this.state.urlMeetingReal, user});
            }else{
                showMessage({
                    message: "Advertencia",
                    description: "Su nombre debe tener al menos 4 caractéres.",
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
                    <View style={{ alignItems: 'center', position: 'absolute', left: 0, right: 0, top: this.state.showKeyboard ? -50 : -30 }}>
                        <Image source={require('../assets/images/logo.png')} style={{ width: this.state.showKeyboard ? '30%' : '70%', resizeMode: 'contain', }} />
                    </View>
                    <View style={{ marginHorizontal: 20, marginTop: 100 }}>
                        <View style={{ marginVertical: 10 }}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'rgba(255,255,255,0.3)'}
                                placeholder="Link de la reunión"
                                autoFocus={this.state.urlFocus ? true : false}
                                onChangeText={text => this.setState({urlMeeting: text})}
                                value={this.state.urlMeeting}
                                autoCapitalize='none'
                            />
                        </View>
                        <View style={{ marginVertical: 10 }}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'rgba(255,255,255,0.3)'}
                                placeholder="Ingrese su nombre"
                                autoFocus={!this.state.urlFocus ? true : false}
                                onChangeText={text => this.setState({userName: text})}
                                value={this.state.userName}
                            />
                        </View>
                        <View style={{ marginVertical: 10 }}>
                            <TextInput
                                style={styles.input}
                                placeholderTextColor={'rgba(255,255,255,0.3)'}
                                placeholder="Ingrese su email (Opcional)"
                                onChangeText={text => this.setState({userEmail: text})}
                                value={this.state.userEmail}
                                keyboardType='email-address'
                                autoCapitalize='none'
                            />
                        </View>
                        {this.state.joinStatus && <ActivityIndicator size="large" color="#0A68BF" style={{ marginTop: 10 }} />}
                        <View style={{ marginTop: 20 }}>
                            <Button title="Ingresar" disabled={this.state.joinStatus} onPress={this.getMeet} />
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