declare module '@react-native-community/datetimepicker' {
  import { Component } from 'react';

  type DisplayIOS = 'default' | 'spinner' | 'compact' | 'inline';
  type DisplayAndroid = 'default' | 'spinner' | 'calendar' | 'clock';
  type Mode = 'date' | 'time' | 'datetime' | 'countdown';

  export type DateTimePickerEvent = {
    type: 'set' | 'dismissed';
    nativeEvent: { timestamp: number };
  };

  export interface CommonProps {
    value: Date;
    onChange: (event: DateTimePickerEvent, date?: Date) => void;
    mode?: Mode;
    display?: DisplayIOS | DisplayAndroid;
    maximumDate?: Date;
    minimumDate?: Date;
    locale?: string;
  }

  export default class DateTimePicker extends Component<CommonProps> {}
}
