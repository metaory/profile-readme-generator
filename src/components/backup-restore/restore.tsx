import React from 'react'; // MouseEvent // ChangeEvent,
import { setStorageItem as setItem } from 'utils';
import * as S from './styles';

type FileInputEvent = React.ChangeEvent<HTMLInputElement>;

const Restore = () => {
  const handleRestoreFileInput = (event: FileInputEvent): void => {
    const input = event.target;

    if (!input?.files?.length) return;

    const [file] = input.files;
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        const result = e.target.result as string;
        const parsed = JSON.parse(result);

        for (const key in parsed) {
          setItem(key, parsed[key]);
        }

        window?.location?.reload();
      }
    };
    reader.onerror = (e: ProgressEvent<FileReader>) => {
      const target = e.target as FileReader;
      console.error('Error reading file:', target.error);
    };

    reader.readAsText(file);
  };

  return (
    <>
      <S.FileButton as='label' htmlFor='restore' hue='240'>
        Restore
      </S.FileButton>
      <S.RestoreInput
        type='file'
        id='restore'
        onChange={handleRestoreFileInput}
      />
    </>
  );
};

export { Restore };
