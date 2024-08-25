import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const { width } = Dimensions.get('window');

const SelectBox1 = ({ val, data, placeholder, selectedVal }) => {
  const [selectedService, setSelectedService] = useState(val);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <View style={{ marginTop:'-3%',}}>
     <SelectList
  setSelected={val => {
    setDropdownOpen(true);
    setSelectedService(val);
    selectedVal(val);
  }}
  data={data}
  save="key"
  search={false}
  arrowicon={<FontAwesomeIcon icon={faCaretDown} size={16} color={'#0a4180'} />}
  dropdownStyles={[styles.dropdownStyles, styles.scrollableDropdown]}
  boxStyles={[styles.boxStyles, styles.inputStyle, styles.mainShadow]}
  inputStyles={[styles.inputStyles, { color: 'gray' }]} // Assuming you can set text color here
  placeholder={placeholder}
  selected={selectedService}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownStyles: {
    textTransform: 'capitalize',
    width: '100%',
    backgroundColor: '#fdfdfd',
    borderWidth: 0.3,
    borderColor: '#737373',
    borderRadius: 5,
    marginBottom: '3.5%',
    shadowColor: 'rgba(0,0,0,0.7)',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  scrollableDropdown: {
    marginTop:3,
    maxHeight: 150,
  },
  boxStyles: {
    width: '100%',
    borderRadius: 5,
    borderBottomWidth: 3.5,
    borderBottomColor: '#0a4180',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingRight: '10%',
    marginTop:10,
  },
  dropdownItemStyles: {
    borderColor: 'red', 
    borderWidth: 10, 
    borderRadius: 5,
    marginVertical: 2, 
  },
  inputStyles: {
    width: '100%',
    fontSize: width * 0.035,
  },
  inputStyle: {
    backgroundColor: '#fdfdfd',
    // paddingTop: '2.5%',
    height:45,
    borderWidth: 0.3,
    borderColor: '#7a7a7a',
    marginBottom: '2.8%',
  },
  mainShadow: {
    borderRadius: 5,
    shadowColor: 'rgba(0,0,0,0.4)',
      shadowOpacity: 0.35,
      shadowRadius: 3,
      elevation: 4,
  },
});

export default SelectBox1;
