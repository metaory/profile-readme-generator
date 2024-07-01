import React, { useRef } from 'react';
import { getStorageItem as getItem } from 'utils';
import * as S from './styles';

export const Backup = () => {
  const downloadLinkRef = useRef<HTMLAnchorElement | null>(null);

  const handleClick = () => {
    if (!downloadLinkRef.current) return;

    const data = JSON.stringify(
      ['user.settings', 'canvas.sections'].reduce(
        (acc, cur) => ({ ...acc, [cur]: getItem(cur) }),
        {},
      ),
      null,
      2,
    );

    downloadLinkRef.current.href = URL.createObjectURL(
      new Blob([data], { type: 'application/json' }),
    );
  };

  return (
    <S.FileButton
      as='a'
      hue='260'
      href=''
      ref={downloadLinkRef}
      download={`backup-${Math.round(Date.now() / 1e6)}.json`}
      onClick={handleClick}
      rel='noreferrer'
      target='_blank'
    >
      Backup
    </S.FileButton>
  );
};
