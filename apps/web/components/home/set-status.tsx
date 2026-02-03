import React from 'react'
import { Button } from '@/components/ui/button'
import UsersPublicList from '@/components/users/users-public-list'

export default function SetStatus() {
  return (
    <div className='fixed top-0 right-0 flex flex-col'>
      <Button size="sm" className='m-6'>Set Status</Button>
      <UsersPublicList/>
    </div>
  )
}
