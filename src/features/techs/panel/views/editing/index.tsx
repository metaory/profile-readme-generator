import { AnimatePresence, Reorder } from 'framer-motion';
import { useRef } from 'react';

import { GroupFields, TechIconVariants, TechIconVariantsRef } from 'components';
import { useCanvas, useForceUpdate } from 'hooks';

import { events } from 'app';
import { getDeepObjectProperty } from 'utils';

import { variants } from './animations';
import { fields } from './fields';

import { EditableIcon } from 'types';
import * as S from './styles';

type Icons = {
  [key: string]: EditableIcon;
};

const Editing = () => {
  const techIconVariantsRefs = useRef<(TechIconVariantsRef | null)[]>([]);

  const forceUpdate = useForceUpdate();
  const { currentSection } = useCanvas();

  const selectedIcons = getDeepObjectProperty<Icons>(
    currentSection,
    'props.content.icons',
  )!;

  const icons = Object.entries(selectedIcons);
  const icon_names = icons.map(icon => icon[0]);

  const handleOnReOrder = (order: typeof icon_names) => {
    const path = 'content.icons';

    const value = order.reduce((obj, name) => {
      const finded = icons.find(icon => icon[0] === name)!;

      obj[finded[0]] = finded[1];

      return obj;
    }, {} as Icons);

    events.canvas.edit({ path, value });
    setTimeout(forceUpdate, 200);
  };

  const setRef = (index: number) => (ref: TechIconVariantsRef | null): void => {
    techIconVariantsRefs.current[index] = ref;
  };

  // Filter out null values before passing to a component that expects EditSocialItemRef[]
  const nonNullRefs = techIconVariantsRefs.current.filter((ref): ref is TechIconVariantsRef => ref !== null);

  return (
    <S.Container
      initial='closed'
      animate='open'
      variants={variants.container}
      layoutScroll
    >
      {fields.map(field => <GroupFields key={field.id} {...field} />)}

      <AnimatePresence>
        <Reorder.Group axis='y' values={icon_names} onReorder={handleOnReOrder}>
          {icons.map(([_, props], index) => (
            <TechIconVariants
              key={index}
              ref={setRef(index)}
              refs={nonNullRefs}
              {...props}
            />
          ))}
        </Reorder.Group>
      </AnimatePresence>
    </S.Container>
  );
};

export { Editing };
