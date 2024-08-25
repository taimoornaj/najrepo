import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {
    useQuery,
    useMutation,
    useQueryClient,
    QueryClient,
    QueryClientProvider,
  } from '@tanstack/react-query';
import ComplaintsDetails from './complaintsDetails';
  const complaintsDetailsWrapper = ({navigation, route}) => {
    const queryClient = new QueryClient();
    return (
    <QueryClientProvider client={queryClient}>
      <ComplaintsDetails navigation={navigation} route={route}/>
      </QueryClientProvider>
  )
}

export default complaintsDetailsWrapper

const styles = StyleSheet.create({})