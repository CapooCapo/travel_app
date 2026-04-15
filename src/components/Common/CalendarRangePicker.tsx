import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { COLORS, FONTS } from '../../constants/theme';

interface CalendarRangePickerProps {
  initialStartDate?: string;
  initialEndDate?: string;
  onSelectRange: (start: string, end: string) => void;
  minDate?: string;
}

const CalendarRangePicker: React.FC<CalendarRangePickerProps> = ({
  initialStartDate = '',
  initialEndDate = '',
  onSelectRange,
  minDate = new Date().toISOString().split('T')[0],
}) => {
  const [markedDates, setMarkedDates] = useState<any>({});
  const [startDate, setStartDate] = useState<string>(initialStartDate);
  const [endDate, setEndDate] = useState<string>(initialEndDate);

  const setupMarkedDates = (start: string, end: string) => {
    let marked: any = {};
    
    if (start) {
      marked[start] = { 
        startingDay: true, 
        color: COLORS.primary, 
        textColor: 'white',
        selected: true 
      };
    }

    if (start && end) {
      marked[end] = { 
        endingDay: true, 
        color: COLORS.primary, 
        textColor: 'white',
        selected: true 
      };

      // Fill range
      let startD = new Date(start);
      let endD = new Date(end);
      let curr = new Date(startD);
      curr.setDate(curr.getDate() + 1);

      while (curr < endD) {
        let dateStr = curr.toISOString().split('T')[0];
        marked[dateStr] = { 
          color: COLORS.primary + '33', 
          textColor: COLORS.primary 
        };
        curr.setDate(curr.getDate() + 1);
      }
    }

    setMarkedDates(marked);
  };

  useMemo(() => {
    setupMarkedDates(initialStartDate, initialEndDate);
    setStartDate(initialStartDate);
    setEndDate(initialEndDate);
  }, [initialStartDate, initialEndDate]);

  const onDayPress = (day: DateData) => {
    const dateStr = day.dateString;

    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(dateStr);
      setEndDate('');
      setupMarkedDates(dateStr, '');
    } else {
      // Complete selection
      if (dateStr < startDate) {
        // Swap if end is before start
        setStartDate(dateStr);
        setEndDate(startDate);
        onSelectRange(dateStr, startDate);
        setupMarkedDates(dateStr, startDate);
      } else {
        setEndDate(dateStr);
        onSelectRange(startDate, dateStr);
        setupMarkedDates(startDate, dateStr);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rangeInfo}>
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>{startDate || 'Select'}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.dateBox}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>{endDate || 'Select'}</Text>
        </View>
      </View>
      
      <Calendar
        minDate={minDate}
        markingType={'period'}
        markedDates={markedDates}
        onDayPress={onDayPress}
        theme={{
          calendarBackground: 'transparent',
          textSectionTitleColor: COLORS.muted,
          selectedDayBackgroundColor: COLORS.primary,
          selectedDayTextColor: '#ffffff',
          todayTextColor: COLORS.primary,
          dayTextColor: COLORS.text,
          textDisabledColor: COLORS.border,
          dotColor: COLORS.primary,
          monthTextColor: COLORS.text,
          indicatorColor: COLORS.primary,
          textDayFontSize: 14,
          textMonthFontSize: 16,
          textDayHeaderFontSize: 12,
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 10,
    overflow: 'hidden',
  },
  rangeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 10,
  },
  dateBox: {
    flex: 1,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: COLORS.muted,
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '700',
  },
  divider: {
    width: 20,
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 10,
  },
});

export default CalendarRangePicker;
