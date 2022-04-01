import React from 'react';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';
import UserContext from '../../contexts/UserContext';

import Gender from '../../types/Gender';

const genderOptions: ItemType[] = [
  { label: 'Female', value: 'female' },
  { label: 'Male', value: 'male' },
];

const femVoices = [
  'en-US-Wavenet-C',
  'en-US-Wavenet-E',
  'en-US-Wavenet-F',
  'en-US-Wavenet-G',
  'en-US-Wavenet-H',
  'en-GB-Wavenet-A',
  'en-GB-Wavenet-C',
  'en-GB-Wavenet-F',
];

type VoiceGenderProps = { setGender: (gender: Gender) => void };

function VoiceGender(props: VoiceGenderProps) {
  const { setGender } = props;
  const { settings } = React.useContext(UserContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<ValueType | null>(null);
  const [items, setItems] = React.useState<ItemType[]>(genderOptions);

  React.useEffect(() => {
    if (settings && settings.voice) {
      if (femVoices.includes(settings.voice)) {
        setValue('female');
        setGender('female');
      } else {
        setValue('male');
        setGender('male');
      }
    }
  }, [settings, settings?.voice, setValue, setGender]);

  const onSelect = (gender: ItemType) => {
    setGender(gender.value as Gender);
  };

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      setItems={setItems}
      onSelectItem={onSelect}
      zIndex={open ? 1 : 0}
      placeholder="Select a voice gender"
    />
  );
}

export default VoiceGender;
