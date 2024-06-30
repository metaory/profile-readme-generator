import { AnimatePresence, Reorder } from 'framer-motion';
import { useRef } from 'react';

import { EditSocialItem, EditSocialItemRef, GroupFields } from 'components';
import { useCanvas, useForceUpdate } from 'hooks';

import { events } from 'app';
import { getDeepObjectProperty } from 'utils';

import { variants } from './animations';

import { fields } from './fields';
import * as S from './styles';

type Social = {
  icon: string;
};

type Socials = {
  [key: string]: Social;
};

const Editing = () => {
  const EditSocialItemRefs = useRef<(EditSocialItemRef | null)[]>([]);

  const forceUpdate = useForceUpdate();
  const { currentSection } = useCanvas();

  const selectedSocials = getDeepObjectProperty<Socials>(
    currentSection,
    'props.content.socials',
  )!;

  const socials = Object.entries(selectedSocials);
  const socials_names = socials.map(social => social[0]);

  const handleOnReOrder = (order: typeof socials_names) => {
    const path = 'content.socials';

    const value = order.reduce((obj, name) => {
      const finded = socials.find(social => social[0] === name)!;

      obj[finded[0]] = finded[1];

      return obj;
    }, {} as Socials);

    events.canvas.edit({ path, value });
    setTimeout(forceUpdate, 200);
  };

  const setRef = (index: number) => (ref: EditSocialItemRef | null): void => {
    EditSocialItemRefs.current[index] = ref;
  };

  // Filter out null values before passing to a component that expects EditSocialItemRef[]
  const nonNullRefs = EditSocialItemRefs.current.filter((ref): ref is EditSocialItemRef => ref !== null);

  return (
    <S.Container
      initial='closed'
      animate='open'
      variants={variants.container}
      layoutScroll
    >
      {fields.map(field => <GroupFields key={field.id} {...field} />)}

      <AnimatePresence>
        <Reorder.Group
          axis='y'
          values={socials_names}
          onReorder={handleOnReOrder}
        >
          {socials.map(([social, props], index) => (
            <EditSocialItem
              key={index}
              ref={setRef(index)}
              refs={nonNullRefs}
              social={social}
              {...props}
            />
          ))}
        </Reorder.Group>
      </AnimatePresence>
    </S.Container>
  );
};

export { Editing };
