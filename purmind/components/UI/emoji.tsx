import React from 'react';
import { Image, ImageProps } from 'react-native';
import emojiMap from '@/utils/emojiMap';

type EmojiProps = Omit<ImageProps, 'source'> & {
  name: string;
  size?: number;
};

const Emoji = ({ name, size = 16, style, ...props }: EmojiProps) => {
  // Normaliza o nome para a chave do mapa
  const normalizedName = name.toLowerCase().replace(/\s+/g, '-');
  const emojiSource = emojiMap[normalizedName];
  
  if (!emojiSource) {
    console.warn(`Emoji "${name}" não encontrado`);
    return null;
  }

  return (
    <Image
      source={emojiSource}
      style={[{ width: size, height: size, resizeMode: 'contain' }, style]}
      {...props}
    />
  );
};

export default Emoji;