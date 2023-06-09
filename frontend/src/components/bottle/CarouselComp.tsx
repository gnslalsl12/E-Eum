import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import useDimension from '../../hooks/useDimension';
import Letter from './Letter';
import useLetterSize from '../../hooks/useLetterSize';
import {
  MyBottleResStateType,
  ResBottleStateType,
} from '../../modules/apis/bottle/bottleAtomTypes';
import { useRecoilState } from 'recoil';
import { myBottleResState } from '../../modules/apis/bottle/bottleAtoms';
import { getMyBottleRes } from '../../modules/apis/bottle/bottleApis';
import { FlatList, GestureHandlerRootView } from 'react-native-gesture-handler';

const { DEVICE_WIDTH, DEVICE_HEIGHT } = useDimension();
const { LETTER_WIDTH, LETTER_HEIGHT } = useLetterSize();

const styles = StyleSheet.create({
  carouselWrapper: {
    width: DEVICE_WIDTH, // modal 사이즈
    height: DEVICE_HEIGHT * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carousel: {
    width: '100%', // modal 사이즈
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

type CarouselCompPropsType = {
  bottleId: number;
};

export default function CarouselComp({
  bottleId,
}: CarouselCompPropsType): JSX.Element {
  const [myBottleRes, setMyBottleRes] =
    useRecoilState<MyBottleResStateType>(myBottleResState);

  const [letters, setLetters] = useState<ResBottleStateType[]>();

  const fetchData = () => {
    getMyBottleRes(bottleId).then((data: MyBottleResStateType) => {
      setMyBottleRes(data);
    });
  };

  useEffect(() => {
    if (myBottleRes) {
      setLetters([
        {
          id: myBottleRes.id,
          userNickname: null,
          userBadges: null,
          content: myBottleRes.content,
          regTime: myBottleRes.regTime,
          status: myBottleRes.status,
          ttsPath: null,
          likeDto: null,
        },
        ...myBottleRes.resBottles,
      ]);
    }
  }, [myBottleRes]);

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View style={styles.carouselWrapper}>
      {letters ? (
        <GestureHandlerRootView style={{ width: '100%' }}>
          {/* <FlatList
            horizontal={true}
            data={letters}
            renderItem={({ item, index }) => (
              <Letter
                item={item}
                isRes={index !== 0}
                type={index === 0 ? myBottleRes.type : -1}
                index={index}
                total={letters.length - 1}
              />
            )}
          /> */}
          <Carousel
            style={styles.carousel}
            width={LETTER_WIDTH} // letter 하나 사이즈
            height={LETTER_HEIGHT}
            pagingEnabled={true}
            snapEnabled={true}
            mode='horizontal-stack'
            loop={true}
            autoPlay={false}
            autoPlayReverse={false}
            data={letters}
            modeConfig={{
              snapDirection: 'left',
              stackInterval: 18,
            }}
            customConfig={() => ({
              type: 'positive',
              viewCount: letters.length,
            })}
            renderItem={({ item, index }) => (
              <Letter
                item={item}
                isRes={index !== 0}
                type={index === 0 ? myBottleRes.type : -1}
                index={index}
                total={letters.length - 1}
              />
            )}
          />
        </GestureHandlerRootView>
      ) : (
        <></>
      )}
    </View>
  );
}

