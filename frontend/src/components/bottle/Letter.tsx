import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';
import useLetterSize from '../../hooks/useLetterSize';
import { shadowStyle } from '../common/shadowStyle';
import { MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import theme from '../../utils/theme';
import Badge from '../common/Badge';
import BadgeType from '../../models/user/badgeType';
import TextRender from '../common/editor/TextRender';
import {
  BottleType,
  PostBottleReportBodyType,
  REPORT_TYPE,
  ResBottleStateType,
} from '../../modules/apis/bottle/bottleAtomTypes';
import useDate from '../../hooks/useDate';
import {
  postBottleLike,
  postBottleReport,
} from '../../modules/apis/bottle/bottleApis';
import { Audio } from 'expo-av';

const paperImage = require('../../assets/images/paper.png');
const { LETTER_WIDTH, LETTER_HEIGHT } = useLetterSize();

const styles = StyleSheet.create({
  containerBackgroundImage: {
    width: LETTER_WIDTH,
    height: LETTER_HEIGHT,
    padding: 20,
  },
  container: {
    width: '100%',
    height: '100%',
  },
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pages: {
    fontSize: theme.fontSize.small,
    color: theme.grayColor.lightGray,
    // backgroundColor: 'orange',
    flex: 1,
    padding: 10,
    textAlign: 'center',
    // height: 30,
    // justifyContent: 'center',
  },
  report: {
    fontSize: theme.fontSize.small,
    color: theme.grayColor.lightGray,
  },
  reqDate: {
    fontSize: theme.fontSize.small,
  },
  kindof: {
    fontSize: theme.fontSize.small,
    color: theme.grayColor.lightGray,
  },
  contentWrapper: {
    marginBottom: 20,
  },
  bottom: {},
  badgesWrapper: {
    width: '100%',
    alignItems: 'center',
  },
  bottombottom: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  from: {
    fontSize: theme.fontSize.small,
    color: theme.textColor.main,
  },
});

const badgeMockup: BadgeType[] = [
  {
    id: 1,
    name: 'badge',
    description: 'badge인뎅',
    imagePath: '',
  },
  {
    id: 2,
    name: 'badge',
    description: 'badge인뎅',
    imagePath: '',
  },
  {
    id: 3,
    name: 'badge',
    description: 'badge인뎅',
    imagePath: '',
  },
];

type LetterPropsType = {
  item: ResBottleStateType;
  isRes: boolean;
  type: BottleType | -1; // 답변일 경우 -1
  index: number;
  total: number;
  // currentIdx: number;
};

export default function Letter({
  item,
  isRes,
  type,
  index,
  total,
}: // currentIdx,
LetterPropsType): JSX.Element {
  const [date, setNewDate] = useDate();
  const [isLike, setisLike] = useState<boolean>(false);
  const [fromWhom, setFromWhom] = useState<string>('익명의 사용자');
  const [reqType, setReqType] = useState<'고민 상담' | '전문가 상담'>(
    '고민 상담'
  );
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [ttsSound, setTtsSound] = useState<Audio.Sound>();

  const onSendReport = (): void => {
    const postData: PostBottleReportBodyType = {
      type: REPORT_TYPE.resBottle,
      targetId: item.id,
      content: '불건전합니다',
    };
    postBottleReport(postData).then(() => alert('신고되었습니다.'));
  };
  const onPressLike = (): void => {
    postBottleLike(1, item.id);
    if (!isLike) {
      setisLike((prev) => !prev);
    }
  };
  const onPressTTSplay = async (): Promise<void> => {
    if (item.ttsPath) {
      const { sound } = await Audio.Sound.createAsync({
        uri: item.ttsPath,
      });
      await sound.playAsync();
    }
  };
  const onToggleIsPlaying = () => {
    setIsPlaying((prev) => !prev);
  };

  useEffect(() => {
    if (isPlaying) {
      onPressTTSplay();
      // onToggleIsPlaying();
    } else {
      ttsSound?.stopAsync();
    }
  }, [isPlaying]);

  useEffect(() => {
    if (item.userNickname) {
      if (item.status === 1) {
        // 정상해류병(신고된게 아니면)
        setFromWhom(item.userNickname);
      } else if (type && type === 2) {
        setFromWhom(item.userNickname);
      }
    }
    if (item) {
      (setNewDate as (regTime: Date) => void)(item.regTime);
    }
    if (type) {
      if (type !== -1) {
        // 질문
        type === 1 ? setReqType('고민 상담') : setReqType('전문가 상담');
      } else {
        // 답변
        setisLike(item.likeDto ? true : false);
      }
    }
  }, [item]);
  return (
    <ImageBackground
      source={paperImage}
      style={StyleSheet.flatten([
        styles.containerBackgroundImage,
        shadowStyle.shadow,
      ])}
    >
      {item ? (
        <Pressable style={styles.container}>
          {isRes ? (
            <View style={styles.top}>
              <MaterialCommunityIcons
                name={isLike ? 'thumb-up' : 'thumb-up-outline'}
                size={24}
                color={
                  isLike ? theme.textColor.error : theme.grayColor.inputIcon
                }
                onPress={onPressLike}
              />
              <Text onPress={() => {}} style={styles.pages}>
                {index} / {total}
              </Text>
              <Text style={styles.report} onPress={onSendReport}>
                신고
              </Text>
            </View>
          ) : (
            <View style={styles.top}>
              <Text style={styles.reqDate}>{date as string}</Text>

              <Text onPress={() => {}} style={styles.pages}></Text>
              <Text style={styles.kindof}>{reqType}</Text>
            </View>
          )}
          <FlatList
            data={[item.status === 3 ? '신고된 해류병 입니다.' : item.content]}
            style={styles.contentWrapper}
            renderItem={({ item }) => <TextRender content={item} />}
          />
          {isRes ? (
            <View style={styles.bottom}>
              {/* 뱃지 */}
              {item.userBadges && item.status !== 3 ? (
                <GestureHandlerRootView>
                  <FlatList
                    horizontal
                    inverted
                    contentContainerStyle={styles.badgesWrapper}
                    data={item.userBadges}
                    scrollEnabled={false}
                    renderItem={({ item, index }) => (
                      <View
                        style={{
                          zIndex: badgeMockup.length - index + 1,
                          right: 10 * index,
                        }}
                      >
                        <Badge key={item.id} badge={item} />
                      </View>
                    )}
                  />
                </GestureHandlerRootView>
              ) : (
                <></>
              )}
              <View style={styles.bottombottom}>
                <Entypo
                  name={isPlaying ? 'controller-paus' : 'controller-play'}
                  size={24}
                  color={
                    item.ttsPath
                      ? theme.textColor.main
                      : theme.grayColor.darkGray
                  }
                  onPress={onToggleIsPlaying}
                />
                <Text style={styles.from}>from.{fromWhom}</Text>
              </View>
            </View>
          ) : (
            <View style={styles.bottom}></View>
          )}
        </Pressable>
      ) : (
        <></>
      )}
    </ImageBackground>
  );
}

