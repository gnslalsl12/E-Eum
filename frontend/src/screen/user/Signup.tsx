import React, { useState, useEffect } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import theme from '../../utils/theme';
import { Feather } from '@expo/vector-icons';
import { color } from 'react-native-reanimated';
import * as Font from 'expo-font';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const stylesTempBorder = StyleSheet.create({
  //일반 보더 확인용
  Red: {
    borderWidth: 1,
    borderColor: 'red',
  },
  Blue: {
    borderWidth: 1,
    borderColor: 'blue',
  },
  Yellow: {
    borderWidth: 1,
    borderColor: 'yellow',
  },
});

const stylesGlobalContainer = StyleSheet.create({
  //가장 큰 페이지
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.background,
    padding: 0,
    margin: 0,
  },
});

const stylesInnerContainer = StyleSheet.create({
  //내부 내용 global container
  container: {
    // backgroundColor: 'black',
    // flex: 1,
    flexDirection: 'column',
    // justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    padding: 0,
    width: DEVICE_WIDTH * 0.9,
  },
});

const stylesSignupInput = StyleSheet.create({
  box: {
    width: '100%',
    marginBottom: 10,
    marginTop: 20,
    borderBottomWidth: 2,
    borderBottomColor: theme.mainColor.main,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputStyle: {
    fontSize: theme.fontSize.regular,
    borderWidth: 1,
    borderColor: 'red',
    height: '100%',
    flex: 1,
    paddingTop: 2,
    paddingBottom: 2,
  },
  button: {
    width: '20%',
    backgroundColor: theme.mainColor.light,
    height: 30,
    borderRadius: 50,
  },
  buttonInnerText: {
    textAlign: 'center',
    lineHeight: 30,
    color: '#474747',
    fontSize: 12,
  },
  timeLeft: {
    color: '#949494',
    marginRight: 10,
    marginLeft: 10,
  },
  checkIcon: {
    marginRight: 10,
    marginLeft: 10,
  },
  selectGenderContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  selectGenderBox: {
    flexDirection: 'column',
    paddingLeft: 30,
  },
  selectGenderButton: {
    width: 15,
    height: 15,
    borderRadius: 20,
    // borderWidth: 0.5,
    // borderColor: 'black',
    marginRight: 10,
  },
  selectGenderSelections: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectGenderSelectionsText: {
    color: 'red',
    fontFamily: theme.fontFamily.main,
  },
});

export default function Signup(): JSX.Element {
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [verifCode, setVerifCode] = useState<string>('');
  const [userPW, setUserPW] = useState<string>('');
  const [userVerifPW, setUserVerifPW] = useState<string>('');
  const [userNickName, setUserNickName] = useState<string>('');
  const [userGender, setUserGender] = useState<string>('');

  const [checkRegexPW, setCheckRegexPW] = useState<boolean>(false);
  const [checkSamePW, setCheckSamePW] = useState<boolean>(false);

  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [timerOn, setTimerOn] = useState<boolean>(false);

  const handleUserName = (input: string) => {
    setUserName(input);
  };
  const handleUserEmail = (input: string) => {
    setUserEmail(input);
  };
  const handleVerifCode = (input: string) => {
    setVerifCode(input);
  };

  const handleTimeLeft = () => {
    setTimerOn(true);
  };

  //이메일 인증 관련
  useEffect(() => {
    let interval: any;
    console.log('카운트다운');
    if (timerOn && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else {
      setTimerOn(false);
      setTimeLeft(5);
    }
    return () => clearInterval(interval);
  }, [timerOn, timeLeft]);

  // 비밀번호 관련
  const PWRegex = /^(?=.*[!@#$%^&*(),.?":{}|<>])(?=.*\d)(?=.*[a-zA-Z]).{8,16}$/;
  const handleUserPW = (input: string) => {
    setUserPW(input);
    setUserVerifPW('');
    if (!PWRegex.test(input)) setCheckRegexPW(false);
    else setCheckRegexPW(true);
    setCheckSamePW(false);
  };

  const handleUserVerifPW = (input: string) => {
    setUserVerifPW(input);
  };

  useEffect(() => {
    console.log('비밀번호 같은지 체크');
    setCheckSamePW(userPW !== '' && userPW === userVerifPW);
  }, [userVerifPW]);

  // 닉네임 관련
  const handleUserNickName = (input: string) => {
    setUserNickName(input);
  };

  // 성별 관련
  const handleGender = (input: string) => {
    setUserGender(input);
  };

  return (
    <View
      style={StyleSheet.flatten([
        stylesTempBorder.Blue,
        stylesGlobalContainer.container,
      ])}
    >
      <View
        testID='inner'
        style={StyleSheet.flatten([
          stylesTempBorder.Red,
          stylesInnerContainer.container,
        ])}
      >
        <View
          style={StyleSheet.flatten([
            stylesTempBorder.Yellow,
            stylesSignupInput.box,
          ])}
        >
          <TextInput
            testID='inputName'
            onChangeText={handleUserName}
            value={userName}
            placeholder='이름 (~8자)'
            maxLength={8}
            style={stylesSignupInput.inputStyle}
          ></TextInput>
        </View>
        <View
          style={StyleSheet.flatten([
            stylesTempBorder.Yellow,
            stylesSignupInput.box,
          ])}
        >
          <TextInput
            testID='inputEmail'
            onChangeText={handleUserEmail}
            value={userEmail}
            placeholder='이메일'
            style={stylesSignupInput.inputStyle}
          ></TextInput>
          <Pressable onPress={handleTimeLeft} style={stylesSignupInput.button}>
            <Text style={stylesSignupInput.buttonInnerText}>인증</Text>
          </Pressable>
        </View>
        <View
          style={StyleSheet.flatten([
            stylesTempBorder.Yellow,
            stylesSignupInput.box,
          ])}
        >
          <TextInput
            testID='inputVerifCode'
            onChangeText={handleVerifCode}
            value={verifCode}
            placeholder='코드 입력'
            style={stylesSignupInput.inputStyle}
          ></TextInput>
          <Text style={stylesSignupInput.timeLeft}>{`${Math.floor(timeLeft / 60)
            .toString()
            .padStart(2, '0')}:${(timeLeft % 60)
            .toString()
            .padStart(2, '0')}`}</Text>
          <Pressable style={stylesSignupInput.button}>
            <Text style={stylesSignupInput.buttonInnerText}>확인</Text>
          </Pressable>
        </View>
        <View
          style={StyleSheet.flatten([
            stylesTempBorder.Yellow,
            stylesSignupInput.box,
          ])}
        >
          <TextInput
            testID='inputPW'
            onChangeText={handleUserPW}
            value={userPW}
            placeholder='비밀번호'
            secureTextEntry={true}
            maxLength={16}
            style={stylesSignupInput.inputStyle}
          ></TextInput>
          <View style={stylesSignupInput.checkIcon}>
            <Feather
              name='check-circle'
              size={24}
              color={
                checkRegexPW
                  ? theme.mainColor.main
                  : userPW === ''
                  ? theme.textColor.light
                  : theme.textColor.error
              }
            />
          </View>
        </View>
        <View
          style={StyleSheet.flatten([
            stylesTempBorder.Yellow,
            stylesSignupInput.box,
          ])}
        >
          <TextInput
            testID='inputVerifPW'
            onChangeText={handleUserVerifPW}
            value={userVerifPW}
            placeholder='비밀번호 확인'
            secureTextEntry={true}
            maxLength={16}
            style={stylesSignupInput.inputStyle}
          ></TextInput>
          <View style={stylesSignupInput.checkIcon}>
            <Feather
              name='check-circle'
              size={24}
              color={
                checkSamePW
                  ? theme.mainColor.main
                  : userVerifPW === ''
                  ? theme.textColor.light
                  : theme.textColor.error
              }
            />
          </View>
        </View>
        <View
          style={StyleSheet.flatten([
            stylesTempBorder.Yellow,
            stylesSignupInput.box,
          ])}
        >
          <TextInput
            testID='inputNickName'
            onChangeText={handleUserNickName}
            value={userNickName}
            placeholder='닉네임'
            maxLength={10}
            style={stylesSignupInput.inputStyle}
          ></TextInput>
        </View>
        <View
          style={StyleSheet.flatten([
            stylesTempBorder.Yellow,
            stylesSignupInput.selectGenderContainer,
          ])}
        >
          <Text>성별</Text>
          <View
            style={StyleSheet.flatten([
              stylesTempBorder.Blue,
              stylesSignupInput.selectGenderBox,
            ])}
          >
            <View style={stylesSignupInput.selectGenderSelections}>
              <Pressable
                onPress={() => handleGender('Female')}
                style={[
                  stylesSignupInput.selectGenderButton,
                  {
                    backgroundColor:
                      userGender === 'Female'
                        ? theme.mainColor.main
                        : theme.grayColor.lightGray,
                  },
                ]}
              ></Pressable>
              <Text style={stylesSignupInput.selectGenderSelectionsText}>
                여성
              </Text>
            </View>
            <View style={stylesSignupInput.selectGenderSelections}>
              <Pressable
                onPress={() => handleGender('Male')}
                style={[
                  stylesSignupInput.selectGenderButton,
                  {
                    backgroundColor:
                      userGender === 'Male'
                        ? theme.mainColor.main
                        : theme.grayColor.lightGray,
                  },
                ]}
              ></Pressable>
              <Text style={stylesSignupInput.selectGenderSelectionsText}>
                남성
              </Text>
            </View>
            <View style={stylesSignupInput.selectGenderSelections}>
              <Pressable
                onPress={() => handleGender('None')}
                style={[
                  stylesSignupInput.selectGenderButton,
                  {
                    backgroundColor:
                      userGender === 'None'
                        ? theme.mainColor.main
                        : theme.grayColor.lightGray,
                  },
                ]}
              ></Pressable>
              <Text style={stylesSignupInput.selectGenderSelectionsText}>
                선택 안 함
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
