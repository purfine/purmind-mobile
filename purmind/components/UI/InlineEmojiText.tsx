import React from 'react';
import { View, Image, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import emojiData from '../../assets/emojis/data.json';
import WRText from '../wrappers/Text';
import Emoji from './emoji';

export type InlineEmojiTextProps = {
  children: React.ReactNode;
  emojiName: string;
  emojiSize?: number;
  textStyle?: TextStyle;
  containerStyle?: ViewStyle;
};

export default function InlineEmojiText({
  children,
  emojiName,
  emojiSize = 18,
  textStyle,
  containerStyle,
}: InlineEmojiTextProps) {
  return (
    <View style={[styles.row, containerStyle]}>
      <WRText style={[textStyle]}>{children}</WRText>
      <Emoji name={emojiName} size={emojiSize} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }
});
