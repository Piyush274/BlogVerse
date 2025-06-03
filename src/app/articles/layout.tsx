import { Navbar } from '@/components/home/Navbar'
import React from 'react'

type Props = React.PropsWithChildren<{}>

export default function layout({ children }: Props) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}