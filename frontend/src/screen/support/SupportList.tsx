import React, { useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import theme from '../../utils/theme';
import * as Progress from 'react-native-progress';
import PlusButton from '../../components/common/PlusButton';
import useNav from '../../hooks/useNav';
import { getSupports } from '../../modules/apis/support/supportApis';
import { useRecoilState } from 'recoil';
import { SupportsStateType } from '../../modules/apis/support/supportAtomTypes';
import { supportsState } from '../../modules/apis/support/supportAtoms';

const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = Dimensions.get('window');

const styles = StyleSheet.create({
  // 화면 전체에 적용
  container: {
    flex: 1,
    fontSize: theme.fontSize.regular,
  },
  // navigating을 위해 잠시 사용
  tempContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  // 개별 후원 카드
  item: {
    flex: 1,
    backgroundColor: theme.textColor.white,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 10,
    borderRadius: 15,
  },
  // 제목을 감싸는 태그
  titleBox: {
    marginVertical: DEVICE_HEIGHT * 0.005,
    height: DEVICE_HEIGHT * 0.05,
    justifyContent: 'center',
  },
  // 후원 카드에 표시되는 '제목'
  title: {
    fontWeight: '700',
  },
  // 목표금액, 달성률 -> 연한 회색 제목
  lightTitle: {
    color: theme.textColor.light,
    marginVertical: DEVICE_HEIGHT * 0.005,
  },
  // 프로필 사진
  image: {
    width: DEVICE_WIDTH * 0.11,
    height: DEVICE_WIDTH * 0.11,
    borderRadius: 30,
    marginRight: 8,
  },
  // 사진과 이름을 묶은 스타일
  profile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // 목표금액: 제목 및 금액
  goal: {},
  // 달성률: 제목 및 그래프
  progress: {
    marginVertical: DEVICE_HEIGHT * 0.015,
  },
});

// 나중에 다 분리하자.. ===================================================
// 후원 목록에서 보여줄 데이터: 임의의 JSON 데이터
const DATA = [
  {
    uid: 1,
    userNickname: '1싸피',
    title: '개발자가 되고싶어요 길어지면 어케되누',
    achievementRate: 110000,
  },
  {
    uid: 2,
    userNickname: '2싸피',
    title: '개발자가 되고싶어요 길어지면 어케되누',
    achievementRate: 110000,
  },
  {
    uid: 3,
    userNickname: '3싸피',
    title: '개발자가 되고싶어요 길어지면 어케되누',
    achievementRate: 110000,
  },
  {
    uid: 4,
    userNickname: '4싸피',
    title: '개발자가 되고싶어요 길어지면 어케되누',
    achievementRate: 110000,
  },
  {
    uid: 5,
    userNickname: '5싸피',
    title: '개발자가 되고싶어요 길어지면 어케되누',
    achievementRate: 110000,
  },
  {
    uid: 6,
    userNickname: '6싸피',
    title: '개발자가 되고싶어요 길어지면 어케되누',
    achievementRate: 110000,
  },
  {
    uid: 7,
    userNickname: '7싸피',
    title: '개발자가 되고싶어요 길어지면 어케되누',
    achievementRate: 110000,
  },
];

// 각 아이템(목록 데이터) 요소의 타입 지정
type ItemProps = {
  uid: number;
  userNickname: string;
  title: string;
  achievementRate: number;
};

// 각 카드를 어떻게 보여줄지 설정
const Item = ({ uid, userNickname, title, achievementRate }: ItemProps) => (
  <TouchableOpacity
    style={styles.item}
    onPress={() => console.log('디테일 스크린이 까꿍')}
    activeOpacity={0.6}
  >
    <View style={styles.container}>
      <View style={styles.profile}>
        <Image
          source={require('../../assets/images/sample.png')}
          style={styles.image}
        />
        <Text>{userNickname}</Text>
      </View>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.goal}>
        <Text style={styles.lightTitle}>목표금액</Text>
        <Text>{achievementRate}원</Text>
      </View>
      <View style={styles.progress}>
        <Text style={styles.lightTitle}>달성률</Text>
        <Progress.Bar
          progress={0.65}
          width={null}
          height={5}
          color={theme.mainColor.main}
        />
      </View>
    </View>
  </TouchableOpacity>
);
// ========================================================================

// 초기 꿈후원 목록 화면
export default function SupportList(): JSX.Element {
  const [supports, setSupports] =
    useRecoilState<SupportsStateType[]>(supportsState);

  const navigation = useNav();

  const onPressPlusBtn = () => {
    navigation.push('NewSupport');
  };

  const fetchData = async () => {
    const { data } = await getSupports();
    setSupports(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.tempContainer}>
        <Text
          style={{ color: 'red' }}
          onPress={() => navigation.push('SupportDetail')}
        >
          게시물 상세
        </Text>
      </View>
      <FlatList
        // data={DATA}
        data={supports}
        renderItem={({ item }) => (
          <Item
            uid={item.uid}
            userNickname={item.userNickname}
            title={item.title}
            achievementRate={item.achievementRate}
          />
        )}
        numColumns={2}
        keyExtractor={(item) => item.uid.toString()}
      />
      <PlusButton onPressPlusBtn={onPressPlusBtn} />
    </View>
  );
}
