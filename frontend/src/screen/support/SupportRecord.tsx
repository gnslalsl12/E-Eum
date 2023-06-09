import React, { useRef, useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
  LayoutChangeEvent,
  Pressable,
} from 'react-native';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import theme from '../../utils/theme';
import ItemContainer from '../../components/record/ItemContainer';
import useDimension from '../../hooks/useDimension';
import { useRecoilState } from 'recoil';
import {
  recordProfileState,
  recordsState,
} from '../../modules/apis/record/recordAtoms';
import {
  getProfileData,
  getRecordsWithTag,
} from '../../modules/apis/record/recordApis';
import {
  RecordProfileStateType,
  RecordsStateType,
} from '../../modules/apis/record/recordAtomTypes';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../navigator/SupportStack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
// ====
import DeleteModal from '../../components/record/DeleteModal';
import MockupDateGroupType from '../../models/record/mockupDateGroupType';
import { getRecords, getTags } from '../../modules/apis/record/recordApis';
import { TagStateType } from '../../modules/apis/record/recordAtomTypes';

const { DEVICE_WIDTH, DEVICE_HEIGHT } = useDimension();

const stylesContainer = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.mainColor.light,
  },
});

const stylesProfile = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH * 0.8,
  },
  nickName: {
    fontSize: theme.fontSize.big,
    fontWeight: '600', // theme 사용해서 바꾸기
    marginTop: 20,
  },
  infoWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 30,
  },
  infoImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  infoItemsWrapper: {
    flexDirection: 'row',
  },
  infoItem: {
    marginHorizontal: 30,
    alignItems: 'center',
  },
  infoContent: {
    fontSize: theme.fontSize.regular,
  },
  infoCaption: {
    fontSize: theme.fontSize.small,
    color: theme.textColor.light,
    marginTop: 10,
  },
  intro: {
    fontSize: theme.fontSize.regular,
    color: theme.textColor.light,
  },
  imgPressBox: {
    width: 100,
    height: 100,
    borderRadius: 50,
    position: 'absolute',
  },
});

const stylesFeed = StyleSheet.create({
  container: {
    width: DEVICE_WIDTH,
    height: DEVICE_HEIGHT,
    flex: 1,
    position: 'absolute',
  },
});

const styles = StyleSheet.create({
  fake: {
    flex: 1,
    backgroundColor: 'orange',
  },
  container: {
    paddingTop: 200,
  },
  contentContainer: {
    width: DEVICE_WIDTH * 0.9,
  },
  itemContainer: {
    padding: 6,
    margin: 6,
    backgroundColor: '#eee',
  },
});

export default function SupportRecord(): JSX.Element {
  const route = useRoute<RouteProp<RootStackParamList, 'SupportRecord'>>();
  const uid = route.params?.uid; // 글 작성자 id
  const tid = route.params?.tid; // 후원글 태그 id

  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const [records, setRecords] = useRecoilState<RecordsStateType>(recordsState);
  const [profile, setProfile] =
    useRecoilState<RecordProfileStateType>(recordProfileState);

  const sheetRef = useRef<BottomSheet>(null);
  const imageRef = useRef<Image>(null);
  const [profileHeight, setProfileHeight] = useState<number>(0);
  const [delTargetContentId, setDelTargetContentId] = useState<number>();
  const [expandFeed, setExpandFeed] = useState<boolean>(false);
  const [imgOffsetXY, setImgOffsetXY] = useState<{ x: number; y: number }>();

  const onLayoutProfile = (e: LayoutChangeEvent): void => {
    const { height } = e.nativeEvent.layout;
    setProfileHeight(height);
  };

  const onLayoutImage = (): void => {
    imageRef.current?.measureInWindow((x, y) => {
      console.log(x, y);
      setImgOffsetXY({ x, y });
    });
  };

  const handleSheetChange = (idx: number): void => {
    setExpandFeed(idx === 1 ? true : false);
  };

  const onToggleDelete = (recordId?: number): void => {
    if (recordId || recordId === 0) {
      setDelTargetContentId(recordId);
    }
  };

  const handleProfilePress = (uid: number) => {
    nav.navigate('SupportProfile', { uid: uid });
  };

  const fetchData = () => {
    getRecordsWithTag(uid, tid).then((data) => setRecords(data));
    getProfileData(uid).then((data) => setProfile(data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={stylesContainer.container}>
      {/* 프로필 */}
      <View style={stylesProfile.container} onLayout={onLayoutProfile}>
        <Text style={stylesProfile.nickName}>{profile.nickname}</Text>
        <View style={stylesProfile.infoWrapper}>
          <Image
            ref={imageRef}
            onLayout={onLayoutImage}
            style={stylesProfile.infoImg}
            source={{ uri: profile.imagePath }}
          />
          <View style={stylesProfile.infoItemsWrapper}>
            <View style={stylesProfile.infoItem}>
              <Text style={stylesProfile.infoContent}>
                {records ? records.recordCnt + '개' : '-'}
              </Text>
              <Text style={stylesProfile.infoCaption}>꿈피드</Text>
            </View>

            <View style={stylesProfile.infoItem}>
              <Text style={stylesProfile.infoContent}>+{profile.dayCnt}일</Text>
              <Text style={stylesProfile.infoCaption}>꿈여정</Text>
            </View>
          </View>
        </View>
        <Text style={stylesProfile.intro}>{profile.introduction}</Text>
      </View>

      {/* 피드 */}
      <View
        style={StyleSheet.flatten([stylesFeed.container, styles.container])}
      >
        {profileHeight && profileHeight != 0 ? (
          <BottomSheet
            ref={sheetRef}
            index={0}
            snapPoints={[DEVICE_HEIGHT - (profileHeight + 50), '100%']}
            onChange={handleSheetChange}
            style={{ alignItems: 'center' }}
          >
            {records ? (
              <BottomSheetFlatList
                contentContainerStyle={styles.contentContainer}
                showsVerticalScrollIndicator={false}
                data={records.recordList}
                renderItem={({ item, index }) => (
                  <ItemContainer
                    regTime={records.dateList[index]}
                    list={item}
                    onToggleDelete={onToggleDelete}
                  />
                )}
              />
            ) : (
              <></>
            )}
          </BottomSheet>
        ) : (
          <></>
        )}
      </View>

      {/* 사용자 이미지 클릭 섹션*/}
      {imgOffsetXY && !expandFeed ? (
        <Pressable
          style={StyleSheet.flatten([
            stylesProfile.imgPressBox,
            {
              top: imgOffsetXY.y,
              left: imgOffsetXY.x,
            },
          ])}
          onPress={() => handleProfilePress(uid)}
        />
      ) : (
        <></>
      )}
    </View>
  );
}
