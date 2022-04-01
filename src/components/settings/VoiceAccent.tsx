import React from 'react';
import DropDownPicker, { ItemType, ValueType } from 'react-native-dropdown-picker';
import UserContext from '../../contexts/UserContext';

import Accent from '../../types/Accent';

const accentOptions: ItemType[] = [
  { label: 'American', value: 'us' },
  { label: 'British', value: 'gb' },
];

type VoiceAccentProps = { setAccent: (accent: Accent) => void };

function VoiceAccent(props: VoiceAccentProps) {
  const { setAccent } = props;
  const { settings } = React.useContext(UserContext);
  const [open, setOpen] = React.useState<boolean>(false);
  const [value, setValue] = React.useState<ValueType | null>(null);
  const [items, setItems] = React.useState<ItemType[]>(accentOptions);

  React.useEffect(() => {
    if (settings && settings.voice) {
      const lowerVoice = settings.voice.toLowerCase();
      if (lowerVoice.includes('us')) {
        setValue('us');
        setAccent('us');
      } else if (lowerVoice.includes('gb')) {
        setValue('gb');
        setAccent('gb');
      }
    }
  }, [settings, settings?.voice, setValue, setAccent]);

  const onSelect = (accent: ItemType) => {
    if (accent.value) {
      setAccent(accent.value as Accent);
    }
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
      placeholder="Select a voice accent"
    />
  );
}

export default VoiceAccent;
