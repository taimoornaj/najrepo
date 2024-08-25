import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

const Timer = ({ startTime, width, FirstAdd }) => {
  const [elapsedTime, setElapsedTime] = useState('');
  const [start, setStart] = useState(startTime);

  useEffect(() => {
    if (FirstAdd) {
      // Set the current time as the start time if FirstAdd has a value
      const currentDateTime = new Date();
      const formattedCurrentDateTime = `${currentDateTime.getFullYear()}-${String(currentDateTime.getMonth() + 1).padStart(2, '0')}-${String(currentDateTime.getDate()).padStart(2, '0')} ${String(currentDateTime.getHours()).padStart(2, '0')}:${String(currentDateTime.getMinutes()).padStart(2, '0')}:${String(currentDateTime.getSeconds()).padStart(2, '0')}`;
      setStart(formattedCurrentDateTime);
    } else {
      setStart(startTime);
    }
  }, [FirstAdd, startTime]);

  useEffect(() => {
    if (!start) {
      alert('startTime is null or undefined');
      return;
    }

    // Ensure the startTime is in the correct format
    const startParts = start.split(/[- :]/);
    if (startParts.length !== 6) {
      alert('Invalid startTime format');
      return;
    }

    const startDateTime = new Date(
      startParts[0],
      startParts[1] - 1,
      startParts[2],
      startParts[3],
      startParts[4],
      startParts[5]
    );

    if (isNaN(startDateTime.getTime())) {
      alert('Invalid date derived from startTime');
      return;
    }

    const interval = setInterval(() => {
      const now = new Date(); // Current time

      // Calculate difference in milliseconds
      const difference = now.getTime() - startDateTime.getTime();

      // Convert difference to days, hours, minutes, and seconds
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Format elapsed time
      const formattedElapsedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

      // Update state with formatted elapsed time
      setElapsedTime(formattedElapsedTime);
    }, 1000);

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, [start]);

  return (
    <View>
      <Text style={{ color: 'gray', fontWeight: '700', textAlign: 'center', marginVertical: '1%', fontSize: width * 0.035 }}>
        {elapsedTime}
      </Text>
    </View>
  );
};

export default Timer;