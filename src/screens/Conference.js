import React, { useEffect } from 'react';
import JitsiMeet, { JitsiMeetView } from 'react-native-jitsi-meet';
import md5 from 'md5';

function Conference({ route, navigation }) {

  useEffect(() => {
    setTimeout(() => {
      const url = route.params.link;
      const userInfo = {
        displayName: route.params.user.name,
        email: route.params.user.email,
        avatar: `https://gravatar.com/avatar/${md5(route.params.user.email)}`,
      };
      JitsiMeet.call(url, userInfo);
      /* Você também pode usar o JitsiMeet.audioCall (url) para chamadas apenas de áudio */
      /* Você pode terminar programaticamente a chamada com JitsiMeet.endCall () */
    }, 2000);
  }, [])

  useEffect(() => {
    return () => {
      JitsiMeet.endCall();
    };
  });

  function onConferenceTerminated(nativeEvent) {
    /* Conference terminated event */
    // console.log(nativeEvent)
    console.log('end');
    navigation.navigate('Index');
  }

  function onConferenceJoined(nativeEvent) {
    /* Conference joined event */
    // console.log(nativeEvent)
    console.log('join');
  }

  function onConferenceWillJoin(nativeEvent) {
    /* Conference will join event */
    // console.log(nativeEvent)
    console.log('joined');
  }
  return (
    <JitsiMeetView
      onConferenceTerminated={e => onConferenceTerminated(e)}
      onConferenceJoined={e => onConferenceJoined(e)}
      onConferenceWillJoin={e => onConferenceWillJoin(e)}
      style={{
        flex: 1,
        height: '100%',
        width: '100%',
      }}
    />
  )
}
export default Conference;