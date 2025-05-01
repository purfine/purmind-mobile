import React from 'react';
import { useContext } from 'react';
import { Image, ImageProps, Alert } from 'react-native';
import DataContext from '@/context/DataContext';

type EmojiProps = ImageProps & {
  name: string;
};

function Emoji({ name, style, ...props }: EmojiProps) {
  const data = useContext(DataContext);
  const normalizedNames = [
    name.replaceAll(' ', '-'),
    name.replaceAll('-', ' ')
  ];
  const foundName = normalizedNames.find(n => n in data);
  const url = foundName ? data[foundName] : undefined;

  if (!url) {
    Alert.alert(`Emoji ${name} could not be found in the EmojiProvider's data.`);
    return null; 
  }

  return (
    <Image
      source={{ uri: url }}
      accessibilityLabel={name}
      style={[{ width: 24, height: 24 }, style]}
      {...props}
    />
  );
}

export default Emoji;